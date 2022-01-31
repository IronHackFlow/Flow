import { useContext, useEffect, useState, useCallback, memo } from 'react'
import TheContext from '../../contexts/TheContext'
import ButtonClearText from '../ButtonClearText'
import useHandleOSK from '../../utils/useHandleOSK'
import useDebugInformation from '../../utils/useDebugInformation'
import { errorStyles } from '../../constants/index'

const MemoizedItem = memo(function EditProfileItem({ inputData, updateList }) {

  const { name, type, placeholder, autoComplete, inputRef, value, setValue, borderRadius } = inputData
  const { user } = useContext(TheContext)
  const { handleOnFocus } = useHandleOSK()

  const handleInputChange = useCallback(e => {
    setValue(e.target.value)
  }, [setValue])

  const handleInputTitle = useCallback(() => {
    if (updateList.length !== 0) return value !== "" ? value : user[name]
    if (user?.hasOwnProperty(name)) return user[name]
  }, [updateList, user])

  return (
    <li className="edit-section__item">
      <div className="edit-section__item--shadow-outset" style={{borderRadius: borderRadius}}>
        <label 
          for={name}
          className="edit-section__item-input-container"
        >
          <p>{handleInputTitle()}</p>
          <input
            id={name}
            className="edit-section__item-input"
            style={inputData?.errorPath === "name" ? errorStyles : {} }
            ref={inputRef}
            name={name}
            placeholder={placeholder}
            type={type}
            autoComplete={autoComplete}
            value={value}
            onFocus={() => { handleOnFocus() }}
            onChange={handleInputChange}
          />
        </label> 

        <ButtonClearText 
          inset={true}
          shadowColors={["#6c6b6b", "#e7e7e7", "#5f5f5f", "#fafafa"]}
          inputRef={inputRef}
          value={value}
          setValue={setValue}
        />
      </div>
    </li>
  )
}, (prevProps, nextProps) => {
  if (nextProps.inputData.value !== prevProps.inputData.value || nextProps.onUpdate !== prevProps.onUpdate) {
    return false
  }
  return true
})

export default MemoizedItem