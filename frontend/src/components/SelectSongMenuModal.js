import { useState, useEffect, useCallback } from 'react'
import SelectSongItem from "./SelectSongItem"
import dropDown from "../images/select-down.svg"

export default function SelectSongMenuModal({ songArray, isOpen, onClose, option, setOption }) {

  const handleOptionChange = (e) => {
    let getSong = songArray.filter(each => each.name === e.currentTarget.id)
    option = getSong[0]
    setOption(option)
    console.log(getSong[0], option, "what is this actulall??")
    onClose(false)
  }

  const handleSelected = useCallback(node => {

  }, [])

  const mapOptions = useCallback(() => {
    if (songArray.length === 0) {
      return <option>Your Takes</option>
    } 
    else {
      return songArray.map((element, index) => {
        let addSelect = false
        if (element.name === option?.name) {
          addSelect = true
        }
        return (
          <SelectSongItem 
            key={`${element.name}_${index}`}
            option={option}
            element={element}
            onSelect={handleOptionChange}
            isSelected={addSelect ? true : false}
          />
        )
      })
    }
  }, [songArray])
  
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
      <div className="select-menu__list">
        <ul className="select-menu__list--shadow-inset">
          {mapOptions()}
        </ul>
      </div>
    </div>
  )
}

