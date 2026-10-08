function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.05]">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/15">
            <Icon size={18} />
          </div>
        )}

      </div>

    </div>
  )
}

export default MetricCard