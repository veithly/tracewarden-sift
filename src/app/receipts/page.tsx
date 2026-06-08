const rows = [
  ["CLAIM-004", "revoked", "timeline.csv:3", "updater false lead revoked"],
  ["CLAIM-009", "confirmed", "powershell.log:2 + network.log:1", "attacker script download"],
  ["CLAIM-017", "confirmed", "powershell + registry + network", "intrusion chain"],
];

export default function ReceiptsPage() {
  return (
    <main data-visual-lane="operational-dashboard terminal" className="min-h-screen bg-[#0a0d11] p-4 text-[#e2e8f0] md:p-8">
      <h1 className="text-xl font-bold text-[#5ce1e6]">Claim receipt ledger</h1>
      <table className="mt-5 w-full table-fixed border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-[#5ce1e6]">
            <th className="p-2">Claim</th>
            <th className="p-2">Status</th>
            <th className="p-2">Evidence</th>
            <th className="p-2">Verifier</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([claim, status, evidence, verifier]) => (
            <tr key={claim} className="border-b border-slate-800">
              <td className="p-2 font-mono text-[#5ce1e6]">{claim}</td>
              <td className={status === "revoked" ? "p-2 text-[#ff5c5c]" : "p-2 text-[#32d583]"}>{status}</td>
              <td className="p-2">{evidence}</td>
              <td className="p-2">{verifier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
