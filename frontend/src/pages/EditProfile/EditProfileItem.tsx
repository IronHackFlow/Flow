import { useContext, useEffect, useState, useCallback, memo } from 'react'
// import { UserContext } from '../../contexts/AuthContext'
// import { errorStyles } from '../../constants/index'
// import useHandleOSK from '../../utils/useHandleOSK'
// import useDebugInformation from '../../utils/useDebugInformation'
// import ButtonClearText from '../../components/ButtonClearText'
// import { SectionType } from './EditProfile'


// type Props = {
//   inputData: SectionType,
//   updateList: string[]
// }

// const MemoizedItem = memo(
//   function EditProfileItem({ inputData, updateList }: Props) {
//     const { name, type, placeholder, autoComplete, value, setValue, borderRadius } =
//       inputData
//     const { user } = useContext(UserContext)
//     const { handleOnFocus } = useHandleOSK()

//     const handleInputChange = useCallback(
//       e => {
//         setValue(e.target.value)
//       },
//       [setValue],
//     )

//     const handleInputTitle = useCallback((): string => {
//       if (!user) return ""
//       if (updateList.length !== 0) return value !== '' ? value : `${user[name as keyof typeof user]}`
//       if (user?.hasOwnProperty(name)) return `${user[name as keyof typeof user]}`
//       else return ""
//     }, [updateList, user])

//     return (
//       <li className="edit-section__item">
//         <div className="edit-section__item--shadow-outset" style={{ borderRadius: borderRadius }}>
//           <label htmlFor={name} className="edit-section__item-input-container">
//             <p>{handleInputTitle()}</p>
//             <input
//               id={name}
//               className="edit-section__item-input"
//               style={inputData?.errorPath === 'name' ? errorStyles : {}}
//               // ref={inputRef}
//               name={name}
//               placeholder={placeholder}
//               type={type}
//               autoComplete={autoComplete}
//               value={value}
//               onFocus={() => handleOnFocus()}
//               onChange={e => handleInputChange(e)}
//             />
//           </label>

//           <ButtonClearText
//             inset={true}
//             shadowColors={['#6c6b6b', '#e7e7e7', '#5f5f5f', '#fafafa']}
//             // inputRef={inputRef}
//             value={value}
//             setValue={setValue}
//           />
//         </div>
//       </li>
//     )
//   },
//   (prevProps, nextProps) => {
//     if (
//       nextProps.inputData.value !== prevProps.inputData.value ||
//       nextProps.updateList !== prevProps.updateList
//     ) {
//       return false
//     }
//     return true
//   },
// )

// export default MemoizedItem
