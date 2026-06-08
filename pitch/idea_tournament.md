# Idea Tournament

## Context

- Hackathon: FIND EVIL!
- Tracks/rubric: autonomous execution quality, IR accuracy, security/reliability/guardrails, traceability.
- Constraints: Linux terminal/SIFT environment, Protocol SIFT/MCP integration, under-5-minute live terminal demo, self-correction sequence, architecture diagram, dataset docs, accuracy report, execution logs.

## GPT Pro Deep Research 10x10

| Prompt | Response | Local synthesis | Completed hackathons | Mature products |
|---|---|---|---:|---:|
| `pitch/gpt-pro/prompts/research/01-10x10-deep-research.md` | `pitch/gpt-pro/responses/research/01-10x10-deep-research-response.md` | `pitch/deep_research_10x10.md` | 10 | 11 |

## GPT Pro Availability

GPT Pro Deep Research and Web Search were attempted. Extraction failed after the Deep Research connector reported completion, and the web-search fallback produced no substantive extract. Following the failure policy, this tournament uses local synthesis and logs the quality warning in `.hunter/evidence-log.md`.

## Raw GPT Pro ideation windows

| Window | Prompt | Response | Ideas returned |
|---|---|---|---:|
| 01-hackathon-transfer | `pitch/gpt-pro/prompts/ideation/01-hackathon-transfer.md` | `pitch/gpt-pro/responses/ideation/01-hackathon-transfer-response.md` | 0 |
| 02-product-analogue | `pitch/gpt-pro/prompts/ideation/02-product-analogue.md` | `pitch/gpt-pro/responses/ideation/02-product-analogue-response.md` | 0 |
| 03-sponsor-demo-primitive | `pitch/gpt-pro/prompts/ideation/03-sponsor-demo-primitive.md` | `pitch/gpt-pro/responses/ideation/03-sponsor-demo-primitive-response.md` | 0 |

## Deduped Candidates

| Idea ID | Name | 5-12 word rumor | Recent idea family | Freshness delta | Mutation operator | 2026 clone trap avoided | Winner pattern basis | Novelty delta | Judge surprise | Judge-magnet basis | Demo interaction | Showcase plan | New primitive | 60s consequence | Proof artifact | Merged from |
|---|---|---|---|---|---|---|---|---:|---:|---|---|---|---|---|---|---|
| IDEA-001 | TraceWarden SIFT | It revokes bad forensic claims before judges blink. | Evaluator/deploy gate + workflow compiler | Claim receipts are replayable and revocable, not just logged. | Report -> state transition/proof | Hypothesis ledger, graph dashboard | QA sandbox + SOAR audit + Protocol SIFT | 9 | 9 | Direct rubric match | Run one case; false lead is revoked. | Terminal first, reports second. | Claim receipt verifier | Bad lead revoked; true intrusion confirmed. | `claim_receipts.json` | Local synthesis |
| IDEA-002 | SIFT Circuit Breaker | The agent stops itself before touching evidence. | Evaluator/deploy gate | Strong guardrail story, weaker IR depth. | Dashboard -> control surface | Raw shell wrapper | Security gate winners | 8 | 7 | Guardrails | Attempt destructive command; blocker fires. | Terminal refusal proof. | Evidence spoliation gate | Unsafe action blocked. | `spoliation_report.md` | Local synthesis |
| IDEA-003 | Dual-Artifact Reconciler | Disk and memory argue until truth survives. | Reconciliation router | Strong DFIR scar, needs memory data. | RAG -> reconciliation | Single-source triage | Timesketch + Volatility loops | 8 | 8 | Accuracy | Compare disk timeline and memory process list. | Conflict table. | Cross-artifact contradiction engine | Contradiction corrected. | `reconciliation_receipts.json` | Local synthesis |
| IDEA-004 | Typed SIFT Tool Wall | Protocol SIFT gets safe typed forensic functions. | Proxy/efficiency primitive | Architecturally strong, less demo magic alone. | Shell -> typed functions | Prompt guardrails | MCP/A2A patterns | 7 | 7 | Sponsor fit | Agent calls only read-only parsers. | Tool schema demo. | Read-only MCP adapter | Path escape blocked. | `tool_audit.jsonl` | Local synthesis |
| IDEA-005 | Accuracy League | Protocol SIFT agents compete on known cases. | Evaluator/benchmark | Useful community infra, lower incident-drama. | Report -> benchmark score | Accuracy afterthought | LLM eval products | 8 | 7 | After-hack credibility | Run agent on ground truth case. | Scoreboard. | DFIR hallucination benchmark | Accuracy score produced. | `accuracy_report.json` | Local synthesis |
| IDEA-006 | Junior Analyst Flight Recorder | Every AI step becomes a training replay. | Institution memory transfer | Clear education use, weaker tiebreaker. | Copilot -> replay artifact | Chat tutor | Abridge/Copilot loops | 7 | 6 | Transparency | Replay run log as teachable timeline. | Split terminal/report. | Investigation trace replay | Junior can trace why. | `execution_log.jsonl` | Local synthesis |
| IDEA-007 | Live Endpoint Triage Router | Remote MCP evidence becomes a routed case. | Ops router/control surface | Ambitious, live endpoint risk. | Dashboard -> dispatch | SIEM clone | SOAR products | 7 | 8 | Operational value | Pull remote logs, route severity. | Live SIEM-like terminal. | Remote evidence router | Case routed to owner. | `handoff.json` | Local synthesis |
| IDEA-008 | Artifact Gap Hunter | The agent hunts missing evidence before concluding. | Workflow compiler | Good self-correction, less memorable than receipts. | Assistant -> compiler | Summary-only | DevSecOps checklists | 7 | 7 | Autonomy | Initial report blocked by missing artifact. | Missing-evidence checklist. | Gap-driven planner | Missing parser rerun. | `gap_plan.json` | Local synthesis |

## Demo Interaction Plans

| Idea ID | 0-10s hook | 10-30s interaction | 30-60s consequence | Judge participation | Visual staging | Fallback if live input fails |
|---|---|---|---|---|---|---|
| IDEA-001 | Terminal: "17 claims require receipts." | Run packaged case; watch initial false lead. | Claim revoked, reroute runs, true claims confirmed. | Judge can open receipt by ID. | Terminal + generated HTML report. | Pre-generated run under `artifacts/sample-run`. |
| IDEA-002 | Terminal blocks unsafe operation. | Attempt path escape/destructive command. | Refusal logged. | Judge can inspect test. | Red/green terminal. | Replay unit test. |
| IDEA-003 | Disk and memory disagree. | Run reconciliation. | Conflict resolved. | Judge toggles artifact. | Conflict table. | Use packaged memory JSON. |
| IDEA-004 | MCP schemas appear. | Call tools. | Unsafe command impossible. | Judge reads schema. | Tool list. | Static schema print. |
| IDEA-005 | Scoreboard prints. | Run benchmark. | Accuracy score. | Judge changes threshold. | Terminal table. | Precomputed report. |

## Scoreboard

| Idea ID | Rubric/Sponsor | Technical | Product/Demo | Interaction/Showcase | Novelty/Judge Surprise | Judge Magnet | Aggregate | Fatal concerns |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| IDEA-001 | 10 | 9 | 9 | 9 | 9 | 12 | 58 | Needs careful scope; solve with packaged case and typed adapters. |
| IDEA-002 | 9 | 9 | 7 | 7 | 7 | 10 | 49 | Less IR accuracy depth. |
| IDEA-003 | 9 | 8 | 8 | 8 | 8 | 10 | 51 | Requires realistic memory data. |
| IDEA-004 | 10 | 8 | 6 | 6 | 7 | 9 | 46 | Could look like infrastructure only. |
| IDEA-005 | 8 | 9 | 7 | 7 | 8 | 10 | 49 | Lower visible incident drama. |
| IDEA-006 | 7 | 8 | 7 | 7 | 6 | 8 | 43 | Judge-magnet below gate. |
| IDEA-007 | 8 | 6 | 8 | 8 | 8 | 9 | 47 | Live endpoint risk. |
| IDEA-008 | 8 | 8 | 7 | 7 | 7 | 9 | 46 | Weaker retellable hook. |

## GPT Pro Judges

| Judge | Prompt | Response | Role |
|---|---|---|---|
| Rubric/Sponsor | `pitch/gpt-pro/prompts/judging/01-rubric-sponsor-judge.md` | `pitch/gpt-pro/responses/judging/01-rubric-sponsor-judge-response.md` | Sponsor/rubric fit; unavailable, replaced by local scoring. |
| Technical | `pitch/gpt-pro/prompts/judging/02-technical-execution-judge.md` | `pitch/gpt-pro/responses/judging/02-technical-execution-judge-response.md` | Execution risk; unavailable, replaced by local scoring. |
| Product/Demo | `pitch/gpt-pro/prompts/judging/03-product-demo-judge.md` | `pitch/gpt-pro/responses/judging/03-product-demo-judge-response.md` | User clarity and showmanship; unavailable, replaced by local scoring. |

## Selected Winner

- Idea ID: IDEA-001
- Why it wins: it hits all four judging criteria in one terminal-visible loop and produces evidence artifacts judges can inspect.
- Novelty delta: claim receipts must be replayed and can be revoked; this is stronger than a hypothesis ledger or graph.
- Recent idea family: evaluator/deploy gate plus workflow compiler.
- Freshness delta: turns AI DFIR output into a guarded proof pipeline.
- Mutation operator: report -> state transition/proof.
- 2026 clone trap avoided: generic SIFT dashboard, graph visualizer, hypothesis ledger, raw shell wrapper.
- Judge-magnet reason: one command shows self-correction, accuracy validation, guardrails, and traceability.
- Demo interaction/showcase reason: false lead revoked within 60 seconds; receipts and reports open immediately.
- Tie-breaker: strongest 60-second visible consequence.
- Known risk: no local SIFT VM; mitigated by SIFT-compatible adapters, packaged evidence, and explicit workstation instructions.
- Next file: `pitch/concept_lock.md`
- Next file: `pitch/demo_interaction_plan.md`
