export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const shortUrl = url.pathname.substring(1);
  const fullUrl = await env.links.get(shortUrl);
  if (fullUrl === null) {
    return Response.redirect(url.origin, 302);
  }
  return Response.redirect(fullUrl, 302);
}
