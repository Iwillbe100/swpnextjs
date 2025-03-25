'use client'

export default function InputPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-indigo-100 to-purple-200">
      <p className="mb-6 text-xl font-semibold text-gray-800 animate-fade-in">
        지금 기분이 어때요?
        <br />
        🎤 말해보세요!
      </p>

      <button
        onClick={() => (window.location.href = '/recording?autoStart=true')}
        className="relative w-32 h-32 bg-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 group"
      >
        {/* 마이크 아이콘 */}
        <span className="text-white text-4xl z-10">🎙️</span>

        {/* 펄스 애니메이션 배경 */}
        <div className="absolute w-full h-full rounded-full bg-black opacity-40 animate-ping group-hover:opacity-60" />
      </button>
    </div>
  )
}
