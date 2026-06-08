#!/usr/bin/env node

import fs from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "pitch", "recording");
const POLISH = path.join(ROOT, "pitch", "polish-combined");
const QA = path.join(POLISH, "qa");
const AUDIO = path.join(OUT, "audio-screenrecord");
const RUN_OUT = path.join(ROOT, "runs", "demo-video");
const FFMPEG = "/opt/homebrew/bin/ffmpeg";
const FFPROBE = "/opt/homebrew/bin/ffprobe";
const W = 1920;
const H = 1080;
const FPS = 30;
const BGM = path.join(
  process.env.HOME || "",
  "Documents",
  "MySkill",
  "hackathonhunter-skill",
  "assets",
  "music",
  "02_innovation_drive.mp3",
);

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const idx = line.indexOf("=");
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(path.join(process.env.HOME || "", "use_key.txt"));
loadEnvFile(path.join(ROOT, ".env.local"));

const TTS_PROVIDER = (process.env.TTS_PROVIDER || (process.env.MIMO_API_KEY ? "mimo" : "")).toLowerCase();
const MIMO_API_KEY = process.env.TTS_API_KEY || process.env.MIMO_API_KEY;
const MIMO_BASE_URL = (process.env.TTS_BASE_URL || process.env.MIMO_BASE_URL || "https://api.xiaomimimo.com/v1").replace(/\/+$/, "");
const MIMO_MODEL = process.env.TTS_MODEL || process.env.MIMO_TTS_MODEL || "mimo-v2.5-tts";
const MIMO_VOICE = process.env.TTS_VOICE || process.env.MIMO_TTS_VOICE || "Chloe";
const TTS_FORMAT = (process.env.TTS_FORMAT || "wav").toLowerCase();
const TTS_INSTRUCTION =
  process.env.TTS_INSTRUCTION ||
  "Calm hackathon demo voiceover. Speak like a founder walking through a screen recording. Keep TraceWarden, SIFT, DFIR, MCP, CLAIM IDs, and file paths clear. Use short pauses at scene changes.";

if (TTS_PROVIDER !== "mimo") {
  throw new Error("Mimo TTS is required. Set TTS_PROVIDER=mimo in ~/use_key.txt or .env.local.");
}
if (!MIMO_API_KEY) {
  throw new Error("Mimo TTS key missing. Set TTS_API_KEY or MIMO_API_KEY in ~/use_key.txt or .env.local.");
}

const runtimeNodeModules = path.join(
  process.env.HOME || "",
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "node",
  "node_modules",
);
const requireFromRuntime = createRequire(path.join(runtimeNodeModules, "package.json"));
const { chromium } = requireFromRuntime("playwright");

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    env: { ...process.env, PYTHONPATH: path.join(ROOT, "src"), ...(options.env || {}) },
    encoding: "utf8",
    stdio: options.stdio || "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `${cmd} failed with exit ${result.status}`,
        result.stdout?.trim(),
        result.stderr?.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  return result;
}

function ffprobeDuration(file) {
  const result = run(FFPROBE, [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    file,
  ]);
  return Number.parseFloat(result.stdout.trim());
}

async function mimoTts(text, outFile) {
  const endpoint = `${MIMO_BASE_URL}/chat/completions`;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "api-key": MIMO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MIMO_MODEL,
        messages: [
          { role: "user", content: TTS_INSTRUCTION },
          { role: "assistant", content: text },
        ],
        audio: {
          format: TTS_FORMAT,
          voice: MIMO_VOICE,
        },
      }),
    });
    const body = await response.text();
    if (response.ok) {
      const data = JSON.parse(body);
      const audioData = data?.choices?.[0]?.message?.audio?.data;
      if (!audioData) throw new Error("Mimo TTS response did not include choices[0].message.audio.data");
      await fs.writeFile(outFile, Buffer.from(audioData, "base64"));
      return;
    }
    if (attempt === 4) throw new Error(`Mimo TTS failed (${response.status}): ${body.slice(0, 500)}`);
    const wait = (2 ** attempt) * 1000;
    console.warn(`Mimo TTS retry in ${wait}ms: ${response.status}`);
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function compactLines(text, max = 12) {
  return String(text)
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .slice(0, max);
}

function wrapWords(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function srtTime(seconds) {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milli = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(milli).padStart(3, "0")}`;
}

async function prepare() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(POLISH, { recursive: true });
  await fs.mkdir(path.join(POLISH, "assets"), { recursive: true });
  await fs.mkdir(QA, { recursive: true });
  await fs.mkdir(AUDIO, { recursive: true });
  await fs.rm(RUN_OUT, { recursive: true, force: true });
}

async function gatherDemoData() {
  const demo = run("python3", ["-m", "tracewarden", "run", "examples/evidence/case-alpha", "--out", "runs/demo-video"]);
  const tests = run("python3", ["-m", "unittest", "discover", "-s", "tests", "-v"]);
  const schema = run("python3", ["-m", "tracewarden", "mcp-schema"]);
  const receipts = JSON.parse(await fs.readFile(path.join(RUN_OUT, "claim_receipts.json"), "utf8"));
  const accuracyJson = JSON.parse(await fs.readFile(path.join(RUN_OUT, "accuracy_report.json"), "utf8"));
  const accuracyMarkdown = await fs.readFile(path.join(RUN_OUT, "accuracy_report.md"), "utf8");
  const logText = await fs.readFile(path.join(RUN_OUT, "execution_log.jsonl"), "utf8");
  const incidentHtml = await fs.readFile(path.join(RUN_OUT, "incident_report.html"), "utf8");
  const claim004 = receipts.find((claim) => claim.id === "CLAIM-004") || receipts[0];
  const claim009 = receipts.find((claim) => claim.id === "CLAIM-009") || receipts.find((claim) => claim.status === "confirmed") || receipts[1];

  return {
    demoStdout: compactLines(demo.stdout, 12),
    testStdout: compactLines(`${tests.stderr}\n${tests.stdout}`, 12),
    schemaLines: compactLines(schema.stdout, 16),
    receipts,
    claim004,
    claim009,
    accuracyJson,
    accuracyMarkdownLines: compactLines(accuracyMarkdown, 18),
    logLines: compactLines(logText, 10),
    incidentTitle: incidentHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.replace(/<[^>]*>/g, "") || "TraceWarden SIFT Incident Report",
  };
}

function buildScenes(data) {
  return [
    {
      id: "01-hook",
      label: "Recorded demo",
      title: "Prove 17 DFIR claims in a live run.",
      screen: "hero",
      proof: "Repo command, receipts, reports, tests.",
      narration:
        "TraceWarden SIFT proves seventeen DFIR claims in a recorded run. The command writes receipts before findings reach the report.",
    },
    {
      id: "02-command",
      label: "Terminal",
      title: "One command starts the case.",
      screen: "command",
      proof: "PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo-video",
      narration:
        "The demo starts in the repo root. One command runs the packaged case-alpha evidence and writes a fresh output folder.",
    },
    {
      id: "03-live-run",
      label: "Stdout",
      title: "The recorded run evaluates 17 claims.",
      screen: "stdout",
      proof: "Actual stdout captured from the CLI.",
      narration:
        "The agent seals the evidence root, calls read-only parsers, evaluates seventeen claims, and writes the reports. This is the stdout from the run.",
    },
    {
      id: "04-revocation",
      label: "Self-correction",
      title: "CLAIM-004 gets revoked.",
      screen: "claim004",
      proof: "Signed updater path, no corroboration.",
      narration:
        "CLAIM zero zero four fails. The timeline shows a signed updater path, and no second source supports malicious activity, so the verifier revokes it.",
    },
    {
      id: "05-reroute",
      label: "Reroute",
      title: "TraceWarden follows stronger evidence.",
      screen: "claim009",
      proof: "PowerShell and network parsers support the replacement claim.",
      narration:
        "TraceWarden reroutes into PowerShell and network evidence. CLAIM zero zero nine survives because two parsers point to the same attacker script.",
    },
    {
      id: "06-receipt",
      label: "Receipt",
      title: "Judges can inspect every field.",
      screen: "receiptFields",
      proof: "File, line, parser, hash, tool calls.",
      narration:
        "The receipt is inspectable. It lists file, line, parser, hash, and the tool calls behind the finding.",
    },
    {
      id: "07-accuracy",
      label: "Accuracy",
      title: "The report scores the run against ground truth.",
      screen: "accuracy",
      proof: "16 confirmed, 1 revoked, 0 hallucinations.",
      narration:
        "The accuracy report compares the run to ground truth. It records sixteen confirmed claims, one revoked claim, zero hallucinations, and precision and recall of one point zero.",
    },
    {
      id: "08-tests",
      label: "Tests",
      title: "The guardrails are tested.",
      screen: "tests",
      proof: "Path escape, report writing, schema safety, weak claim revocation.",
      narration:
        "The tests cover path escape, report writing, schema safety, and weak claim revocation. The demo does not rely on a hidden manual fix.",
    },
    {
      id: "09-architecture",
      label: "Boundary",
      title: "The safety boundary sits below the planner.",
      screen: "architecture",
      proof: "Sealed evidence, typed tools, verifier state, receipts.",
      narration:
        "The safety boundary stays below any planner: sealed evidence, typed read-only tools, verifier-owned claim state, and replayable receipts.",
    },
    {
      id: "10-close",
      label: "Submission",
      title: "Run it, inspect it, extend it.",
      screen: "close",
      proof: "Repo, case, reports, deck, video source, tests.",
      narration:
        "The repo includes the case, reports, deck, video source, and tests. Run it, inspect CLAIM zero zero four, then add the next SIFT parser.",
    },
  ];
}

async function buildNarration(scenes) {
  const audioFiles = [];
  const records = [];
  let cursor = 0;
  let srt = "";
  for (let idx = 0; idx < scenes.length; idx += 1) {
    const scene = scenes[idx];
    const raw = path.join(AUDIO, `${scene.id}.raw.wav`);
    const normalized = path.join(AUDIO, `${scene.id}.normalized.wav`);
    const padded = path.join(AUDIO, `${scene.id}.padded.wav`);
    const rawStat = existsSync(raw) ? await fs.stat(raw) : null;
    if (!rawStat || rawStat.size < 1024) {
      await mimoTts(scene.narration, raw);
    }
    run(FFMPEG, ["-y", "-i", raw, "-ar", "48000", "-ac", "2", normalized]);
    const voiceSeconds = ffprobeDuration(normalized);
    const duration = Math.max(voiceSeconds + 1.15, scene.id === "03-live-run" ? 12.5 : 8.0);
    run(FFMPEG, [
      "-y",
      "-i",
      normalized,
      "-af",
      `apad=pad_dur=${Math.max(0, duration - voiceSeconds).toFixed(3)},atrim=0:${duration.toFixed(3)}`,
      "-ar",
      "48000",
      "-ac",
      "2",
      padded,
    ]);
    audioFiles.push(padded);
    records.push({
      ...scene,
      audio_path: path.relative(ROOT, padded),
      voice_duration_seconds: Number(voiceSeconds.toFixed(3)),
      duration_seconds: Number(duration.toFixed(3)),
      start_seconds: Number(cursor.toFixed(3)),
    });
    const subtitle = wrapWords(scene.narration, 62).slice(0, 2).join("\n");
    srt += `${idx + 1}\n${srtTime(cursor)} --> ${srtTime(cursor + duration)}\n${subtitle}\n\n`;
    cursor += duration;
  }

  const concatFile = path.join(AUDIO, "narration-concat.txt");
  await fs.writeFile(concatFile, audioFiles.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n"), "utf8");
  await fs.writeFile(
    path.join(OUT, "voiceover.concat.txt"),
    audioFiles.map((file) => `file '${path.relative(ROOT, file).replaceAll("\\", "/").replaceAll("'", "'\\''")}'`).join("\n"),
    "utf8",
  );
  const narrationWav = path.join(AUDIO, "narration.wav");
  const narrationMp3 = path.join(AUDIO, "narration.mp3");
  run(FFMPEG, ["-y", "-f", "concat", "-safe", "0", "-i", concatFile, "-c", "copy", narrationWav]);
  run(FFMPEG, ["-y", "-i", narrationWav, "-codec:a", "libmp3lame", "-b:a", "192k", narrationMp3]);

  await fs.writeFile(path.join(OUT, "captions.srt"), srt, "utf8");
  await fs.writeFile(path.join(POLISH, "assets", "captions.srt"), srt, "utf8");
  await fs.writeFile(
    path.join(AUDIO, "narration.timing.json"),
    JSON.stringify(
      {
        voice: `mimo:${MIMO_MODEL}:${MIMO_VOICE}`,
        total_duration_seconds: Number(cursor.toFixed(3)),
        scenes: records.map((scene) => ({
          id: scene.id,
          start_seconds: scene.start_seconds,
          duration_seconds: scene.duration_seconds,
          audio_path: scene.audio_path,
        })),
      },
      null,
      2,
    ),
  );

  return { records, narrationWav, narrationMp3, totalDuration: cursor };
}

function htmlForDemo(data, records) {
  const payload = {
    records,
    demoStdout: data.demoStdout,
    testStdout: data.testStdout,
    schemaLines: data.schemaLines,
    logLines: data.logLines,
    accuracyMarkdownLines: data.accuracyMarkdownLines,
    claim004: data.claim004,
    claim009: data.claim009,
    accuracyJson: data.accuracyJson,
    incidentTitle: data.incidentTitle,
  };
  const json = JSON.stringify(payload).replaceAll("</", "<\\/");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TraceWarden SIFT Screen Recording Demo</title>
<style>
  :root {
    --bg: #071014;
    --panel: #101a20;
    --panel-2: #15232a;
    --line: #2b4b55;
    --text: #eef9f7;
    --muted: #9db6ba;
    --teal: #4de1d6;
    --green: #77d887;
    --amber: #f4bd67;
    --red: #ff6a66;
  }
  * { box-sizing: border-box; }
  body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: var(--bg); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  #stage { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: radial-gradient(circle at 84% 12%, rgba(77,225,214,.12), transparent 34%), radial-gradient(circle at 0% 100%, rgba(244,189,103,.08), transparent 32%), linear-gradient(135deg, #071014, #091318 54%, #05090d); }
  #stage:before { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px); background-size: 54px 54px; opacity: .62; }
  .chrome { position: absolute; inset: 44px 54px; display: grid; grid-template-rows: 92px 1fr 96px; gap: 24px; }
  header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
  .brand { display: flex; align-items: center; gap: 18px; }
  .mark { width: 48px; height: 48px; border: 2px solid var(--teal); border-radius: 14px; display: grid; place-items: center; color: var(--teal); font: 800 22px Menlo, monospace; box-shadow: 0 0 28px rgba(77,225,214,.18); }
  .eyebrow { color: var(--teal); font: 700 18px Menlo, monospace; letter-spacing: 2px; text-transform: uppercase; }
  h1 { margin: 4px 0 0; font-size: 38px; line-height: 1.05; letter-spacing: 0; }
  .counter { color: var(--muted); font: 700 20px Menlo, monospace; }
  .grid { display: grid; grid-template-columns: minmax(0, 1fr) 438px; gap: 26px; min-height: 0; }
  .screen, .voice { min-height: 0; border: 1px solid var(--line); background: rgba(7,14,18,.88); border-radius: 8px; box-shadow: 0 26px 60px rgba(0,0,0,.35); overflow: hidden; }
  .windowbar { height: 52px; display: flex; align-items: center; gap: 10px; padding: 0 20px; background: #142229; border-bottom: 1px solid var(--line); color: var(--muted); font: 700 16px Menlo, monospace; }
  .dot { width: 12px; height: 12px; border-radius: 999px; display: inline-block; }
  .red { background: var(--red); } .yellow { background: var(--amber); } .green { background: var(--green); }
  #mainView { position: relative; height: calc(100% - 52px); padding: 32px; }
  .voice { display: grid; grid-template-rows: 52px 1fr; }
  #voiceText { padding: 30px 28px; font-size: 28px; line-height: 1.27; }
  #voiceText strong { color: var(--teal); display: block; margin-bottom: 18px; font: 800 18px Menlo, monospace; letter-spacing: 1px; text-transform: uppercase; }
  .proof { margin-top: 26px; padding: 18px; border: 1px solid var(--line); border-radius: 8px; color: var(--muted); font-size: 20px; line-height: 1.25; }
  footer { display: grid; grid-template-columns: 1fr 438px; gap: 26px; align-items: stretch; }
  .caption, .meter { border: 1px solid var(--line); background: rgba(5,11,14,.86); border-radius: 8px; padding: 18px 24px; min-height: 76px; }
  .caption { font-size: 26px; font-weight: 750; line-height: 1.15; }
  .meter { display: grid; gap: 12px; align-content: center; }
  .bar { height: 10px; background: #132027; border-radius: 999px; overflow: hidden; }
  #progress { width: 0%; height: 100%; background: linear-gradient(90deg, var(--teal), var(--green)); }
  .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .metric { border: 1px solid var(--line); border-radius: 8px; padding: 20px; background: rgba(20,34,41,.82); }
  .metric b { display: block; color: var(--teal); font-size: 46px; line-height: 1; }
  .metric span { display: block; margin-top: 10px; color: var(--muted); font-size: 18px; }
  pre { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; color: #dce9e7; font: 22px/1.55 Menlo, Consolas, monospace; }
  .terminal-line { opacity: 0; transform: translateY(10px); transition: opacity .28s ease, transform .28s ease; }
  .terminal-line.on { opacity: 1; transform: none; }
  .cmd { color: var(--text); }
  .seal, .tool { color: var(--teal); }
  .verify, .accuracy { color: var(--amber); }
  .correct, .revoked { color: var(--red); }
  .write, .ok { color: var(--green); }
  .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .card { border: 1px solid var(--line); border-radius: 8px; background: rgba(16,26,32,.92); padding: 22px; min-height: 154px; }
  .card h3 { margin: 0 0 14px; color: var(--teal); font-size: 25px; }
  .card p, .card li { color: var(--text); font-size: 21px; line-height: 1.35; }
  .receiptGrid { display: grid; grid-template-columns: 420px 1fr; gap: 24px; align-items: start; }
  .receiptBadge { border: 2px solid var(--red); color: var(--red); border-radius: 8px; padding: 24px; font: 800 28px Menlo, monospace; }
  .receiptBadge.confirmed { border-color: var(--green); color: var(--green); }
  .snippet { color: var(--muted); font-size: 19px; line-height: 1.33; overflow-wrap: anywhere; }
  .flow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 56px; }
  .flow .card { min-height: 190px; }
  .artifact-stack-3d { transform-style: preserve-3d; perspective: 1200px; }
  .component-lift { transform: scale(1); }
  .proof-montage { transform: translateY(0); opacity: 1; }
  .shared-object { outline: 2px solid var(--teal); box-shadow: 0 0 34px rgba(77,225,214,.2); }
  .architecture-reveal { transform: translateZ(24px); }
  @keyframes lift { from { transform: scale(.98) translateY(16px); opacity: .2; } to { transform: scale(1) translateY(0); opacity: 1; } }
  @keyframes slideIn { from { transform: translateY(28px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
</head>
<body>
<main id="stage">
  <div class="chrome">
    <header>
      <div class="brand"><div class="mark">TW</div><div><div class="eyebrow" id="label">Recorded demo</div><h1 id="title">TraceWarden SIFT</h1></div></div>
      <div class="counter"><span id="sceneNo">01</span>/10</div>
    </header>
    <section class="grid">
      <div class="screen artifact-stack-3d"><div class="windowbar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span id="windowTitle">repo root</span></div><div id="mainView"></div></div>
      <aside class="voice"><div class="windowbar"><span>Mimo voiceover</span></div><div id="voiceText"></div></aside>
    </section>
    <footer>
      <div class="caption" id="caption">Starting recorded demo.</div>
      <div class="meter"><div class="bar"><div id="progress"></div></div><div class="counter" id="timeLabel">0:00</div></div>
    </footer>
  </div>
</main>
<script>
const DATA = ${json};
let startAt = null;
let raf = null;
const total = DATA.records.reduce((sum, scene) => sum + scene.duration_seconds, 0);
function cls(line) {
  if (line.startsWith("$")) return "cmd";
  if (line.includes("[seal]") || line.includes("[tool]")) return "seal";
  if (line.includes("[verify]") || line.includes("accuracy")) return "verify";
  if (line.includes("[correct]") || line.includes("revoked")) return "correct";
  if (line.includes("[write]") || line.includes("OK")) return "write";
  return "";
}
function terminal(lines, progress) {
  const visible = Math.max(1, Math.ceil(lines.length * Math.min(1, progress * 1.15)));
  return "<pre>" + lines.map((line, i) => '<div class="terminal-line ' + cls(line) + (i < visible ? ' on' : '') + '">' + escapeHtml(line) + "</div>").join("") + "</pre>";
}
function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function firstEvidence(claim) {
  return claim && claim.evidence && claim.evidence[0] ? claim.evidence[0] : {};
}
function render(scene, progress) {
  const c004 = DATA.claim004;
  const c009 = DATA.claim009;
  const ev004 = firstEvidence(c004);
  const ev009 = firstEvidence(c009);
  if (scene.screen === "hero") {
    return '<div class="metrics proof-montage"><div class="metric"><b>17</b><span>claims evaluated</span></div><div class="metric"><b>16</b><span>confirmed</span></div><div class="metric"><b>1</b><span>revoked</span></div><div class="metric"><b>0</b><span>hallucinations</span></div></div><div class="flow"><div class="card"><h3>Run</h3><p>Terminal command executes case-alpha.</p></div><div class="card"><h3>Verify</h3><p>Unsupported claims cannot survive.</p></div><div class="card"><h3>Write</h3><p>Receipts and reports land in runs/demo-video.</p></div><div class="card"><h3>Score</h3><p>Ground truth checks the result.</p></div></div>';
  }
  if (scene.screen === "command") {
    return terminal(["$ PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo-video", "$ open runs/demo-video/incident_report.html", "$ sed -n '1,12p' runs/demo-video/execution_log.jsonl"], progress);
  }
  if (scene.screen === "stdout") return terminal(DATA.demoStdout, progress);
  if (scene.screen === "claim004") {
    return '<div class="receiptGrid component-lift"><div class="receiptBadge">CLAIM-004<br>REVOKED</div><div class="card shared-object"><h3>' + escapeHtml(c004.title) + '</h3><p>' + escapeHtml(c004.verifier_notes[0]) + '</p><p class="snippet">' + escapeHtml(ev004.file + ":" + ev004.line + " | " + ev004.snippet) + '</p></div></div><div class="proof">' + terminal(DATA.logLines, Math.min(1, progress + .2)) + '</div>';
  }
  if (scene.screen === "claim009") {
    return '<div class="receiptGrid component-lift"><div class="receiptBadge confirmed">CLAIM-009<br>CONFIRMED</div><div class="card shared-object"><h3>' + escapeHtml(c009.title) + '</h3><p>' + escapeHtml(c009.verifier_notes[0]) + '</p><p class="snippet">' + escapeHtml(ev009.file + ":" + ev009.line + " | " + ev009.snippet) + '</p></div></div><div class="cards proof-montage"><div class="card"><h3>PowerShell</h3><p>' + escapeHtml((c009.evidence[0] || {}).snippet || "") + '</p></div><div class="card"><h3>Network</h3><p>' + escapeHtml((c009.evidence[1] || {}).snippet || "") + '</p></div></div>';
  }
  if (scene.screen === "receiptFields") {
    const ev = firstEvidence(c009);
    return '<div class="cards"><div class="card component-lift"><h3>Receipt fields</h3><p>file: ' + escapeHtml(ev.file) + '</p><p>line: ' + escapeHtml(ev.line) + '</p><p>parser: ' + escapeHtml(ev.parser) + '</p><p>sha256: ' + escapeHtml(String(ev.sha256).slice(0, 18)) + '...</p></div><div class="card"><h3>Related tool calls</h3><p>' + escapeHtml((c009.related_tool_calls || []).join(", ")) + '</p><p class="snippet">' + escapeHtml(c009.rationale) + '</p></div></div><div class="proof">The same fields are in runs/demo-video/claim_receipts.json.</div>';
  }
  if (scene.screen === "accuracy") {
    return '<div class="metrics proof-montage"><div class="metric"><b>' + DATA.accuracyJson.total_claims + '</b><span>claims evaluated</span></div><div class="metric"><b>' + DATA.accuracyJson.confirmed + '</b><span>confirmed</span></div><div class="metric"><b>' + DATA.accuracyJson.revoked + '</b><span>revoked</span></div><div class="metric"><b>' + DATA.accuracyJson.hallucinated_claim_ids.length + '</b><span>hallucinations</span></div></div><div class="proof">' + terminal(DATA.accuracyMarkdownLines, progress) + '</div>';
  }
  if (scene.screen === "tests") return terminal(DATA.testStdout, progress);
  if (scene.screen === "architecture") {
    return '<div class="flow architecture-reveal"><div class="card"><h3>Seal</h3><p>Hash evidence root before parsing.</p></div><div class="card"><h3>Tools</h3><p>Read-only parsers return EvidenceRef.</p></div><div class="card"><h3>Verify</h3><p>Policy controls claim state.</p></div><div class="card"><h3>Receipts</h3><p>Replayable proof for findings.</p></div></div><div class="proof">' + terminal(DATA.schemaLines.slice(0, 9), progress) + '</div>';
  }
  return '<div class="cards proof-montage"><div class="card"><h3>Repo</h3><p>https://github.com/veithly/tracewarden-sift</p></div><div class="card"><h3>Report</h3><p>' + escapeHtml(DATA.incidentTitle) + '</p></div><div class="card"><h3>Deck</h3><p>pitch/deck/tracewarden-sift-deck.pdf</p></div><div class="card"><h3>Command</h3><p>tracewarden run examples/evidence/case-alpha</p></div></div>';
}
function sceneAt(elapsed) {
  let t = 0;
  for (let i = 0; i < DATA.records.length; i++) {
    const scene = DATA.records[i];
    const d = scene.duration_seconds;
    if (elapsed <= t + d || i === DATA.records.length - 1) return { scene, index: i, start: t, progress: Math.max(0, Math.min(1, (elapsed - t) / d)) };
    t += d;
  }
}
function tick(now) {
  const elapsed = Math.min(total, (now - startAt) / 1000);
  const state = sceneAt(elapsed);
  const scene = state.scene;
  document.getElementById("label").textContent = scene.label;
  document.getElementById("title").textContent = scene.title;
  document.getElementById("sceneNo").textContent = String(state.index + 1).padStart(2, "0");
  document.getElementById("windowTitle").textContent = scene.screen;
  document.getElementById("mainView").innerHTML = render(scene, state.progress);
  document.getElementById("voiceText").innerHTML = '<strong>Mimo narration</strong>' + escapeHtml(scene.narration) + '<div class="proof">' + escapeHtml(scene.proof) + '</div>';
  document.getElementById("caption").textContent = scene.proof;
  document.getElementById("progress").style.width = (elapsed / total * 100).toFixed(2) + "%";
  document.getElementById("timeLabel").textContent = Math.floor(elapsed / 60) + ":" + String(Math.floor(elapsed % 60)).padStart(2, "0") + " / " + Math.floor(total / 60) + ":" + String(Math.floor(total % 60)).padStart(2, "0");
  if (elapsed < total) raf = requestAnimationFrame(tick);
  else window.__demoDone = true;
}
window.startDemo = () => { startAt = performance.now(); window.__demoDone = false; if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
</script>
</body>
</html>`;
}

async function writeManifests(data, records, totalDuration) {
  const narration = {
    "$schema": "narration.v1",
    language: "en",
    voice: `mimo:${MIMO_MODEL}:${MIMO_VOICE}`,
    first_sentence: "Prove 17 DFIR claims in a live run.",
    project: "TraceWarden SIFT",
    hero: "Prove 17 DFIR claims in 90 seconds.",
    recording_source: "pitch/recording/raw.webm",
    target_duration_seconds: Math.round(totalDuration),
    scenes: records.map((scene) => ({
      id: scene.id,
      title: scene.title,
      narration: scene.narration,
      screen_action: scene.screen,
      proof: scene.proof,
      audio_path: scene.audio_path,
      duration: scene.duration_seconds,
    })),
  };
  await fs.writeFile(path.join(ROOT, "artifacts", "narration.json"), JSON.stringify(narration, null, 2), "utf8");
  await fs.writeFile(path.join(POLISH, "narration.json"), JSON.stringify(narration, null, 2), "utf8");
  await fs.mkdir(path.join(POLISH, "assets"), { recursive: true });
  for (const scene of records) {
    await fs.writeFile(path.join(POLISH, "assets", `${scene.id}.txt`), scene.narration, "utf8");
  }
  await fs.writeFile(
    path.join(OUT, "cues.json"),
    JSON.stringify(
      records.map((scene) => ({
        id: scene.id,
        atMs: Math.round(scene.start_seconds * 1000),
        durationMs: Math.round(scene.duration_seconds * 1000),
      })),
      null,
      2,
    ),
    "utf8",
  );
  const outline = `# Combined Pitch + Recorded Demo Video Outline

Final file: \`pitch/recording/pitch-demo-combined-final.mp4\`

Runtime: ${totalDuration.toFixed(1)} seconds. Resolution: 1920x1080. Source recording: \`pitch/recording/raw.webm\`. Voice: Mimo \`${MIMO_MODEL}:${MIMO_VOICE}\`.

## Source truth

- Demo command: \`PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo-video\`
- User case: \`pitch/user_cases.md\` HERO PATH
- Judge magnet: \`pitch/judge_magnet.md\`
- Real proof files: \`runs/demo-video/claim_receipts.json\`, \`runs/demo-video/accuracy_report.md\`, \`runs/demo-video/execution_log.jsonl\`, \`runs/demo-video/incident_report.html\`

## Scene Table

| Scene | Screen action | Proof |
|---|---|---|
${records.map((scene) => `| \`${scene.id}\` | ${scene.title} | ${scene.proof} |`).join("\n")}

## First-sample anchor

- Sample range: first 30 seconds of \`pitch/recording/raw.webm\`
- Expected visible actions: repo-root command, Mimo narration panel, terminal stdout from the real run
- Expected judge belief: TraceWarden is a runnable CLI, not a static pitch animation
- Critique result: the first sample shows a live command and generated outputs before the video switches into receipt inspection
- Fixes applied: replaced static SVG-only video with Playwright screen recording, actual run output, right-side narration panel, and Mimo voiceover

## Judge attention pass

| Scene | Judge should think | Proof shown |
|---|---|---|
${records.map((scene) => `| \`${scene.id}\` | ${scene.proof} | ${scene.screen} |`).join("\n")}
`;
  await fs.writeFile(path.join(OUT, "video-outline.md"), outline, "utf8");
  const director = `# HyperFrames Director Board: TraceWarden SIFT Recorded Demo

| Scene | Judge belief | Screen action | Proof surface | Treatment | QA frame |
| --- | --- | --- | --- | --- | --- |
${records.map((scene, idx) => `| \`${scene.id}\` | ${scene.proof} | ${scene.title} | ${scene.screen} | Screen recording + component-lift/proof-montage cues | \`pitch/polish-combined/qa/video-qa-${String(idx + 1).padStart(2, "0")}.png\` |`).join("\n")}

The final video records a browser demo surface with actual CLI output from \`runs/demo-video\`. Mimo owns the voice track. The right-side narration panel makes the voiceover visible for silent review, and the final MP4 also carries the mixed audio track.
`;
  await fs.writeFile(path.join(OUT, "director-board.md"), director, "utf8");
  const manifest = {
    generated_at: new Date().toISOString(),
    source_recording: "pitch/recording/raw.webm",
    final_video: "pitch/recording/pitch-demo-combined-final.mp4",
    voice: `mimo:${MIMO_MODEL}:${MIMO_VOICE}`,
    command_stdout: data.demoStdout,
    accuracy: data.accuracyJson,
    scenes: records,
  };
  await fs.writeFile(path.join(OUT, "screenrecord-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
}

async function recordScreen(htmlPath, totalDuration) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT, size: { width: W, height: H } },
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(htmlPath).href);
  const video = page.video();
  await page.evaluate(() => window.startDemo());
  // Chromium's screencast can stop early if the page reports completion while the
  // last scene is still settling. Record by wall-clock duration so the close
  // scene is actually present in raw.webm, then trim in ffmpeg.
  await page.waitForTimeout(Math.ceil((totalDuration + 1.25) * 1000));
  await context.close();
  await browser.close();
  const videoPath = await video.path();
  const raw = path.join(OUT, "raw.webm");
  await fs.copyFile(videoPath, raw);
  return raw;
}

function mixFinal(rawWebm, narrationWav, totalDuration) {
  const picture = path.join(OUT, "demo-picture.mp4");
  const demo = path.join(OUT, "demo.mp4");
  const final = path.join(OUT, "pitch-demo-combined-final.mp4");
  run(FFMPEG, [
    "-y",
    "-i",
    rawWebm,
    "-t",
    totalDuration.toFixed(3),
    "-vf",
    `fps=${FPS},scale=${W}:${H},unsharp=5:5:0.6,eq=contrast=1.04:saturation=1.08`,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "17",
    "-pix_fmt",
    "yuv420p",
    picture,
  ]);

  const fadeOutStart = Math.max(0, totalDuration - 2.5);
  run(FFMPEG, [
    "-y",
    "-i",
    picture,
    "-i",
    narrationWav,
    "-stream_loop",
    "-1",
    "-i",
    BGM,
    "-filter_complex",
    `[1:a]volume=1.45,loudnorm=I=-16:TP=-1.5:LRA=8,asplit=2[narrMix][narrSide];[2:a]atrim=0:${totalDuration.toFixed(3)},asetpts=PTS-STARTPTS,volume=0.16,afade=t=in:st=0:d=1.2,afade=t=out:st=${fadeOutStart.toFixed(3)}:d=2.5[bed0];[bed0][narrSide]sidechaincompress=threshold=0.035:ratio=9:attack=18:release=320[bed];[narrMix][bed]amix=inputs=2:duration=first:weights='1 1',loudnorm=I=-14.5:TP=-1:LRA=10,volume=1.12,alimiter=limit=0.95[a]`,
    "-map",
    "0:v",
    "-map",
    "[a]",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    demo,
  ]);
  run(FFMPEG, ["-y", "-i", demo, "-c", "copy", final]);
  return final;
}

async function extractQaFrames(final, records, totalDuration) {
  const sampleTimes = [];
  for (const scene of records) {
    sampleTimes.push(scene.start_seconds + Math.min(scene.duration_seconds * 0.55, scene.duration_seconds - 0.5));
  }
  const selected = sampleTimes.slice(0, 10);
  for (let idx = 0; idx < selected.length; idx += 1) {
    run(FFMPEG, [
      "-y",
      "-ss",
      selected[idx].toFixed(3),
      "-i",
      final,
      "-frames:v",
      "1",
      "-vf",
      "scale=960:540",
      path.join(QA, `video-qa-${String(idx + 1).padStart(2, "0")}.png`),
    ]);
  }
  run(FFMPEG, [
    "-y",
    "-ss",
    Math.min(totalDuration * 0.48, totalDuration - 14).toFixed(3),
    "-t",
    "12",
    "-i",
    final,
    "-vf",
    "fps=12,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=180:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle",
    "-loop",
    "0",
    path.join(OUT, "trailer.gif"),
  ]);
}

async function main() {
  await prepare();
  const data = await gatherDemoData();
  const scenes = buildScenes(data);
  const { records, narrationWav, totalDuration } = await buildNarration(scenes);
  await fs.mkdir(path.join(POLISH, "assets"), { recursive: true });
  const html = htmlForDemo(data, records);
  const htmlPath = path.join(OUT, "screen-demo.html");
  await fs.writeFile(htmlPath, html, "utf8");
  await fs.writeFile(path.join(POLISH, "index.html"), html, "utf8");
  await writeManifests(data, records, totalDuration);
  const raw = await recordScreen(htmlPath, totalDuration);
  const final = mixFinal(raw, narrationWav, totalDuration);
  await extractQaFrames(final, records, totalDuration);
  console.log(JSON.stringify({ final, raw, totalDuration: Number(totalDuration.toFixed(3)), voice: `mimo:${MIMO_MODEL}:${MIMO_VOICE}` }, null, 2));
}

await main();
