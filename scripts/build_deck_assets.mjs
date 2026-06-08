#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

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
const { PDFDocument } = requireFromRuntime("pdf-lib");
const sharp = requireFromRuntime("sharp");
const OUT = path.join(ROOT, "pitch", "deck");
const THUMBS = path.join(ROOT, "pitch", "deck-thumbs");
const PREVIEWS = path.join(OUT, "previews");
const WIDTH = 1920;
const HEIGHT = 1080;

const palette = {
  bg: "#081016",
  panel: "#111b23",
  panel2: "#17242d",
  line: "#2e4350",
  text: "#eef6f6",
  muted: "#a8bbc0",
  teal: "#45d4c8",
  green: "#75d38a",
  amber: "#f2b760",
  red: "#ff6a66",
  ink: "#071015",
};

const slides = [
  {
    id: "01",
    kicker: "TraceWarden SIFT",
    title: "Prove 17 DFIR claims in 90 seconds.",
    subtitle: "Autonomous incident-response findings earn replayable receipts before they survive.",
    body: [
      "Sealed evidence root",
      "Typed read-only parsers",
      "Verifier-controlled claim states",
    ],
    notes:
      "A defender agent can be fast and still dangerous if it cannot prove what it says. TraceWarden SIFT runs a packaged case and makes each finding point back to evidence.",
  },
  {
    id: "02",
    kicker: "Why it matters",
    title: "Unverified agent claims pollute incident response.",
    subtitle: "The failure mode is not a weak summary. It is a false lead that burns responder time.",
    body: [
      "Status quo: agent says a process is suspicious",
      "Breakage: responders chase the wrong artifact",
      "TraceWarden: unsupported claims get revoked",
    ],
    notes:
      "In incident response, a plausible false lead creates work. The demo shows the agent suspecting updater.exe, then the verifier rejects that path and pushes the investigation into the logs that actually support the intrusion.",
  },
  {
    id: "03",
    kicker: "Live demo",
    title: "CLAIM-004 gets revoked on screen.",
    subtitle: "The agent reroutes from a weak updater lead into PowerShell and network evidence.",
    body: [
      "Run one terminal command",
      "Watch plan -> tool -> verify -> correct",
      "Open receipts and accuracy report",
    ],
    notes:
      "This is the show. The same run writes claim_receipts.json, execution_log.jsonl, accuracy_report.md, and an HTML incident report.",
  },
  {
    id: "04",
    kicker: "Mechanism",
    title: "Guardrails live below the planner.",
    subtitle: "The LLM can plan, but the verifier controls what becomes a durable finding.",
    body: [
      "Evidence root is sealed and hashed",
      "Tools return typed EvidenceRef objects",
      "Receipts bind claims to file, line, parser, hash, and tool call",
    ],
    notes:
      "Three parts matter: sealed evidence, typed tools, and verifier-owned claim transitions. That makes Protocol SIFT usable as a guardrail layer around future planners and parsers.",
  },
  {
    id: "05",
    kicker: "Proof",
    title: "16 confirmed. 1 revoked. 0 hallucinations.",
    subtitle: "The package is reproducible from the repo and scored against ground truth.",
    body: [
      "17 claims evaluated",
      "precision 1.0, recall 1.0",
      "path escape blocked in tests",
    ],
    notes:
      "Everything here is local and inspectable. Run the command, open the receipts, and compare the accuracy report to the ground truth file.",
  },
];

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

function textBlock(lines, x, y, size, color, weight = 500, family = "Inter, Helvetica, Arial, sans-serif", gap = 1.18) {
  return lines
    .map((line, idx) => {
      const yy = y + idx * size * gap;
      return `<text x="${x}" y="${yy}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(line)}</text>`;
    })
    .join("\n");
}

function terminalLines() {
  const rows = [
    ["$ PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo", palette.muted],
    ["[seal] evidence root locked · 5 artifacts · manifest hash written", palette.teal],
    ["[plan] parse timeline, auth, PowerShell, registry, network", palette.muted],
    ["[tool] read_powershell_log -> 5 evidence refs", palette.muted],
    ["[verify] CLAIM-004 lacks cross-source support", palette.amber],
    ["[correct] CLAIM-004 revoked; rerouting into PowerShell + network", palette.red],
    ["[write] claim_receipts.json · accuracy_report.md · incident_report.html", palette.green],
  ];
  return rows
    .map((row, idx) => {
      const [text, color] = row;
      return `<text x="122" y="${538 + idx * 42}" font-family="Menlo, Consolas, monospace" font-size="24" fill="${color}">${esc(text)}</text>`;
    })
    .join("\n");
}

function receiptCard(x, y, label, status, detail, color) {
  return `
    <g filter="url(#softShadow)">
      <rect x="${x}" y="${y}" width="520" height="128" rx="14" fill="${palette.panel}" stroke="${color}" stroke-width="2"/>
      <text x="${x + 28}" y="${y + 43}" font-family="Menlo, Consolas, monospace" font-size="25" font-weight="700" fill="${color}">${esc(label)} · ${esc(status)}</text>
      <text x="${x + 28}" y="${y + 84}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="22" fill="${palette.text}">${esc(detail)}</text>
    </g>`;
}

function statPill(x, y, value, label, color) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="255" height="140" rx="16" fill="${palette.panel}" stroke="${palette.line}" stroke-width="2"/>
      <text x="${x + 28}" y="${y + 62}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="48" font-weight="800" fill="${color}">${esc(value)}</text>
      <text x="${x + 28}" y="${y + 102}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="22" fill="${palette.muted}">${esc(label)}</text>
    </g>`;
}

function flowBox(x, y, title, detail, color) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="335" height="150" rx="16" fill="${palette.panel}" stroke="${color}" stroke-width="2"/>
      <text x="${x + 26}" y="${y + 52}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="30" font-weight="800" fill="${color}">${esc(title)}</text>
      ${textBlock(wrapWords(detail, 25), x + 26, y + 92, 21, palette.text, 500)}
    </g>`;
}

function sharedChrome(slide, index) {
  return `
  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1d3038" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.bg}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" opacity="0.34"/>
  <circle cx="1580" cy="118" r="370" fill="${palette.teal}" opacity="0.09"/>
  <circle cx="180" cy="1010" r="420" fill="${palette.amber}" opacity="0.07"/>
  <text x="84" y="78" font-family="Menlo, Consolas, monospace" font-size="21" fill="${palette.teal}" letter-spacing="2">${esc(slide.kicker.toUpperCase())}</text>
  <text x="1708" y="78" font-family="Menlo, Consolas, monospace" font-size="20" fill="${palette.muted}">0${index + 1}/05</text>
  <line x1="84" y1="104" x2="1836" y2="104" stroke="${palette.line}" stroke-width="2"/>
  `;
}

function slideSvg(slide, index) {
  const titleLines = wrapWords(slide.title, index === 0 ? 23 : 28);
  const subtitleLines = wrapWords(slide.subtitle, 58);
  const bullets = slide.body
    .map((item, idx) => {
      const y = 822 + idx * 54;
      return `
        <g>
          <rect x="112" y="${y - 26}" width="30" height="30" rx="8" fill="${idx === 1 ? palette.amber : palette.teal}" opacity="0.92"/>
          <text x="164" y="${y}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25" fill="${palette.text}">${esc(item)}</text>
        </g>`;
    })
    .join("\n");

  let proof = "";
  if (index === 0) {
    proof = `
      <g transform="translate(1040 230) rotate(-2)">
        ${receiptCard(0, 0, "CLAIM-004", "REVOKED", "weak updater lead stopped", palette.red)}
        ${receiptCard(44, 156, "CLAIM-009", "CONFIRMED", "powershell.log + network.log", palette.green)}
        ${receiptCard(88, 312, "RECEIPTS", "WRITTEN", "file · line · parser · hash", palette.teal)}
      </g>
      <g filter="url(#softShadow)">
        <rect x="92" y="378" width="874" height="410" rx="18" fill="#071015" stroke="${palette.line}" stroke-width="2"/>
        <rect x="92" y="378" width="874" height="48" rx="18" fill="#15242b"/>
        <circle cx="126" cy="402" r="8" fill="${palette.red}"/><circle cx="154" cy="402" r="8" fill="${palette.amber}"/><circle cx="182" cy="402" r="8" fill="${palette.green}"/>
        ${terminalLines()}
      </g>`;
  } else if (index === 1) {
    proof = `
      <g filter="url(#softShadow)">
        <rect x="104" y="382" width="740" height="340" rx="18" fill="${palette.panel}" stroke="${palette.line}" stroke-width="2"/>
        <text x="144" y="448" font-family="Inter, Helvetica, Arial, sans-serif" font-size="33" font-weight="800" fill="${palette.red}">Weak path</text>
        <text x="144" y="510" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25" fill="${palette.text}">Process looks suspicious.</text>
        <text x="144" y="564" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25" fill="${palette.muted}">No second source. Benign vendor traffic.</text>
        <line x1="144" y1="612" x2="790" y2="612" stroke="${palette.line}" stroke-width="2"/>
        <text x="144" y="672" font-family="Menlo, Consolas, monospace" font-size="26" fill="${palette.red}">CLAIM-004 -> revoked</text>
      </g>
      <g filter="url(#softShadow)">
        <rect x="946" y="382" width="740" height="340" rx="18" fill="${palette.panel}" stroke="${palette.green}" stroke-width="2"/>
        <text x="986" y="448" font-family="Inter, Helvetica, Arial, sans-serif" font-size="33" font-weight="800" fill="${palette.green}">Receipt path</text>
        <text x="986" y="510" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25" fill="${palette.text}">PowerShell download chain.</text>
        <text x="986" y="564" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25" fill="${palette.muted}">Network beacon and auth anomaly line up.</text>
        <line x1="986" y1="612" x2="1632" y2="612" stroke="${palette.line}" stroke-width="2"/>
        <text x="986" y="672" font-family="Menlo, Consolas, monospace" font-size="26" fill="${palette.green}">confirmed -> claim_receipts.json</text>
      </g>`;
  } else if (index === 2) {
    proof = `
      <g filter="url(#softShadow)">
        <rect x="120" y="338" width="1220" height="520" rx="18" fill="#071015" stroke="${palette.line}" stroke-width="2"/>
        <rect x="120" y="338" width="1220" height="54" rx="18" fill="#15242b"/>
        <text x="158" y="374" font-family="Menlo, Consolas, monospace" font-size="22" fill="${palette.muted}">tracewarden terminal run</text>
        ${terminalLines().replaceAll('x="122"', 'x="166"').replaceAll('y="538"', 'y="476"').replaceAll('y="580"', 'y="518"').replaceAll('y="622"', 'y="560"').replaceAll('y="664"', 'y="602"').replaceAll('y="706"', 'y="644"').replaceAll('y="748"', 'y="686"').replaceAll('y="790"', 'y="728"')}
      </g>
      <g>
        <path d="M 1420 492 C 1508 492, 1508 570, 1602 570" fill="none" stroke="${palette.teal}" stroke-width="5"/>
        <polygon points="1602,570 1574,554 1574,586" fill="${palette.teal}"/>
        ${receiptCard(1350, 640, "CLAIM-004", "REVOKED", "the demo's self-correction", palette.red)}
      </g>`;
  } else if (index === 3) {
    proof = `
      <g transform="translate(92 438)">
        ${flowBox(0, 0, "Seal", "hash evidence root before parsing", palette.teal)}
        <path d="M 350 75 L 418 75" stroke="${palette.muted}" stroke-width="4"/><polygon points="418,75 398,62 398,88" fill="${palette.muted}"/>
        ${flowBox(445, 0, "Tools", "read-only parsers return EvidenceRef", palette.amber)}
        <path d="M 795 75 L 863 75" stroke="${palette.muted}" stroke-width="4"/><polygon points="863,75 843,62 843,88" fill="${palette.muted}"/>
        ${flowBox(890, 0, "Verify", "claim transitions need support", palette.green)}
        <path d="M 1240 75 L 1308 75" stroke="${palette.muted}" stroke-width="4"/><polygon points="1308,75 1288,62 1288,88" fill="${palette.muted}"/>
        ${flowBox(1335, 0, "Receipts", "durable proof for each finding", palette.teal)}
      </g>
      <g filter="url(#softShadow)">
        <rect x="302" y="676" width="1314" height="170" rx="16" fill="${palette.panel}" stroke="${palette.line}" stroke-width="2"/>
        <text x="346" y="742" font-family="Menlo, Consolas, monospace" font-size="27" fill="${palette.text}">EvidenceRef(file, line, parser, sha256, tool_call_id)</text>
        <text x="346" y="794" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" fill="${palette.muted}">The planner suggests. The verifier decides what survives.</text>
      </g>`;
  } else {
    proof = `
      <g transform="translate(118 396)">
        ${statPill(0, 0, "17", "claims evaluated", palette.teal)}
        ${statPill(300, 0, "16", "confirmed", palette.green)}
        ${statPill(600, 0, "1", "revoked", palette.red)}
        ${statPill(900, 0, "0", "hallucinations", palette.amber)}
        ${statPill(1200, 0, "1.0", "precision / recall", palette.green)}
      </g>
      <g filter="url(#softShadow)">
        <rect x="118" y="626" width="1540" height="180" rx="18" fill="${palette.panel}" stroke="${palette.line}" stroke-width="2"/>
        <text x="158" y="698" font-family="Menlo, Consolas, monospace" font-size="28" fill="${palette.teal}">Open: runs/demo/incident_report.html · claim_receipts.json · accuracy_report.md</text>
        <text x="158" y="756" font-family="Inter, Helvetica, Arial, sans-serif" font-size="25" fill="${palette.text}">Ask: inspect the proof chain, then add the next SIFT parser family.</text>
      </g>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  ${sharedChrome(slide, index)}
  ${textBlock(titleLines, 92, 206, index === 0 ? 82 : 68, palette.text, 850, "Inter, Helvetica, Arial, sans-serif", 1.05)}
  ${textBlock(subtitleLines, 96, 326 + Math.max(0, titleLines.length - 1) * 70, 31, palette.muted, 500)}
  ${proof}
  ${bullets}
  <text x="92" y="1018" font-family="Menlo, Consolas, monospace" font-size="20" fill="${palette.muted}">TraceWarden SIFT · FIND EVIL! · reproducible local package</text>
</svg>`;
}

async function writeSpeakerNotes() {
  const lines = [
    "# TraceWarden SIFT Pitch Deck Speaker Notes",
    "",
    "Hero anchor: Prove 17 DFIR claims in 90 seconds.",
    "",
    ...slides.flatMap((slide, idx) => [
      `## Slide ${idx + 1}: ${slide.title}`,
      "",
      slide.notes,
      "",
    ]),
  ];
  await fs.writeFile(path.join(OUT, "speaker-notes.md"), `${lines.join("\n")}\n`, "utf8");
}

async function svgToPng(svgPath, pngPath) {
  const svg = await fs.readFile(svgPath);
  await sharp(svg).png().toFile(pngPath);
}

async function buildPdf(pngPaths, pdfPath) {
  const pdf = await PDFDocument.create();
  for (const pngPath of pngPaths) {
    const bytes = await fs.readFile(pngPath);
    const image = await pdf.embedPng(bytes);
    const page = pdf.addPage([WIDTH, HEIGHT]);
    page.drawImage(image, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
  }
  await fs.writeFile(pdfPath, await pdf.save());
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(PREVIEWS, { recursive: true });
  await fs.mkdir(THUMBS, { recursive: true });

  const pngPaths = [];
  for (let idx = 0; idx < slides.length; idx += 1) {
    const slide = slides[idx];
    const svg = slideSvg(slide, idx);
    const svgPath = path.join(OUT, `slide-${slide.id}.svg`);
    const previewPng = path.join(PREVIEWS, `slide-${slide.id}.png`);
    const thumbPng = path.join(THUMBS, `slide-${slide.id}.png`);
    await fs.writeFile(svgPath, svg, "utf8");
    await svgToPng(svgPath, previewPng);
    await fs.copyFile(previewPng, thumbPng);
    pngPaths.push(previewPng);
  }
  await writeSpeakerNotes();
  await buildPdf(pngPaths, path.join(OUT, "tracewarden-sift-deck.pdf"));
  await fs.writeFile(
    path.join(OUT, "manifest.json"),
    `${JSON.stringify(
      {
        title: "TraceWarden SIFT",
        hero: "Prove 17 DFIR claims in 90 seconds.",
        slide_count: slides.length,
        previews: pngPaths.map((p) => path.relative(ROOT, p)),
        thumbs: slides.map((s) => `pitch/deck-thumbs/slide-${s.id}.png`),
        pdf: "pitch/deck/tracewarden-sift-deck.pdf",
        generated_from: path.relative(ROOT, fileURLToPath(import.meta.url)),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
