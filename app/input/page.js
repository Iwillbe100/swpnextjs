'use client'

export default function InputPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6 bg-white">
      <p className="mb-6 text-lg">
        지금 기분이 어때요?
        <br />
        말해보세요!
      </p>

    <button
    onClick={() => (window.location.href = '/recording?autoStart=true')}
    className="rounded-full bg-black p-6 shadow-md"
    >
    <span className="text-white text-2xl">🎙️</span>
    </button>
    </div>
  )
}
