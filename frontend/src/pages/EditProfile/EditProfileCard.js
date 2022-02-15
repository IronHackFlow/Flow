import React, { useContext, useState, useCallback } from 'react'
import actions from '../../api'
import TheContext from '../../contexts/TheContext'
import useDebugInformation from '../../utils/useDebugInformation'
import EditProfileItem from './EditProfileItem'

const MemoizedCard = React.memo(
  function EditProfileCard({ title, items, isExpanded, onExpand }) {
    useDebugInformation('EditProfileCard', { title, items, isExpanded, onExpand })
    const { setUser } = useContext(TheContext)
    const [updateList, setUpdateList] = useState([])

    const displayItems = useCallback(() => {
      return items.map(inputData => (
        <EditProfileItem inputData={inputData} key={inputData.name} updateList={updateList} />
      ))
    }, [items])

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
      items.forEach(each => clearInputValue(each.setValue))
    }

    const handleSaveForm = async e => {
      e.preventDefault()
      let inputData = {}
      items.forEach(each => (each.value !== '' ? (inputData[each.name] = each.value) : null))

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
          isExpanded === title ? 'expand-card' : 'shrink-card'
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

            <div className="edit-section__btn--container">
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
  },
  (prevProps, nextProps) => {
    if (
      nextProps?.items[0]?.value !== prevProps?.items[0]?.value ||
      nextProps?.items[1]?.value !== prevProps?.items[1]?.value ||
      nextProps?.items[2]?.value !== prevProps?.items[2]?.value ||
      nextProps?.isExpanded !== prevProps?.isExpanded
    )
      return false
    return true
  },
)

export default MemoizedCard
