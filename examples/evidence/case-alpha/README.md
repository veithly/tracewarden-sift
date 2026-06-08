# Case Alpha Evidence

`case-alpha` is a compact synthetic DFIR case for TraceWarden SIFT. It is safe to commit and designed to exercise the judging requirements:

- timeline evidence
- authentication evidence
- PowerShell execution evidence
- registry persistence evidence
- network exfiltration evidence
- one plausible but wrong updater/malware lead that must be revoked

The case is synthetic but uses realistic field names so the agent loop can run without a SIFT VM. SIFT/Protocol SIFT adapters can map real parser output into the same schemas.
