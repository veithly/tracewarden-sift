# Demo Interaction Plan

## 5 Seconds

- Screen: terminal in project root.
- Line spoken: "TraceWarden makes autonomous DFIR claims earn receipts before they survive."
- Action: show `python -m tracewarden run examples/evidence/case-alpha --out runs/demo`.

## 30 Seconds

- Fresh judge reaches meaningful action in one command.
- Terminal prints:
  - evidence hash sealing
  - planner steps
  - typed tool calls
  - initial proposed claims

## 60 Seconds

- Visible consequence:
  - `CLAIM-004` starts as a suspicious updater execution.
  - Verifier finds insufficient cross-source support and benign corroboration.
  - Agent marks it `revoked`, logs the correction, and reroutes into PowerShell/network/timeline evidence.
  - Confirmed claims produce receipt IDs with file/line/hash references.

## 5 Minutes

- Open:
  - `runs/demo/claim_receipts.json`
  - `runs/demo/accuracy_report.md`
  - `runs/demo/incident_report.html`
  - `docs/architecture/tracewarden-architecture.svg`
- Explain guardrails:
  - no raw shell is exposed to the agent
  - evidence root path guard blocks path escape
  - every tool call is logged
  - every confirmed claim needs verifier support

## Fallback

If terminal demo fails, open `artifacts/sample-run/` and replay the same generated logs/reports. The fallback is not hand-authored; it is produced by the same command during verification.
