import React, { useState } from 'react'
import { IComment } from '../../../interfaces/IModels'
import { useAddComment, useEditComment } from '../../../hooks/useQueries_REFACTOR/useComments'

export default function CommentFormData() {
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
    let newText: string = _newText.value
    if (_type === 'Edit' && _commentToEdit) {
      const isValid = validateInput(newText, _type, _commentToEdit.text)
      if (!isValid) return console.log('ERROR: you havent editted the text')
      console.log('executing a comment edit!')
      // editComment.mutate()
    } else {
      const isValid = validateInput(newText)
      if (!isValid) return console.log('ERROR: invalid text')
      addComment.mutate({ songId: _songId, text: newText })
      console.log(newText, 'adding a comment!')
    }
  }

  const validateInput = (_text: string, _type?: string, _originalText?: string) => {
    if (_text === '') return false
    if (_type && _type === 'Edit') {
      if (_originalText && _originalText === _type) return true
      else return false
    }
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
