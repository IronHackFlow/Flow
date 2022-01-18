import { useState, useCallback } from 'react'

export default function SelectSongMenu({ songArray }) {
  const [selectValue, setSelectValue] = useState();
  const [selectedSong, setSelectedSong] = useState({})


  const handleOptionChange = (e) => {
    setSelectValue(e.target.value)
    setSelectedSong(songArray[e.target.selectedIndex])
  };
  
  const mapOptions = useCallback(() => {
    if (songArray.length === 0) {
      return <option>Your Takes</option>
    } 
    else {
      return songArray.map((element, index) => {
        return (
          <option value={element.song_URL} key={`${index}_${element.song_URL}`}>
            {element.name}
          </option>
        )
      })
    }
  }, [songArray])
  
  return (
   <select 
     id="takes" 
     className="select-takes_shadow-div-outset" 
     value={selectValue}
     onChange={handleOptionChange}
   >
     {mapOptions()}
   </select>
  )
}

