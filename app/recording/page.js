'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Mic, StopCircle } from 'lucide-react'

export default function RecordingPage() {
  const searchParams = useSearchParams()
  const autoStart = searchParams.get('autoStart') === 'true'

  const [isRecording, setIsRecording] = useState(autoStart)
  const [volume, setVolume] = useState(0)

  const animationRef = useRef(null)

  const startMic = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      source.connect(analyser)

      const animate = () => {
        analyser.getByteFrequencyData(dataArray)
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        setVolume(avg)
        animationRef.current = requestAnimationFrame(animate)
      }

      animate()
    } catch (err) {
      console.error('🎤 마이크 접근 실패:', err)
    }
  }

  useEffect(() => {
    if (isRecording) {
      startMic()
    }
    return () => cancelAnimationFrame(animationRef.current)
  }, [isRecording])

  const handleToggle = () => {
    if (isRecording) {
      window.location.href = '/result'
    } else {
      setIsRecording(true)
    }
  }

  const dynamicSize = volume * 3 // 기본 크기 + 볼륨 반응

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-indigo-100 to-purple-200 relative overflow-hidden">
      <p className="mb-8 text-xl font-semibold text-gray-800">
        {isRecording ? '듣고 있어요... 더 말해보세요!' : '시작하려면 버튼을 눌러주세요'}
      </p>

      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* 볼륨 반응 원 */}
        {isRecording && (
          <div
            className="absolute rounded-full bg-green-500 opacity-80 blur-sm transition-all duration-200 ease-out"
            style={{
              width: `${dynamicSize}px`,
              height: `${dynamicSize}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
            }}
          />
        )}

        {/* 마이크 버튼 */}
<button
  onClick={handleToggle}
  className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-transform duration-300 shadow-md
    ${isRecording
      ? 'bg-red-500 hover:bg-red-600 opacity-80 brightness-95'
      : 'bg-black hover:bg-gray-800'}
  `}
>
  {isRecording ? (
    <StopCircle className="text-white w-12 h-12" />
  ) : (
    <Mic className="text-white w-12 h-12" />
  )}
</button>
      </div>
    </div>
  )
}
