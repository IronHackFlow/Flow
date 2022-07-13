import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { ISongTake } from 'src/interfaces/IModels'
import { SelectMenu } from 'src/components/_Modals/SelectMenu/SelectMenu'

type SelectSongProps = {
  songTakes: ISongTake[]
  take: ISongTake
  setTake: Dispatch<SetStateAction<ISongTake>>
}

export const SelectSong = ({ songTakes, take, setTake }: SelectSongProps) => {
  const [showSelectSongMenu, setShowSelectSongMenu] = useState<boolean>(false)

  const handleShowMenu = () => {
    console.log(songTakes.length, 'Why is this not updating?')
    if (songTakes.length === 0) return
    setShowSelectSongMenu(true)
  }

  return (
    <>
      <SelectMenu
        position={['bottom', 25]}
        maxHeight={96 - 25}
        list={songTakes}
        listKey={['_id', 'title']}
        currentItem={take}
        setCurrentItem={setTake}
        isOpen={showSelectSongMenu}
        onClose={setShowSelectSongMenu}
      />
      <button className="select-takes_shadow-div-inset" onClick={handleShowMenu}>
        <div className="select-takes_shadow-div-outset">
          <p>{songTakes.length === 0 ? 'No Recorded Flows' : take.title}</p>
        </div>
      </button>
    </>
  )
}
