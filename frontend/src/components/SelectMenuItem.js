import { useState, useEffect } from 'react';
import useHover from "../utils/useHover"

export default function SelectMenuItem({
  element, list, setCurrentItem, onClose, isSelected
}) {
  const [hoverRef, isHovered] = useHover()
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setSelected(true)
    } else {
      setSelected(false)
    }
  }, [isSelected])

  const handleOptionChange = (e) => {
    let getSong = list.filter(each => each.name === e.currentTarget.id)
    setCurrentItem(getSong[0])
    onClose(false)
  }

  return (
    <li 
      id={`${element?.name}`} 
      ref={hoverRef}
      className={`select-menu__item-container ${selected ? "selected" : isHovered ? "selected" : ""}`}
      onClick={(e) => handleOptionChange(e)}
    >
      <div className="select-menu__item--shadow-outset selected_2">
        <div className="select-menu__item--shadow-inset selected_3">
          <div className="select-menu__item-content-container selected_4">
            <div className="select-menu__item-bullet selected_5">
              <div className="select-menu__item-bullet--shadow-inset selected_6">
                <div className="select-menu__item-bullet selected_7"></div>
              </div>
            </div>
            <div className="select-menu__item-text">
              <h2>{element?.name}</h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

