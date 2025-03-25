'use client'
import { useState, useEffect, useRef } from 'react'

export default function ResultPage() {
  const audioRef = useRef(null)
  const [trackIndex, setTrackIndex] = useState(0)
  
  const tracks = ['/sample.mp3', '/sample2.mp3']
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('자동 재생 차단됨:', err)
      })
    }
  }, [trackIndex])

  const handleEnded = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(trackIndex + 1)
    }
  }

  const emotion = '슬픔'
  const message = '오늘 힘든 하루였나요? 이 노래가 위로가 될 거예요.'

  return (
    <div className="h-screen relative overflow-hidden flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-blue-200 to-purple-300">
    {/* 둥근 원 애니메이션 */}
    <div className="absolute inset-0 z-0">
    <div className="absolute w-64 h-64 bg-white opacity-50 rounded-full blur-sm top-20 left-10 animate-float" />
    <div className="absolute w-48 h-48 bg-white opacity-30 rounded-full blur-sm bottom-20 left-10 animate-drift" />
    <div className="absolute w-48 h-48 bg-white opacity-30 rounded-full blur-sm top-20 right-10 animate-drift" />
    <div className="absolute w-32 h-32 bg-white opacity-20 rounded-full blur-sm  left-1/2 animate-float" />
    <div className="absolute w-56 h-56 bg-white opacity-50 rounded-full bottom-10 right-10 blur-sm animate-float" />
    <div className="absolute w-36 h-36 bg-white opacity-50  rounded-full bottom-1/3 left-1/4 blur-sm animate-drift" />
</div>


      <p className="text-xl font-semibold mb-2">당신의 감정은 <strong>{emotion}</strong>이에요.</p>
      <p className="mb-6 text-gray-800 text-sm">{message}</p>

      <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-md">
        <div className="text-3xl">🎵</div>
      </div>

    <audio
        ref={audioRef}
        src={tracks[trackIndex]}
        onEnded={handleEnded}
        controls
        autoPlay
        className="mt-6"
      />
    </div>
  )
}
