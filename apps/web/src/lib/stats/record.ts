import { APEX_HOSTNAME, resolvePathRedirect } from '@ambik/catalog'
import { utcDayString } from './series'

const SKIP_EXTENSIONS = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.map',
]

function requestCountry(request: Request): string {
  const cf = (request as Request & { cf?: { country?: string } }).cf
  const code = cf?.country ?? request.headers.get('cf-ipcountry') ?? 'XX'
  return code.toUpperCase().slice(0, 2)
}

function isSkippablePath(pathname: string): boolean {
  const lower = pathname.toLowerCase()
  if (lower.startsWith('/assets/')) return true
  return SKIP_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

function redirectSlug(pathname: string): string | null {
  const segment = pathname.replace(/^\/+/, '').split('/')[0]?.toLowerCase()
  return segment || null
}

async function incrementMetric(
  db: D1Database,
  day: string,
  metric: 'hub_view' | 'redirect',
  dim1: string,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO metric_events_daily (day, metric, dim1, count)
       VALUES (?, ?, ?, 1)
       ON CONFLICT(day, metric, dim1)
       DO UPDATE SET count = count + 1`,
    )
    .bind(day, metric, dim1)
    .run()
}

export async function recordMetrics(
  request: Request,
  db: D1Database | undefined,
): Promise<void> {
  if (!db) return
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.hostname !== APEX_HOSTNAME) return
  if (isSkippablePath(url.pathname)) return

  const day = utcDayString()

  const destination = resolvePathRedirect(
    url.pathname,
    url.search,
    url.hostname,
  )

  if (destination) {
    const slug = redirectSlug(url.pathname)
    if (slug) {
      await incrementMetric(db, day, 'redirect', slug)
    }
    return
  }

  if (url.pathname === '/' || url.pathname === '') {
    const country = requestCountry(request)
    await incrementMetric(db, day, 'hub_view', country)
  }
}
