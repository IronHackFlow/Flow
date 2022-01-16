import { createContext, useContext, useState, useEffect} from "react"
import actions from '../api'

export default function AuthContext({children}) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    actions
      .isUserAuth()
      .then(res => {
        console.log(res, "I GOT AN AUTH USER HERE")
        setUser(res.data.user)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  
  return (
    <AuthContext.Provider value={user, setUser}>
        { children }
    </AuthContext.Provider>
  )
}
