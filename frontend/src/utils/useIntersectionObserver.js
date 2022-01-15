import  { useEffect, useState, useRef} from 'react'

export const useIntersectionObserver = ({ feedSongs, setSongInView }) => {
  const [entry, updateEntry] = useState({})
  const [node, setNode] = useState(null)
  
  const observer = useRef(null)

  useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(
      (entries) => {
          updateEntry(entry)
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              feedSongs.forEach((each) => {
                if (each.song._id === entry.target.id) {
                  setSongInView(each.song)
                  entry.target.style.backgroundImage = `url('${each.songVideo}')`
                }
              })
            } 
          })
      },
      {
        root: document.querySelector('.video-scroll-container'),
        rootMargin: "0px 0px 200px 0px",
        threshold: .9
      }
    )

    const { current: currentObserver } = observer

    if (node) currentObserver.observe(node)

    return () => currentObserver.disconnect()
  }, [node])

  return [ setNode, entry ]
}
