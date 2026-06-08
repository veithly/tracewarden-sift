export default function AccuracyPage() {
  return (
    <main data-visual-lane="operational-dashboard terminal" className="min-h-screen bg-[#0a0d11] p-4 text-[#e2e8f0] md:p-8">
      <h1 className="text-xl font-bold text-[#5ce1e6]">Accuracy report</h1>
      <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          ["claims", "17"],
          ["confirmed", "16"],
          ["revoked", "1"],
          ["F1", "1.0"],
          ["hallucinations", "0"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-md border border-slate-700 bg-[#14191f] p-4">
            <strong className="block text-2xl text-[#5ce1e6]">{value}</strong>
            <span className="text-sm text-slate-300">{label}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
