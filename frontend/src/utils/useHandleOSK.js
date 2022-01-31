import { useEffect, useState } from 'react';

export default function useHandleOSK() {
  const [windowSize, setWindowSize] = useState();
  const [refIsFocused, setRefIsFocused] = useState(false);

  useEffect(() => {
    const windowSize = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    setWindowSize(windowSize)
  }, [])

  const handleOnFocus = () => {
    const getSize = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
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
