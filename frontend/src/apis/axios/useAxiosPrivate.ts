import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { axiosPrivate } from './axios'
import useRefreshToken from './useRefreshToken'
import { useAuth } from 'src/contexts/_AuthContext/AuthContext'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const { auth, setAuth, setUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!auth) return config
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth}`
        }
        return config
      },
      error => Promise.reject(error),
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config
        if (error?.response?.data?.message === 'redirect') {
          // refresh token has expired
          setUser(null)
          return navigate('/auth')
        }
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken.accessToken}`
          console.log(error?.response, prevRequest, newAccessToken, 'WHAT IS GOING ON HERE??')
          return axiosPrivate(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
