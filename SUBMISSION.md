# FIND EVIL Submission: TraceWarden SIFT

> Paste-ready Devpost field map. Replace the external URL placeholders before final submit.

## Platform

Devpost

## Hackathon

FIND EVIL!

## Project Name

TraceWarden SIFT

## Tagline

Prove 17 DFIR claims in 90 seconds.

## Short Description

TraceWarden SIFT makes autonomous DFIR findings earn receipts before they reach a report. In the demo, the agent revokes a weak `updater.exe` lead, reroutes into PowerShell and network evidence, and writes claim receipts plus an accuracy report.

## Inspiration

During incident response, a plausible false lead can waste precious analyst time. FIND EVIL asks for autonomous execution without hallucinated conclusions, so TraceWarden focuses on one hard moment: making an agent retract a weak forensic claim and replace it with evidence-backed findings.

## What It Does

TraceWarden SIFT runs a packaged SIFT-style evidence case from the terminal. It seals the evidence root, calls typed read-only parsers, proposes DFIR claims, verifies them against evidence refs, revokes unsupported claims, and writes `claim_receipts.json`, `execution_log.jsonl`, `accuracy_report.md`, and `incident_report.html`.

The main demo moment is `CLAIM-004`. The agent first suspects an updater lead. The verifier rejects it because the support is weak, then pushes the run toward the PowerShell and network artifacts that explain the intrusion.

## How We Built It

The core is a Python CLI with four pieces: `EvidenceToolset`, `TraceWardenAgent`, `ClaimVerifier`, and `AccuracyScorer`.

The toolset reads only inside a sealed evidence root. The verifier owns claim state transitions. The scorer compares confirmed claims against `ground_truth.json`. The report writer turns each run into files judges can inspect and replay.

## Try It Out

```bash
PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo
PYTHONPATH=src python3 -m unittest discover -s tests -v
```

Open after running:

- `runs/demo/incident_report.html`
- `runs/demo/claim_receipts.json`
- `runs/demo/execution_log.jsonl`
- `runs/demo/accuracy_report.md`

## Architecture Diagram

`docs/architecture/tracewarden-architecture.svg`

Architecture summary: Direct Agent Extension / MCP-style typed tool surface. The agent does not receive raw shell access. It calls typed read-only parsers under a sealed evidence root. A deterministic verifier controls claim state transitions and blocks unsupported findings from surviving.

## Dataset Documentation

`docs/evidence-dataset.md`

The included `case-alpha` evidence is synthetic, public-safe, and ground-truthed. It covers timeline, auth, PowerShell, registry, and network artifacts.

## Accuracy Report

Current sample run:

- 17 claims evaluated
- 16 confirmed
- 1 revoked
- precision 1.0
- recall 1.0
- hallucinated claims 0

Report path: `artifacts/sample-run/accuracy_report.md`

## Execution Logs

Structured log: `artifacts/sample-run/execution_log.jsonl`

The log records sealing, planning, typed tool calls, claim proposal, correction, verification, and report writing.

## Challenges We Ran Into

The hard part was building a self-correction that was visible and defensible. `CLAIM-004` had to start as a plausible updater lead, fail verifier policy for lack of cross-source support, and then push the agent toward the PowerShell and network evidence that actually explains the intrusion.

## Accomplishments We Are Proud Of

The sample run evaluates 17 claims, confirms 16, revokes 1, and reports 0 hallucinated claims. The same run writes receipts that point to file, line, parser, hash, and tool call.

## What We Learned

For DFIR agents, the useful safety layer is not another instruction in the prompt. It is a typed tool surface, a verifier-owned claim lifecycle, and a receipt format that makes every surviving finding replayable.

## What Is Next

Map more SIFT parser outputs into the `EvidenceRef` schema and turn TraceWarden into a shared verification layer for Protocol SIFT agents.

## Built With

Python, Protocol SIFT-style MCP schema, local SIFT-style evidence, HTML reports, unittest, ffmpeg.

## License

MIT. See `LICENSE`.

## Track Fit

- Autonomous execution quality: planner, typed tools, verifier, correction, and report writing are all logged.
- IR accuracy: ground-truth scoring reports precision, recall, false positives, false negatives, and hallucinations.
- Security and reliability guardrails: typed read-only tool surface, sealed evidence root, and path guard tests.
- Traceability: every confirmed claim maps to file, line, parser, hash, and tool call.

## Known Limitations

TraceWarden proves depth on one log/timeline case. It does not cover the full SIFT tool catalog yet. The next step is to map more parser outputs into the same `EvidenceRef` and claim receipt schema.

## Required External Links Before Final Devpost Submit

- Repository URL: `https://github.com/veithly/tracewarden-sift`
- Demo video URL: `PENDING_YOUTUBE_WATCH_URL`
- Optional public deck URL: `https://github.com/veithly/tracewarden-sift/blob/main/pitch/deck/tracewarden-sift-deck.pdf`
- Live URL: use local run instructions unless a hosted URL is added

## Local Pitch Deck

- `pitch/deck/tracewarden-sift-pitch.pptx`
- `pitch/deck/tracewarden-sift-deck.pdf`
- `pitch/deck/previews/`

## Local Demo Video

- `pitch/recording/pitch-demo-combined-final.mp4`
- `pitch/recording/demo.mp4`
- `pitch/recording/trailer.gif`

The final MP4 is 81.404 seconds at 1920x1080, H.264/AAC, 30 fps, with narration, background music, baked captions, terminal execution, `CLAIM-004` self-correction, receipts, accuracy, tests, and architecture.

## Team Members

- Rick, GitHub: `veithly`, Role: Builder. Use the Devpost account email if the form asks for an email field.

## Did You Use AI?

Yes. AI tools were used for pair-programming, review, and media production support. The shipped mechanism is deterministic: typed evidence parsers, verifier-owned claim states, claim receipts, and ground-truth scoring.

## Final Manual Checklist

- [ ] Public GitHub repo opens without login.
- [ ] README first screen says "Prove 17 DFIR claims in 90 seconds."
- [ ] YouTube video is unlisted and playable without login.
- [ ] Devpost video URL uses `https://www.youtube.com/watch?v=<id>`.
- [ ] Repo URL is HTTPS, not SSH.
- [ ] `PENDING_YOUTUBE_WATCH_URL` is replaced.
- [ ] Final form is reviewed before clicking Submit.
- [ ] Confirmation screenshot is saved to `pitch/submission-receipt.png`.
