import { useContext, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import datamuse from 'datamuse'
import RecordBoothContext from '../../contexts/RecordBoothContext'
import { shuffleIcon, lockedIcon } from '../../assets/images/_icons'

export default function RhymeActionBar({ type, tutBorder }) {
  const {
    currentRhymeNum,
    focusBorder,
    rhymes,
    setRhymes,
    rhymesLocked,
    setRhymesLocked,
    rhymesSelected,
    setRhymesSelected,
    rhymeWord,
    recorderState,
    rhymeWordLocked,
    setRhymeWordLocked,
    rhymeWordSelected,
  } = useContext(RecordBoothContext)

  useEffect(() => {
    setRhymesSelected([])
    if (rhymeWordSelected !== undefined) {
      datamuse
        .request(`words?rel_rhy=${rhymeWordSelected}&max=20`)
        .then(res => {
          if (res.length !== 0) {
            let getRhymes = res.map(each => each.word)
            setRhymesSelected(getRhymes)
          }
        })
        .catch(console.error)
    }
  }, [rhymeWordSelected])

  const showRhymeSuggestions = useCallback(
    array => {
      if (array.length >= currentRhymeNum.song) {
        let newArr = array.slice(0, currentRhymeNum.song)
        return newArr.map((each, index) => {
          if (index === currentRhymeNum.song - 1) {
            return (
              <p className="rhyme-actions__suggestions-text" key={`${uuidv4()}toprhymes${index}`}>
                {each}
              </p>
            )
          } else {
            return (
              <p className="rhyme-actions__suggestions-text" key={`${uuidv4()}toprhymes${index}`}>
                {each} {'\u2022'}
              </p>
            )
          }
        })
      } else {
        return array.map((each, index) => {
          if (index === array.length - 1) {
            return (
              <p className="rhyme-actions__suggestions-text" key={`${uuidv4()}toprhymes${index}`}>
                {each}
              </p>
            )
          } else {
            return (
              <p className="rhyme-actions__suggestions-text" key={`${uuidv4()}toprhymes${index}`}>
                {each} {'\u2022'}
              </p>
            )
          }
        })
      }
    },
    [rhymes, rhymesLocked, rhymesSelected],
  )

  const showRhymesHandler = useCallback(() => {
    if (type === 'select') {
      if (rhymeWordSelected && recorderState?.initRecording) {
        return showRhymeSuggestions(rhymesSelected)
      } else {
        return (
          <p className="rhyme-actions__suggestions-text initial-prompt">
            Click any Flowed word above to generate rhymes here.
          </p>
        )
      }
    } else if (type === 'lock') {
      if (rhymeWordLocked && recorderState?.initRecording) {
        return showRhymeSuggestions(rhymesLocked)
      } else {
        return (
          <p className="rhyme-actions__suggestions-text initial-prompt">
            Click lock button to the right to save above rhymes here.
          </p>
        )
      }
    } else {
      if (rhymeWord && recorderState?.initRecording) {
        return showRhymeSuggestions(rhymes)
      } else {
        return (
          <p className="rhyme-actions__suggestions-text initial-prompt">
            Click record button below and spit bars to get rhymes here.
          </p>
        )
      }
    }
  }, [
    recorderState.initRecording,
    rhymeWordSelected,
    rhymeWordLocked,
    rhymeWord,
    rhymesSelected,
    rhymesLocked,
    rhymes,
  ])

  const shuffleRhymesHandler = useCallback(
    (array, type) => {
      if (array.length !== 0) {
        let randomRhymeArr = []

        for (let i = 1; i <= currentRhymeNum.song; i++) {
          randomRhymeArr.push(array[Math.floor(Math.random() * array.length)])
        }
        if (type === 'rhyme') {
          setRhymes(randomRhymeArr)
        } else {
          setRhymesSelected(randomRhymeArr)
        }
      }
    },
    [currentRhymeNum],
  )

  const lockRhymesHandler = () => {
    if (rhymes) {
      setRhymeWordLocked(rhymeWord)
      setRhymesLocked([...rhymes])
    }
  }

  return (
    <div className={`rhyme-actions__bar ${focusBorder === tutBorder ? 'focus-border' : ''}`}>
      <div className="rhyme-actions__rhymes--container">
        <div className="rhyme-actions__header">
          <div className="rhyme-actions__header--shadow-inset">
            {type === 'select' ? (
              <p className="rhyme-actions__header-text selected">
                {rhymeWordSelected && recorderState?.initRecording
                  ? rhymeWordSelected
                  : 'selected rhymes'}
              </p>
            ) : type === 'lock' ? (
              <p className="rhyme-actions__header-text locked">
                {rhymeWordLocked && recorderState?.initRecording
                  ? rhymeWordLocked
                  : 'locked rhymes'}
              </p>
            ) : (
              <p className="rhyme-actions__header-text rhyme">
                {rhymeWord && recorderState?.initRecording ? rhymeWord : 'rhymes'}
              </p>
            )}
          </div>
        </div>
        <div className="rhyme-actions__suggestions--container">
          <div className="rhyme-actions__suggestions">{showRhymesHandler()}</div>
        </div>
      </div>
      <div className="rhyme-actions__btn--container">
        <div className="rhyme-actions__btn--shadow-outset">
          <div className="rhyme-actions__btn--shadow-inset">
            <button
              className="rhyme-actions__btn"
              onClick={() => {
                type === 'select'
                  ? shuffleRhymesHandler(rhymesSelected, 'select')
                  : type === 'rhyme'
                  ? shuffleRhymesHandler(rhymes, 'rhyme')
                  : lockRhymesHandler()
              }}
            >
              <img
                className="button-icons"
                src={type === 'lock' ? lockedIcon : shuffleIcon}
                alt="action button icon"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
