import React from 'react'
import { useQuery } from 'react-query'
import { getAuthUser } from '../../apis/actions/users.actions'
import { IUser } from '../../interfaces/IModels'

export function useAuthUser() {
  return useQuery<IUser, Error>(['user'], getAuthUser)
}
