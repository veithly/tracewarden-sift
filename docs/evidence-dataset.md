# Evidence Dataset Documentation

## Case

- Case ID: `case-alpha`
- Location: `examples/evidence/case-alpha`
- Type: synthetic endpoint log/timeline case, safe for public repository use.

## Files

| File | Purpose |
|---|---|
| `timeline.csv` | Process and timeline events. |
| `auth.log` | Authentication and privilege events. |
| `powershell.log` | PowerShell command evidence. |
| `registry.log` | Persistence-related registry evidence. |
| `network.log` | Network download/upload and benign updater traffic. |
| `ground_truth.json` | Expected positive and benign/revoked claim IDs. |

## What TraceWarden Finds

- encoded PowerShell downloader
- credential dump behavior
- Run key persistence
- archive staging
- exfiltration to `203.0.113.77`
- privileged `svc_backup` network logon
- benign signed updater traffic that revokes the initial false lead

## Evidence Integrity

TraceWarden hashes every evidence file before parsing and writes `evidence_manifest.json` into each run directory. The source files are read-only from the agent's perspective.
