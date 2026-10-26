import type { LinkEntry } from './types'

export const links = {
  portfolio: { service: 'portfolio', url: 'https://portfolio.ambik.link' },
  ameersorne: { service: 'ameersorne', url: 'https://portfolio-v2.ambik.link' },

  mybajet: { service: 'mybajet', url: 'https://mybajet.ambik.link' },
  mycukai: { service: 'mycukai', url: 'https://mycukai.ambik.link' },
  hafalah: { service: 'hafalah', url: 'https://hafalah.ambik.link' },
  nakmasak: { service: 'nakmasak', url: 'https://nakmasak.ambik.link' },
  nakmasakapa: {
    service: 'nakmasak',
    url: 'https://nakmasak.ambik.link',
  },
  mustajab: { service: 'mustajab', url: 'https://mustajab.ambik.link' },
  naksalam: { service: 'naksalam', url: 'https://naksalam.ambik.link' },
  suasana: { service: 'suasana', url: 'https://suasana.ambik.link' },
  tadarus: { service: 'tadarus', url: 'https://tadarus.ambik.link' },

  zurince: { service: 'zurince', url: 'https://zurince.ambik.link' },
  ketasewa: { service: 'ketasewa', url: 'https://ketasewa.ambik.link' },
  ragdolls: { service: 'ragdolls', url: 'https://ragdolls.ambik.link' },
  munchiq: { service: 'munchiq', url: 'https://munchiq.ambik.link' },
} as const satisfies Record<string, LinkEntry>

export type LinkSlug = keyof typeof links

/** Path segment → destination for ambik.link shortcuts (includes legacy aliases). */
export const pathRedirectMap: Record<string, LinkEntry> = { ...links }

const ASSET_EXTENSIONS = [
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
  '.ttf',
  '.eot',
  '.map',
]

const ASSET_PREFIXES = ['/assets/', '/_next/', '/static/']

export const APEX_HOSTNAME = 'ambik.link'

/**
 * Returns absolute redirect URL for ambik.link path shortcuts, or null if no redirect.
 * Mirrors v1 Cloudflare Pages `functions/[[path]].js` behavior.
 */
export function resolvePathRedirect(
  pathname: string,
  search: string,
  hostname: string,
): string | null {
  if (hostname !== APEX_HOSTNAME) {
    return null
  }

  if (pathname === '/' || pathname === '') {
    return null
  }

  const lowerPath = pathname.toLowerCase()
  if (ASSET_EXTENSIONS.some((ext) => lowerPath.endsWith(ext))) {
    return null
  }

  if (ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null
  }

  const pathParts = pathname.split('/').filter((part) => part !== '')
  const subdomain = pathParts[0]
  if (!subdomain) {
    return null
  }

  const entry = pathRedirectMap[subdomain]
  if (!entry) {
    return null
  }

  const remainingPath = pathParts.slice(1).join('/')
  return (
    entry.url +
    (remainingPath ? `/${remainingPath}` : '') +
    search
  )
}
