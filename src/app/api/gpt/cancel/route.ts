import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-access-token')
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 })

  // First fetch account ID
  const checkRes = await fetch(
    'https://chatgpt.com/backend-api/accounts/check/v4-2023-04-27',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://chatgpt.com/',
        Origin: 'https://chatgpt.com',
      },
    }
  )
  if (!checkRes.ok) {
    const err = await checkRes.json().catch(() => ({}))
    return NextResponse.json(err, { status: checkRes.status })
  }
  const checkData = await checkRes.json()
  const accountId = Object.keys(checkData.accounts ?? {})[0]
  if (!accountId) return NextResponse.json({ error: 'no account found' }, { status: 404 })

  const upstream = await fetch(
    `https://chatgpt.com/backend-api/accounts/${accountId}/billing/cancel_subscription`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://chatgpt.com/',
        Origin: 'https://chatgpt.com',
      },
      body: JSON.stringify({}),
    }
  )

  const data = await upstream.json().catch(() => ({ error: 'invalid response' }))
  return NextResponse.json(data, { status: upstream.status })
}
