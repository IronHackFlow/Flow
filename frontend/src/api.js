import axios from 'axios'

const baseURL = `http://localhost:5000/api`;
// const baseURL = 'https://iron-flow.herokuapp.com/api'
const token = localStorage.getItem('token')

// const baseURL = process.env.NODE_ENV == 'production' ? " https://iron-flow.herokuapp.com/api ": "http://localhost:5000 "

const API = axios.create({
  baseURL,
  headers: { Authorization: "Bearer " + token },
})

let resetHead = () => {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem('token'),
    },
  }
}

const actions = {
  signUp: async (user) => {
    return await axios.post(`${baseURL}/signUp`, user, resetHead())
  },

  logIn: async (user) => {
    return await axios.post(`${baseURL}/logIn`, user, resetHead())
  },

  isUserAuth: async () => {
    return await axios.get(`${baseURL}/isUserAuth`, resetHead())
  },

  getUserName: async () => {
    return await axios.get(`${baseURL}/getUserName`, resetHead())
  },

  getUser: async () => {
    //This will go get our user every time we refresh
    return await axios.get(`${baseURL}/user`, resetHead())
  },

  getAllBeats: async () => {
    return await axios.get(`${baseURL}/getAllBeatsRT`, resetHead())
  },

  getBeat: async () => {
    return await axios.get(`${baseURL}/getBeatRT`, resetHead())
  },

  getUserSongs: async theUser => {
    return await axios.post(`${baseURL}/getUserSongsRT`, theUser, resetHead())
  },
  getUserFollowsSongs: async userFollows => {
    return await axios.post(`${baseURL}/getUserFollowsSongsRT`, userFollows, resetHead())
  },
  //search bar bobby
  getManyUsers: async searchStr => {
    return await axios.post(`${baseURL}/getManyUsersRT`, searchStr, resetHead())
  },
  getManySongs: async searchStr => {
    return await axios.post(`${baseURL}/getManySongsRT`, searchStr, resetHead())
  },
  getSong: async getSong => {
    return await axios.post(`${baseURL}/getSongRT`, getSong, resetHead())
  },

  getUserLikedSongs: async () => {
    return await axios.get(`${baseURL}/getUserLikedSongsRT`, resetHead())
  },

  getMostLikedSongs: async () => {
    return await axios.post(`${baseURL}/getMostLikedSongsRT`, resetHead())
  },

  addLike: async likePassed => {
    return await axios.post(`${baseURL}/addLikeRT`, likePassed, resetHead())
  },

  deleteLike: async delLike => {
    return await axios.post(`${baseURL}/deleteLikeRT`, delLike, resetHead())
  },

  getSongLikes: async song => {
    return await axios.post(`${baseURL}/getSongLikesRT`, song, resetHead())
  },

  addFollow: async followDat => {
    // console.log('followDat from the API', followDat)
    return await axios.post(`${baseURL}/addFollowRT`, followDat, resetHead())
  },

  deleteFollow: async delFollow => {
    return await axios.post(`${baseURL}/deleteFollowRT`, delFollow, resetHead())
  },

  addSong: async song => {
    return await axios.post(`${baseURL}/addSongRT`, song, resetHead())
  },

  deleteSong: async song => {
    return await axios.post(`${baseURL}/deleteSongRT`, song, resetHead())
  },

  addBeat: async () => {
    return await axios.post(`${baseURL}/addBeatRT`, resetHead())
  },

  addSongBG: async () => {
    return await axios.post(`${baseURL}/addSongBGRT`, resetHead())
  },

  getOneUser: async () => {
    return await axios.get(`${baseURL}/getOneUserRT`, resetHead())
  },

  getAUser: async userid => {
    return await axios.post(`${baseURL}/getAUserRT`, userid, resetHead())
  },

  addUserProf: async person => {
    return await axios.post(`${baseURL}/addUserProfRT`, person, resetHead())
  },

  addUserPhoto: async () => {
    return await axios.post(`${baseURL}/addUserPhotoRT`, resetHead())
  },

  getUsersFollowed: async () => {
    return await axios.get(`${baseURL}/getUsersFollowedRT`, resetHead())
  },

  getComments: async dat => {
    return await axios.post(`${baseURL}/getCommentsRT`, dat, resetHead())
  },

  getAComment: async aComm => {
    return await axios.post(`${baseURL}/getACommentRT`, aComm, resetHead())
  },

  addComment: async addComm => {
    return await axios.post(`${baseURL}/addCommentRT`, addComm, resetHead())
  },
  deleteComment: async delComm => {
    return await axios.post(`${baseURL}/deleteCommentRT`, delComm, resetHead())
  },

  getUserComments: async () => {
    return await axios.get(`${baseURL}/getUserCommentsRT`, resetHead())
  },

  getMostFollowed: async () => {
    return await axios.get(`${baseURL}/getMostFollowedRT`, resetHead())
  },

  getMyPosts: async () => {
    return await axios.get(`${baseURL}/myPosts`, resetHead())
  },
  getAllPosts: async () => {
    return await axios.get(`${baseURL}/allPosts`, resetHead())
  },
  addPost: async post => {
    console.log('are we there yet')
    return await axios.post(`${baseURL}/addAPost`, { post }, resetHead())
  },
  logMeIn: async data => {
    localStorage.setItem('googleTokenId', data.tokenId)

    let headerObj = resetHead()
    headerObj.headers['X-Google-Token'] = data.tokenId

    let resFromOurDB = await axios.post(`${baseURL}/logMeIn`, data, headerObj)

    console.log(resFromOurDB)

    window.localStorage.setItem('token', resFromOurDB?.data?.token)

    return resFromOurDB
  },

  uploadFile: async ({ fileName, fileType, file, kind }, songData) => {
    console.log(songData)
    axios
      .post(
        `${baseURL}/sign_s3`,
        {
          fileName: fileName,
          fileType: fileType,
          kind: kind,
        },
        resetHead(),
      )
      .then(response => {
        var returnData = response.data.data.returnData
        var signedRequest = returnData.signedRequest
        var url = returnData.url
        var options = {
          headers: {
            'Content-Type': fileType,
          },
        }
        console.log(response)

        // return response
        axios
          .put(signedRequest, file, options)
          .then(async result => {
            console.log(result, ' kindddd', kind, url)
            if (kind === 'song') {
              return await axios.post(
                `${baseURL}/addSongRT`,
                {
                  songName: songData.songName,
                  songCaption: songData.songCaption,
                  songBG: null,
                  songLyricsAudio: null,
                  songLyricsStr: songData.lyrics,
                  songPBR: null,
                  songURL: url,
                  songTotLikes: 0,
                  songUser: songData.user._id,
                  songDate: songData.date,
                  songDuration: songData.songDuration,
                  songBeatTrack: null,
                },
                resetHead(),
              )
            }
            if (kind === 'beatTrack') {
              return await axios.post(`${baseURL}/addSongRT`, { url }, resetHead())
            }
            //this.setState({ audio: url }, () => console.log(this.state.audio));
            //post url to mongoose here??  or better do it from backend index.js before sending response to here???
            alert('File uploaded')
          })
          .catch(error => {
            alert('ERROR ' + JSON.stringify(error))
          })
      })
      .catch(error => {
        alert(JSON.stringify(error))
      })
  },
}

export default actions
