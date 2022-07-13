import { useEffect, useState } from 'react'
import datamuse from 'datamuse'

type DatamuseRes = {
  word: string
  score: string
}

const sortByLength = (pos: string[]) => {
  return [...pos].sort((a, b) => a.length - b.length)
}

// getRhymeWords `words?rel_rhy=${param}&max=20`
// getTriggerWords `words?rel_trg=${param}&max=10`
// getSynonymWords `words?rel_jjb=${param}&max=5`
// getKindOfWords `words?rel_spc=${param}&max=5`
// getLastWordRelWords `words?ml=${noun}&rel_rhy=${lastWord}`

export default function useDatamuse(query: string[], rhymeCount: number, lastWord?: string) {
  const [rhymes, setRhymes] = useState<string[]>([])
  const [triggers, setTriggers] = useState<string[]>([])
  const [synonyms, setSynonyms] = useState<string[]>([])
  const [relatedRhymes, setRelatedRhymes] = useState<string[]>([])
  const [queryWord, setQueryWord] = useState<string>('')

  useEffect(() => {
    const sortQuery = sortByLength(query)
    setQueryWord(sortQuery[0])
  }, [query])

  useEffect(() => {
    datamuse
      .request(`words?rel_rhy=${queryWord}&max=${rhymeCount}`)
      .then((res: DatamuseRes[]) => {
        if (res.length !== 0) {
          let filterRes = res.map(each => each.word)
          setRhymes(filterRes)
        }
      })
      .catch((err: any) => console.log(err))
  }, [query])

  useEffect(() => {
    datamuse
      .request(`words?rel_trg=${queryWord}&max=${rhymeCount}`)
      .then((res: DatamuseRes[]) => {
        if (res.length !== 0) {
          let filterRes = res.map(each => each.word)
          setTriggers(filterRes)
        }
      })
      .catch((err: any) => console.log(err))
  }, [query])

  useEffect(() => {
    datamuse
      .request(`words?rel_jjb=${queryWord}&max=${rhymeCount}`)
      .then((res: DatamuseRes[]) => {
        if (res.length !== 0) {
          let filterRes = res.map(each => each.word)
          setSynonyms(filterRes)
        }
      })
      .catch((err: any) => console.log(err))
  }, [query])

  useEffect(() => {
    if (lastWord) {
      datamuse
        .request(`words?ml=${queryWord}&rel_rhyme=${lastWord}&max=5`)
        .then((res: DatamuseRes[]) => {
          if (res.length !== 0) {
            let filterRes = res.map((each: any) => each.word)
            setRelatedRhymes(filterRes)
          }
        })
        .catch((err: any) => console.log(err))
    }
  }, [query, lastWord])

  return { queryWord, rhymes, triggers, synonyms, relatedRhymes }
}
