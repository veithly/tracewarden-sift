# Devpost 提交训练清单

这个文件是提交前照着走的流程。不要最后一分钟临场想文案。

## 当前本地可交付件

- Deck PPTX: `pitch/deck/tracewarden-sift-pitch.pptx`
- Deck PDF: `pitch/deck/tracewarden-sift-deck.pdf`
- Final video: `pitch/recording/pitch-demo-combined-final.mp4`
- Trailer GIF: `pitch/recording/trailer.gif`
- Submission copy: `SUBMISSION.md`
- Manifest: `.hunter/submission-manifest.json`

## 提交前必须补的外部 URL

1. GitHub repo URL: `https://github.com/veithly/tracewarden-sift`
2. YouTube video URL: `https://www.youtube.com/watch?v=WQ51-db0OoE`
3. 可选 deck PDF public URL: `https://github.com/veithly/tracewarden-sift/blob/main/pitch/deck/tracewarden-sift-deck.pdf`

视频上传规则：

- 已上传 `pitch/recording/pitch-demo-combined-final.mp4`
- YouTube 设置为 **Unlisted**
- Devpost 填 canonical URL：`https://www.youtube.com/watch?v=WQ51-db0OoE`
- 不要填 `youtu.be/WQ51-db0OoE`

## Devpost 字段怎么填

### Project name

TraceWarden SIFT

### Tagline

Prove 17 DFIR claims in 90 seconds.

### Short description

TraceWarden SIFT makes autonomous DFIR findings earn receipts before they reach a report. In the demo, the agent revokes a weak `updater.exe` lead, reroutes into PowerShell and network evidence, and writes claim receipts plus an accuracy report.

### Inspiration

During incident response, a plausible false lead can waste precious analyst time. FIND EVIL asks for autonomous execution without hallucinated conclusions, so the project focuses on one hard moment: making an agent retract a weak forensic claim and replace it with evidence-backed findings.

### What it does

TraceWarden SIFT runs a packaged SIFT-style evidence case from the terminal. It seals the evidence root, calls typed read-only parsers, proposes DFIR claims, verifies them against evidence refs, revokes unsupported claims, and writes `claim_receipts.json`, `execution_log.jsonl`, `accuracy_report.md`, and `incident_report.html`.

### How we built it

The core is a Python CLI with four pieces: `EvidenceToolset`, `TraceWardenAgent`, `ClaimVerifier`, and `AccuracyScorer`. The toolset reads only inside the sealed evidence root. The verifier controls claim state transitions. The scorer compares confirmed claims against `ground_truth.json`. The report writer turns the run into files judges can inspect.

### Challenges we ran into

The hard part was building a self-correction that was visible and defensible. `CLAIM-004` had to start as a plausible updater lead, fail verifier policy for lack of cross-source support, and then push the agent toward the PowerShell and network evidence that actually explains the intrusion.

### Accomplishments

The sample run evaluates 17 claims, confirms 16, revokes 1, and reports 0 hallucinated claims. The same run writes receipts that point to file, line, parser, hash, and tool call.

### What we learned

For DFIR agents, the useful safety layer is not another instruction in the prompt. It is a typed tool surface, a verifier-owned claim lifecycle, and a receipt format that makes every surviving finding replayable.

### What's next

Map more SIFT parser outputs into the `EvidenceRef` schema and turn TraceWarden into a shared verification layer for Protocol SIFT agents.

### Built with

Python, Protocol SIFT-style MCP schema, local SIFT-style evidence, HTML reports, unittest, ffmpeg.

## 提交时现场检查

- [ ] GitHub repo 是 public
- [ ] README 第一屏能看到 “Prove 17 DFIR claims in 90 seconds.”
- [ ] YouTube 视频能无登录播放
- [ ] 视频开头 5 秒能看到 terminal/receipt，不是黑屏
- [ ] `SUBMISSION.md` 里的 TODO 已替换
- [ ] Devpost 里 Video URL 是 `youtube.com/watch?v=...`
- [ ] Repo URL 不是 SSH 地址
- [ ] Track/category 选 FIND EVIL 对应主赛道
- [ ] 最终 Submit 前截图保存到 `pitch/submission-receipt.png`

## 提交后检查

1. 刷新 Devpost 项目页。
2. 用 incognito 打开项目页。
3. 点视频，确认可播放。
4. 点 repo，确认 public。
5. 如果 Devpost 允许 edit，确认所有字段没被 markdown 格式吃掉。

## 口头提交确认句

“GitHub repo、YouTube video、deck、README、reports、manifest 和 audits 都已经准备好。现在可以填 Devpost 表单；最后 submit 前停下来给你确认。”
