import { mkdir, writeFile, rm, rename, readdir } from "node:fs/promises";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const out = "docs/ui-mockups";
await mkdir(out, { recursive: true });

const palette = {
  bg: "#0a0d11",
  panel: "#14191f",
  panel2: "#101419",
  line: "#475569",
  text: "#e2e8f0",
  muted: "#94a3b8",
  green: "#32d583",
  amber: "#f4c430",
  red: "#ff5c5c",
  cyan: "#5ce1e6",
};

function esc(text) {
  return String(text).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
}

function t(x, y, text, color = palette.text, size = 24, weight = 500) {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="Menlo, Consolas, monospace" font-size="${size}" font-weight="${weight}">${esc(text)}</text>`;
}

function r(x, y, w, h, fill = palette.panel, stroke = palette.line, radius = 10) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
}

function svg(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="${palette.bg}"/>
${body}
</svg>`;
}

const heroLines = [
  ["[seal] evidence root locked: examples/evidence/case-alpha", palette.green],
  ["[plan] collect timeline, auth, powershell, network artifacts", palette.muted],
  ["[tool] read_timeline -> 23 events, sha256 sealed", palette.muted],
  ["[claim] CLAIM-004 proposed: updater.exe suspicious execution", palette.text],
  ["[verify] CLAIM-004 lacks cross-source support; benign updater path found", palette.amber],
  ["[correct] CLAIM-004 revoked; rerouting into powershell + network", palette.red],
  ["[tool] read_powershell -> encoded credential dump command", palette.muted],
  ["[tool] read_network -> exfil connection to 203.0.113.77", palette.muted],
  ["[write] claim_receipts.json accuracy_report.md incident_report.html", palette.green],
];

const hero = svg(
  1920,
  1200,
  [
    t(80, 78, "TraceWarden SIFT", palette.text, 32, 700),
    t(80, 114, "Prove 17 DFIR claims in 90 seconds.", palette.cyan, 24, 600),
    r(70, 150, 1090, 860),
    t(100, 195, "$ python -m tracewarden run examples/evidence/case-alpha --out runs/demo", palette.green, 22),
    ...heroLines.map(([line, color], i) => t(104, 258 + i * 70, line, color, 24)),
    r(1210, 150, 640, 860, palette.panel2),
    t(1240, 195, "Claim Receipts", palette.text, 30, 700),
    ...[
      ["CLAIM-004", "REVOKED", "No cross-source support", palette.red],
      ["CLAIM-009", "CONFIRMED", "Credential dump command", palette.green],
      ["CLAIM-013", "CONFIRMED", "Persistence key written", palette.green],
      ["CLAIM-017", "CONFIRMED", "Exfil connection", palette.green],
    ].flatMap(([id, status, desc, color], i) => {
      const y = 240 + i * 158;
      return [
        r(1240, y, 578, 132, "#181e26", palette.line, 8),
        t(1260, y + 42, id, palette.cyan, 22, 700),
        t(1600, y + 42, status, color, 20, 700),
        t(1260, y + 78, desc, palette.text, 22),
        t(1260, y + 108, "file:line + sha256 + tool_call_id", palette.muted, 18),
      ];
    }),
    r(70, 1040, 1780, 90, "#0d1217"),
    t(100, 1095, "17 claims evaluated  |  12 confirmed  |  1 revoked  |  precision 0.92  |  recall 0.86  |  hallucinations 0", palette.cyan, 24),
  ].join("\n"),
);

const ledgerRows = [
  ["CLAIM-004", "revoked", "timeline.csv:44 sha256:91af...", "timeline", "benign updater path; no network/process corroboration"],
  ["CLAIM-009", "confirmed", "powershell.log:88 sha256:b32c...", "powershell", "encoded credential dump command"],
  ["CLAIM-013", "confirmed", "registry.log:31 sha256:c7e1...", "registry", "run key persistence after credential dump"],
  ["CLAIM-017", "confirmed", "network.log:16 sha256:aa08...", "network", "exfil host contacted after archive staging"],
];

const app = svg(
  1920,
  1200,
  [
    t(80, 80, "Claim receipt ledger", palette.text, 34, 700),
    t(80, 116, "Every surviving finding maps to evidence, parser, hash, and tool span.", palette.muted, 22),
    r(70, 145, 1780, 935),
    ...["Claim", "Status", "Evidence ref", "Parser", "Verifier reason"].map((h, i) => t([105, 310, 520, 990, 1220][i], 195, h, palette.cyan, 22, 700)),
    ...ledgerRows.flatMap((row, i) => {
      const y = 240 + i * 145;
      const xs = [105, 310, 520, 990, 1220];
      return [
        r(95, y, 1723, 118, "#181e26"),
        ...row.map((v, j) => t(xs[j], y + 52, v, v === "revoked" ? palette.red : v === "confirmed" ? palette.green : palette.text, j === 1 ? 20 : 19, j < 2 ? 700 : 500)),
      ];
    }),
    r(95, 880, 1723, 158, "#0c1116"),
    t(125, 928, "Accuracy strip", palette.cyan, 24, 700),
    t(125, 976, "TP 12   FP 1   FN 2   hallucinated 0   F1 0.89   evidence integrity: pass", palette.text, 24),
  ].join("\n"),
);

const mobile = svg(
  390,
  844,
  [
    t(22, 42, "TraceWarden", palette.text, 22, 700),
    t(22, 70, "Receipt CLAIM-004", palette.cyan, 16, 700),
    r(18, 92, 354, 668),
    t(38, 132, "Status", palette.muted, 14),
    t(38, 160, "REVOKED", palette.red, 24, 700),
    t(38, 214, "Verifier note", palette.muted, 14),
    t(38, 242, "No cross-source support.", palette.text, 16),
    t(38, 268, "Benign updater path found.", palette.text, 16),
    t(38, 324, "Evidence", palette.muted, 14),
    t(38, 352, "timeline.csv:44", palette.cyan, 16),
    t(38, 380, "sha256:91af...", palette.text, 16),
    t(38, 408, "tool_call: TOOL-003", palette.text, 16),
    r(38, 456, 314, 154, "#0c1116"),
    t(58, 494, "Next confirmed lead", palette.muted, 14),
    t(58, 526, "CLAIM-009 credential dump", palette.green, 16, 700),
    t(58, 554, "powershell.log:88", palette.cyan, 16),
    t(38, 700, "Accuracy  F1 0.89   Hallucinations 0", palette.cyan, 14),
    r(18, 780, 354, 44),
    t(38, 808, "Receipts     Accuracy     Architecture", palette.text, 14),
  ].join("\n"),
);

const frames = [
  ["01-hero-frame", hero],
  ["02-app-frame", app],
  ["03-mobile-first-run", mobile],
];

for (const [name, content] of frames) {
  const svgPath = join(out, `${name}.svg`);
  await writeFile(svgPath, content, "utf8");
  try {
    await rm(join(out, `${name}.png`), { force: true });
    await exec("qlmanage", ["-t", "-s", name.startsWith("03") ? "844" : "1920", "-o", out, svgPath]);
    const files = await readdir(out);
    const generated = files.find((file) => file.startsWith(`${name}.svg`) && file.endsWith(".png"));
    if (generated) await rename(join(out, generated), join(out, `${name}.png`));
  } catch (error) {
    console.error(`Failed to render ${name}: ${error.message}`);
    process.exitCode = 1;
  }
}
