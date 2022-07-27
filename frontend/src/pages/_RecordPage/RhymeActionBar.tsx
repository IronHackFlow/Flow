import datamuse from 'datamuse'
import { useEffect, useState, useCallback } from 'react'
import { LayoutTwo, LayoutThree } from 'src/components/__Layout/LayoutWrappers'
import { v4 as uuidv4 } from 'uuid'
import { shuffleIcon, lockedIcon } from '../../assets/images/_icons'
import useTranscript from './Utils/useTranscript'

type RhymeActionBarProps = {
  type: string
  focusBorder: number
  isRecording: boolean
  suggestionsInitialPrompt: string
  rhymeNumber: number
  word?: string
  words?: string[]
}

export default function RhymeActionBar({
  type,
  focusBorder,
  isRecording,
  suggestionsInitialPrompt,
  rhymeNumber,
  word,
  words,
}: RhymeActionBarProps) {
  const { adjectives, nouns } = useTranscript()
  const [rhymeWordHolder, setRhymeWordHolder] = useState<string>(word ? word : '')
  const [numberOfRhymes, setNumberOfRhymes] = useState<number>(rhymeNumber ? rhymeNumber : 0)
  const [rhymeList, setRhymeList] = useState<string[]>([])
  const tutBorder = type === 'Top' ? 20 : type === 'Locked' ? 21 : 20

  // useEffect(() => {
  //   setRhymesSelected([])
  //   if (rhymeWordSelected !== undefined) {
  //     datamuse
  //       .request(`words?rel_rhy=${rhymeWordSelected}&max=20`)
  //       .then(res => {
  //         if (res.length !== 0) {
  //           let getRhymes = res.map(each => each.word)
  //           setRhymesSelected(getRhymes)
  //         }
  //       })
  //       .catch(console.error)
  //   }
  // }, [rhymeWordSelected])

  useEffect(() => {
    if (nouns && !nouns.length) return
    datamuse
      .request(`words?rel_trg=${nouns[0]}&max=5`)
      .then((res: any) => {
        console.log(res, "I'm gonna need to see what I'm working with here")
        if (res.length !== 0) {
          let fillRhymes = res.map((each: any) => each.word)
          setRhymeList(fillRhymes)
        }
      })
      .catch((err: any) => console.log(err))
  }, [nouns])

  // useEffect(() => {
  //   if (word && words) {
  //     setRhymeWordHolder(word)
  //     setRhymeList(words)
  //     setNumberOfRhymes(rhymeNumber)
  //   }
  // }, [word, words])

  const displayRhymeSuggestions = (_array: string[], _numberOfRhymes: number) => {
    let rhymeSuggestions = []
    for (let i = 0; i < _numberOfRhymes; i++) {
      rhymeSuggestions.push(_array[i])
    }
    return rhymeSuggestions
  }

  const handleRhymeSuggestions = useCallback(() => {
    if (rhymeWordHolder !== '' && isRecording) {
      const suggestions = displayRhymeSuggestions(rhymeList, numberOfRhymes)
      return suggestions.map((each, i) => {
        return (
          <p className="rhyme-actions__suggestions-text" key={`${uuidv4()}`}>
            {each} {i === suggestions.length - 1 ? '\u2022' : ''}
          </p>
        )
      })
    } else {
      return (
        <p className="rhyme-actions__suggestions-text initial-prompt">{suggestionsInitialPrompt}</p>
      )
    }
  }, [rhymeWordHolder, rhymeList, isRecording])

  const handleButtonClick = () => {
    switch (type) {
      case 'Selected':
      case 'Locked':
      default:
    }
  }

  return (
    <div className={`rhyme-actions__bar ${focusBorder === tutBorder ? 'focus-border' : ''}`}>
      <div className="rhyme-actions__rhymes--container">
        <LayoutTwo classes={['rhyme-actions__header', 'rhyme-actions__header--shadow-inset']}>
          <p className={`rhyme-actions__header-text ${type}`}>
            {rhymeWordHolder && isRecording ? rhymeWordHolder : `${type} rhymes`}
          </p>
        </LayoutTwo>
        <LayoutTwo
          classes={['rhyme-actions__suggestions--container', 'rhyme-actions__suggestions']}
        >
          {handleRhymeSuggestions()}
        </LayoutTwo>
      </div>

      <LayoutThree
        classes={[
          'rhyme-actions__btn--container',
          'rhyme-actions__btn--shadow-outset',
          'rhyme-actions__btn--shadow-inset',
        ]}
      >
        <ActionBarButton type={type} onClick={handleButtonClick} />
      </LayoutThree>
    </div>
  )
}

const ActionBarButton = ({ type, onClick }: { type: string; onClick: () => void }) => {
  return (
    <button className="rhyme-actions__btn" onClick={() => onClick()}>
      <img
        className="button-icons"
        src={type === 'Locked' ? lockedIcon : shuffleIcon}
        alt="action button icon"
      />
    </button>
  )
}
