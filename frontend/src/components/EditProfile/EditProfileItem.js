import React, { useEffect, useState, useCallback } from 'react'
import ButtonClearText from '../ButtonClearText'
import useHandleOSK from '../../utils/useHandleOSK'

const MemoizedItem = React.memo(function EditProfileItem({ inputData, onUpdate }) {
    const { value, setValue, inputRef} = inputData
    const { handleOnFocus } = useHandleOSK()
    const errorStyles = {
      border: "2px solid #ff6e6e",
      background: "#fc94a1",
      boxShadow: "inset 2px 2px 3px #775656, inset -2px -2px 3px #ffbaba"
    }

    const handleInputChange = useCallback(e => {
      setValue(e.target.value)
    }, [setValue])

    const handleInputTitle = useCallback(() => {
      console.log("am i even being called??", onUpdate, inputData.value, inputData.current)
      if (onUpdate.length !== 0) {
        return inputData.value !== "" ? inputData.value : inputData.current
      } else {
        console.log('so waht is going on with inputData', inputData)
        return inputData?.current !== null ? inputData?.current : ""
      }
    }, [onUpdate])

    return (
      <li className="edit-section__item">
        <div className="edit-section__item--shadow-outset" style={{borderRadius: inputData?.borderRadius}}>
          <label 
            for={`${inputData.name}`}
            className="edit-section__item-input-container"
          >
            <p>{handleInputTitle()}</p>
            <input
              id={`${inputData.name}`}
              className="edit-section__item-input"
              style={inputData?.errorPath === "name" ? errorStyles : {} }
              ref={inputRef}
              name={`${inputData?.name}`}
              placeholder={`${inputData?.placeholder}`}
              type={`${inputData?.type}`}
              autoComplete={`${inputData?.autoComplete}`}
              value={value}
              onFocus={() => handleOnFocus()}
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