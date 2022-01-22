import { useContext, useState, useRef, useCallback } from 'react'
import RecordBoothContext from "../contexts/RecordBoothContext"
import SelectMenuItem from "./SelectMenuItem"
import dropDown from "../images/select-down.svg"
import useBeats from '../utils/useBeats'

export default function SelectMenuModal({type, positionTop, positionY, isOpen, onClose}) {
  const { allTakes, currentSong, beats, currentBeat } = useContext(RecordBoothContext)
  const arrayRef = useRef([])
  const currentRef = useRef({})

  const displayOptions = useCallback(() => {
    if (type === "song") {
      arrayRef.current = allTakes
      currentRef.current = currentSong
    } else {
      arrayRef.current = beats
      currentRef.current = currentBeat
    }

    return arrayRef.current.map((element, index) => {
      let isSelected = false
      if (element.name === currentRef?.current?.name) {
        isSelected = true
      } 
      return (
        <SelectMenuItem 
          type={type}
          key={`${element.name}_${index}`}
          element={element}
          onClose={onClose}
          isSelected={isSelected ? true : false}
        />
      )
    })
  }, [allTakes, currentBeat, currentSong])
  
  return (
    <div 
      className="SelectMenuModal"
      style={isOpen ? {opacity: "1", zIndex: "4"} : {opacity: "0", zIndex: "-4"}}
      onClick={() => onClose(false)}
    >
      <div 
        className="select-menu__list"
        style={positionTop ? {top: `${positionY}%`} : {bottom: `${positionY}%`}}
      >
        <ul className="select-menu__list--shadow-inset">
          {displayOptions()}
        </ul>
      </div>
    </div>
  )
}

