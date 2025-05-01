'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ResponsePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emotion = searchParams.get('emotion') || '슬픔'

  const options = {
  슬픔: ['조용한 음악으로 위로 받고 싶어요', '신나는 음악으로 기분 전환하고 싶어요'],
  기쁨: ['행복한 기분을 유지하고 싶어요', '조금은 차분해지고 싶어요'],
  분노: ['격한 감정을 분출하고 싶어요', '차분함을 되찾고 싶어요'],
  혐오: ['불쾌한 감정을 정화하고 싶어요', '감정을 날려버릴 강한 음악이 듣고 싶어요'],
  공포: ['두려움을 이겨내고 싶어요', '공포의 분위기에 빠지고 싶어요'],
  놀람: ['흥미로운 음악으로 놀람을 즐기고 싶어요', '차분한 음악으로 진정하고 싶어요'],
  기대: ['기대되는 마음을 더 북돋우고 싶어요', '기대감을 잠시 가라앉히고 싶어요'],
  신뢰: ['믿음직한 느낌을 유지하고 싶어요', '편안한 안정감을 느끼고 싶어요'],
  }

  const handleSelect = (choice) => {
    router.push(`/result?emotion=${encodeURIComponent(emotion)}&response=${encodeURIComponent(choice)}`)
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center px-6 text-center bg-gradient-to-br from-yellow-100 to-rose-200">
      <h2 className="text-2xl font-bold mb-4">당신의 감정은 "{emotion}"이에요.</h2>
      <p className="mb-6 text-gray-700 text-base">어떤 음악이 듣고 싶으신가요?</p>

      <div className="space-y-4 w-full max-w-xs">
        {(options[emotion] || ['기분을 맞춰줄 음악이 듣고 싶어요']).map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-full shadow"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
