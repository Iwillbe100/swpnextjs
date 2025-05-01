'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ResultPage() {
  const searchParams = useSearchParams()
  const emotion = searchParams.get('emotion') || '슬픔'
  const response = searchParams.get('response') || '조용한 음악으로 위로 받고 싶어요'

  const [videoId, setVideoId] = useState(null)
  const [trackTitle, setTrackTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [loading, setLoading] = useState(true)
  const [trackQueries, setTrackQueries] = useState([])
  const [trackIndex, setTrackIndex] = useState(0)

  const keywordMap = {
    슬픔: {
      '조용한 음악으로 위로 받고 싶어요': ['calm sad acoustic instrumental', 'comforting slow piano'],
      '신나는 음악으로 기분 전환하고 싶어요': ['uplifting pop for sadness', 'happy songs to cheer up'],
    },
    기쁨: {
      '행복한 기분을 유지하고 싶어요': ['happy energetic dance music', 'feel good pop hits'],
      '조금은 차분해지고 싶어요': ['peaceful ambient music', 'soft indie relaxing'],
    },
    신뢰: {
      '믿음직한 느낌을 유지하고 싶어요': ['uplifting inspirational songs', 'confident background music'],
      '편안한 안정감을 느끼고 싶어요': ['soothing instrumental trust music', 'calm reassuring tunes'],
    },
    공포: {
      '두려움을 이겨내고 싶어요': ['motivational music for fear', 'overcoming fear soundtrack'],
      '공포의 분위기에 빠지고 싶어요': ['dark horror music', 'scary cinematic soundtracks'],
    },
    놀람: {
      '흥미로운 음악으로 놀람을 즐기고 싶어요': ['interesting music', 'surprising upbeat playlist'],
      '차분한 음악으로 진정하고 싶어요': ['relaxing music', 'calm soothing ambient'],
    },
    혐오: {
      '불쾌한 감정을 정화하고 싶어요': ['cleansing ambient music', 'healing instrumental'],
      '감정을 날려버릴 강한 음악이 듣고 싶어요': ['intense rock metal', 'angry punk playlist'],
    },
    분노: {
      '격한 감정을 분출하고 싶어요': ['rage music playlist', 'aggressive workout songs'],
      '차분함을 되찾고 싶어요': ['calming anger relief music', 'soft instrumental for stress'],
    },
    기대: {
      '기대되는 마음을 더 북돋우고 싶어요': ['hopeful cinematic music', 'inspiring orchestral tracks'],
      '기대감을 잠시 가라앉히고 싶어요': ['light ambient waiting music', 'subtle anticipation background'],
    }
  }
  const keywords = keywordMap[emotion]?.[response] || ['modern music']

  const fetchYouTubeVideo = async (query) => {
    console.log(query)
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    )
    const data = await res.json()
    const video = data.items?.[0]
    if (video?.id?.videoId) {
      setVideoId(video.id.videoId)
      setTrackTitle(video.snippet.title)
      setArtist(video.snippet.channelTitle)
    }
  }

  // 감정/반응 바뀌면 쿼리 초기화
  useEffect(() => {
    setTrackQueries(keywords)
    setTrackIndex(0)
  }, [emotion, response])

  // 쿼리 or 인덱스 바뀌면 fetch 실행
  useEffect(() => {
    const loadTrack = async () => {
      if (trackQueries.length > 0) {
        setLoading(true)
        await fetchYouTubeVideo(trackQueries[trackIndex])
        setLoading(false)
      }
    }
    loadTrack()
  }, [trackQueries, trackIndex])

  const handleNextTrack = async () => {
    const nextIndex = trackIndex + 1
    if (nextIndex < trackQueries.length) {
      setTrackIndex(nextIndex)
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-blue-200 to-purple-300">
      <p className="text-xl font-semibold mb-4 text-gray-700">
        당신의 감정은 <strong>{emotion}</strong>이에요.
      </p>
      <p className="mb-6 text-gray-800 text-sm">{response}</p>

      {loading ? (
        <p className="text-sm text-gray-500">추천 음악을 불러오는 중...</p>
      ) : videoId ? (
        <>
          <iframe
            width="640"
            height="360"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube Music Player"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded-lg shadow-lg mb-6"
          />
          <p className="text-lg text-gray-700 font-semibold mb-2">{trackTitle}</p>
          <p className="text-sm text-gray-500 mb-4">by {artist}</p>
          {trackIndex < trackQueries.length - 1 && (
            <button
              onClick={handleNextTrack}
              className="mt-4 text-sm bg-white text-gray-700 px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition"
            >
              ⏭️ 다음 곡
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-red-500">음악을 찾지 못했어요 😢</p>
      )}
    </div>
  )
}
