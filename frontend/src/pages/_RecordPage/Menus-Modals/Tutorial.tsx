import { useState } from 'react'
import { ActionButton } from '../ActionButtons'
import { RecordingBoothModal } from 'src/components/RecordingBoothModal'

export const Tutorial = () => {
  const [focusBorder, setFocusBorder] = useState<number>(0)
  const [showTutorial, setShowTutorial] = useState<boolean>(false)

  return (
    <>
      <RecordingBoothModal
        isOpen={showTutorial}
        onClose={setShowTutorial}
        focusBorder={focusBorder}
        setFocusBorder={setFocusBorder}
      />
      <ActionButton type="tutorial" onClick={() => setShowTutorial(prev => !prev)}>
        tutorial
      </ActionButton>
    </>
  )
}
