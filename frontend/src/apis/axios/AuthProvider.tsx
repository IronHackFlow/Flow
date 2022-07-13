import { createContext, ReactNode, useState } from 'react'
import { IUser } from 'src/interfaces/IModels'

const INITIAL_AUTH = {
  user: undefined,
  accessToken: undefined,
  refreshToken: undefined,
}

type GetAuthType = ReturnType<typeof GetAuth>

interface IAuth {
  user: IUser | undefined
  accessToken: string | undefined
  refreshToken: string | undefined
}
const AuthContext = createContext({} as GetAuthType)

const GetAuth = () => {
  const [auth, setAuth] = useState<IAuth>(INITIAL_AUTH)

  return { auth, setAuth }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = GetAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default AuthContext
