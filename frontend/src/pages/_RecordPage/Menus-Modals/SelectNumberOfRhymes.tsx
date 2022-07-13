import { Dispatch, SetStateAction, useState } from 'react'
import { ActionButton } from '../ActionButtons'
import { SelectMenu } from 'src/components/_Modals/SelectMenu/SelectMenu'
import { rhymeNumberList } from 'src/constants/index'

type RhymeNumber = {
  song: number
  title: string
}

type SelectNumberOfRhymesProps = {
  rhymeNumber: any
  setRhymeNumber: any
}

export const SelectNumberOfRhymesButton = ({
  rhymeNumber,
  setRhymeNumber,
}: SelectNumberOfRhymesProps) => {
  const [showMenu, setShowMenu] = useState<boolean>(false)

  return (
    <>
      <SelectMenu
        position={['bottom', 41]}
        maxHeight={96 - 42}
        list={rhymeNumberList}
        listKey={['number', 'title']}
        currentItem={rhymeNumber}
        setCurrentItem={setRhymeNumber}
        isOpen={showMenu}
        onClose={setShowMenu}
      />
      <ActionButton type="rhymes" onClick={() => setShowMenu(true)}>
        {rhymeNumber?.title}
      </ActionButton>
    </>
  )
}
