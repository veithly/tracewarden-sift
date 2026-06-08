export default function ArchitecturePage() {
  return (
    <main data-visual-lane="operational-dashboard terminal" className="min-h-screen bg-[#0a0d11] p-4 text-[#e2e8f0] md:p-8">
      <h1 className="text-xl font-bold text-[#5ce1e6]">Trust boundary</h1>
      <div className="mt-5 rounded-md border border-slate-700 bg-[#14191f] p-4">
        <p>Sealed evidence root -> typed read-only tools -> planner -> verifier -> receipts.</p>
        <p className="mt-3 text-sm text-slate-300">No raw shell tool is exposed to the agent. Path traversal is blocked by code and tested.</p>
      </div>
    </main>
  );
}
