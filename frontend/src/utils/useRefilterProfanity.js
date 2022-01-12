export default function useRefilterProfanity() {

  const refilterProfanity = (curse) => {
    let curseLength = curse.length
    let firstChar = curse.charAt(0)
  
    switch(firstChar) {
      case firstChar === "a":
        return "asshole"
      case firstChar === "b":
        if (curseLength === 5) return "bitch"
        else return "bitches"
      case firstChar === "c":
        if (curseLength === 4) return "cunt"
        else return "cunts"
      case firstChar === "f":
        if (curseLength === 4) return "fuck"
        else if (curseLength === 6) return "fucked"
        else return "fucking"
      case firstChar === "n":
        if (curseLength === 6) return "niggas"
        else return "niggas"
      case firstChar === "p":
        if (curseLength === 5) return "pussy"
        else return "pussies"
      case firstChar === "s":
        return "shit"
      default: 
        return ""
    }
  }
  return { refilterProfanity }
}