import { useEffect, useState, useCallback, useRef, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
// import LyricLine from '../_RecordPage/LyricLine'
import useTranscript from '../_RecordPage/Utils/useTranscript'

type LyricsFeedProps = {
  songLyrics: string[][] | null
  isRecording: boolean
}

export default function LyricsFeed({ songLyrics, isRecording }: LyricsFeedProps) {
  const { lyrics } = useTranscript()
  const [feedLyrics, setFeedLyrics] = useState<string[][]>([])
  const scrollRef = useRef<any>(null)

  useEffect(() => {
    setFeedLyrics([...lyrics])
  }, [lyrics])

  const handleLiveLyrics = useCallback(() => {
    if (feedLyrics[0] && feedLyrics[0].length === 0) return null
    return [...feedLyrics].map((row, index) => {
      return <LyricLine key={`${row}_${index}`} row={row} index={index} />
    })
  }, [feedLyrics])

  const handleSongLyricsLength = (songLyrics: string[][] | null) => {
    const lyricsLength = songLyrics ? songLyrics.length : -1
    const copiedLyrics = songLyrics ? [...songLyrics] : null

    switch (lyricsLength) {
      case -1:
        return <LyricPrompt>Start flowing to see your lyrics!</LyricPrompt>
      case 0:
        return <LyricPrompt>This Flow contains no lyrics.</LyricPrompt>
      default:
        return copiedLyrics?.map((row, index) => {
          return <LyricLine key={`${row}_${index}`} row={row} index={index} />
        })
    }
  }

  useEffect(() => {
    let scrollLyrics = document.getElementById('currentTranscript')
    if (scrollLyrics) {
      scrollLyrics.scrollTop = scrollLyrics.scrollHeight + 35
    }
  }, [lyrics, songLyrics])

  return (
    <div className="record__transcript-lyrics">
      <div className="record__lyrics--container">
        <div className={`record__lyrics`}>
          <ul className="record__lyrics-list" ref={scrollRef}>
            {isRecording ? handleLiveLyrics() : handleSongLyricsLength(songLyrics)}
          </ul>
        </div>
      </div>
    </div>
  )
}

const LyricLine = ({ row, index }: { row: string[]; index: number }) => {
  return (
    <li className="record__lyrics-item" key={`${uuidv4()}_${row}_${index}`}>
      <div className="record__item-num">
        <p className="record__item-num-text">{`${index + 1}`}</p>
      </div>
      <div className="record__item-words">
        {row.map((word, index) => {
          return (
            <p className="record__item-words-text" key={`${uuidv4()}_${index}_${word}`}>
              {word}
            </p>
          )
        })}
      </div>
    </li>
  )
}

const LyricPrompt = ({ children }: { children: ReactNode }) => (
  <li className="record__lyrics-item">
    <div className="record__item-words">
      <p className="record__item-words-text initial-prompt">{children}</p>
    </div>
  </li>
)
