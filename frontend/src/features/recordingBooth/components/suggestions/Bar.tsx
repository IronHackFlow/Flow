import { useEffect, useRef } from 'react'
import { LayoutTwo } from 'src/components/__Layout/LayoutWrappers'

const Bar = ({ transcript }: { transcript: string }) => {
  const scrollContainerRef = useRef<any>(null)
  const scrollRef = useRef<any>(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      let container = scrollContainerRef.current.clientWidth
      let scroller = scrollRef.current.clientWidth
      if (scroller > container) {
        const difference = scroller - container
        scrollContainerRef.current.scrollLeft += difference
      }
    }
  }, [transcript])

  return (
    <LayoutTwo
      classes={['suggestions__transcript--container', 'suggestions__transcript--bs-inset']}
    >
      <div className="suggestions__transcript-title">
        <div className="suggestions__transcript-title--bs-outset">Bar</div>
      </div>
      <div className="suggestions__transcript-text">
        <div className="suggestions__transcript--wrapper" ref={scrollContainerRef}>
          <p className="suggestions__transcript" ref={scrollRef}>
            {transcript}
          </p>
        </div>
      </div>
    </LayoutTwo>
  )
}
export default Bar
