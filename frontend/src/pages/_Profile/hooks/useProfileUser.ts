import { useEffect, useState } from 'react'
import { useAuth } from 'src/contexts/_AuthContext/AuthContext'
import { trpc } from 'src/utils/trpc'
import { IUser } from '../../../../../backend/src/models/User'

const useProfileUser = (id: string | undefined) => {
  const { user } = useAuth()
  const getUser = trpc.useQuery(['users.get-user', { _id: id }], {
    enabled: false,
  })
  const [thisUser, setThisUser] = useState<IUser>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (user && user._id === id) {
      setThisUser(user)
    }
  }, [user, id])

  useEffect(() => {
    if (user && user._id !== id) {
      const fetchUserByParams = async () => {
        const fetchedUser = await getUser.refetch({ throwOnError: true })
        setThisUser(fetchedUser.data)
      }
      fetchUserByParams()
    }
  }, [user, id])

  useEffect(() => {
    if (getUser.isLoading || getUser.isFetching || typeof thisUser === 'undefined') {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [thisUser, getUser.isLoading, getUser.isFetching])

  return { thisUser, isLoading }
}
export default useProfileUser
