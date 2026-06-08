# TraceWarden SIFT 评委 Q&A 训练

每个回答先给一句结论，再给一个 proof path。不要绕。

## 1. 这是不是只是 prompt engineering？

不是。Prompt 可以建议调查方向，但 claim 是否存活由 deterministic verifier 决定。

Proof:
- `src/tracewarden/verifier.py`
- `src/tracewarden/tools.py`
- `tests/test_tracewarden.py`

## 2. 为什么 `CLAIM-004` 会被撤销？

它只有 timeline 里的 updater execution。Verifier 看到 signed vendor path，并且没有 PowerShell、network 或 auth 的交叉证据，所以把它设为 revoked。

Proof:
- `runs/demo/claim_receipts.json`
- `runs/demo/execution_log.jsonl`

## 3. 你们怎么定义 hallucination？

Confirmed claim 如果没有 ground truth 支持，或者没有 evidence refs 支持，就会进入 hallucination/false-positive 统计。当前样例里 hallucinated claims 是 0。

Proof:
- `runs/demo/accuracy_report.md`
- `runs/demo/accuracy_report.json`
- `examples/evidence/case-alpha/ground_truth.json`

## 4. 为什么这个项目适合 FIND EVIL？

FIND EVIL 看四件事：autonomous execution、IR accuracy、guardrails、traceability。TraceWarden 每一项都有文件证据。

Proof:
- Autonomous execution: `execution_log.jsonl`
- IR accuracy: `accuracy_report.md`
- Guardrails: `tests/test_tracewarden.py`
- Traceability: `claim_receipts.json`

## 5. 和普通 SOC dashboard 有什么区别？

Dashboard 展示结果。TraceWarden 控制结果能不能成立。核心不是 UI，而是 claim lifecycle：proposed -> challenged -> revoked/confirmed。

Proof:
- `src/tracewarden/models.py`
- `src/tracewarden/verifier.py`
- `runs/demo/claim_receipts.json`

## 6. 如果以后接入真正的 LLM planner，会不会不稳定？

Planner 可以不稳定，所以 verifier 必须稳定。TraceWarden 把安全边界放在工具和 verifier，不放在模型回答里。

Proof:
- `src/tracewarden/mcp_schema.py`
- `tests/test_tracewarden.py`

## 7. 为什么不用 raw shell？

DFIR 证据不能被 agent 随便改。这个 demo 只暴露 typed read-only parsers，并且 path escape 会被测试拦住。

Proof:
- `tests/test_tracewarden.py`
- `src/tracewarden/tools.py`

## 8. 数据是不是假的？

数据是 synthetic，但不是 runtime fake。它是 public-safe packaged case，有 ground truth，适合提交评审和复现。真实 SIFT parser 输出可以映射到同一个 `EvidenceRef` schema。

Proof:
- `docs/evidence-dataset.md`
- `examples/evidence/case-alpha/`

## 9. 这个能不能在 SIFT Workstation 上用？

这版核心 demo 不依赖完整 SIFT 安装。SIFT Workstation 路线是把更多 parser output 接到 `EvidenceRef`，然后复用同一套 verifier 和 receipt writer。

Proof:
- `README.md` 的 SIFT Workstation Notes
- `src/tracewarden/mcp_schema.py`

## 10. 你们最难的技术点是什么？

最难的是让 demo 有自纠正，而不是只生成一份漂亮报告。`CLAIM-004` 必须先看起来合理，再被证据策略撤销，这样评委才能看到 guardrail 在工作。

Proof:
- `src/tracewarden/agent.py`
- `src/tracewarden/verifier.py`
- `runs/demo/execution_log.jsonl`

## 11. 为什么不是 200 个 SIFT 工具全覆盖？

这个 hackathon cut 选深度，不选广度。先证明 claim receipt contract、verifier policy、accuracy harness 能跑通，再扩 parser。

Proof:
- `SUBMISSION.md` Known Limitations
- `pitch/judge_magnet.md` Prototype Cut

## 12. 如果评委只给你 20 秒，你说什么？

“TraceWarden makes forensic claims earn receipts. In the demo, the agent suspects `updater.exe`, the verifier revokes that weak claim, then confirms the real PowerShell and network path with file-line-hash receipts.”

## 13. 如果问下一步做什么？

接更多 SIFT parser families，做成 Protocol SIFT agent 的 shared verification layer，再把 receipt schema 变成 benchmark。

## 14. 如果问 prize money 怎么用？

用来扩展 parser coverage 和真实 SIFT Workstation adapter，不做泛化 dashboard。

## 15. 如果问“为什么能赢？”

因为它把 challenge 的四条评审线都压成同一个可见 moment：一个 autonomous agent 撤销自己的错误 claim，并写出可复现 receipts。
