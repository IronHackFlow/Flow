import React, { useState } from 'react'
import { trpc } from 'src/utils/trpc'
// import { IComment } from '../../../interfaces/IModels'
import { IComment } from '../../../../../backend/src/models/Comment'
import { useAuth } from '../../../contexts/_AuthContext/AuthContext'

export default function CommentFormData() {
  const { user } = useAuth()
  const addComment = trpc.useMutation(['comments.create'], {
    onSuccess: data => console.log(data, 'success: added a comment'),
  })
  const editComment = trpc.useMutation(['comments.edit'], {
    onSuccess: data => console.log(data, 'success: edited a comment'),
  })
  const [error, setError] = useState()
  const [notification, setNotification] = useState()

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    _type: string,
    _songId: string,
    _newText: any,
    _commentToEdit?: IComment,
  ) => {
    e.preventDefault()
    const newText: string = _newText.value
    if (_type === 'Edit' && _commentToEdit) {
      const isValid = validateInput(newText, _commentToEdit.text)
      if (!isValid || !user) return console.log('ERROR: you have not edited the text')
      editComment.mutate({ _id: _commentToEdit._id, song: _songId, text: newText })
    } else {
      const isValid = validateInput(newText)
      if (!isValid || !user) return console.log('ERROR: invalid text')
      addComment.mutate({ song: _songId, user: user, text: newText })
    }
  }

  const validateInput = (_text: string, _originalText?: string) => {
    if (_text === '') return false
    if (_originalText && _originalText === _text) return false
    return true
  }

  return {
    handleSubmit,
    error,
    setError,
    notification,
    setNotification,
  }
}
