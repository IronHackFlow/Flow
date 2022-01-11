import { useEffect, useState } from 'react'
import beat1 from '../assets/beatsTrack1.m4a'
import beat2 from '../assets/beatsTrack2.m4a'
import beat3 from '../assets/beatsTrack3.m4a'
import beat4 from '../assets/beatsTrack4.m4a'
import beat5 from '../assets/beatsTrack5.m4a'

export default function useBeats() {
  const [beats, setBeats] = useState([
    { song: beat1, name: 'After Dark' },
    { song: beat2, name: 'Futurology' },
    { song: beat3, name: 'Peacock' },
    { song: beat4, name: 'Callback' },
    { song: beat5, name: 'Drained' },
  ]);
  const [beatOption, setBeatOption] = useState(beats[0].song)
  const [isBeatPlaying, setIsBeatPlaying] = useState(false)
  const [ref, setRef] = useState()

  useEffect(() => {
    if (isBeatPlaying) {
      ref?.current.play()
    } else {
      ref?.current.pause()
    }
  }, [isBeatPlaying])

  const mapBeatOptions = () => {
    return beats.map((beat, index) => {
      return <option key={`${beat}_${index}`} value={beat.song}>{beat.name}</option>;
    });
  };
    
  const selectBeatOption = (e) => {
    if (isBeatPlaying) {
      setIsBeatPlaying(false)
    }
    setBeatOption(e.target.value)
  };
  
  const playSelectBeat = (ref) => {
    setRef(ref)
    setIsBeatPlaying(!isBeatPlaying)
  }

  return {
    beatOption, 
    isBeatPlaying,
    mapBeatOptions, 
    selectBeatOption,
    playSelectBeat,
  }
}