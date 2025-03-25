'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function RecordingPage() {
  const searchParams = useSearchParams()
  const autoStart = searchParams.get('autoStart') === 'true'

  const [isRecording, setIsRecording] = useState(autoStart)
  const [volume, setVolume] = useState(0)

  const animationRef = useRef(null)

  const startMic = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      console.warn('Browser does not support mediaDevices')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
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
      console.error('Failed to access microphone:', err)
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

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6 bg-white">
      <p className="mb-6 text-lg">
        {isRecording ? '녹음 중이에요... 말해보세요!' : '시작하려면 버튼을 눌러주세요'}
      </p>

      <button
        onClick={handleToggle}
        className="relative w-32 h-32 flex items-center justify-center"
      >
        {isRecording && (
          <div
            className="absolute rounded-full bg-green-400 opacity-70 transition-all duration-100"
            style={{
              width: `${volume + 50}px`,
              height: `${volume + 50}px`,
            }}
          />
        )}
        <div
          className={`relative z-10 w-16 h-16 rounded-full text-white text-2xl flex items-center justify-center shadow-md ${
            isRecording ? 'bg-red-500' : 'bg-black'
          }`}
        >
          {isRecording ? '⏹️' : '🎙️'}
        </div>
      </button>
    </div>
  )
}
