# Visual Build Contract: TraceWarden SIFT

## Source Inputs

- PRD: `pitch/project_prd.md` § 9-11
- Mockups: `docs/ui-mockups/01-hero-frame.png`, `02-app-frame.png`, `03-mobile-first-run.png`
- gpt-taste pass: unavailable; local design anchor chosen from PRD lane after GPT Pro/browser bridge failures.
- impeccable pass: unavailable; local anti-slop audit applied with HackathonHunter frontend rules.

## Visual Lane

- Lane: operational-dashboard terminal
- Why this lane fits: Find Evil judging requires live terminal execution, evidence traceability, and architectural guardrails.
- Design anchor / recipe: forensic evidence bench with terminal stream, claim receipt stack, hash ribbons, and verifier status stamps.
- Four positioning answers:
  - Narrative role: proof surface, not marketing surface.
  - Viewing distance: laptop/projector during terminal screencast and README screenshot.
  - Visual temperature: authoritative, dense, readable, restrained.
  - Capacity check: information-dense tables use fixed columns, short claim IDs, and printable reports.
- Non-Tailwind visual signature: receipt IDs, evidence hash ribbons, verifier status stamps, trace-span rails.
- Forbidden defaults: default starter, generic Tailwind SaaS cards, unmodified shadcn dashboard, purple cyber gradients, graph-first dashboard, chat box.

## Generated Cutout Assets

- Raw prompts: not used.
- Raw generations: not used.
- Cutout command: `node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/cutout_assets.mjs public/art/raw --out public/art/cutouts --brief-dir public/art/briefs --usage "not used for TraceWarden terminal report" --auto-key --trim` (recorded for audit; no cutouts are required)
- Cutout manifest: `public/art/cutouts/cutout-manifest.json` with `not_used=true`.
- UI usage map: none.

## Libraries

- Primary UI library: xterm-monaco-inspired terminal/report component system implemented with static HTML/CSS.
- Supporting UI library: data-viz-stack style tables and metric strips implemented with semantic HTML/CSS.
- Official docs checked: no third-party UI library required for the core judge path.
- Install commands: none.

## Route and Component Map

| Route | Mockup source | Hero/user-case beat | Components | Source marker |
|---|---|---|---|---|
| `/cli` | `docs/ui-mockups/01-hero-frame.png` | run case, self-correct, write reports | CLI status stream, claim transition stream | `data-visual-lane="operational-dashboard terminal" data-hero-composition="terminal evidence bench"` |
| `/receipts` | `docs/ui-mockups/02-app-frame.png` | inspect receipt proof | receipt table, status stamps, hash ribbons | `data-visual-lane="operational-dashboard terminal"` |
| `/accuracy` | `docs/ui-mockups/02-app-frame.png` | inspect scoring proof | accuracy strip, confusion table | `data-visual-lane="operational-dashboard terminal"` |
| `/architecture` | `docs/architecture/tracewarden-architecture.svg` | inspect trust boundary | SVG diagram, Markdown mirror | `data-hero-composition="trust boundary diagram"` |
| mobile QR | `docs/ui-mockups/03-mobile-first-run.png` | tap receipt detail | mobile receipt panel | static report anchors |

## Desktop and Mobile Compositions

- Desktop 1920x1200: two-column terminal plus receipt stack, bottom accuracy strip.
- Mobile 390x844: one receipt at a time, fixed bottom anchors for receipts, accuracy, architecture.
- Touch-first action path: tap a claim ID, read status, tap accuracy.
- Desktop parity detail: desktop report shows all tables, trace spans, and printable evidence refs.

## V0 Anchor and Critique

- V0 anchor artefact: `docs/ui-mockups/01-hero-frame.png`
- Five-dimension critique: philosophy 9/10, hierarchy 9/10, craft 8/10, functionality 9/10, originality 8/10
- Overall score: 8.6/10
- Fixes applied before full build: shortened hero line, removed decorative gradients, emphasized revoked claim in red text plus status word, added accuracy strip.

## Implementation Checks

- Top product shell has `data-visual-lane="operational-dashboard terminal"`.
- Top hero/app surface has `data-hero-composition="terminal evidence bench"`.
- Default starter copy/assets are deleted.
- Brand pack appears in README, report header, favicon/OG placeholder, and video lower-third.
- `node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_project.mjs <project> --phase ui-libs` must pass before final recording.
