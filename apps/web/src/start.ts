import { resolvePathRedirect } from '@ambik/catalog'
import { createMiddleware, createStart } from '@tanstack/react-start'

const pathRedirectMiddleware = createMiddleware().server(
  ({ request, next }) => {
    const url = new URL(request.url)
    const destination = resolvePathRedirect(
      url.pathname,
      url.search,
      url.hostname,
    )

    if (destination) {
      return new Response(null, {
        status: 301,
        headers: { Location: destination },
      })
    }

    return next()
  },
)

export const startInstance = createStart(() => ({
  requestMiddleware: [pathRedirectMiddleware],
}))
