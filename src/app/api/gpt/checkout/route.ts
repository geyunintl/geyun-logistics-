import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-access-token')
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  const { plan_type, country_code, currency } = body

  if (!plan_type || !country_code || !currency) {
    return NextResponse.json({ error: 'missing plan_type / country_code / currency' }, { status: 400 })
  }

  const upstream = await fetch('https://chatgpt.com/backend-api/payments/checkout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Referer: 'https://chatgpt.com/',
      Origin: 'https://chatgpt.com',
    },
    body: JSON.stringify({ plan_type, country_code, currency }),
  })

  const data = await upstream.json().catch(() => ({ error: 'invalid response' }))
  return NextResponse.json(data, { status: upstream.status })
}
