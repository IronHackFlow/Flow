import { useContext } from 'react'
import EditProfile from './EditProfile'
import TheContext from '../TheContext'
import useEventListener from '../utils/useEventListener'

function EditProfileScreen(props) {
  const { windowSize } = useContext(TheContext)
  useEventListener('resize', e => {
    var onChange = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    if (onChange < 600) {
      document.getElementById('body').style.height = `${windowSize}px`
      document.getElementById('EditProfileScreen').style.height = `${windowSize}px`
    } else {
      document.getElementById('body').style.height = `${onChange}px`
      document.getElementById('EditProfileScreen').style.height = `${onChange}px`
    }
  })
  
  return (
    <div id="EditProfileScreen" className="EditProfileScreen">
      <div className="page-container profile-pc">
        <div className="upper-container profile-uc">
          <div className="upper-outset profile-uo">
            <div className="upper-inset profile-ui">
              <h2>Edit Profile</h2>
            </div>
          </div>
        </div>
        <div className="middle-container profile-mc">
          <div className="mid-outset profile-mo">
            <EditProfile />
          </div>
        </div>
        <div className="bottom-container profile-bc">
          <div className="useless-bars profile-ub"></div>
          {/* <div className="useless-bars profile-ub"></div> */}
        </div>
      </div>
    </div>
  )
}
export default EditProfileScreen
