import { useState, useCallback } from 'react'
import datamuse from 'datamuse'
import useRefilterProfanity from '../utils/useRefilterProfanity'

export default function useDatamuseRhymes({ params }) {
  const [data, setData] = useState([])

  const getData = useCallback(async () => {
    await datamuse
      .request(`words?${params.type}=${params.word}&max=${params.num}`)
      .then(res => {
        setData(res)
      })
      .catch(err => console.log(err))
  }, [])

  return [data]
}

// useEffect(() => {
//   setRetrievedSelectedRhymes([])
//   if (selectedWordHolder !== undefined) {
//     datamuse
//       .request(`words?rel_rhy=${selectedWordHolder}&max=20`)
//       .then(res => {
//         if (res.length !== 0) {
//           res.forEach(each => {
//             setRetrievedSelectedRhymes(oldRhymes => [...oldRhymes, each.word])
//           })
//         }
//       })
//       .catch(console.error)
//   }
// }, [selectedWordHolder])

// async function getActionWords(regex) {

//   const getData = await datamuse
//     .request(`words?rel_trg=${finalWord}&max=20`)
//     .then(res => {
//       if (res.length !== 0) {
//         console.log(res)
//         for (let i = 0; i < 1; i++) {
//           let randomIndex = Math.floor(Math.random() * (res.length - 1))
//           console.log(randomIndex, res[randomIndex].word)
//           setRetrievedActionRhymes(oldRhymes => [...oldRhymes, res[randomIndex].word])
//         }
//       }
//     })
//     .catch(console.error)
//   console.log(retrievedActionRhymes, 'RETRIEVED ACTIONS VERBS')
// }

// async function getDatamuseRhymes() {
//   let splitScript = transcript.split(' ')

//   if (splitScript[0] !== '') {
//     let lastWord = splitScript[splitScript.length - 1]
//     let finalWord = lastWord

//     if (lastWord.includes("'")) {
//       finalWord = lastWord.split("'").join('')
//     }
//     if (lastWord.includes('*')) {
//       finalWord = refilterProfanity(lastWord)
//     }

//     setRhymeWordHolder(finalWord)
//     setRetrievedRhymes([])
//     console.log(finalWord, ' - this is the last word')

//     const getData = await datamuse
//       .request(`words?rel_rhy=${finalWord}&max=30`)
//       .then(res => {
//         console.log(res, "I'm gonna need to see what I'm working with here")
//         if (res.length !== 0) {
//           res.forEach(each => {
//             setRetrievedRhymes(oldRhymes => [...oldRhymes, each.word])
//           })
//         }
//       })
//       .catch(console.error)
//   }
// }
