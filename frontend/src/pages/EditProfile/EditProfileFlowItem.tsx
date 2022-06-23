import { useContext, useEffect, useState, useRef, memo } from 'react'
// import { UserContext } from '../../contexts/AuthContext'
// import SongPosts from '../../utils/SongPosts'
// import actions from '../../api'
// import useHandleOSK from '../../utils/useHandleOSK'
// import ButtonClearText from '../../components/ButtonClearText'
// import { Song } from '../../constants/Types'

// type Props = {
//   inputData: Song,
//   index: number,
//   indexLength: number,
// }

// const MemoizedItem = memo(
//   function EditProfileFlowItem({ inputData, index, indexLength }: Props) {
//     const { _id: songId, name, caption } = inputData
//     const { user } = useContext(UserContext)
//     const { handleOnFocus } = useHandleOSK()
//     const { updateSong } = SongPosts()

//     const nameRef = useRef()
//     const captionRef = useRef()
//     const [labelName, setLabelName] = useState<string>(name)
//     const [labelCaption, setLabelCaption] = useState<string>(caption)
//     const [songName, setSongName] = useState<string>('')
//     const [songCaption, setSongCaption] = useState<string>('')

//     const handleSaveSong = async (e: React.MouseEvent<HTMLElement>, songId: string, name: string, caption: string) => {
//       e.preventDefault()
//       if (songName !== '' && songCaption !== '') {
//         await updateSong(songId, name, caption)

//         setLabelName(songName)
//         setLabelCaption(songCaption)
//         setSongName('')
//         setSongCaption('')
//       }
//     }

//     const handleClearForm = () => {
//       setSongName('')
//       setSongCaption('')
//     }

//     return (
//       <li className="edit-section__item song">
//         <div className="edit-section__item--shadow-outset">
//           <div className="edit-section__item-header">
//             <p className="edit-section__title">
//               song - <span>{index + 1}</span>
//             </p>
//           </div>
//           <div className="edit-section__flow--container">
//             <div className="edit-section__flow-input--container">
//               <label
//                 htmlFor={labelName}
//                 className="edit-section__item-input-container name"
//                 // style={{ borderRadius: '2em 2em 2em 0.5em' }}
//               >
//                 <p>{labelName}</p>
//                 <input
//                   id={name}
//                   className="edit-section__item-input"
//                   // ref={nameRef}
//                   // style={inputData?.errorPath === 'name' ? errorStyles : {}}
//                   name={name}
//                   placeholder={'Change name..'}
//                   type="text"
//                   autoComplete="off"
//                   value={songName}
//                   onFocus={() => handleOnFocus()}
//                   onChange={e => setSongName(e.target.value)}
//                 />
//               </label>

//               <ButtonClearText
//                 inset={true}
//                 shadowColors={['#6c6b6b', '#e7e7e7', '#5f5f5f', '#fafafa']}
//                 value={songName}
//                 setValue={setSongName}
//               />
//             </div>

//             <div className="edit-section__flow-input--container">
//               <label
//                 htmlFor={labelCaption}
//                 className="edit-section__item-input-container caption"
//                 // style={{ borderRadius: '0.5em 2em 2em 2em' }}
//               >
//                 <p>{labelCaption}</p>
//                 <input
//                   id={caption}
//                   className="edit-section__item-input"
//                   // style={inputData?.errorPath === 'name' ? errorStyles : {}}
//                   // ref={captionRef}
//                   name={caption}
//                   placeholder={'Caption this Flow..'}
//                   type="text"
//                   autoComplete="off"
//                   value={songCaption}
//                   onFocus={() => handleOnFocus()}
//                   onChange={e => setSongCaption(e.target.value)}
//                 />
//               </label>

//               <ButtonClearText
//                 inset={true}
//                 shadowColors={['#6c6b6b', '#e7e7e7', '#5f5f5f', '#fafafa']}
//                 value={songCaption}
//                 setValue={setSongCaption}
//               />
//             </div>
//           </div>
//           <div className="edit-section__btn--container song">
//             <div className="edit-section__btn--shadow-inset">
//               <div className="edit-section__btn-cancel--container">
//                 <button
//                   className="edit-section__btn-cancel"
//                   type="button"
//                   onClick={() => handleClearForm()}
//                 >
//                   Cancel
//                 </button>
//               </div>
//               <div className="edit-section__btn-save--container">
//                 <button
//                   className="edit-section__btn-save"
//                   type="button"
//                   onClick={e => handleSaveSong(e, songId, songName, songCaption)}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </li>
//     )
//   },
//   (prevProps, nextProps) => {
//     if (
//       nextProps?.inputData !== prevProps?.inputData
//     ) {
//       return false
//     }
//     return true
//   },
// )

// export default MemoizedItem
