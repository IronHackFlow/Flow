import { useCallback } from 'react'
import SelectMenuItem from "./SelectMenuItem"


export default function SelectMenuModal({
  positionTop, positionY, maxHeight, list, currentItem, setCurrentItem, isOpen, onClose
}) {

  const displayItems = useCallback(() => {
    if (list == null) return
    return list.map((element, index) => {
      let isSelected = false
      if (element.name === currentItem.name) {
        isSelected = true
      } 
      return (
        <SelectMenuItem 
          key={`${element.name}_${index}`}
          element={element}
          list={list}
          setCurrentItem={setCurrentItem}
          onClose={onClose}
          isSelected={isSelected ? true : false}
        />
      )
    })
  }, [list, currentItem])
  
  return (
    <div 
      className="SelectMenuModal"
      style={isOpen ? {opacity: "1", zIndex: "4"} : {opacity: "0", zIndex: "-4"}}
      onClick={() => onClose(false)}
    >
      <div 
        className="select-menu__list--container"
        style={positionTop ? {top: `${positionY}%`, maxHeight: `${maxHeight}%`} : {bottom: `${positionY}%`,  maxHeight: `${maxHeight}%`}}
      >
        <div className="select-menu__list--shadow-inset">
          <ul className="select-menu__list">
            {displayItems()}
          </ul>
        </div>
      </div>
    </div>
  )
}

