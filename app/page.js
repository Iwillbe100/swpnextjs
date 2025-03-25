'use client'
import { useState } from 'react'

export default function Home() {
  const [selected, setSelected] = useState(null)
  const [otherText, setOtherText] = useState('')

  const options = ['조용한 음악', '신나는 음악', '감성적인 클래식', '기타 (직접 입력)']

  const handleSelect = (option) => {
    setSelected(option)
    if (option !== '기타 (직접 입력)') {
      setOtherText('')
    }
  }

  const handleNext = () => {
    const finalChoice = selected === '기타 (직접 입력)' ? otherText : selected
    console.log('선택된 음악 취향:', finalChoice)
    window.location.href = '/input'
  }

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">🎵 기분에 따라 맞춤 음악을 추천해드릴게요!</p>
          <p className="text-sm text-gray-600">우울할 때 어떤 음악을 듣고 싶나요?</p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`border px-4 py-2 rounded-full cursor-pointer text-sm transition-colors ${
                selected === opt
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {opt}
            </div>
          ))}

          {selected === '기타 (직접 입력)' && (
            <input
              type="text"
              className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="듣고 싶은 음악을 입력하세요"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
            />
          )}
        </div>

        <div className="text-center pt-4">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition disabled:opacity-40"
            onClick={handleNext}
            disabled={!selected || (selected === '기타 (직접 입력)' && otherText.trim() === '')}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
