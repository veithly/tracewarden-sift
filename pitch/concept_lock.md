# Concept Lock

## Selected Concept

- Project name: TraceWarden SIFT
- Seven-word rumor: It revokes bad forensic claims before judges blink.
- Hero copy: TraceWarden SIFT proves 17 DFIR claims in 90 seconds, revoking bad leads before they reach the report.
- Track/domain: autonomous incident response on SANS SIFT / Protocol SIFT.
- Sponsor/domain primitive: typed read-only MCP-style SIFT tool calls plus terminal-native agent loop.

## Anti-Wrapper Score

| Dimension | Score | Evidence |
|---|---:|---|
| Residue | 2 | "Claim receipts for autonomous incident response" is retellable. |
| Workflow Scar | 2 | AI/junior responders can publish confident false leads during active incidents. |
| New Primitive | 2 | Replayable, revocable claim receipt verifier. |
| Live Consequence | 2 | A false claim changes from `proposed` to `challenged` to `revoked`; true claims become `confirmed`. |
| Sponsor/Domain Necessity | 2 | Mechanism depends on SIFT artifacts, Protocol SIFT/MCP-style typed tools, and terminal execution. |
| **Total** | **10** | Gate pass. |

## Judge-Magnet Score

| Dimension | Score | Evidence |
|---|---:|---|
| First-pass survival | 2 | Required repo, local run path, diagram, dataset docs, accuracy report, logs planned. |
| Problem belief | 2 | Challenge itself names hallucination and senior-analyst sequencing as pain. |
| Prototype cut | 2 | Three P0s: typed tools, verifier loop, reports/logs. |
| Aha/proof | 2 | Bad lead auto-revoked and replaced by receipts. |
| Rubric coverage | 2 | Maps directly to autonomy, accuracy, guardrails, traceability. |
| After-hack credibility | 2 | Can wrap more SIFT parsers and become Protocol SIFT benchmark infrastructure. |
| **Total** | **12** | Gate pass. |

## Demo Magic Moment

First 15 seconds:
- Judge sees: terminal run starts, evidence hashes are sealed, agent proposes initial claims.
- User action: runs `tracewarden run examples/evidence/case-alpha --out runs/demo`.

Live input:
- What changes during demo: a plausible updater/malware claim fails verification and is revoked.
- Who/what provides the input: packaged case evidence and typed read-only parsers.

Visible consequence:
- State before: `CLAIM-004` proposed as malware execution.
- State after: `CLAIM-004` revoked; `CLAIM-009` to `CLAIM-017` confirm credential compromise, persistence, staging, and exfiltration.
- Proof artifact: `claim_receipts.json`, `execution_log.jsonl`, `accuracy_report.md`.

Deterministic proof:
- Verifier code requires evidence references and cross-source support. Unsupported claims cannot survive.

Judge participation:
- Judge can open a receipt ID, verify line/file/hash pointers, or rerun the packaged case.

Interaction model:
- Primary control: terminal command.
- Feedback loop: plan -> tool call -> claim -> verifier -> reroute -> report.
- State transition: proposed/challenged/confirmed/revoked.
- Why this is better than slides: the correction happens during execution and leaves machine-readable logs.

Showcase plan:
- 0-10s hook: "Every finding needs a receipt."
- 10-30s interaction: run case and watch first suspicious lead.
- 30-60s visible consequence: claim revocation and reroute.
- 60-90s proof close: open accuracy report and receipt ledger.
- Fallback if live input/API/chain fails: use `artifacts/sample-run` generated from the same code.

Judge magnet:
- First-pass survival issue avoided: terminal demo, repo, logs, reports, architecture, dataset docs all exist.
- Rubric line proven: all four criteria are mapped to concrete artifacts.
- Likely judge question answered: "Is this prompt-based?" No, verifier and tool boundary are code.
- Why the judge remembers this after 20 submissions: the agent publicly takes back its own bad forensic claim.

## One-Miracle Budget

The single miracle is self-revocation: the agent detects a plausible but wrong lead, challenges it, reroutes, and publishes the correction without human intervention. Everything else is deterministic, boring, and testable.
