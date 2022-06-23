import { useEffect, useState, useCallback, useRef, Dispatch, SetStateAction } from 'react'
import useHistory from '../../hooks/useHistory'
import {
  editIcon,
  saveIcon,
  deleteIcon,
  moveIcon,
  undoIcon,
  redoIcon,
} from '../../assets/images/_icons'

type Props = {
  line: {id: string, array: Array<string>},
  index: number,
  updateLyrics: Dispatch<SetStateAction<any>>
}

export default function EachLyricLine({ line, index, updateLyrics }: Props) {
  const [lyricLine, setLyricLine, { history, pointer, back, forward }] = useHistory(
    [...line.array][0],
  )
  const [initialLyricLine, setInitialLyricLIne] = useState(line)
  const [deleteBool, setDeleteBool] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isEdited, setIsEdited] = useState(false)
  const lyricRefs = useRef()
  const regexNo = /^(?:\d*)/g

  const editLyricLine = () => {
    setIsEditing(true)
    // console.log(each, 'editing')
  }

  const deleteLyricLine = (e: {id: string, array: string[]}) => {
    updateLyrics((prevArr: any) => prevArr.filter((each: any) => each.id !== e.id))
  }

  const saveLyricLine = () => {
    // setLyricLine([...lyricLine, lyricLine])
    updateLyrics((prevArr: any) =>
      prevArr.map((each: any)=> {
        if (each.id === line.id) return { ...each, array: [lyricLine] }
        else return each
      }),
    )
    setIsEdited(true)
    setIsEditing(false)
    // console.log(e, 'saved')
  }

  const setLyricRefs = useCallback(node => {
    lyricRefs.current = node
  }, [])

  const mapEachLyric = useCallback(
    wordArr => {
      return wordArr.array.map((each: any, index: number) => {
        if (isEditing) {
          return (
            <form className="edit-lyrics__form">
              <textarea
                className="edit-lyrics__edit-field"
                placeholder={isEdited ? `${lyricLine}` : `${each}`}
                // type="text
                value={lyricLine}
                onChange={e => setLyricLine(e.target.value)}
              />
            </form>
          )
        } else {
          return (
            <>
              {isEdited && lyricLine !== each ? (
                <p className="edit-lyrics__text edited" key={`${each}+${index}`} id={`${each}`}>
                  {lyricLine}
                </p>
              ) : (
                <p className="edit-lyrics__text" key={`${each}+${index}`} id={`${each}`}>
                  {each}
                </p>
              )}
            </>
          )
        }
      })
    },
    [lyricLine, isEditing, isEdited],
  )

  return (
    <li className="lyrics-list-item" ref={setLyricRefs}>
      <div className="list-item-1_edit-lyrics">
        <div className="edit-lyrics-container">
          <div className="edit-lyrics_shadow-div-outset">
            <div className="buttons-container">
              <div className="buttons-container_shadow-div-inset">
                <div className="bar-number-container">
                  <div className="bar-num_shadow-div-inset">
                    <div className="bar-num_shadow-div-outset">{line.id.match(regexNo)}</div>
                  </div>
                </div>
                <div className="buttons_shadow-div-inset">
                  {isEditing ? (
                    <button
                      className="buttons_shadow-div-outset"
                      onClick={() => saveLyricLine()}
                    >
                      <img className="button-icons" src={saveIcon} alt="save" />
                    </button>
                  ) : (
                    <button
                      className="buttons_shadow-div-outset"
                      onClick={() => editLyricLine()}
                    >
                      <img className="button-icons" src={editIcon} alt="edit" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="each-lyric-container">
              {deleteBool ? (
                <div className="confirm-delete-container">
                  <div className="confirm-delete-title">
                    <p style={{ color: 'pink' }}>Do you want to delete this line?</p>
                  </div>
                  <div className="word-btn-container">
                    <button className="word-cancel" onClick={() => setDeleteBool(false)}>
                      Cancel
                    </button>
                    <button className="word-delete" onClick={() => deleteLyricLine(line)}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="each-word-container">{mapEachLyric(line)}</div>
              )}
            </div>

            <div className="close-btn-container">
              <div className="close-btn_shadow-div-inset">
                <button className="close-btn_shadow-div-outset" onClick={() => setDeleteBool(true)}>
                  <img className="button-icons" src={deleteIcon} alt="delete" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="list-item-2_lyric-suggestions">
          <div className="move-handle--container">
            <button className="move-handle__btn">
              <img className="button-icons" src={moveIcon} alt="move" />
            </button>
          </div>
          <div className="get-lyrics--container"></div>
          <div className="undo-redo--container">
            <div className="undo-redo__btn--container">
              <button className="undo-redo__btn undo" onClick={back}>
                <img src={undoIcon} alt="undo" className="button-icons" />
              </button>
            </div>
            <div className="undo-redo__btn--container">
              <button className="undo-redo__btn redo" onClick={forward}>
                <img src={redoIcon} alt="redo" className="button-icons" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
