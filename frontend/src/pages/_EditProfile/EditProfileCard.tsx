import React, { useState, useCallback, Dispatch, SetStateAction } from 'react'
import actions from '../../api'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import useDebugInformation from '../../utils/useDebugInformation'
import EditProfileItem from './EditProfileItem'
import EditProfileFlowItem from './EditProfileFlowItem'
import { SectionType } from './EditProfile'
import { ISong } from '../../interfaces/IModels'

type Props = {
  title: string
  items: Array<SectionType>
  songs: ISong[]
  toExpand: string
  onExpand: Dispatch<SetStateAction<string>>
}


export default function EditProfileCard({ title, items, songs, toExpand, onExpand }: Props) {
    // useDebugInformation('EditProfileCard', { title, items, toExpand, onExpand })
    const { setUser } = useAuth()
    const [updateList, setUpdateList] = useState<string[]>([])

    const displayItems = useCallback((): React.ReactNode => {
      if (title === 'Songs' && songs) {
        return songs?.map((inputData, index) => (
          <EditProfileFlowItem
            inputData={inputData}
            key={inputData._id}
            index={index}
            indexLength={songs.length}
          />
        ))
      } else if (items) {
        return items.map(inputData => (
          <EditProfileItem inputData={inputData} key={inputData.name} updateList={updateList} />
        ))
      }
    }, [items, songs])

    const handleExpandCard = useCallback(
      title => {
        onExpand(title)
      },
      [onExpand],
    )

    const clearInputValue = useCallback(setValue => {
      setValue('')
    }, [])

    const handleClearForm = () => {
      if (items) return items.forEach(each => clearInputValue(each.setValue))
    }

    const handleSaveForm = async (e: React.FormEvent) => {
      e.preventDefault()
      let inputData: any = {}
      if (items) {
        items.forEach(each => (each.value !== '' ? (inputData[each.name] = each.value) : null))
      }

      if (Object.keys(inputData).length === 0) return

      await actions
        .updateUserProfile(inputData)
        .then(async res => {
          console.log(res)
          setUpdateList(Object.keys(inputData))

          await actions
            .getAuthUser()
            .then(res => {
              setUser(res.data.user)
              handleClearForm()
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }

    return (
      <div
        className={`edit-section--shadow-inset ${title} ${
          toExpand === title ? 'expand-card' : 'shrink-card'
        }`}
      >
        <button
          className="edit-section__header"
          type="button"
          onClick={() => handleExpandCard(title)}
        >
          <div className="edit-section__header--shadow-outset">
            <h3>{title}</h3>
          </div>
        </button>

        <div className="edit-section__error--container"></div>
        <div className="edit-section__form--container">
          <div className="edit-section__form">
            <ul className="edit-section__list">{displayItems()}</ul>

            <div
              className="edit-section__btn--container"
              style={title === 'Songs' ? { display: 'none' } : {}}
            >
              <div className="edit-section__btn-cancel--container">
                <button
                  className="edit-section__btn-cancel"
                  type="button"
                  onClick={() => handleClearForm()}
                >
                  Cancel
                </button>
              </div>
              <div className="edit-section__btn-save--container">
                <button
                  className="edit-section__btn-save"
                  type="button"
                  onClick={e => handleSaveForm(e)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

