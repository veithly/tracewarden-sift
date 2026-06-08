# Pitch Draft

## Slide 1 — Prove 17 DFIR claims in 90 seconds.

Prove 17 DFIR claims in 90 seconds.

TraceWarden SIFT makes autonomous incident-response findings earn receipts. The agent runs in a terminal, seals the evidence root, calls typed read-only artifact tools, and proposes claims from a packaged SIFT-style case.

The important moment happens in the first minute. The agent suspects `updater.exe`, then the verifier catches the weak evidence. It revokes `CLAIM-004`, reroutes into PowerShell and network logs, and confirms the real intrusion path.

Judges can inspect the proof. `claim_receipts.json` maps every surviving finding to file, line, parser, hash, and tool call. `execution_log.jsonl` shows the agent sequence. `accuracy_report.md` scores true positives, false positives, missed claims, and hallucinations against ground truth.

The product avoids prompt-only safety. The tool surface is read-only by construction, and tests prove path escape is blocked. Protocol SIFT can use the same shape as a guardrail layer around future SIFT parsers and agent planners.

## Slide 2 — The Risk

Autonomous attackers move faster than manual verification. A defender agent that cannot prove its claims creates a new incident inside the incident.

## Slide 3 — Live Demo

Run the packaged case. Watch `CLAIM-004` get revoked and replaced by receipt-backed intrusion claims.

## Slide 4 — How It Works

Sealed evidence root, typed read-only tools, planner loop, verifier, accuracy harness, and report writer.

## Slide 5 — Proof

17 claims evaluated. 16 confirmed. 1 revoked. 0 hallucinations. Every confirmed claim points to evidence.
