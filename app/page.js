'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleRedirect = () => {
    // 페이지 이동
    router.push('/input')
  }

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">🎵 기분에 따라 맞춤 음악을 추천해드릴게요!</p>
          <p className="text-sm text-gray-600">바로 감정 분석을 시작하고, 음악을 추천 받을 준비가 되셨나요?</p>
        </div>

        {/* 바로 다음 페이지로 넘어가는 버튼 */}
        <div className="text-center pt-4">
          <button
            onClick={handleRedirect}
            className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition"
          >
            감정 분석 시작 → 
          </button>
        </div>
      </div>
    </div>
  )
}
