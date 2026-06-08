# User Cases

## User case 1 (HERO PATH): Senior Analyst Reviewing AI Triage

- Actor: incident responder on a SIFT Workstation.
- Trigger: suspicious endpoint evidence arrives during an active incident.
- Flow: run TraceWarden on the case directory, watch the agent plan tools, inspect evidence, challenge its own claims, reroute, and write final reports.
- Success: every surviving finding has replayable evidence references and the accuracy report quantifies TP/FP/FN/hallucinations.

## User case 2: Protocol SIFT Maintainer Testing Guardrails

- Actor: maintainer evaluating whether an AI agent can safely call artifact tools.
- Trigger: agent attempts an unsupported or destructive operation.
- Flow: read-only tool wall rejects path escape and non-exposed shell commands; execution log records the refusal.
- Success: security boundaries are architectural, test-covered, and visible in the architecture diagram.

## User case 3: Junior Analyst Learning Investigation Sequence

- Actor: junior responder using the run as a training artifact.
- Trigger: wants to understand why a claim was confirmed or revoked.
- Flow: open `execution_log.jsonl` and `claim_receipts.json`, trace a finding back to parser output and verifier rule.
- Success: the agent's reasoning sequence is teachable without trusting a black-box summary.
