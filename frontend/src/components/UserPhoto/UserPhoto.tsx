type UserPhotoProps = {
  photoUrl: string | undefined
  username: string
}

export const UserPhoto = ({ photoUrl, username }: UserPhotoProps) => {
  if (!photoUrl) return <DefaultPhotoPlaceholder username={username} />
  return <img src={photoUrl} alt={`profile photo for ${username}`} />
}

const DefaultPhotoPlaceholder = ({ username }: { username: string }) => {
  const userInitial = username[0].toUpperCase()
  return (
    <div className="DefaultPhotoPlaceholder">
      <p className="def-photo-ph__initial">{userInitial}</p>
    </div>
  )
}
