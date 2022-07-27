import { useEffect, useState } from 'react'
import { useSpeechRecognition } from 'react-speech-recognition'
import { refilterProfanity } from './profanityHandler'
import useDebounce from 'src/hooks/useDebounce'
var pos = require('pos')

const ADJ_TAGS = ['JJ', 'JJS', 'JJR']
const NOUN_TAGS = ['NN', 'NNP', 'NNPS', 'NNS']
const VERB_TAGS = ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ']

export default function useTranscript() {
  const { transcript, finalTranscript, resetTranscript } = useSpeechRecognition()

  const debounced1000 = useDebounce(transcript, 1000)
  const debounced500 = useDebounce(transcript, 500)
  const debounced200 = useDebounce(transcript, 200)

  const [adjectives, setAdjectives] = useState<string[]>([])
  const [nouns, setNouns] = useState<string[]>([])
  const [verbs, setVerbs] = useState<string[]>([])
  const [lastWord, setLastWord] = useState<string>('')
  const [lyrics, setLyrics] = useState<string[][]>([])

  useEffect(() => {
    var words = new pos.Lexer().lex(debounced200)
    var tagger = new pos.Tagger()
    var taggedWords = tagger.tag(words)

    setAdjectives(getPartsOfSpeech(taggedWords, ADJ_TAGS))
    setNouns(getPartsOfSpeech(taggedWords, NOUN_TAGS))
  }, [debounced200])

  useEffect(() => {
    const validWord = getValidTranscriptWord(debounced500)
    if (validWord !== '') {
      setLastWord(validWord)
    }
  }, [debounced500])

  useEffect(() => {
    const validArray = getValidTranscriptArray(debounced500)
    if (validArray.length) {
      console.log(validArray, 'WHat this LOOKING LIKE???')
      setLyrics(prevLyrics => [...prevLyrics, validArray])
      // resetTranscript()
    }
  }, [debounced500])

  return { adjectives, nouns, lastWord, transcript, lyrics }
}

const getPartsOfSpeech = (taggedWords: string[][], type: string[]) => {
  let partsOfSpeech: string[] = []
  for (let i in taggedWords) {
    if (type.includes(taggedWords[i][1])) {
      partsOfSpeech.push(taggedWords[i][0])
    }
  }
  return partsOfSpeech
}

const getValidTranscriptWord = (_transcript: string): string => {
  const transcript = _transcript.trim()
  const transcriptArray = transcript.split(' ')

  const filteredForProfanity = refilterProfanity(transcriptArray[transcriptArray.length - 1])
  if (filteredForProfanity.includes("'")) return filteredForProfanity.split("'").join('')
  return filteredForProfanity
}

const getValidTranscriptArray = (_transcript: string): string[] => {
  const transcript = _transcript.trim()
  const splitTranscript = transcript.split(' ')
  let filteredTranscript = []

  for (let i = 0; i < splitTranscript.length; i++) {
    const filteredWord = refilterProfanity(splitTranscript[i])
    if (filteredWord !== '') {
      filteredTranscript.push(filteredWord)
    }
  }
  return filteredTranscript
}
