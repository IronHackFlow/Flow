import React from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function LyricLine({ row, index }) {
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
