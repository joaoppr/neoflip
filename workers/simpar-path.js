const PREFIX = '/cases/simpar'

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url)
    if (incoming.pathname !== PREFIX && !incoming.pathname.startsWith(`${PREFIX}/`)) {
      return fetch(request)
    }

    if (!env.SIMPAR_ORIGIN) {
      return new Response('The Simpar application origin is not configured.', { status: 503 })
    }

    const origin = new URL(env.SIMPAR_ORIGIN)
    const appPath = incoming.pathname.slice(PREFIX.length) || '/'
    origin.pathname = `${origin.pathname.replace(/\/$/, '')}${appPath}`
    origin.search = incoming.search

    return fetch(new Request(origin, request))
  },
}
