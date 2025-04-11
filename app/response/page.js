'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ResponsePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emotion = searchParams.get('emotion') || '슬픔'

  const options = {
    슬픔: ['조용한 음악으로 위로 받고 싶어요', '신나는 음악으로 기분 전환하고 싶어요'],
    기쁨: ['행복한 기분을 유지하고 싶어요', '조금은 차분해지고 싶어요'],
    피곤함: ['잔잔한 음악으로 쉬고 싶어요', '활력 있는 음악으로 깨고 싶어요'],
    불안: ['마음이 차분해지는 음악 듣고 싶어요', '긴장감을 날려버릴 음악 듣고 싶어요'],
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
