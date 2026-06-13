export default function PagePlaceholder({ eyebrow, title, description }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{description}</p>
    </section>
  )
}
