import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useAuth } from '../../contexts/_AuthContext/AuthContext'
import EditProfileItem from './EditProfileItem'
import EditProfileFlowItem from './EditProfileFlowItem'
// import { IUser } from '../../interfaces/IModels'
import { IUser } from '../../../../backend/src/models/User'
import { getFieldData, FieldObject } from './functions/handleFieldData'
import { tempMockUser } from '../_Home/initialData'

type Props = {
  title: string
  toExpand: string
  onExpand: Dispatch<SetStateAction<string>>
}

export default function EditProfileCard({ title, toExpand, onExpand }: Props) {
  const { user } = useAuth()
  const [fieldData, setFieldData] = useState<FieldObject>(
    getFieldData(title, user !== null ? user : tempMockUser),
  )
  const [editedUser, setEditedUser] = useState<IUser | null>(null)
  const [isInputReset, setIsInputReset] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (!user || title === 'Songs') return
    const data: FieldObject = getFieldData(title, user)
    setFieldData(data)
  }, [user, title])

  useEffect(() => {
    if (!user) return
    if (editedUser == null) {
      setEditedUser({ ...user })
    }
  }, [user])

  useEffect(() => {
    if (isSubmitted) {
      console.log(fieldData, 'FIELD DATA AFTER SUBMIT')
    }
  }, [isSubmitted, fieldData])

  // const displayItems = useCallback((): React.ReactNode => {
  //   if (title === 'Songs' && songs) {
  //     return songs?.map((inputData, index) => (
  //       <EditProfileFlowItem
  //         inputData={inputData}
  //         key={inputData._id}
  //         index={index}
  //         indexLength={songs.length}
  //       />
  //     ))
  //   } else if (items) {
  //     return items.map(inputData => (
  //       <EditProfileItem name={inputData} key={inputData.name} updateList={updateList} />
  //     ))
  //   }
  // }, [items, songs])

  const handleExpandCard = useCallback(
    (title: string) => {
      onExpand(title)
    },
    [onExpand],
  )

  const clearAllSectionInputText = () => {
    setIsInputReset(true)
    setFieldData(prevData =>
      Object.fromEntries(
        Object.entries(prevData).map(([key, val]) => [key, { ...val, value: val.initialValue }]),
      ),
    )
  }

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault()
    let inputData: any = {}
    console.log(fieldData, 'what this?')
    // if (items) {
    //   items.forEach(each => (each.value !== '' ? (inputData[each.name] = each.value) : null))
    // }

    if (Object.keys(inputData).length === 0) return

    // await actions
    //   .updateUserProfile(inputData)
    //   .then(async res => {
    //     console.log(res)
    //     setUpdateList(Object.keys(inputData))

    //     await actions
    //       .getAuthUser()
    //       .then(res => {
    //         setUser(res.data.user)
    //         handleClearForm()
    //       })
    //       .catch(err => console.log(err))
    //   })
    //   .catch(err => console.log(err))
  }

  return (
    <div
      className={`edit-section--shadow-inset ${title} ${
        toExpand === title ? 'expand-card' : 'shrink-card'
      }`}
    >
      <div className="edit-section__header" onClick={() => handleExpandCard(title)}>
        <div className="edit-section__header--shadow-outset">
          <h3>{title}</h3>
        </div>
      </div>

      <div className="edit-section__error--container"></div>
      <div className="edit-section__form--container">
        <div className="edit-section__form">
          <ul className="edit-section__list">
            {fieldData &&
              Object.entries(fieldData).map(entry => {
                return (
                  <EditProfileItem
                    key={entry[0]}
                    fieldData={entry[1]}
                    setFieldData={setFieldData}
                    reset={{ isReset: isInputReset, setIsReset: setIsInputReset }}
                    isSubmitted={isSubmitted}
                  />
                )
              })}
          </ul>

          <div
            className="edit-section__btn--container"
            style={title === 'Songs' ? { display: 'none' } : {}}
          >
            <div className="edit-section__btn-cancel--container">
              <button
                className="edit-section__btn-cancel"
                type="button"
                onClick={() => clearAllSectionInputText()}
              >
                Cancel
              </button>
            </div>
            <div className="edit-section__btn-save--container">
              <button
                className="edit-section__btn-save"
                type="button"
                onClick={() => setIsSubmitted(true)}
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

// const useSectionKeys = (section: string, title: string) => {
//   const { user, setUser } = useAuth()
//   const [fieldData, setFieldData] = useState<FieldObject>(getFieldData(title, user))

//   // const [editedUser, setEditedUser] = useState<IUser | null>(null)
//   const [isInputReset, setIsInputReset] = useState<boolean>(false)

//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
//   const [areInputsClear, setAreInputsClear] = useState<boolean>(false)

//   useEffect(() => {
//     if (isSubmitted) {
//       // make mutation
//     }
//   }, [isSubmitted])

//   useEffect(() => {
//     if (areInputsClear) {
//       // clear field object values
//     }
//   }, [areInputsClear])

//   // Submit all inputs
//   const onSubmit = () => {}

//   const onSubmitUpdateEditUser = () => {}
//   // Validate all inputs
//   const validateInput = (key: string, value: string) => {}

//   const clearAllInputs = () => {}
// }
