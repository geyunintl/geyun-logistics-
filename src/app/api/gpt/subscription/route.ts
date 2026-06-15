import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-access-token')
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 })

  const upstream = await fetch(
    'https://chatgpt.com/backend-api/accounts/check/v4-2023-04-27',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://chatgpt.com/',
        Origin: 'https://chatgpt.com',
      },
    }
  )

  const data = await upstream.json().catch(() => ({ error: 'invalid response' }))
  return NextResponse.json(data, { status: upstream.status })
}
