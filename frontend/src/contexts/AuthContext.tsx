import { createContext, useEffect, useState, Dispatch, SetStateAction } from 'react'
// import actions from '../api'
// import { User } from '../constants/Types'

// const UserContext = createContext<UseGetUsersType>({
//   user: {_id: "", user_name: "", email: "",  },
//   setUser: () => {}
// })

// type UseGetUsersType = ReturnType<typeof UseGetUser>

// const UseGetUser = () => {
//   const [user, setUser] = useState<Partial<User>>()

//   useEffect(() => {
//     const controller = new AbortController()
//     const signal = controller.signal
  
//     actions
//       .getAuthUser()
//       .then(
//         (res) => {
//           console.log(res, 'I GOT AN AUTH USER HERE')
//           setUser(res.data.user)
//         },
//       )
//       .catch(err => console.log(err))
  
//     return () => controller.abort()
//   }, [])

//   return { user, setUser }
// }

// const UserContextProvider = ({children} : React.PropsWithChildren<{}>) => {
//   const values = UseGetUser()
//   return (
//     <UserContext.Provider value={values}>
//       {children }
//     </UserContext.Provider>
//   )
// }

// export { UserContext, UserContextProvider }