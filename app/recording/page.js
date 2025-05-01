'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function RecordingPage() {
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)
  const animationRef = useRef(null)
  const [volume, setVolume] = useState(0)

  const startSpeechRecognition = async () => {
    if (!('webkitSpeechRecognition' in window) || !navigator.mediaDevices) {
      alert('이 브라우저는 음성 인식 또는 마이크 접근을 지원하지 않습니다.')
      return
    }

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

    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'ko-KR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = async (event) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      console.log('🎤 인식 결과:', result)
      cancelAnimationFrame(animationRef.current)
      await analyzeEmotionWithChatGPT(result)
    }

    recognition.onerror = (event) => {
      console.error('음성 인식 오류:', event.error)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const analyzeEmotionWithChatGPT = async (text) => {
    const res = await fetch('/api/chatgpt-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: text }),
    })
    const data = await res.json()
    const emotion = data.emotion?.trim()
    console.log('감정 분석 결과:', emotion)
    router.push(`/response?emotion=${encodeURIComponent(emotion)}`)
  }

  const micSize = 128 + volume * 0.8 // mic animation 반응형 크기

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-indigo-100 to-purple-200">
      <p className="mb-4 text-xl font-semibold text-gray-800">
        {isListening ? '듣고 있어요... 말해보세요 🎧' : '기분을 말로 표현해보세요'}
      </p>

      <div className="relative flex items-center justify-center">
        {isListening && (
          <div
            className="absolute rounded-full bg-green-300 opacity-60 blur-md animate-pulse"
            style={{
              width: `${micSize}px`,
              height: `${micSize}px`,
              transition: 'all 0.1s ease-out',
            }}
          />
        )}

        <button
          onClick={startSpeechRecognition}
          disabled={isListening}
          className="relative w-32 h-32 rounded-full bg-black flex items-center justify-center text-white text-4xl shadow-lg"
        >
          🎙️
        </button>
      </div>

      {transcript && (
        <p className="mt-4 text-sm text-gray-600">"{transcript}"</p>
      )}
    </div>
  )
}
