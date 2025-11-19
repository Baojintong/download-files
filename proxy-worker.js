export default {
  async fetch(request) {
    const u = new URL(request.url)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }})
    }
    if (u.pathname !== '/proxy') {
      return new Response('Not Found', { status: 404 })
    }
    const target = u.searchParams.get('url') || ''
    if (!target) {
      return new Response('Missing url', { status: 400 })
    }
    const headers = new Headers()
    headers.set('User-Agent','Mozilla/5.0')
    const resp = await fetch(target, { headers, redirect: 'follow' })
    const h = new Headers(resp.headers)
    h.set('Access-Control-Allow-Origin','*')
    h.set('Access-Control-Expose-Headers','Content-Length, Content-Disposition, Content-Type')
    return new Response(resp.body, { status: resp.status, headers: h })
  }
}