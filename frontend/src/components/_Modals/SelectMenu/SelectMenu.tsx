import { useCallback, Dispatch, SetStateAction } from 'react'
import SelectMenuItem from "./SelectMenuItem"

type Props = {
  positionTop: boolean,
  positionY: number,
  maxHeight: number,
  list: any,
  currentItem: any,
  setCurrentItem: Dispatch<SetStateAction<any>>,
  isOpen: boolean,
  onClose: Dispatch<SetStateAction<boolean>>
}

export default function SelectMenu({
  positionTop, positionY, maxHeight, list, currentItem, setCurrentItem, isOpen, onClose
}: Props) {

  const displayItems = useCallback(() => {
    if (list && list.length === 0) return
    
    return list.map((element: any, index: number) => {
      let isSelected = false
      if (element.name === currentItem.name) isSelected = true
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
      style={isOpen && list.length !== 0 ? {opacity: 1, zIndex: 4} : {opacity: 0, zIndex: -4}}
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

