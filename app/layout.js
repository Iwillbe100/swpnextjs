import '../styles/globals.css'

export const metadata = {
  title: 'Emotion Music',
  description: '감정을 기반으로 음악을 추천해드립니다',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
