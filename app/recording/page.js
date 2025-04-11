// 'use client'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { useEffect, useRef, useState } from 'react'
// import { Mic, StopCircle } from 'lucide-react'

// export default function RecordingPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const autoStart = searchParams.get('autoStart') === 'true'

//   const [isRecording, setIsRecording] = useState(autoStart)
//   const [volume, setVolume] = useState(0)

//   const animationRef = useRef(null)

//   const startMic = async () => {
//     if (typeof window === 'undefined' || !navigator.mediaDevices) return

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
//       const source = audioCtx.createMediaStreamSource(stream)
//       const analyser = audioCtx.createAnalyser()
//       analyser.fftSize = 256
//       const dataArray = new Uint8Array(analyser.frequencyBinCount)
//       source.connect(analyser)

//       const animate = () => {
//         analyser.getByteFrequencyData(dataArray)
//         const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
//         setVolume(avg)
//         animationRef.current = requestAnimationFrame(animate)
//       }

//       animate()
//     } catch (err) {
//       console.error('🎤 마이크 접근 실패:', err)
//     }
//   }

//   useEffect(() => {
//     if (isRecording) {
//       startMic()
//     }
//     return () => cancelAnimationFrame(animationRef.current)
//   }, [isRecording])

//   const handleToggle = () => {
//     if (isRecording) {
//       setIsRecording(false)

//       // 🎯 감정 분석 결과 예시 (임시)
//       const detectedEmotion = '슬픔' // 실제 분석 결과로 대체 가능
//       router.push(`/response?emotion=${encodeURIComponent(detectedEmotion)}`)
//     } else {
//       setIsRecording(true)
//     }
//   }

//   const dynamicSize = volume * 3

//   return (
//     <div className="h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-indigo-100 to-purple-200 relative overflow-hidden">
//       <p className="mb-8 text-xl font-semibold text-gray-800">
//         {isRecording ? '듣고 있어요... 더 말해보세요!' : '시작하려면 버튼을 눌러주세요'}
//       </p>

//       <div className="relative w-40 h-40 flex items-center justify-center">
//         {isRecording && (
//           <div
//             className="absolute rounded-full bg-green-500 opacity-80 blur-sm transition-all duration-200 ease-out"
//             style={{
//               width: `${dynamicSize}px`,
//               height: `${dynamicSize}px`,
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               zIndex: 0,
//             }}
//           />
//         )}

//         <button
//           onClick={handleToggle}
//           className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-transform duration-300 shadow-md
//             ${isRecording
//               ? 'bg-red-500 hover:bg-red-600 opacity-80 brightness-95'
//               : 'bg-black hover:bg-gray-800'}
//           `}
//         >
//           {isRecording ? (
//             <StopCircle className="text-white w-12 h-12" />
//           ) : (
//             <Mic className="text-white w-12 h-12" />
//           )}
//         </button>
//       </div>
//     </div>
//   )
// }







'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RecordingPage() {
  const router = useRouter()

  const [selectedEmotion, setSelectedEmotion] = useState('')

  const handleEmotionSelection = (emotion) => {
    setSelectedEmotion(emotion)
    // 선택한 감정에 따라 response 페이지로 이동
    router.push(`/response?emotion=${encodeURIComponent(emotion)}`)
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-indigo-100 to-purple-200 relative overflow-hidden">
      <p className="mb-8 text-xl font-semibold text-red-800">
        *백엔드 감정 분석 연결 전 감정 선택 임시 화면*
      </p>
      <p className='text-xl font-semibold text-gray-800'>감정을 선택해주세요</p>

      {/* 감정 선택 버튼들 */}
      <div className="space-y-4">
        <button
          onClick={() => handleEmotionSelection('슬픔')}
          className="w-32 h-12 rounded-full bg-pink-200 text-gray text-lg hover:bg-pink-300"
        >
          슬픔
        </button>
        <button
          onClick={() => handleEmotionSelection('기쁨')}
          className="w-32 h-12 rounded-full bg-yellow-200 text-gray text-lg hover:bg-yellow-300"
        >
          기쁨
        </button>
        <button
          onClick={() => handleEmotionSelection('피곤함')}
          className="w-32 h-12 rounded-full bg-blue-200 text-gray text-lg hover:bg-blue-300"
        >
          피곤함
        </button>
        <button
          onClick={() => handleEmotionSelection('불안')}
          className="w-32 h-12 rounded-full bg-red-200 text-gray text-lg hover:bg-red-300"
        >
          불안
        </button>
      </div>

      {/* 선택된 감정 표시 */}
      {selectedEmotion && (
        <p className="mt-6 text-lg font-semibold text-gray-800">
          선택한 감정: <strong>{selectedEmotion}</strong>
        </p>
      )}
    </div>
  )
}
