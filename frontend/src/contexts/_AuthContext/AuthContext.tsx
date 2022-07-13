import {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useContext,
} from 'react'
import { useQueryClient } from 'react-query'
import { useAuthUser } from '../../hooks/useQueries_REFACTOR/useAuthUser'
// import actions from '../api'
import axios from 'src/apis/axios/axios'
import useLocalStorage from 'src/hooks/useLocalStorage'
import useAxiosPrivate from 'src/apis/axios/useAxiosPrivate'
import { IUser } from '../../interfaces/IModels'
import { tempMockUser } from '../../pages/_Home/initialData'
import { Navigate, useNavigate } from 'react-router'

const AuthUserContext = createContext<AuthProviderType>({
  auth: null,
  setAuth: () => null,
  user: null,
  setUser: () => null,
  login: (credentials: { username: string; password: string }) => Promise.resolve(),
  logout: () => {},
  signin: () => {},
  isAuthenticated: false,
})

type AuthProviderType = ReturnType<typeof useProvideAuth>

const useProvideAuth = () => {
  const axiosPrivate = useAxiosPrivate()
  const [user, setUser] = useState<IUser | null>(null)
  const [auth, setAuth] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const getUser = async () => {
      try {
        const response = await axiosPrivate.get('/getAuthUser', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response) {
          setUser(response.data)
          setIsAuthenticated(true)
          navigate('/')
        }
      } catch (err) {
        console.log(err)
        setIsAuthenticated(false)
        navigate('/auth')
      }
    }
    getUser()
  }, [auth])

  const signin = () => {}

  const login = async (credentials: { username: string; password: string }) => {
    const login = await axios.post(`/logIn`, credentials)
    if (login.data) {
      localStorage.setItem('token', login.data.accessToken)
      setAuth(login.data.accessToken)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAuth(null)
  }

  return {
    user,
    setUser,
    auth,
    setAuth,
    login,
    logout,
    signin,
    isAuthenticated,
  }
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const values = useProvideAuth()

  return <AuthUserContext.Provider value={values}>{children}</AuthUserContext.Provider>
}

function useAuth() {
  return useContext(AuthUserContext)
}

const Authenticated = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth()

  if (!user) return <Navigate to="/auth" replace={true} />
  return <>{children}</>
}

const Unauthenticated = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth()

  if (user) return null
  return <>{children}</>
}

export { useAuth, AuthProvider, Authenticated, Unauthenticated }
