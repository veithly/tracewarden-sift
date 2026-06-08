export default function TraceWardenReportShell() {
  const claims = [
    ["CLAIM-004", "revoked", "No cross-source support"],
    ["CLAIM-009", "confirmed", "Credential dump command"],
    ["CLAIM-017", "confirmed", "Intrusion chain complete"],
  ];

  return (
    <main
      data-visual-lane="operational-dashboard terminal"
      data-hero-composition="terminal evidence bench"
      className="min-h-screen bg-[#0a0d11] text-[#e2e8f0]"
    >
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="rounded-lg border border-slate-600 bg-[#14191f] p-5">
          <p className="text-sm text-[#5ce1e6]">TraceWarden SIFT</p>
          <h1 className="mt-2 text-2xl font-bold">Prove 17 DFIR claims in 90 seconds.</h1>
          <pre className="mt-5 overflow-x-auto rounded-md bg-[#0c1116] p-4 text-sm leading-7">
            {`[seal] evidence root locked
[plan] collect timeline, auth, powershell, registry, network
[verify] CLAIM-004 lacks cross-source support
[correct] CLAIM-004 revoked; rerouting into evidence
[write] claim_receipts.json accuracy_report.md`}
          </pre>
        </div>
        <aside className="rounded-lg border border-slate-600 bg-[#101419] p-5">
          <h2 className="text-lg font-semibold text-[#5ce1e6]">Receipt Stack</h2>
          <div className="mt-4 space-y-3">
            {claims.map(([id, status, note]) => (
              <article key={id} className="rounded-md border border-slate-700 p-3">
                <div className="flex items-center justify-between gap-3">
                  <code className="text-[#5ce1e6]">{id}</code>
                  <span className={status === "revoked" ? "text-[#ff5c5c]" : "text-[#32d583]"}>{status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{note}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
