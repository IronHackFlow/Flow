import { useContext, useState, useEffect, useCallback } from 'react'
import RecordBoothContext from "../contexts/RecordBoothContext"
import SelectSongItem from "./SelectSongItem"
import dropDown from "../images/select-down.svg"

export default function SelectSongMenuModal({positionTop, positionY, isOpen, onClose}) {
  const { allTakes, currentSong } = useContext(RecordBoothContext)
  
  const displayOptions = useCallback(() => {
    return allTakes.map((element, index) => {
      let isSelected = false
      if (element.name === currentSong?.name) {
        isSelected = true
      } 
      return (
        <SelectSongItem 
          key={`${element.name}_${index}`}
          element={element}
          onClose={onClose}
          isSelected={isSelected ? true : false}
        />
      )
    })
  }, [allTakes, currentSong])
  
  return (
    <div 
      className="SelectSongMenuModal"
      style={isOpen ? {opacity: "1", zIndex: "4"} : {opacity: "0", zIndex: "-4"}}
    >
      {/* <div className="select-menu__in-display--shadow-outset">
        <div className="select-menu__text-container">
          <p>{selectedValue}</p>
        </div>
        <div className="select-menu__menu-btn-container">
          <div className="select-menu__menu-btn" onClick={handleSelectMenu}>
            <img className="button-icons" src={dropDown} alt="drop down arrow" />
          </div>
        </div>
      </div> */}
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

