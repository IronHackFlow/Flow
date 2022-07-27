import { useRef, ReactNode, useEffect, useState } from 'react'
import datamuse from 'datamuse'
import { LayoutTwo, LayoutThree } from 'src/components/__Layout/LayoutWrappers'
import useTranscript from './utils/useTranscript'
import useDatamuse from './utils/useDatamuse'
import Bar from './components/suggestions/Bar'

export const Suggestions = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const { adjectives, nouns, lastWord, transcript } = useTranscript()
  const adjRhymes = useDatamuse(adjectives, 5)
  const nounRhymes = useDatamuse(nouns, 5, lastWord)

  return (
    <div className="suggestions">
      <Bar transcript={transcript} />

      <div className={`rhyme-actions__bar`}>
        <div className="rhyme-actions__rhymes--container">
          <LayoutTwo classes={['rhyme-actions__header', 'rhyme-actions__header--shadow-inset']}>
            <p className={`rhyme-actions__header-text`}>Last Word: {lastWord}</p>
          </LayoutTwo>
          <LayoutTwo
            classes={['rhyme-actions__suggestions--container', 'rhyme-actions__suggestions']}
          >
            {nounRhymes?.relatedRhymes.map(rel => {
              return <p className="rhyme-actions__text">{`${rel} ${String.fromCodePoint(8226)}`}</p>
            })}
          </LayoutTwo>
        </div>

        <LayoutThree
          classes={[
            'rhyme-actions__btn--container',
            'rhyme-actions__btn--shadow-outset',
            'rhyme-actions__btn--shadow-inset',
          ]}
        >
          {/* <ActionBarButton type={type} onClick={handleButtonClick} /> */}
        </LayoutThree>
      </div>

      <div className={`suggestions__pos`}>
        <div className="suggestions__pos-header--container">
          <div className="suggestions__pos-header">
            <div className="suggestions__pos-header--bs-inset">
              <p className={`rhyme-actions__header-text`}>Nouns: {nounRhymes?.queryWord}</p>
            </div>
            <div className="suggestions__pos-btns--container">
              <div className="suggestions__pos-btn">
                <button className="suggestions__pos-btn--bs-outset">SYN</button>
              </div>
              <div className="suggestions__pos-btn">
                <button className="suggestions__pos-btn--bs-outset">TRG</button>
              </div>
              <div className="suggestions__pos-btn">
                <button className="suggestions__pos-btn--bs-outset">RHY</button>
              </div>
            </div>
          </div>
          <LayoutTwo
            classes={['rhyme-actions__suggestions--container', 'rhyme-actions__suggestions']}
          >
            <p className="rhyme-actions__suggestions-text">
              Rhyming: {nounRhymes?.rhymes.map(each => `${each} ${String.fromCodePoint(8226)} `)}
            </p>
            <p className="rhyme-actions__suggestions-text">
              Triggers: {nounRhymes?.triggers.map(each => `${each} ${String.fromCodePoint(8226)} `)}
            </p>
            <p className="rhyme-actions__suggestions-text">
              Synonym: {nounRhymes?.synonyms.map(each => `${each} ${String.fromCodePoint(8226)} `)}
            </p>
          </LayoutTwo>
        </div>
      </div>

      <div className={`suggestions__pos`}>
        <div className="suggestions__pos-header--container">
          <div className="suggestions__pos-header">
            <div className="suggestions__pos-header--bs-inset">
              <p className={`rhyme-actions__header-text`}>Adjectives: {adjRhymes?.queryWord}</p>
            </div>
            <div className="suggestions__pos-btns--container">
              <div className="suggestions__pos-btn">
                <button className="suggestions__pos-btn--bs-outset">SYN</button>
              </div>
              <div className="suggestions__pos-btn">
                <button className="suggestions__pos-btn--bs-outset">TRG</button>
              </div>
              <div className="suggestions__pos-btn">
                <button className="suggestions__pos-btn--bs-outset">RHY</button>
              </div>
            </div>
          </div>
          <LayoutTwo
            classes={['rhyme-actions__suggestions--container', 'rhyme-actions__suggestions']}
          >
            <p className="rhyme-actions__suggestions-text">
              Rhyming: {adjRhymes?.rhymes.map(each => `${each} ${String.fromCodePoint(8226)} `)}
            </p>
            <p className="rhyme-actions__suggestions-text">
              Triggers: {adjRhymes?.triggers.map(each => `${each} ${String.fromCodePoint(8226)} `)}
            </p>
            <p className="rhyme-actions__suggestions-text">
              Synonym: {adjRhymes?.synonyms.map(each => `${each} ${String.fromCodePoint(8226)} `)}
            </p>
          </LayoutTwo>
        </div>
      </div>

      <LayoutTwo
        classes={['interactions__options--container', 'interactions__options--shadow-inset']}
      >
        {children}
      </LayoutTwo>
    </div>
  )
}
