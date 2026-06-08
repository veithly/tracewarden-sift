# Judge Magnet Brief

## Evidence Used

| Source | Used for | Portable lesson |
|---|---|---|
| Devpost challenge/rules/resources | Requirements and rubric. | Terminal execution, self-correction, accuracy, guardrails, traceability are mandatory. |
| Protocol SIFT GitHub/resources | Sponsor primitive. | MCP and SIFT integration must be structurally necessary. |
| Recent AI/agent winner corpus | Idea shape. | Evaluators and workflow compilers beat generic assistants. |
| Current indexed Find Evil submissions | Clone avoidance. | Avoid another ledger, graph, or broad MCP wrapper. |

## First-Pass Survival

- Required submission fields: repository, demo/video URL, project story, architecture diagram, dataset docs, accuracy report, execution logs.
- Must-open links: repo README, terminal demo instructions, generated reports, accuracy JSON/Markdown, run logs.
- Fresh-work / version-control requirement: all source and pitch artifacts created in this workspace for the hackathon period; pre-existing libraries only.
- AI/spec/tool attribution requirement: README documents Codex/HackathonHunter assistance and local deterministic agent rules.
- Partner/sponsor prize requirement: Protocol SIFT/SIFT/MCP integration is the product mechanism, not decorative.
- Disqualification risks: missing terminal demo, no self-correction sequence, no traceability, prompt-only guardrails.

## Judge Personas

| Persona | What they care about first | What would make them stop watching | Evidence we show |
|---|---|---|---|
| Retired FBI/Senior Forensics Examiner | Can every claim be defended? | Hallucinated finding with no artifact pointer. | Claim receipts with file/line/hash refs and verifier results. |
| SIFT/Protocol SIFT Maintainer | Does this improve the platform? | Raw shell wrapper or dashboard bolted on. | Typed MCP-style read-only tools and Claude/OpenClaw command surface. |
| Security Architect | Are guardrails real? | "The prompt says don't modify evidence." | Deny-by-construction tool surface and spoliation tests. |
| Devpost Judge | Can I understand it in 60 seconds? | Slow setup or vague AI claims. | One command runs a case, revokes a false lead, and writes reports. |

## Winner Thesis

- Personal or customer scar: during active incidents, junior responders and AI agents can overfit an early artifact and publish a confident false lead.
- Why this problem deserves attention: Find Evil is explicitly about hallucination reduction, self-correction, and traceability under AI-speed attacks.
- What the project proves in one screen action: a false DFIR claim is automatically challenged, revoked, rerouted, and replaced with evidence-backed receipts.
- Why the domain/sponsor primitive is necessary: the mechanism depends on SIFT/Protocol SIFT-style typed artifact tools and terminal execution.
- Why this can continue after the hackathon: the receipt/verifier layer can wrap additional SIFT tools and become a shared benchmark for Protocol SIFT agents.

## Prototype Cut

- 2-3 must-have features: typed read-only evidence tools; autonomous planner/verifier loop with self-correction; accuracy/report/log output.
- One miracle: the agent revokes its own plausible but wrong first lead and reroutes without human intervention.
- Cut features: broad 200-tool SIFT coverage, live endpoint response, LLM provider integration, SOC dashboard.
- Why the cut does not weaken the demo: judges score depth, traceability, and self-correction more than breadth.

## Attention Ladder

| Time | Judge should think | Screen / artefact evidence |
|---|---|---|
| 0-10s | This is terminal-native and built for the actual challenge. | `tracewarden run examples/evidence/case-alpha` starts in terminal. |
| 10-30s | It found a suspicious lead but did not trust itself. | Initial claim becomes `challenged`. |
| 30-60s | It self-corrected with traceable evidence. | False lead is `revoked`; true intrusion claims become `confirmed`. |
| 2-3min | The architecture enforces guardrails. | Tool wall, evidence hashes, execution log, and spoliation test. |
| 5min / Q&A | This can become community infrastructure. | Accuracy harness, MCP adapter, README expansion path. |

## Aha Moment

- User action: run one command against packaged case evidence.
- Visible consequence: the agent revokes a wrong malware claim, reopens a missing parser, and confirms the real intrusion path.
- Proof artefact: `claim_receipts.json`, `execution_log.jsonl`, `accuracy_report.md`, and `incident_report.html`.
- Why a judge can retell it: "It makes forensic claims earn receipts before they can survive."

## Rubric Coverage

| Rubric / prize criterion | Where it appears | Proof |
|---|---|---|
| Autonomous execution quality | Planner/verifier loop | Max-iteration autonomous reroute and self-correction trace. |
| IR accuracy | Accuracy harness | TP/FP/FN/hallucination score against ground truth. |
| Security/reliability/guardrails | Typed evidence tools | Read-only path guard and blocked destructive tool tests. |
| Traceability | Claim receipts | Every confirmed claim maps to file, line, offset, hash, parser, and tool call. |

## Q&A Bank

| Likely judge question | 1-sentence answer | Proof link / screen |
|---|---|---|
| Is this just a prompt? | No; claims are blocked or revoked by deterministic verifier code and typed read-only tools. | `src/tracewarden/verifier.py`, `tests/test_guardrails.py` |
| Can it run without SIFT installed? | Yes for the packaged log/timeline case; SIFT adapters are documented for workstation use. | README quick start |
| What self-correction is visible? | The first suspicious updater claim is revoked after cross-source verification fails. | `runs/.../execution_log.jsonl` |
| How do you measure hallucination? | Claims absent from ground truth and unsupported by evidence are counted separately from false positives. | `accuracy_report.json` |

## Judge-Magnet Scorecard

| Dimension | Score | Evidence |
|---|---:|---|
| First-pass survival | 2 | Required links and artifacts are explicit. |
| Problem belief | 2 | The challenge names hallucination and senior-analyst sequencing as the core scar. |
| Prototype cut | 2 | Three P0s: typed tools, verifier loop, reports/logs. |
| Aha/proof | 2 | A bad claim is visibly revoked and replaced with receipts. |
| Rubric coverage | 2 | Every criterion maps to a screen, file, or test. |
| After-hack credibility | 2 | The verifier can wrap more SIFT artifacts and become community benchmark infrastructure. |
| **Total** | **12/12** | Gate pass; required minimum is 9/12. |

## Anti-Hype Red Flags

- Ambiguity removed: the project is a terminal claim-verification agent, not an "AI cyber copilot."
- Template/starter-kit distance: custom claim model, verifier, tool wall, benchmark, reports, and tests.
- Missing-code or thin-repo risk: all code, case data, reports, docs, and tests live in the repo.
- Over-indexed criterion: balances autonomy, accuracy, guardrails, and traceability.
- Reused-project risk: repository starts empty and documents novel contribution.
