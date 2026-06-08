# Combined Pitch + Demo Video Outline

Final file: `pitch/recording/pitch-demo-combined-final.mp4`

Runtime: 81 seconds. Resolution: 1920x1080. Audio: narration + rights-cleared HackathonHunter BGM. Captions are baked into the visual plates; SRT is saved at `pitch/recording/captions.srt`.

## Scene Table

| Scene | Time | Screen Action | Proof |
|---|---:|---|---|
| `01-cold-open` | 0:00-0:08 | Hero terminal and receipt stack | command, revoked claim, reports |
| `02-risk` | 0:08-0:17 | Weak lead versus receipt path | updater false lead pressure |
| `03-terminal-run` | 0:17-0:27 | Local CLI run | `[seal]`, `[plan]`, `[tool]`, `[verify]`, `[correct]` |
| `04-correction` | 0:27-0:38 | `CLAIM-004` revoked | signed updater path lacks corroboration |
| `05-receipts` | 0:38-0:50 | Receipt-backed replacement path | PowerShell + network evidence refs |
| `06-accuracy` | 0:50-1:01 | Accuracy report and tests | 17 claims, 16 confirmed, 1 revoked, 0 hallucinations |
| `07-architecture` | 1:01-1:12 | Guardrail pipeline | sealed evidence -> tools -> verifier -> receipts |
| `08-close` | 1:12-1:21 | Submission package | deck, video, reports ready |

## Build Source

- Visual source: `pitch/polish-combined/index.html`
- Video script: `scripts/build_pitch_video.mjs`
- Narration manifest: `pitch/polish-combined/narration.json`
- Director board: `pitch/recording/director-board.md`
- QA frames: `pitch/polish-combined/qa/video-qa-*.png`
