# TraceWarden SIFT Project PRD

## 1. Project background

FIND EVIL! asks teams to make Protocol SIFT a fully autonomous incident response agent on the SANS SIFT Workstation. The challenge explicitly values self-correction, accuracy validation, architectural guardrails, and traceability over broad but shallow tool coverage.

TraceWarden SIFT is a terminal-native claim-verification layer for autonomous DFIR. It treats every AI finding as a claim that must earn a replayable receipt before it can survive in the final report.

## 2. Problem definition

Primary user: a senior incident responder using SIFT during an active case.

Secondary user: a Protocol SIFT/OpenClaw maintainer evaluating whether an agent is safe enough to trust.

Personal/customer scar: during time-sensitive incidents, responders can overfit the first suspicious artifact. AI agents make that worse by producing confident text quickly. A plausible but unsupported malware lead can waste the first response window or pollute a report.

Top pain points:
- A finding often cannot be traced back to a file, line, offset, parser, or hash without manual digging.
- Prompt-only "do not modify evidence" rules are not enough for forensic trust.
- Agents rarely show how they corrected themselves after a failed lead.

Current workaround: analysts manually rerun SIFT commands, keep notes, and challenge AI summaries by hand.

Why the workaround fails: attackers move in minutes, while manual verification and report cleanup take longer than the first escalation window.

Must-have need: an autonomous loop that forces claim evidence, rejects unsupported findings, and logs its corrections.

Nice-to-have need: portable adapters for more SIFT artifact types.

Delight / wow layer: the agent publicly revokes its own first plausible claim, then replaces it with receipt-backed findings.

What a judge should believe after the first screen action: this is not an AI report generator; it is a forensic claim gate.

## 3. Target users

- Senior DFIR analyst: wants fast triage without losing evidentiary rigor.
- Protocol SIFT maintainer: wants architectural guardrails and reproducible traces.
- Junior analyst: wants to learn why the agent sequenced tools and corrected itself.
- Devpost judge: wants a one-command terminal demo and inspectable artifacts.

## 4. User pain points

- Speed mismatch: AI-enabled adversaries can act while humans are still preparing tools.
- Trust gap: autonomous findings are useless if the proof trail is missing.
- Evidence integrity anxiety: original evidence must not be modified.
- Context overload: raw tool output can bury the signal and degrade agent reasoning.
- Reporting burden: accuracy, false positives, missed artifacts, and hallucinations need structured documentation.

## 5. Core requirements & priority

P0 demo must-haves:
- `REQ-001` Typed read-only evidence tools: parsers expose bounded artifact functions and block path escape.
- `REQ-002` Self-correcting planner/verifier loop: at least one unsupported claim is challenged, revoked, and rerouted without human intervention.
- `REQ-003` Judge artifact compiler: each run writes claim receipts, execution log, accuracy report, incident report, and evidence manifest.

P1 requirements:
- `REQ-004` Accuracy harness against known ground truth with TP/FP/FN/hallucination metrics.
- `REQ-005` MCP/Protocol SIFT adapter surface for future workstation integration.
- `REQ-006` HTML report and receipt ledger for post-demo review.

P2 requirements:
- `REQ-007` Additional SIFT parsers such as MFT, Amcache, Prefetch, Volatility, and pcap adapters.
- `REQ-008` Multi-case benchmark leaderboard.

Non-goals for this submission:
- Full 200+ SIFT tool coverage.
- Live endpoint response or SIEM writeback.
- LLM provider integration.
- SOC dashboard or graph-first UI.

## 6. Solution overview

TraceWarden SIFT runs as a Python CLI. The agent loop is deterministic and local for the hackathon demo:

1. Seal evidence files with hashes.
2. Use typed read-only tools to parse logs and timelines.
3. Generate proposed claims.
4. Verify every claim against evidence references and ground-truth-compatible rules.
5. Challenge unsupported or contradictory claims.
6. Reroute into additional tools when a gap is detected.
7. Emit receipts, logs, accuracy metrics, and reports.

Recent Devpost AI pattern:
- recentIdeaFamily: evaluator/deploy gate plus workflow compiler.
- freshnessDelta: autonomous DFIR findings become revocable receipts, not summaries.
- mutationOperator: report -> state transition/proof.
- 2026 clone trap avoided: chat assistant, graph dashboard, generic hypothesis ledger, raw shell wrapper.
- Winner family: safety/triage and AI infrastructure primitive.
- Host surface: Linux terminal/SIFT filesystem and generated evidence files.
- Durable artifact: `claim_receipts.json`, `execution_log.jsonl`, `accuracy_report.md`, `incident_report.html`.
- 60-second delta: one bad lead is revoked and replaced by confirmed evidence-backed claims.
- Deterministic layer: parser schemas, verifier rules, path guard, evidence hashes, accuracy scoring.
- Secret/public-page risk: no API keys required; no secrets printed in reports.

## 7. User flows

HERO PATH:
1. Analyst runs `python -m tracewarden run examples/evidence/case-alpha --out runs/demo`.
2. Terminal prints evidence sealing and planner steps.
3. Agent proposes initial claims.
4. Verifier challenges `CLAIM-004`.
5. Planner reroutes into missing evidence.
6. Final report confirms supported claims and revokes the unsupported one.
7. Analyst opens receipts and accuracy report.

Guardrail path:
1. Maintainer runs guardrail tests.
2. Path escape and unsupported destructive operations are denied.
3. The refusal is logged as architecture evidence.

Review path:
1. Judge opens HTML incident report.
2. Clicks a receipt ID.
3. Sees file, line, parser, hash, confidence, status, and related tool-call span.

## 8. User Cases (>= 2)

See `pitch/user_cases.md`.

- User case 1 (HERO PATH): senior analyst runs one command and gets self-corrected claim receipts.
- User case 2: Protocol SIFT maintainer verifies architectural guardrails.
- User case 3: junior analyst replays the execution log as training evidence.

## 9. Demo critical path & Hero Moment

Canonical hero: `pitch/hero.md`.

Demo interaction plan: `pitch/demo_interaction_plan.md`.

Judge magnet: `pitch/judge_magnet.md`.

30s entry: fresh judge runs one command in the terminal.

60s visible consequence: `CLAIM-004` is challenged and revoked; true intrusion claims are confirmed with receipts.

5min proof artifact: `claim_receipts.json`, `execution_log.jsonl`, `accuracy_report.md`, `incident_report.html`, `docs/architecture/tracewarden-architecture.svg`, and `docs/evidence-dataset.md`.

Judge participation: judge can open a receipt ID, rerun the command, inspect verifier code, or run guardrail tests.

Visual staging: terminal first; generated report second; architecture diagram third.

Live-demo fallback: `artifacts/sample-run/` contains a run generated by the same command.

Attention ladder:

| Time | Judge should think | Screen / artifact evidence |
|---|---|---|
| 0-10s | It is built for the actual terminal challenge. | CLI run starts and seals evidence hashes. |
| 10-30s | It does not trust its own first lead. | Proposed claim enters verifier. |
| 30-60s | It self-corrects visibly. | `CLAIM-004` changes to `revoked`. |
| 2-3min | Guardrails are architectural. | Tool wall, path guard, tests, and logs. |
| 5min/Q&A | It can become Protocol SIFT infrastructure. | MCP adapter plan and benchmark outputs. |

Weakest rubric line: breadth of case data. Mitigation: document depth-over-breadth choice, SIFT adapter path, and future parser list.

Q&A proof: `pitch/judge_magnet.md` Q&A bank maps likely questions to proof files.

Retellable aha moment: the agent takes back its own bad forensic claim.

First-pass survival risks avoided: terminal demo, code repo, architecture diagram, dataset docs, accuracy report, and logs are all planned as first-class artifacts.

## 10. Pages / modules plan (>= 3 interactive surfaces)

| Route | Surface | Responsibility | Component/module plan |
|---|---|---|---|
| `/cli` | Terminal run | Primary demo action and live consequence. | `tracewarden.cli`, `TraceWardenAgent`, terminal status lines. |
| `/receipts` | Claim receipt ledger | Review every confirmed/revoked claim. | `claim_receipts.json`, `ReceiptRenderer`, receipt detail anchors. |
| `/accuracy` | Accuracy report | Show TP/FP/FN/hallucination metrics. | `accuracy_report.json`, Markdown/HTML report renderer. |
| `/architecture` | Trust boundary diagram | Explain typed tools, agent, verifier, reports. | `docs/architecture/tracewarden-architecture.svg`. |
| `/dataset` | Evidence dataset docs | Explain packaged case and ground truth. | `docs/evidence-dataset.md`, evidence manifest. |

## 11. Visual direction & UI principles

Visual style lane: operational-dashboard terminal

Primary UI library: xterm-monaco-inspired terminal/report component system, implemented as static HTML/CSS and Python-rendered report components.

Supporting UI library: data-viz-stack for report tables and score blocks, implemented with semantic HTML/CSS and no runtime dependency.

Non-Tailwind visual signature: receipt IDs, evidence hash ribbons, verifier status stamps, and trace-span rails.

Hero composition: terminal evidence bench with left-side run stream, right-side claim receipt stack, and bottom accuracy strip.

Visual differentiation note: avoids SaaS cards, graph-only attack maps, and generic cyber gradients; it looks like a forensic bench a SIFT analyst could use.

Forbidden lookalikes: EvidenceLoop SIFT hypothesis ledger, SIFT.Glass attack graph, generic SOC dashboard, chat assistant.

QR mobile access plan: QR opens the static incident report or README demo section.

Mobile primary flow: phone user can scan the report, tap a receipt ID, and read claim status within two taps.

Desktop parity plan: desktop keeps the full terminal/report split with keyboard-friendly anchors and printable evidence tables.

Logo source: logo-generator skill output planned; fallback is repo-native SVG wordmark in `public/brand/wordmark.svg`.

Avatar source: none; no user avatars are needed for terminal DFIR.

Generated image/cutout assets: not used; this product should prove real terminal artifacts rather than generated art. Mockup PNGs are locally composed screenshots.

## 12. Technical constraints

Environment: Linux terminal, Python 3.11+, SIFT-compatible filesystem paths.

Branch: DOMAIN, cybersecurity/DFIR. No external AI or Web3 provider is required for the demo.

Required env vars: none for the core run.

Official key URLs: none. Optional future LLM integration will document provider-specific keys before use.

Real data sources:
- Packaged evidence files in `examples/evidence/case-alpha`.
- Ground truth file in `examples/evidence/case-alpha/ground_truth.json`.
- Generated run artifacts in `runs/<run_id>`.

Product backbone:
- identity/session: stateless local analyst session identified by `run_id`.
- database/storage schema: filesystem storage under `runs/<run_id>` with JSONL, JSON, Markdown, and HTML artifacts.
- ownership fields: `run_id`, `case_id`, `evidence_root`, `analyst_id`, `tool_call_id`, `claim_id`.
- multi-user proof: stateless exception; judges can rerun locally and compare run IDs. Multi-role proof appears through analyst/maintainer/judge review paths.
- durable storage: local filesystem, suitable for SIFT workstation use.

Security constraints:
- Evidence tools are read-only.
- Evidence root path guard blocks traversal.
- Agent cannot call arbitrary shell in the P0 surface.
- Reports never modify original evidence.

Deployment target:
- Public docs/report can be served statically by Cloudflare Pages.
- Core judge path is local terminal execution on SIFT/Linux.

## 13. Success metrics

Product success metrics:
- One command completes the packaged case in under 90 seconds.
- At least 17 claims are evaluated.
- At least one plausible unsupported claim is revoked.
- Every surviving claim has file/line/hash evidence.
- Accuracy report includes TP, FP, FN, hallucinated claims, precision, recall, and F1.

Judge success metrics:
- Autonomous execution quality: visible plan/tool/verify/reroute loop.
- IR accuracy: accuracy report compares findings against ground truth.
- Security/reliability/guardrails: path guard and tool wall tests pass.
- Traceability: every confirmed claim links to a tool call and evidence reference.
- Video readiness: first 60 seconds show first click, self-correction, and proof artifact.

## 14. Risks & cut list

Prototype cut:
- Build deep support for one packaged log/timeline case instead of shallow support for many artifact types.
- Use deterministic local agent rules instead of external LLM calls.
- Generate static reports instead of building a full web app.

Cut features:
- Full SIFT 200+ tool coverage.
- Live endpoint response.
- SIEM writeback.
- Real-time graph visualization.
- Multi-user hosted SaaS.

Risks:
- No SIFT VM in this workspace. Mitigation: SIFT-compatible adapters, documented workstation install path, and packaged evidence proof.
- Judges may expect Protocol SIFT MCP wire protocol. Mitigation: include `mcp` command/schema surface and explain adapter boundary.
- Deterministic agent could look less "AI" than LLM. Mitigation: frame as guardrail/verifier layer that Protocol SIFT agents can use, and show autonomous self-correction.

## PRD Coverage Matrix

| Requirement | Priority | User case | Route/component | API/server action | Real data source | Contract/state | Test | Deploy evidence | Status |
|---|---|---|---|---|---|---|---|---|---|
| `REQ-001` | P0 | HERO PATH | `/cli` + `tracewarden.tools` | `EvidenceToolset.read_*` | `examples/evidence/case-alpha/*.log` | Read-only path guard, evidence hash manifest | `tests/test_guardrails.py` | Local run + README | planned |
| `REQ-002` | P0 | HERO PATH | `/cli` + `TraceWardenAgent` | `run_case()` | Timeline, auth, PowerShell, network logs | Claim status: proposed/challenged/confirmed/revoked | `tests/test_agent_loop.py` | Demo video + sample run | planned |
| `REQ-003` | P0 | HERO PATH | `/receipts` + report writer | `write_run_artifacts()` | Run claim model | JSON receipts, JSONL spans, HTML report | `tests/test_reports.py` | `artifacts/sample-run` | planned |
| `REQ-004` | P1 | Judge review | `/accuracy` | `score_claims()` | `ground_truth.json` | TP/FP/FN/hallucination metrics | `tests/test_accuracy.py` | Accuracy report | planned |
| `REQ-005` | P1 | Maintainer | `/architecture` + `tracewarden mcp` | `print_mcp_schema()` | Tool schema definitions | MCP-style typed read-only functions | `tests/test_mcp_schema.py` | Architecture diagram | planned |
| `REQ-006` | P1 | Junior analyst | `/dataset` + docs | `render_dataset_docs()` | Evidence manifest | Case and ground-truth documentation | `tests/test_cli.py` | Docs link | planned |
| `REQ-007` | P2 | Future SIFT | Parser adapters | `adapters/*` | MFT/Amcache/Prefetch/memory/pcap | Adapter interface | Future tests | cut-with-reason | cut-with-reason |
| `REQ-008` | P2 | Community benchmark | Leaderboard | `benchmark_many()` | Multiple cases | Multi-case score table | Future tests | cut-with-reason | cut-with-reason |
