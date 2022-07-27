import axios from './axios'
import { useAuth } from 'src/contexts/_AuthContext/AuthContext'

const useRefreshToken = () => {
  // const { setAuth } = useAuth()

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true,
    })
    console.log(response, 'USE REFRESH TOKEN RESPONSE')
    // setAuth(response.data.accessToken)
    return response.data.accessToken
  }
  return refresh
}

export default useRefreshToken
