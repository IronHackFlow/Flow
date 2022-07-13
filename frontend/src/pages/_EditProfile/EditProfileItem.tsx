import { useState, forwardRef, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import useMobileKeyboardHandler from '../../hooks/useMobileKeyboardHandler'
import ButtonClearText from '../../components/_Buttons/ButtonClearText'
import { IFieldData, FieldObject } from './functions/handleFieldData'

interface IEditProfileInputProps {
  fieldData: IFieldData
  reset: { isReset: boolean; setIsReset: Dispatch<SetStateAction<boolean>> }
}

interface IEditProfileItemProps extends IEditProfileInputProps {
  setFieldData: Dispatch<SetStateAction<FieldObject>>
  isSubmitted: boolean
}

export default function EditProfileItem({
  fieldData,
  setFieldData,
  reset,
  isSubmitted,
}: IEditProfileItemProps) {
  const valueRef = useRef<any>('')

  useEffect(() => {
    if (isSubmitted && valueRef.current?.value !== '') {
      // TODO: Validate input here
      setFieldData(prevData => ({
        ...prevData,
        [fieldData.key]: { ...prevData[fieldData.key], value: valueRef.current?.value },
      }))
    }
  }, [valueRef, isSubmitted])

  return (
    <li className="edit-section__item">
      <EditProfileInput fieldData={fieldData} reset={reset} ref={valueRef} />
    </li>
  )
}

const EditProfileInput = forwardRef(({ fieldData, reset }: IEditProfileInputProps, ref: any) => {
  const { handleOnFocus } = useMobileKeyboardHandler()
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    if (reset.isReset) {
      setValue('')
      reset.setIsReset(false)
    }
  }, [reset.isReset, value])

  return (
    <div className={`edit-section__item--shadow-outset ${fieldData?.label}`}>
      <div className="edit-section__item-input-container">
        <p>{fieldData?.label}</p>
        <input
          id={fieldData?.key}
          className={`edit-section__item-input ${fieldData?.hasValue ? 'hasValue' : ''}`}
          // style={inputData?.errorPath === 'name' ? errorStyles : {}}
          ref={ref}
          name={fieldData?.key}
          placeholder={fieldData?.placeholder}
          type="text"
          autoComplete="off"
          value={value}
          onFocus={() => handleOnFocus()}
          onChange={e => setValue(e.target.value)}
        />
      </div>

      <ButtonClearText
        inset={true}
        shadowColors={['#6c6b6b', '#e7e7e7', '#5f5f5f', '#fafafa']}
        value={value}
        setValue={setValue}
      />
    </div>
  )
})
