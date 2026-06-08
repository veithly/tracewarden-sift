# TraceWarden SIFT Pitch Deck Speaker Notes

Hero anchor: Prove 17 DFIR claims in 90 seconds.

## Slide 1: Prove 17 DFIR claims in 90 seconds.

A defender agent can be fast and still dangerous if it cannot prove what it says. TraceWarden SIFT runs a packaged case and makes each finding point back to evidence.

## Slide 2: Unverified agent claims pollute incident response.

In incident response, a plausible false lead creates work. The demo shows the agent suspecting updater.exe, then the verifier rejects that path and pushes the investigation into the logs that actually support the intrusion.

## Slide 3: CLAIM-004 gets revoked on screen.

This is the show. The same run writes claim_receipts.json, execution_log.jsonl, accuracy_report.md, and an HTML incident report.

## Slide 4: Guardrails live below the planner.

Three parts matter: sealed evidence, typed tools, and verifier-owned claim transitions. That makes Protocol SIFT usable as a guardrail layer around future planners and parsers.

## Slide 5: 16 confirmed. 1 revoked. 0 hallucinations.

Everything here is local and inspectable. Run the command, open the receipts, and compare the accuracy report to the ground truth file.

