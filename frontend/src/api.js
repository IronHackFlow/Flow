import axios from 'axios'

// const baseURL = `http://localhost:5000/api`;
// const baseURL = 'https://iron-flow.herokuapp.com/api'
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://iron-flow.herokuapp.com/api'
    : 'http://localhost:5000/api'

const token = localStorage.getItem('token')

const API = axios.create({
  baseURL,
  headers: { Authorization: 'Bearer ' + token },
})

let resetHead = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  }
}

const actions = {
  signUp: async user => {
    return await axios.post(`${baseURL}/signUp`, user, resetHead())
  },

  logIn: async user => {
    return await axios.post(`${baseURL}/logIn`, user, resetHead())
  },

  logInGoogle: async data => {
    localStorage.setItem('googleTokenId', data.tokenId)
    let headerObj = resetHead()
    headerObj.headers['X-Google-Token'] = data.tokenId
    let resFromOurDB = await axios.post(`${baseURL}/logInGoogle`, data, headerObj)
    window.localStorage.setItem('token', resFromOurDB?.data?.token)
    return resFromOurDB
  },

  getAuthUser: async () => {
    return await axios.get(`${baseURL}/getAuthUser`, resetHead())
  },

  getUserSongs: async theUser => {
    return await axios.post(`${baseURL}/getUserSongs`, theUser, resetHead())
  },

  getUsersLikes: async user => {
    return await axios.post(`${baseURL}/getUsersLikes`, user, resetHead())
  },

  updateUserProfile: async person => {
    return await axios.post(`${baseURL}/updateUserProfile`, person, resetHead())
  },

  getSignedS3: async ({ fileName, fileType }) => {
    return await axios.post(`${baseURL}/getSignedS3`, { fileName, fileType }, resetHead())
  },

  addSong: async song => {
    return await axios.post(`${baseURL}/addSong`, song, resetHead())
  },

  deleteSong: async song => {
    return await axios.post(`${baseURL}/deleteSong`, song, resetHead())
  },

  updateSong: async song => {
    return await axios.post(`${baseURL}/updateSong`, song, resetHead())
  },

  getAllSongs: async () => {
    return await axios.get(`${baseURL}/getAllSongs`, resetHead())
  },

  searchUsersAndSongs: async searchStr => {
    return await axios.post(`${baseURL}/searchUsersAndSongs`, searchStr, resetHead())
  },

  addComment: async comment => {
    return await axios.post(`${baseURL}/addComment`, comment, resetHead())
  },

  deleteComment: async comment => {
    return await axios.post(`${baseURL}/deleteComment`, comment, resetHead())
  },

  editComment: async comment => {
    return await axios.post(`${baseURL}/editComment`, comment, resetHead())
  },

  getComments: async dat => {
    return await axios.post(`${baseURL}/getComments`, dat, resetHead())
  },

  addCommentLike: async like => {
    return await axios.post(`${baseURL}/addCommentLike`, like, resetHead())
  },

  deleteCommentLike: async like => {
    return await axios.post(`${baseURL}/deleteCommentLike`, like, resetHead())
  },

  addSongLike: async like => {
    return await axios.post(`${baseURL}/addSongLike`, like, resetHead())
  },

  deleteSongLike: async like => {
    return await axios.post(`${baseURL}/deleteSongLike`, like, resetHead())
  },

  addFollow: async follow => {
    return await axios.post(`${baseURL}/addFollow`, follow, resetHead())
  },

  deleteFollow: async follow => {
    return await axios.post(`${baseURL}/deleteFollow`, follow, resetHead())
  },
}

export default actions

// addUserPhoto: async () => {
//   return await axios.post(`${baseURL}/addUserPhotoRT`, resetHead())
// },

// uploadFile: async ({ fileName, fileType, file, kind }, songData) => {
//   console.log(songData)
//   axios
//     .post(
//       `${baseURL}/sign_s3`,
//       {
//         fileName: fileName,
//         fileType: fileType,
//         file: file,
//         kind: kind,
//       },
//       resetHead(),
//     )
//     .then(res => {
//       console.log(res, 'YO WHTF IS GONING ON HERE OK??')
//       var rtnData = res.data
//       var signedRequest = rtnData.signedRequest
//       var url = rtnData.url
//       var options = {
//         headers: {
//           'Content-Type': fileType,
//         },
//       }
//       console.log(signedRequest, file, options, 'come on man what is goin on h??')

//       // return response
//       axios
//         .put(signedRequest, file, options)
//         .then(async result => {
//           console.log(result, ' kindddd', kind, url)
//           if (kind === 'song') {
//             return await axios.post(
//               `${baseURL}/addSongRT`,
//               {
//                 song_URL: url,
//                 song_user: songData.song_user,
//                 video: null,
//                 date: songData.date,
//                 duration: songData.duration,
//                 name: songData.name,
//                 lyrics: songData.lyrics,
//                 song_PBR: null,
//                 song_BPM: null,
//                 caption: songData.caption,
//                 song_beattrack: null,
//               },
//               resetHead(),
//             )
//           }
//           if (kind === 'beatTrack') {
//             return await axios.post(`${baseURL}/addSongRT`, { url }, resetHead())
//           }
//           //this.setState({ audio: url }, () => console.log(this.state.audio));
//           //post url to mongoose here??  or better do it from backend index.js before sending response to here???
//           alert('File uploaded')
//         })
//         .catch(console.error)
//     })
//     .catch(console.error)
// },
