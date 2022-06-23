import { createContext, useEffect, useState, Dispatch, SetStateAction, ReactNode, useContext } from 'react'
import { useAuthUser } from '../../hooks/useQueries_REFACTOR/useAuthUser'
// import actions from '../api'
import { IUser } from '../../interfaces/IModels'
import { tempMockUser } from '../../pages/_Home/initialData'


const AuthUserContext = createContext<UseGetUsersType>({ user: tempMockUser, setUser: () => {}})

type UseGetUsersType = ReturnType<typeof GetUser>

const GetUser = () => {
  const getUser = useAuthUser()
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    if (getUser.data) {
      setUser(getUser.data)
    }
  }, [getUser])

  return { user, setUser }
}

const AuthProvider = ({children} : { children: ReactNode}) => {
  const values = GetUser()
  
  return (
    <AuthUserContext.Provider value={values}>
      {children }
    </AuthUserContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthUserContext)
}

export { useAuth, AuthProvider }