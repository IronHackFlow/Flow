import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import useHover from "../hooks/useHover"

type Props = {
  element: any,
  list: any,
  setCurrentItem: any,
  onClose: Dispatch<SetStateAction<boolean>>,
  isSelected: boolean
}

export default function SelectMenuItem({
  element, list, setCurrentItem, onClose, isSelected
}: Props) {
  const hoverRef = useRef<HTMLLIElement>(null)
  const isHovered = useHover(hoverRef)
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    if (isSelected) {
      setSelected(true)
    } else {
      setSelected(false)
    }
  }, [isSelected])

  const handleOptionChange = (e: any) => {
    let getSong = list.filter((each: any) => each.name === e.currentTarget.id)
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

