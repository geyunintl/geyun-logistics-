import { NextRequest, NextResponse } from 'next/server'

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://chatgpt.com/',
  'Origin': 'https://chatgpt.com',
  'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'oai-language': 'en-US',
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-access-token')
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  const { plan_type, country_code, currency } = body

  if (!plan_type || !country_code || !currency) {
    return NextResponse.json({ error: 'missing plan_type / country_code / currency' }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch('https://chatgpt.com/backend-api/payments/checkout', {
      method: 'POST',
      headers: {
        ...BROWSER_HEADERS,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan_type, country_code, currency }),
    })
  } catch (e: any) {
    return NextResponse.json({ error: '连接 ChatGPT 失败', detail: e.message }, { status: 502 })
  }

  const text = await upstream.text()
  if (!upstream.ok) {
    return NextResponse.json(
      { error: `ChatGPT 返回 ${upstream.status}`, detail: text.slice(0, 500) },
      { status: upstream.status }
    )
  }

  try {
    return NextResponse.json(JSON.parse(text), { status: 200 })
  } catch {
    return NextResponse.json({ error: '响应解析失败', detail: text.slice(0, 500) }, { status: 502 })
  }
}
