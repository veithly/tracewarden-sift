# HyperFrames Director Board: TraceWarden SIFT Recorded Demo

| Scene | Judge belief | Screen action | Proof surface | Treatment | QA frame |
| --- | --- | --- | --- | --- | --- |
| `01-hook` | Repo command, receipts, reports, tests. | Prove 17 DFIR claims in a live run. | hero | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-01.png` |
| `02-command` | PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo-video | One command starts the case. | command | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-02.png` |
| `03-live-run` | Actual stdout captured from the CLI. | The recorded run evaluates 17 claims. | stdout | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-03.png` |
| `04-revocation` | Signed updater path, no corroboration. | CLAIM-004 gets revoked. | claim004 | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-04.png` |
| `05-reroute` | PowerShell and network parsers support the replacement claim. | TraceWarden follows stronger evidence. | claim009 | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-05.png` |
| `06-receipt` | File, line, parser, hash, tool calls. | Judges can inspect every field. | receiptFields | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-06.png` |
| `07-accuracy` | 16 confirmed, 1 revoked, 0 hallucinations. | The report scores the run against ground truth. | accuracy | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-07.png` |
| `08-tests` | Path escape, report writing, schema safety, weak claim revocation. | The guardrails are tested. | tests | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-08.png` |
| `09-architecture` | Sealed evidence, typed tools, verifier state, receipts. | The safety boundary sits below the planner. | architecture | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-09.png` |
| `10-close` | Repo, case, reports, deck, video source, tests. | Run it, inspect it, extend it. | close | Screen recording + component-lift/proof-montage cues | `pitch/polish-combined/qa/video-qa-10.png` |

The final video records a browser demo surface with actual CLI output from `runs/demo-video`. Mimo owns the voice track. The right-side narration panel makes the voiceover visible for silent review, and the final MP4 also carries the mixed audio track.
