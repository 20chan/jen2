export async function GET(request: Request) {
  return new Response(JSON.stringify({
    status: 'ok',
    ts: Date.now(),
  }), { status: 200 })
}