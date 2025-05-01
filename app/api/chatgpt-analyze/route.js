import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { transcript } = await req.json()

    // 🧠 프롬프트 구성 (정확도 향상용)
    const prompt = `
당신은 감정 분석 전문가입니다. 다음 문장에서 사용자의 감정을 분석하세요.
아래 8가지 감정 중 문맥에 가장 적절한 **하나만** 선택해 주세요:

[기쁨, 신뢰, 공포, 놀람, 슬픔, 혐오, 분노, 기대]

규칙:
- 항상 이 중 하나만 선택하세요.
- 중복 금지.
- 문장에 행복, 좋다, 즐겁다, 만족 등 긍정 표현이 있으면 반드시 "기쁨"을 선택하세요.
- "놀람"은 평소에는 사용하지 않습니다. 문장에 놀랐어 라는 단어가 있을때 선택하세요.
- "혐오"는 평소에 사용하지 않습니다. 싫었어 라는 단어가 있을때 선택하세요.

예시:
"기분이 좋아요" → 기쁨
"기대돼" → 기대
"짜증나고 화가 나" → 분노
"너무 싫었어" → 혐오
"무서워 죽겠어" → 공포
"놀랐어" → 놀람

반드시 다음 JSON 형식으로만 응답하세요:
{ "emotion": "기쁨" }


문장: "${transcript}"
`

    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '당신은 감정 분석 전문가입니다.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
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
