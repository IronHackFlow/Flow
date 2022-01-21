import React, { useState, useRef, useEffect } from 'react';

export default function SelectSongItem({ element, onSelect, isSelected}) {
  const [isHovered, setIsHovered] = useState();
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    if (isSelected) {
        setSelected(true)
    } 
  }, [])
//   const styleObject = {
//     item: { background: "#e24f8c", boxShadow: "3px 3px 5px #581d36, -2px -2px 2px 0px #ffcfe3"},
//     item2: { boxShadow: "inset 3px 3px 3px 0px #7e1f47, inset -2px -2px 2px #ffcee2"},
//     item3: { boxShadow: "3px 3px 5px #7e1f47, -2px -2px 2px 0px #ffc3dc"}
//   }
  const handleOnHover = () => {
    if (!isSelected) {
        setIsHovered(true)
    }
  }

  const handleOffHover = () => {
      if (!isSelected) {
          setIsHovered(false)
      }
  }

  return (
    <li 
      id={`${element.name}`} 
      className={`select-menu__item-container ${selected ? "selected" : isHovered ? "selected" : ""}`}
      onClick={(e) => {
          setIsHovered(false)
          onSelect(e)
      }}
      onMouseOver={handleOnHover}
      onMouseOut={handleOffHover}
    >
      <div className="select-menu__item--shadow-outset selected_2">
        <div className="select-menu__item--shadow-inset seleced_3">
          <div className="select-menu__item-content-container selected_4">
            <div className="select-menu__item-bullet">
              <div className="select-menu__item-bullet--shadow-inset">
              </div>
            </div>
            <div className="select-menu__item-text">
              <h2>{element.name}</h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

