import { createContext, useState, ReactNode, useContext } from 'react'
import { useQueryClient } from 'react-query'
import { trpc } from '../../utils/trpc'
import { IUser } from '../../../../backend/src/models/User'
import { useNavigate } from 'react-router'
import { RegisterInputClientType } from 'src/pages/_Auth/validation'

type AuthProviderType = ReturnType<typeof useProvideAuth>

const AuthUserContext = createContext<AuthProviderType>({
  user: null,
  login: (credentials: { username: string; password: string }) => Promise.resolve(),
  logout: () => {},
  register: (credentials: RegisterInputClientType) => Promise.resolve(),
})

const useProvideAuth = () => {
  const token = localStorage.getItem('token')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [user, setUser] = useState<IUser | null>(null)

  const authRefresh = trpc.useQuery(['auth.refresh'], {
    retry: 1,
    enabled: false,
    onSuccess: data => {
      localStorage.setItem('token', data)
      queryClient.invalidateQueries('users.me')
    },
    onError: err => {
      // document.location.href = '/auth'
    },
  })

  const authLogin = trpc.useMutation(['auth.login'], {
    onSuccess: async data => {
      localStorage.setItem('token', data)
      await getMe.refetch()
      navigate('/')
    },
    onError: err => {
      console.log(err.message)
    },
  })

  const authRegister = trpc.useMutation(['auth.register'], {
    onSuccess: data => {
      login(data)
    },
    onError: err => console.log(err.message),
  })

  const getMe = trpc.useQuery(['users.get-me'], {
    enabled: !!token,
    retry: 1,
    onSuccess: data => {
      setUser(data)
    },
    onError: error => {
      let retryRequest = true
      if (error.message.includes('you must be logged in') && retryRequest) {
        retryRequest = false
        try {
          authRefresh.refetch({ throwOnError: true })
        } catch (err: any) {
          console.log(err.message)
          if (err.message.includes('refresh expired token')) {
            // navigate('/auth')
            setUser(null)
            document.location.href = '/auth'
          }
        }
      }
    },
  })

  const login = async (credentials: { username: string; password: string }) => {
    console.log(credentials, 'login args')
    authLogin.mutate(credentials)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/auth')
  }

  const register = async (credentials: RegisterInputClientType) => {
    console.log(credentials, 'register args')
    authRegister.mutate(credentials)
  }

  return {
    user,
    login,
    logout,
    register,
  }
}

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const values = useProvideAuth()
  return <AuthUserContext.Provider value={values}>{children}</AuthUserContext.Provider>
}

function useAuth() {
  return useContext(AuthUserContext)
}

export { useAuth, AuthProvider }
