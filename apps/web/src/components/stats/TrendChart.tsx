import { useId, useMemo, useState } from 'react'
import type { DailyPoint } from '#/lib/stats/types'
import { areaPath, linePath, scaleTrendPoints } from '#/lib/stats/chart-scale'

type TrendChartProps = {
  title: string
  titleId: string
  points: DailyPoint[]
  variant?: 'line' | 'area'
  accentClass?: string
  formatValue?: (value: number) => string
}

const defaultFormat = (value: number) => value.toLocaleString()

export function TrendChart({
  title,
  titleId,
  points,
  variant = 'line',
  accentClass = 'text-[var(--color-brand)]',
  formatValue = defaultFormat,
}: TrendChartProps) {
  const tableId = useId()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const scaled = useMemo(() => scaleTrendPoints(points), [points])
  const line = useMemo(() => linePath(scaled), [scaled])
  const area = useMemo(() => areaPath(scaled), [scaled])

  const summary =
    points.length > 0
      ? formatValue(points.reduce((s, p) => s + p.value, 0))
      : '—'

  return (
    <section
      className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-elevated)] p-5 shadow-sm"
      aria-labelledby={titleId}
    >
      <div className="flex flex-wrap items-end justify-between gap-3 motion-safe:opacity-100">
        <div>
          <h2
            id={titleId}
            className="text-lg font-semibold tracking-tight text-[var(--color-ink)]"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            30-day total:{' '}
            <span className="font-medium text-[var(--color-ink)]">{summary}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-[color-mix(in_oklab,var(--color-surface)_85%,white)] p-2">
        <svg
          role="img"
          aria-labelledby={titleId}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-36 w-full touch-pan-y"
        >
          <title>{title}</title>
          {[25, 50, 75].map((y) => (
            <line
              key={y}
              x1="0"
              x2="100"
              y1={y}
              y2={y}
              className="stroke-[var(--color-border-soft)]"
              strokeWidth="0.5"
            />
          ))}
          {variant === 'area' && area ? (
            <path
              d={area}
              className="fill-[color-mix(in_oklab,var(--color-brand)_18%,transparent)]"
            />
          ) : null}
          {line ? (
            <polyline
              points={scaled.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              className={`stroke-current ${accentClass}`}
              strokeWidth="1.75"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
          {scaled.map((p, index) => (
            <circle
              key={p.date}
              cx={p.x}
              cy={p.y}
              r={activeIndex === index ? 2.8 : 1.75}
              className={`cursor-pointer fill-current ${accentClass} focus:outline-none`}
              tabIndex={0}
              role="presentation"
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <title>
                {p.date}: {formatValue(p.value)}
              </title>
            </circle>
          ))}
        </svg>
      </div>

      {activeIndex !== null && scaled[activeIndex] ? (
        <p className="mt-2 text-sm font-medium text-[var(--color-ink)]" aria-live="polite">
          {scaled[activeIndex].date}: {formatValue(scaled[activeIndex].value)}
        </p>
      ) : null}

      <table className="sr-only" id={tableId}>
        <caption>{title} daily values</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.date}>
              <td>{p.date}</td>
              <td>{formatValue(p.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
