import { useContext, useState, useEffect } from 'react';
import RecordBoothContext from '../contexts/RecordBoothContext'
import { beatList } from '../constants/index'

export default function SelectMenuItem({type, element, onClose, isSelected}) {
  const { allTakes, setCurrentSong, setCurrentBeat } = useContext(RecordBoothContext)
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setSelected(true)
    } else {
      setSelected(false)
    }
  }, [isSelected])

  const handleOptionChange = (e) => {
    if (type === "song") {
      let getSong = allTakes?.filter(each => each.name === e.currentTarget.id)
      setCurrentSong(getSong[0])
    } else {
      let getBeat = beatList.filter(each => each.name === e.currentTarget.id)
      setCurrentBeat(getBeat[0])
    }
    onClose(false)
  }

  return (
    <li 
      id={`${element?.name}`} 
      className={`select-menu__item-container ${selected ? "selected" : ""}`}
      onClick={(e) => handleOptionChange(e)}
      onMouseOver={() => !isSelected ? setSelected(true) : null}
      onMouseOut={() => !isSelected ? setSelected(false) : null}
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

