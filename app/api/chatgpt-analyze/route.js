import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { transcript } = await req.json()
    console.log("TRACSCRIPT : ", transcript)

    // 🧠 프롬프트 구성 (정확도 향상용)
    const prompt = `문장: "${transcript}"`

    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', 
          content: `📌 당신은 감정 분석 전문가입니다.
다음 문장에서 사용자의 감정을 아래 8가지 중 **정확히 하나만** 분석하세요:

[기쁨, 신뢰, 공포, 놀람, 슬픔, 혐오, 분노, 기대]

🔒 규칙:
- 반드시 위 목록에서 **하나만** 선택 (중복 없음)
- 긍정 표현(기쁘다, 좋다 등)이 있으면 무조건 "기쁨"
- "놀람"은 "놀랐어" 포함 시에만 선택
- "혐오"는 "싫었어" 포함 시에만 선택

🧪 예시:
"짜증나고 화가 나" → 분노
"너무 싫었어" → 혐오
"기대돼" → 기대
"무서워 죽겠어" → 공포

🎯 반드시 이 JSON 형식으로 응답하세요:
{ "emotion": "기쁨" }`
        },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    })

    const data = await chatRes.json()
    const message = data.choices?.[0]?.message?.content
    console.log('🧠 ChatGPT 응답:', message)

    if (!message) {
      return NextResponse.json({ error: '응답 없음' }, { status: 500 })
    }

    // JSON 응답 검증 및 파싱
    let emotion
    try {
      const parsed = JSON.parse(message)
      emotion = parsed.emotion
    } catch (err) {
      console.error('❌ JSON 파싱 오류:', err)
      return NextResponse.json({ error: '형식 오류' }, { status: 500 })
    }

    return NextResponse.json({ emotion })
  } catch (e) {
    console.error('💥 ChatGPT 감정 분석 에러:', e)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
