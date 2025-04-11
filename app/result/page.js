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
  const [trackList, setTrackList] = useState([])
  const [trackIndex, setTrackIndex] = useState(0)

  const paramMap = {
    슬픔: {
      '조용한 음악으로 위로 받고 싶어요': 'acoustic',
      '신나는 음악으로 기분 전환하고 싶어요': 'pop',
    },
    기쁨: {
      '행복한 기분을 유지하고 싶어요': 'dance',
      '조금은 차분해지고 싶어요': 'classical',
    },
    피곤함: {
      '잔잔한 음악으로 쉬고 싶어요': 'sleep',
      '활력 있는 음악으로 깨고 싶어요': 'electronic',
    },
    불안: {
      '마음이 차분해지는 음악 듣고 싶어요': 'ambient',
      '긴장감을 날려버릴 음악 듣고 싶어요': 'rock',
    },
  }

  const selectedGenre = paramMap[emotion]?.[response] || 'pop'

  const getToken = async () => {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_SPOTIFY_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_SECRET}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })
    const data = await res.json()
    return data.access_token
  }

  const fetchTrack = async () => {
    try {
      const token = await getToken()
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(selectedGenre)}&type=track&market=US&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!res.ok) {
        console.error('[❌ Spotify 검색 실패]', res.status)
        return null
      }

      const data = await res.json()
      const tracks = data.tracks.items
      setTrackList(tracks)
      return tracks
    } catch (err) {
      console.error('⚠️ Spotify 처리 중 오류:', err)
    }
    return []
  }

  const fetchYouTubeVideo = async (query) => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )
      const data = await res.json()
      const video = data.items?.[0]
      if (video?.id?.videoId) {
        setVideoId(video.id.videoId)
      }
    } catch (err) {
      console.error('⚠️ YouTube 검색 오류:', err)
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const tracks = await fetchTrack()
      if (tracks?.length) {
        await fetchYouTubeVideo(`${tracks[0].name} ${tracks[0].artists[0].name}`)
        setTrackTitle(tracks[0].name)
        setArtist(tracks[0].artists[0].name)
      }
      setLoading(false)
    }
    load()
  }, [emotion, response])

  const handleNextTrack = async () => {
    const nextIndex = trackIndex + 1
    if (nextIndex < trackList.length) {
      setTrackIndex(nextIndex)
      await fetchYouTubeVideo(`${trackList[nextIndex].name} ${trackList[nextIndex].artists[0].name}`)
      setTrackTitle(trackList[nextIndex].name)
      setArtist(trackList[nextIndex].artists[0].name)
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
          {/* 앨범 사진 */}
          {/* <img
            src={trackList[trackIndex]?.album?.images?.[0]?.url}
            alt="cover"
            className="w-48 h-48 rounded-full mb-6 shadow-lg"
          /> */}

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
          {/* 다음 곡 버튼 */}
          {trackIndex < trackList.length - 1 && (
            <button
              onClick={handleNextTrack}
              className="mt-4 text-sm text-white bg-gray-200 px-6 py-2 rounded-full shadow-md hover:bg-gray-300 transition"
            >
              
              <h5 className="text-gray-700 font-semibold">NEXT</h5>
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-red-500">음악을 찾지 못했어요 😢</p>
      )}
    </div>
  )
}
