# TraceWarden SIFT 讲解训练稿

目标：让评委在 60 秒内记住一句话，在 90 秒内相信 demo 是真的，在 Q&A 里能追到代码和报告。

主句只说这一句：**Prove 17 DFIR claims in 90 seconds.**

## 10 秒电梯开场

TraceWarden SIFT 是给 Protocol SIFT agent 用的终端守门层。它不让 agent 的 DFIR 结论直接进报告。每个 claim 都必须拿到 receipt，receipt 里有文件、行号、parser、hash 和 tool call。

## 30 秒版

这次 demo 跑一个公开安全的 synthetic case。Agent 一开始怀疑 `updater.exe`，这个判断看起来合理，但证据太弱。Verifier 发现它是 signed vendor path，而且没有 PowerShell 或 network 的交叉支持，于是撤销 `CLAIM-004`，再转去查 PowerShell 和 network 日志。

最后它写出四个东西：`claim_receipts.json`、`execution_log.jsonl`、`accuracy_report.md`、`incident_report.html`。当前结果是 17 个 claims，16 个 confirmed，1 个 revoked，0 个 hallucinations。

## 90 秒现场讲法

1. 开场：
   “这个项目解决的不是让 agent 多说一点，而是让它少说错一点。”

2. 指向命令：
   “评委可以从一个命令复现整条链路：”

   ```bash
   PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo
   ```

3. 指向自纠正：
   “这里是核心 moment：`CLAIM-004` 被撤销。Agent 不是把第一个可疑点硬写进报告，而是被 verifier 拦住了。”

4. 指向 receipts：
   “每个 surviving claim 都能回到具体证据。不是一句自然语言解释，是 file、line、parser、hash、tool call。”

5. 指向 accuracy：
   “这不是只看起来对。`accuracy_report.md` 会和 `ground_truth.json` 对比，给出 precision、recall、false positives、false negatives、hallucinations。”

6. 指向架构：
   “LLM planner 可以换，但 guardrail 不靠 prompt。证据目录先 seal，工具是 read-only，claim 状态由 deterministic verifier 控制。”

7. 收尾：
   “下一步不是重做一个 SOC dashboard，而是把更多 SIFT parser output 接进同一个 `EvidenceRef` 和 claim receipt schema。”

## 5 页 deck 讲法

### Slide 1

说：  
“TraceWarden SIFT proves 17 DFIR claims in 90 seconds. The important part is not speed alone. Every finding needs evidence before it survives.”

别说：  
“我们做了一个 AI-powered cyber platform。”

### Slide 2

说：  
“Incident response 里，最贵的错误不是 agent 不说话，而是它自信地给出一个 plausible false lead。这里的 false lead 是 `updater.exe`。”

### Slide 3

说：  
“这是 live demo 的核心。`CLAIM-004` 先出现，然后被 verifier 撤销。Agent 转去 PowerShell 和 network 证据。”

### Slide 4

说：  
“系统只有三件关键事：seal evidence root，typed read-only tools，verifier-owned claim state。Planner 可以建议，verifier 决定什么能进报告。”

### Slide 5

说：  
“现在样例结果是 17 evaluated, 16 confirmed, 1 revoked, 0 hallucinations。所有文件都在 repo 里，评委可以跑同一条命令。”

## Demo 播放时怎么旁白

如果播放 `pitch/recording/pitch-demo-combined-final.mp4`，不要逐字重复视频旁白。只在播放前后各说一句。

播放前：
“接下来 81 秒只看一件事：一个错误 claim 怎么被撤销，然后被 receipt-backed claim 替换。”

播放后：
“刚才看到的每一帧都对应本地文件：receipt、execution log、accuracy report、architecture diagram。Q&A 我可以直接打开。”

## 现场打开文件顺序

1. `README.md`
2. `runs/demo/accuracy_report.md`
3. `runs/demo/claim_receipts.json`
4. `runs/demo/execution_log.jsonl`
5. `docs/architecture/tracewarden-architecture.svg`
6. `tests/test_tracewarden.py`

## 绝对不要说

- “这是一个全自动安全分析平台。”
- “我们解决了所有 SIFT 工具覆盖。”
- “LLM 保证不会 hallucinate。”
- “这个可以直接用于生产 incident response。”

## 可以主动承认的限制

这版只证明一个 log/timeline case 的深度，不覆盖完整 SIFT catalog。它的价值是 claim receipt 和 verifier contract。更多 parser 可以按同一个 `EvidenceRef` 接入。
