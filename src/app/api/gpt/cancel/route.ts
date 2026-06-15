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

  // Step 1: get account ID
  let checkRes: Response
  try {
    checkRes = await fetch(
      'https://chatgpt.com/backend-api/accounts/check/v4-2023-04-27',
      { headers: { ...BROWSER_HEADERS, Authorization: `Bearer ${token}` } }
    )
  } catch (e: any) {
    return NextResponse.json({ error: '连接 ChatGPT 失败', detail: e.message }, { status: 502 })
  }

  const checkText = await checkRes.text()
  if (!checkRes.ok) {
    return NextResponse.json(
      { error: `查询账号失败 ${checkRes.status}`, detail: checkText.slice(0, 500) },
      { status: checkRes.status }
    )
  }

  let checkData: any
  try { checkData = JSON.parse(checkText) } catch {
    return NextResponse.json({ error: '账号响应解析失败', detail: checkText.slice(0, 500) }, { status: 502 })
  }

  const accountId = Object.keys(checkData.accounts ?? {})[0]
  if (!accountId) return NextResponse.json({ error: '未找到账号 ID' }, { status: 404 })

  // Step 2: cancel
  let upstream: Response
  try {
    upstream = await fetch(
      `https://chatgpt.com/backend-api/accounts/${accountId}/billing/cancel_subscription`,
      {
        method: 'POST',
        headers: { ...BROWSER_HEADERS, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }
    )
  } catch (e: any) {
    return NextResponse.json({ error: '取消请求失败', detail: e.message }, { status: 502 })
  }

  const text = await upstream.text()
  if (!upstream.ok) {
    return NextResponse.json(
      { error: `取消失败 ${upstream.status}`, detail: text.slice(0, 500) },
      { status: upstream.status }
    )
  }

  try {
    return NextResponse.json(JSON.parse(text), { status: 200 })
  } catch {
    return NextResponse.json({ ok: true, detail: text.slice(0, 200) }, { status: 200 })
  }
}
