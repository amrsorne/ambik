type BarRow = { label: string; count: number; percent?: number }

type StatsBarChartProps = {
  title: string
  titleId: string
  rows: BarRow[]
  valueSuffix?: string
  showPercent?: boolean
}

export function StatsBarChart({
  title,
  titleId,
  rows,
  valueSuffix = '',
  showPercent = false,
}: StatsBarChartProps) {
  const max = Math.max(1, ...rows.map((r) => r.count))

  return (
    <section
      className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-elevated)] p-5 shadow-sm"
      aria-labelledby={titleId}
    >
      <h2
        id={titleId}
        className="text-lg font-semibold tracking-tight text-[var(--color-ink)]"
      >
        {title}
      </h2>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
          No data yet — check back after the daily update.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => {
            const width = Math.round((row.count / max) * 100)
            const valueLabel = showPercent
              ? `${row.percent ?? 0}%`
              : `${row.count.toLocaleString()}${valueSuffix}`

            return (
              <li key={row.label}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-[var(--color-ink)]">
                    {row.label}
                  </span>
                  <span className="tabular-nums text-[var(--color-ink-muted)]">
                    {valueLabel}
                  </span>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-border-soft)_70%,white)]"
                  role="img"
                  aria-label={`${row.label}: ${valueLabel}`}
                >
                  <div
                    className="h-full rounded-full bg-[var(--color-brand)] motion-safe:transition-[width] motion-safe:duration-300"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
