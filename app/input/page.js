'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

export default function InputPage() {
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [volume, setVolume] = useState(0)
  const recognitionRef = useRef(null)
  const animationRef = useRef(null)

  const startSpeechRecognition = () => {
    if (isListening) return // 중복 방지

    if (!('webkitSpeechRecognition' in window)) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.')
      return
    }

    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'ko-KR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = async (event) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      console.log('🎤 인식 결과:', result)
      await analyzeEmotionWithChatGPT(result)
    }

    recognition.onerror = (event) => {
      console.error('음성 인식 오류:', event.error)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    startMicVolumeAnimation()
  }

  const startMicVolumeAnimation = async () => {
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
      console.error('마이크 접근 실패:', err)
    }
  }

  const analyzeEmotionWithChatGPT = async (text) => {
    try {
      const res = await fetch('/api/chatgpt-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await res.json()
      const emotion = data.emotion?.trim()
      console.log('감정 분석 결과:', emotion)
      if (emotion) {
        router.push(`/response?emotion=${encodeURIComponent(emotion)}`)
      }
    } catch (e) {
      console.error('감정 분석 요청 실패:', e)
    }
  }

  const dynamicSize = volume * 2 + 60

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-indigo-100 to-purple-200 relative overflow-hidden">
      <p className="mb-6 text-xl font-semibold text-gray-800 animate-fade-in">
        지금 기분이 어때요?
        <br />
        🎤 말해보세요!
      </p>

      <div className="relative w-32 h-32 flex items-center justify-center">
        {isListening && (
          <div
            className="absolute rounded-full bg-green-300 opacity-40 blur-md animate-pulse"
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
        <button
          onClick={startSpeechRecognition}
          disabled={isListening}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 z-10 ${
            isListening ? 'bg-gray-500' : 'bg-black hover:scale-105'
          }`}
        >
          <span className="text-white text-4xl">🎙️</span>
        </button>
      </div>

      {transcript && (
        <p className="mt-4 text-sm text-gray-600">"{transcript}"</p>
      )}
    </div>
  )
}
