import React, { useState } from 'react'
import { IComment } from '../../../interfaces/IModels'
import { useAuth } from '../../../contexts/_AuthContext/AuthContext'
import {
  useAddComment,
  useEditComment,
} from '../../../hooks/useQueries_REFACTOR/useComments/useComments'

export default function CommentFormData() {
  const { user } = useAuth()
  const addComment = useAddComment()
  const editComment = useEditComment()
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
      if (!isValid || !user) return console.log('ERROR: you havent editted the text')
      // editComment.mutate({ songId: _songId, text: newText, })
    } else {
      const isValid = validateInput(newText)
      if (!isValid || !user) return console.log('ERROR: invalid text')
      addComment.mutate({ songId: _songId, user: user, newText: newText })
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
