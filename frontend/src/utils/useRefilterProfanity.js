export default function useRefilterProfanity() {
  const regex = /(?:\w[*]+)/

  const refilterProfanity = curse => {
    const isCurse = curse.match(regex)
    // console.log(curse, 'WHAT THE FUCK AM I GETTING HERE LOL PROFANITY IN THE FITLER???')

    if (isCurse) {
      let curseLength = curse.length
      let firstChar = curse.charAt(0)
      // console.log(curseLength, firstChar, 'argh')

      switch (firstChar) {
        case 'a':
          return 'asshole'
        case 'b':
          if (curseLength === 5) return 'bitch'
          else return 'bitches'
        case 'c':
          if (curseLength === 4) return 'cunt'
          else return 'cunts'
        case 'f':
          if (curseLength === 4) return 'fuck'
          else if (curseLength === 6) return 'fucked'
          else return 'fucking'
        case 'n':
          if (curseLength === 6) return 'niggas'
          else return 'niggas'
        case 'p':
          if (curseLength === 5) return 'pussy'
          else return 'pussies'
        case 's':
          return 'shit'
        default:
          return null
      }
    } else {
      return curse
    }
  }
  return { refilterProfanity }
}
