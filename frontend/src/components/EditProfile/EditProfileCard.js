import React, { useContext, useState, useCallback } from 'react'
import EditProfileItem from "./EditProfileItem"
import TheContext from '../../contexts/TheContext'
import actions from '../../api'

const MemoizedCard = React.memo(function EditProfileCard({ 
    title, items = [], 
    sectionRef, expandSection,
}) { 
  const { setUser } = useContext(TheContext)
  const [updateItems, setUpdateItems] = useState([])

  const displayItems = useCallback(() => {
    return items?.map(inputData => <EditProfileItem inputData={inputData} key={inputData.name} onUpdate={updateItems} />)
  }, [items])

  const handleExpandCard = useCallback((e, sectionRef) => {
    expandSection(e, sectionRef)
  }, [expandSection])

  const clearInputValue = useCallback(setValue => {
    setValue("")
  }, [])

  const handleClearForm = () => {
    items.forEach(each => clearInputValue(each.setValue))
  }
  
  const handleSaveForm = async (e) => {
    e.preventDefault()
    let inputData = {}
    items.forEach(each => (each.value !== "" ? inputData[each.name] = each.value : null))

    if (Object.keys(inputData).length === 0) return 

    await actions
      .addUserProf(inputData)
      .then(async res => {
        console.log(res)
        setUpdateItems(Object.keys(inputData))

        await actions
          .isUserAuth()
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
      className={`edit-section--shadow-inset ${title}`}
      ref={sectionRef}
    >
      <button 
        className="edit-section__header"
        type="button"
        onClick={(e) => handleExpandCard(e, sectionRef)}
      >
        <div className="edit-section__header--shadow-outset">
          <h3>{title}</h3>
        </div>
      </button>

      <div className="edit-section__error--container">
      </div>
      {console.log(items, "HMMMMM MUST BE HERE")}
      <div className="edit-section__form--container">
        <div className="edit-section__form">
          <ul className="edit-section__list">
            {displayItems()}
          </ul>

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
                onClick={(e) => handleSaveForm(e)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  if (nextProps.items !== prevProps.items) return false
  return true
})

export default MemoizedCard