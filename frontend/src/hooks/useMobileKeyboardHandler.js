import { useEffect, useState } from 'react'

export default function useMobileKeyboardHandler() {
  const [windowSize, setWindowSize] = useState()
  const [refIsFocused, setRefIsFocused] = useState(false)

  useEffect(() => {
    // let clientHeight = Math.round(document.documentElement.clientHeight * 10) / 10
    // let innerHeight = Math.round(window.innerHeight * 10) / 10
    // console.log(window.visualViewport.height, innerHeight, "LOL")
    // const windowSize = Math.max(clientHeight, innerHeight || 0)
    const windowSize = Math.round(window.visualViewport.height * 10) / 10
    setWindowSize(windowSize)
  }, [])

  const handleOnFocus = () => {
    // let clientHeight = Math.round(document.documentElement.clientHeight * 10) / 10
    // let innerHeight = Math.round(window.innerHeight * 10) / 10
    // const getSize = Math.max(clientHeight, innerHeight || 0)
    const getSize = Math.round(window.visualViewport.height * 10) / 10
    if (!refIsFocused) {
      setRefIsFocused(true)
      if (getSize !== windowSize) {
        document.getElementById('body').style.height = `${windowSize}px`
      } else {
        document.getElementById('body').style.height = `${getSize}px`
      }
    }
  }

  return { handleOnFocus }
}
