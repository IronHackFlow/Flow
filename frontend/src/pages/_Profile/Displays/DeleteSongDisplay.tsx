import React from 'react'
import { ISong } from '../../../../../backend/src/models/Song'
// import { ISong } from '../../../interfaces/IModels'

export const ConfirmDeleteSong = ({ song }: { song: ISong }) => {
  return (
    <div className="delete-container">
      <div className="delete-question-container">
        <p>
          Are you sure you want to delete <span>{song.title}</span>?
        </p>
      </div>
      <div className="delete-btn-container">
        <div className="delete-btn_shadow-div-inset">
          <div className="space-container"></div>
          <DeleteOrCancelButton title="Cancel" onClick={() => console.log('lol')} />
          <DeleteOrCancelButton title="Delete" onClick={() => console.log('lol')} />
        </div>
      </div>
    </div>
  )
}

export const DeleteOrCancelButton = ({ title, onClick }: { title: string; onClick: any }) => {
  const classOne = title === 'Cancel' ? 'cancel-btn-container' : 'confirm-btn-container'
  const classTwo =
    title === 'Cancel' ? 'cancel-btn_shadow-div-outset' : 'confirm-btn_shadow-div-outset'

  return (
    <div className={classOne}>
      <button className={classTwo} onClick={() => onClick()}>
        {title}
      </button>
    </div>
  )
}
