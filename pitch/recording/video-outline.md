# Combined Pitch + Recorded Demo Video Outline

Final file: `pitch/recording/pitch-demo-combined-final.mp4`

Runtime: 106.0 seconds. Resolution: 1920x1080. Source recording: `pitch/recording/raw.webm`. Voice: Mimo `mimo-v2.5-tts:Chloe`.

## Source truth

- Demo command: `PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo-video`
- User case: `pitch/user_cases.md` HERO PATH
- Judge magnet: `pitch/judge_magnet.md`
- Real proof files: `runs/demo-video/claim_receipts.json`, `runs/demo-video/accuracy_report.md`, `runs/demo-video/execution_log.jsonl`, `runs/demo-video/incident_report.html`

## Scene Table

| Scene | Screen action | Proof |
|---|---|---|
| `01-hook` | Prove 17 DFIR claims in a live run. | Repo command, receipts, reports, tests. |
| `02-command` | One command starts the case. | PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo-video |
| `03-live-run` | The recorded run evaluates 17 claims. | Actual stdout captured from the CLI. |
| `04-revocation` | CLAIM-004 gets revoked. | Signed updater path, no corroboration. |
| `05-reroute` | TraceWarden follows stronger evidence. | PowerShell and network parsers support the replacement claim. |
| `06-receipt` | Judges can inspect every field. | File, line, parser, hash, tool calls. |
| `07-accuracy` | The report scores the run against ground truth. | 16 confirmed, 1 revoked, 0 hallucinations. |
| `08-tests` | The guardrails are tested. | Path escape, report writing, schema safety, weak claim revocation. |
| `09-architecture` | The safety boundary sits below the planner. | Sealed evidence, typed tools, verifier state, receipts. |
| `10-close` | Run it, inspect it, extend it. | Repo, case, reports, deck, video source, tests. |

## First-sample anchor

- Sample range: first 30 seconds of `pitch/recording/raw.webm`
- Expected visible actions: repo-root command, Mimo narration panel, terminal stdout from the real run
- Expected judge belief: TraceWarden is a runnable CLI, not a static pitch animation
- Critique result: the first sample shows a live command and generated outputs before the video switches into receipt inspection
- Fixes applied: replaced static SVG-only video with Playwright screen recording, actual run output, right-side narration panel, and Mimo voiceover

## Judge attention pass

| Scene | Judge should think | Proof shown |
|---|---|---|
| `01-hook` | Repo command, receipts, reports, tests. | hero |
| `02-command` | PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo-video | command |
| `03-live-run` | Actual stdout captured from the CLI. | stdout |
| `04-revocation` | Signed updater path, no corroboration. | claim004 |
| `05-reroute` | PowerShell and network parsers support the replacement claim. | claim009 |
| `06-receipt` | File, line, parser, hash, tool calls. | receiptFields |
| `07-accuracy` | 16 confirmed, 1 revoked, 0 hallucinations. | accuracy |
| `08-tests` | Path escape, report writing, schema safety, weak claim revocation. | tests |
| `09-architecture` | Sealed evidence, typed tools, verifier state, receipts. | architecture |
| `10-close` | Repo, case, reports, deck, video source, tests. | close |
