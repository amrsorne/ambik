import { createFileRoute, Link } from '@tanstack/react-router'
import { cards } from '@ambik/catalog'
import GodRays from '../components/GodRays'
import Navbar from '../components/Navbar'
import { StatsBarChart } from '../components/stats/StatsBarChart'
import { TrendChart } from '../components/stats/TrendChart'
import { loadPublicStats } from '../lib/stats/load-public-stats'
import { sumLastDays } from '../lib/stats/series'

const serviceTitles = new Map(
  cards.map((c) => [c.service, c.title] as const),
)

export const Route = createFileRoute('/stats')({
  loader: () => loadPublicStats(),
  head: () => ({
    meta: [
      { title: 'Ambik stats — public metrics' },
      {
        name: 'description',
        content:
          'Aggregate waitlist interest, hub reach, and shortcut usage for Ambik.link — updated daily, no personal data.',
      },
      { name: 'robots', content: 'index,follow' },
    ],
  }),
  component: StatsPage,
})

function StatsPage() {
  const stats = Route.useLoaderData()
  const waitlist7d = sumLastDays(stats.trends.waitlistSignupsDaily, 7)
  const asOfLabel = stats.asOf
    ? new Date(`${stats.asOf}T00:00:00Z`).toLocaleDateString(undefined, {
        dateStyle: 'medium',
        timeZone: 'UTC',
      })
    : 'pending first daily rollup'

  const byService = stats.byService.map((row) => ({
    label: serviceTitles.get(row.label) ?? row.label,
    count: row.count,
  }))

  const topCountries = stats.topCountries.map((row) => ({
    label: row.code === 'XX' ? 'Unknown' : row.code,
    count: row.count,
    percent: row.percent,
  }))

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[var(--color-surface)] via-indigo-50 to-violet-100">
      <GodRays />
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pt-16">
        <p className="text-sm font-medium text-[var(--color-brand-strong)]">
          <Link to="/" className="underline-offset-4 hover:underline">
            Ambik
          </Link>
        </p>

        <header className="mt-3 max-w-2xl">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Public stats
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            Aggregate numbers only — no emails, sources, or IPs. Updated daily at
            midnight Malaysia time.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-elevated)] p-5 shadow-sm sm:col-span-2 lg:col-span-1">
              <p className="text-sm font-medium text-[var(--color-ink-muted)]">
                Waitlist signups
              </p>
              <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-[var(--color-ink)]">
                {stats.waitlistTotal.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                +{waitlist7d.toLocaleString()} in the last 7 days (UTC)
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-elevated)] p-5 shadow-sm">
              <p className="text-sm font-medium text-[var(--color-ink-muted)]">
                New signups (30d)
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-[var(--color-ink)]">
                {stats.waitlistNew30d.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-elevated)] p-5 shadow-sm">
              <p className="text-sm font-medium text-[var(--color-ink-muted)]">
                Snapshot date (UTC)
              </p>
              <p className="mt-1 text-3xl font-semibold text-[var(--color-ink)]">
                {asOfLabel}
              </p>
            </div>
          </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <TrendChart
            title="Waitlist momentum"
            titleId="chart-waitlist-signups"
            points={stats.trends.waitlistSignupsDaily}
            variant="area"
          />
          <TrendChart
            title="Total interest"
            titleId="chart-waitlist-total"
            points={stats.trends.waitlistTotalDaily}
            accentClass="text-[var(--color-accent)]"
          />
          <TrendChart
            title="Hub visits"
            titleId="chart-hub-views"
            points={stats.trends.hubViewsDaily}
          />
          <TrendChart
            title="Path shortcuts"
            titleId="chart-redirects"
            points={stats.trends.redirectsDaily}
            accentClass="text-[var(--color-brand-strong)]"
          />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <StatsBarChart
            title="Interest by idea"
            titleId="bars-by-service"
            rows={byService}
          />
          <StatsBarChart
            title="Visitor countries (7d hub views)"
            titleId="bars-countries"
            rows={topCountries}
            showPercent
          />
        </div>

        {stats.redirectsBySlug.length > 0 ? (
          <div className="mt-4">
            <StatsBarChart
              title="Shortcut paths (7d)"
              titleId="bars-shortcuts"
              rows={stats.redirectsBySlug}
            />
          </div>
        ) : null}

        <p className="mt-10 text-sm text-[var(--color-ink-muted)]">
          Charts use UTC calendar days. Traffic is counted on{' '}
          <span className="font-medium text-[var(--color-ink)]">ambik.link</span>{' '}
          only.
        </p>
      </main>
      <Navbar />
    </div>
  )
}
