require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const Songs = require('../models/Songs')
const Beats = require('../models/Beats')
const Comments = require('../models/Comments')
const Likes = require('../models/Likes')
const Follows = require('../models/Follows')

router.post(`/signUp`, async (req, res, next) => {
  const user = req.body

  const takenUserName = await User.findOne({ userName: user.userName })
  const takenEmail = await User.findOne({ email: user.email })

  if (takenUserName || takenEmail) {
    res.json({ message: "Username or email has already been taken" })
  } else {
    user.password = await bcrypt.hash(req.body.password, 10)

    const dbUser = {
      userName: user.userName.toLowerCase(),
      email: user.email.toLowerCase(),
      password: user.password
    }
    const newUser = User.create(dbUser)
    res.json({message: "Success"})
  }
})

router.post(`/logIn`, async (req, res, next) => {
  const userLoggingIn = req.body
  User.findOne({ userName: userLoggingIn.userName })
    .then(dbUser => {
      if (!dbUser) {
        return res.json({ message: "Invalid Username or Password" })
      }
      bcrypt.compare(userLoggingIn.password, dbUser.password)
        .then(isCorrect => {
          if (isCorrect) {
            const payload = {
              id: dbUser._id,
              userName: dbUser.userName
            }
            jwt.sign(
              payload,
              process.env.JWT_SECRET,
              {expiresIn: 86400},
              (err, token) => {
                if (err) return res.json({ message: err })
                else {
                  return res.json({
                    message: "Success",
                    token: token
                  })
                }
              }
            )
          } else {
            return res.json({ message: "Invalid Username or Password"})
          }
        })
    })
})

router.get(`/isUserAuth`, verifyJWT, (req, res) => {
  res.json({ isLoggedIn: true, user: req.user.id })
})


router.get(`/user`, verifyToken, async (req, res, next) => {
  //GETTING OUR USER
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      User.findById(authData.user._id)
        .populate('userFollows')
        .then(user => {
          res.status(200).json(user)
          console.log(user, 'is this showing up?')
        })
        .catch(err => res.status(500).json(err))
    }
  })
})

router.get(`/getOneUserRT`, verifyToken, async (req, res, next) => {
  //GETTING ONE USER
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      User.findById(authData.user._id)
        .then(user => {
          res.status(200).json(user)
        })
        .catch(err => res.status(500).json(err))
    }
  })
})

router.post(`/getAUserRT`, async (req, res, next) => {
  console.log('Grabbing a user: ', req.body)
  await User.findById(req.body.id)
    .populate('followers')
    .populate('userFollows')
    .then(user => {
      console.log(user, "ok what is going on again?")
      res.status(200).json(user)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/getSongRT`, async (req, res, next) => {
  await Songs.findById(req.body.id)
    .populate('songUser')
    .populate('songLikes')
    .then(song => {
      res.status(200).json(song)
    })
    .catch(err => res.status(500).json(err))
})

//search bar bobby
router.post('/getManyUsersRT', async (req, res, next) => {
  let searchData = { user: "", songs: "" }
  await User.find({ userName: { $regex: req.body.search, $options: '$i' } })
    .then(user => {
      searchData.user = user
      console.log('yo its ya boi' + user)
    })
    .catch(err => res.status(500).json(err))

  await Songs.find({ songName: { $regex: req.body.search, $options: '$i' } })
    .populate('songUser')
    .then(songs => {
      searchData.songs = songs
      console.log('yo its ya boi 2' + songs)
    })
    .catch(err => res.status(500).json(err))
  console.log(searchData, "LOL IS IT A OBJECT??")
  res.status(200).json(searchData)
})

router.post('/getManySongsRT', async (req, res, next) => {
  await Songs.find({ songName: { $regex: req.body.search, $options: '$i' } })
    .then(song => {
      res.status(200).json(song)
      console.log('yo its ya boi' + song)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/getCommentsRT`, async (req, res, next) => {
  console.log('getting some song comments', req.body.id)
  let body = { id: req.body.id }
  
  await Songs.findById(body.id)
    .populate('songComments')
    .populate({ path: 'songComments', populate: 'commUser' })
    .then(songComments => {
      res.status(200).json(songComments)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/getACommentRT`, async (req, res, next) => {
  Comments.findById(req.body.id)
    .populate('commLikes')
    .then(comm => {
      res.status(200).json(comm)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/getUserSongsRT`, async (req, res, next) => {
  console.log(req.body, 'wha')
  let body = req.body
  await Songs.find({ songUser: body.songUser })
    .populate('songUser')
    .populate({ path: 'songComments', populate: 'commUser' })
    .then(songs => {
      res.status(200).json(songs)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/getUserFollowsSongsRT`, async (req, res, next) => {
  console.log(req.body, 'is this an array?')
  const getFollowedIds = (arr) => {
    return arr.map(each => {
      return each.followed
    })
  }
  // const followedIds = await req.body.map(each => {
  //   return each.followed
  // })

  await Songs.find({ songUser: getFollowedIds(req.body) })
    .populate('songUser')
    .then(songs => {
      console.log(songs, "what???")
      songs.forEach(each => console.log(each.songName))
      res.status(200).json(songs)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.post(`/getSongLikesRT`, async (req, res, next) => {
  Songs.findById({ SongTotLikes: req.body._id })
  console
    .log('getting LIKES from SONG LIKES ROUTE...', req.body._id)
    .then(songLikes => {
      res.status(200).json(songLikes)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/addLikeRT`, verifyJWT, async (req, res, next) => {
  jwt.verify(req.headers['authorization'].split(' ')[1], process.env.JWT_SECRET, async (err, authData) => {
    console.log(authData, "WHSDLKF ALK SD FLK")
    if (err) {
      res.status(403).json(err)
    } else {
      let bodySong = {
        likeUser: authData.id,
        likerSong: req.body.likerSong,
        likeDate: req.body.likeDate,
      }
      let bodyComm = {
        likeUser: authData.id,
        likedComment: req.body.likedComment,
        likeDate: req.body.likeDate,
      }
      let likeCheck = req.body.commLike

      if (likeCheck === false) {
        let likedObject = await Likes.create(bodySong)
        console.log(`CREATED songLike object: `, likedObject)

        await Songs.findByIdAndUpdate(
          bodySong.likerSong,
          { $push: { songLikes: likedObject } },
          { new: true },
        )
          .then(song => {
            res.status(200).json(song)
            console.log(`ADDED a like to Song: ${song.songName}'s likes: `, song.songLikes)
          })
          .catch(err => {
            next(err)
          })
      } else {
        let likedCommObject = await Likes.create(bodyComm)
        console.log('CREATED commentLike object: ', likedCommObject)

        await Comments.findByIdAndUpdate(
          bodyComm.likedComment,
          { $push: { commLikes: likedCommObject } },
          { new: true },
        )
          .then(comm => {
            res.status(200).json(comm)
            console.log(`ADDED a like to CommentUser: ${comm.commUser}'s likes: `, comm.commLikes)
          })
          .catch(err => {
            next(err)
          })
      }
    }
  })
})

router.post(`/deleteLikeRT`, verifyJWT, async (req, res, next) => {
  jwt.verify(req.headers['authorization'].split(' ')[1], process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let bodySong = {
        likeUser: authData.id,
        likerSong: req.body.likerSong,
        deleteObj: req.body.deleteObj,
      }
      let bodyComm = {
        likeUser: authData.id,
        deleteObj: req.body.deleteObj,
      }
      let likeCheck = req.body.commLike

      if (likeCheck === false) {
        await Songs.findByIdAndUpdate(
          bodySong.likerSong,
          { $pull: { songLikes: bodySong.deleteObj._id } },
          { new: true },
        )
          .then(song => {
            res.status(200).json(song)
            console.log(`DELETED a like from Song: ${song.songName}'s likes: `, song.songLikes)
          })
          .catch(err => {
            next(err)
          })

        await Likes.findByIdAndDelete(bodySong.deleteObj._id)
          .then(res => {
            console.log('this songLike has been eliminated!', res)
          })
          .catch(err => {
            next(err)
          })
      } else {
        await Comments.findByIdAndUpdate(
          bodyComm.deleteObj.likedComment,
          { $pull: { commLikes: bodyComm.deleteObj._id } },
          { new: true },
        )
          .then(comm => {
            res.status(200).json(comm)
            console.log(
              `DELETED a like from CommentUser: ${comm.commUser}'s likes: `,
              comm.commLikes,
            )
          })
          .catch(err => {
            next(err)
          })

        await Likes.findByIdAndDelete(bodyComm.deleteObj._id)
          .then(res => {
            console.log('this commentLike has been eliminated!', res)
          })
          .catch(err => {
            next(err)
          })
      }
    }
  })
})
// router.post(`/deleteLikeRT`, verifyToken, async (req, res, next) => {
//   jwt.verify(req.token, 'secretkey', async (err, authData) => {
//     if (err) {
//       res.status(403).json(err)
//     } else {
//       let bodySong = {
//         likeUser: authData.user._id,
//         likerSong: req.body.likerSong,
//         deleteObj: req.body.deleteObj,
//       }
//       let bodyComm = {
//         likeUser: authData.user._id,
//         deleteObj: req.body.deleteObj,
//       }
//       let likeCheck = req.body.commLike

//       if (likeCheck === false) {
//         await Songs.findByIdAndUpdate(
//           bodySong.likerSong,
//           { $pull: { songLikes: bodySong.deleteObj._id } },
//           { new: true },
//         )
//           .then(song => {
//             res.status(200).json(song)
//             console.log(`DELETED a like from Song: ${song.songName}'s likes: `, song.songLikes)
//           })
//           .catch(err => {
//             next(err)
//           })

//         await Likes.findByIdAndDelete(bodySong.deleteObj._id)
//           .then(res => {
//             console.log('this songLike has been eliminated!', res)
//           })
//           .catch(err => {
//             next(err)
//           })
//       } else {
//         await Comments.findByIdAndUpdate(
//           bodyComm.deleteObj.likedComment,
//           { $pull: { commLikes: bodyComm.deleteObj._id } },
//           { new: true },
//         )
//           .then(comm => {
//             res.status(200).json(comm)
//             console.log(
//               `DELETED a like from CommentUser: ${comm.commUser}'s likes: `,
//               comm.commLikes,
//             )
//           })
//           .catch(err => {
//             next(err)
//           })

//         await Likes.findByIdAndDelete(bodyComm.deleteObj._id)
//           .then(res => {
//             console.log('this commentLike has been eliminated!', res)
//           })
//           .catch(err => {
//             next(err)
//           })
//       }
//     }
//   })
// })

router.post(`/addFollowRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', async (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let body = {
        follower: authData.user._id,
        followed: req.body.followedUser,
        followDate: req.body.followDate,
      }

      console.log('DATA received from follow button click', body)

      let followedObject = await Follows.create(body)
      console.log(`CREATED follow object: `, followedObject)
      let resData = { followerData: '', followedData: '' }

      await User.findByIdAndUpdate(
        body.follower,
        { $push: { userFollows: followedObject } },
        { new: true },
      )
        .populate('userFollows')
        .then(authUser => {
          resData.followerData = { ...authUser }
          console.log(
            `ADDED a follow to User: ${authUser.userName}'s userFollows: `,
            authUser.userFollows,
          )
        })
        .catch(err => {
          next(err)
        })

      await User.findByIdAndUpdate(
        body.followed,
        { $push: { followers: followedObject } },
        { new: true },
      )
        .then(user => {
          resData.followedData = { ...user }
          console.log(`ADDED a follow to User: ${user.userName}'s followers: `, user.followers)
        })
        .catch(err => {
          next(err)
        })
      console.log('what the fuccck', resData)
      res.status(200).json(resData)
    }
  })
})

router.post(`/deleteFollowRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', async (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let body = {
        follower: authData.user._id,
        followed: req.body.followedUser,
        deleteObj: req.body.deleteObj,
      }

      let resData = { followerData: '', followedData: '' }

      await User.findByIdAndUpdate(
        body.follower,
        { $pull: { userFollows: body.deleteObj._id } },
        { new: true },
      )
        .populate('userFollows')
        .then(authUser => {
          resData.followerData = { ...authUser }
          console.log(
            `DELETED a follow from User: ${authUser.userName}'s userFollows: `,
            authUser.userFollows,
          )
        })
        .catch(err => {
          next(err)
        })

      await User.findByIdAndUpdate(
        body.followed,
        { $pull: { followers: body.deleteObj._id } },
        { new: true },
      )
        .then(user => {
          resData.followedData = { ...user }
          console.log(`DELETED a follow from User: ${user.userName}'s followers: `, user.followers)
        })
        .catch(err => {
          next(err)
        })

      await Follows.findByIdAndDelete(body.deleteObj._id)
        .then(res => {
          console.log('this follow has been eliminated!', res)
        })
        .catch(err => {
          next(err)
        })

      res.status(200).json(resData)
    }
  })
})

router.post(`/getMostLikedSongsRT`, (req, res, next) => {
  // Songs.find({$sort: {"songTotLikes": -1}})
  Songs.find({})
    .populate('songUser')
    .populate({ path: 'songComments', populate: 'commUser' })
    .populate({ path: 'songUser', populate: 'followers' })
    .then(songs => {
      res.status(200).json(songs)
    })
    .catch(err => res.status(500).json(err))
})

router.post(`/addCommentRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', async (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let body = {
        comment: req.body.comment,
        commUser: authData.user,
        commSong: req.body.commSong,
        commDate: req.body.commDate,
      }
      let comment = await Comments.create(body)

      await Songs.findByIdAndUpdate(
        body.commSong,
        { $push: { songComments: comment } },
        { new: true },
      )
        .populate({ path: 'songComments', populate: 'commUser' })
        .then(song => {
          res.status(200).json(song)
          console.log(`ADDED a comment: `, comment)
        })
        .catch(err => {
          next(err)
        })
    }
  })
})

router.post(`/deleteCommentRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', async (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let body = { deleteObj: req.body.deleteObj, songId: req.body.songId }
      console.log(body, 'this is')

      await Songs.findByIdAndUpdate(
        body.songId,
        { $pull: { songComments: body.deleteObj._id } },
        { new: true },
      )
        .populate({ path: 'songComments', populate: 'commUser' })
        .then(song => {
          res.status(200).json(song)
        })
        .catch(err => {
          next(err)
        })

      await Comments.findByIdAndDelete(body.deleteObj._id)
        .then(res => {
          console.log(`your comment: ${res} has been exterminated`)
        })
        .catch(err => {
          next(err)
        })
    }
  })
})

router.post(`/addUserProfRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      User.findByIdAndUpdate(authData.user._id, req.body)
        .then(ppl => {
          res.status(200).json(ppl)
        })
        .catch(err => res.status(500).json(err))
    }
  })
})

router.post(`/addAPost`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', async (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let body = req.body
      body.userId = authData.user._id
      let post = await Post.create(body)
      res.status(200).json(post)
    }
  })
})

router.get(`/getUserLikedSongsRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', async (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let songLikes = await Likes.find({ likeUser: authData.user._id })

      res.status(200).json(songLikes)
    }
  })
})

router.post(`/addSongRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let song = {
        songURL: req.body.songURL,
        songUser: req.body.songUser,
        songBG: req.body.songBG,
        songDate: req.body.songDate,
        songDuration: req.body.songDuration,
        songName: req.body.songName,
        songLyricsStr: req.body.songLyricsStr,
        songPBR: req.body.songPBR,
        songBPM: null,
        songTotLikes: req.body.songTotLikes,
        songCaption: req.body.songCaption,
        songBeatTrack: req.body.songBeatTrack,
      }
      console.log(req.body, 'add song here')

      Songs.create(song)
        .then(theSong => {
          res.status(200).json(theSong)
        })
        .catch(err => res.status(500).json(err))
    }
  })
})

router.post(`/deleteSongRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let body = req.body
      Songs.findByIdAndDelete(body.song)
        .then((res) => {
          res.status(200).json(res)
          console.log(res, "i was deleted")
        })
        .catch((err) => {
          res.status(500).json(err)
        })
    }
  })
})

router.post(`/addBeatRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      let beat = { beatUser: authData.user._id, beatURL: req.body.url }
      Beats.create(beat)
        .then(beet => {
          res.status(200).json(beet)
        })
        .catch(err => res.status(500).json(err))
    }
  })
})

// router.get(`/getAllBeats`, verifyToken, async (req, res, next) => {
//     jwt.verify(req.token, 'secretkey', (err, authData) => {
//         if (err) {
//             res.status(403).json(err);
//         } else {
//             User.find({}).then(beats => {
//                 res.status(200).json(beats)
//             }).catch(err => res.status(500).json(err))

//         }
//     })
// })

// router.get(`/getBeat`, verifyToken, async (req, res, next) => {
//     jwt.verify(req.token, 'secretkey', (err, authData) => {
//         if (err) {
//             res.status(403).json(err);
//         } else {
//             User.findById({??????????}).then(beats => {
//                 res.status(200).json(beats)
//             }).catch(err => res.status(500).json(err))

//         }
//     })
// })

router.get(`/myPosts`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, 'secretkey', async (err, authData) => {
    //I'm available via AuthData
    if (err) {
      res.status(403).json(err)
    } else {
      let posts = await Post.find({ userId: authData.user._id })
      res.status(200).json(posts)
    }
  })
})

router.get(`/allPosts`, async (req, res, next) => {
  let allPosts = await Post.find({})
  res.status(200).json(allPosts)
})

router.post(`/logMeIn`, async (req, res, next) => {
  const tokenId = req.header('X-Google-Token')
  if (!tokenId) {
    res.status(401).json({ msg: 'Mising Google JWT' })
  }
  const googleResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${encodeURI(tokenId)}`,
  )
  const { email, email_verified, picture, given_name, family_name, error_description } =
    googleResponse.data
  if (!email || error_description) {
    res.status(400).json({ msg: error_description })
  } else if (!email_verified) {
    res.status(401).json({ msg: 'Email not verified with google' })
  }

  const userData = {
    email,
    email_verified,
    picture,
    given_name,
    family_name,
    error_description,
    googleId: req.body.googleId,
  }

  let user = await User.findOne({ email })
  if (!user) {
    user = await User.create(userData)
  }
  jwt.sign({ user }, 'secretkey', (err, token) => {
    res.status(200).json({ ...user._doc, token })
  })
})

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization']
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ')
    // Get token from array
    const bearerToken = bearer[1]
    // Set the token
    req.token = bearerToken
    // Next middleware
    next()
  } else {
    // Forbidden
    res.status(403).json({ err: 'not logged in' })
  }
}

function verifyJWT(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  console.log(req.headers, token, "stillgood?")
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.json({
        isLoggedIn: false,
        message: "Failed to Authenticate"
      })
      req.user = {}
      req.user.id = decoded.id
      req.user.userName = decoded.userName
      next()
    })
  } else {
    res.json({ message: "Incorrect Token Given", isLoggedIn: false })
  }
}

var aws = require('aws-sdk')
require('dotenv').config() // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: 'us-east-2', // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
})

const S3_BUCKET = process.env.Bucket

// Now lets export this function so we can call it from somewhere else
// exports.sign_s3 = (req,res) => {
router.post('/sign_s3', verifyToken, (req, res) => {
  let incoming = req.body

  jwt.verify(req.token, 'secretkey', async (err, authData) => {
    if (err) {
      res.status(403).json(err)
    } else {
      const s3 = new aws.S3() // Create a new instance of S3
      const fileName = req.body.fileName
      const fileType = req.body.fileType
      const file = req.body.file
      const kind = req.body.kind

      // Set up the payload of what we are sending to the S3 api
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 3000,
        ContentType: fileType,
        ACL: 'public-read',
      }
      // Make a request to the S3 API to get a signed URL which we can use to upload our file
      s3.getSignedUrl('putObject', s3Params, async (err, data) => {
        if (err) {
          console.log(err)
          res.json({ error: err })
        }
        // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
        const returnData = {
          signedRequest: data,
          url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
        }

        if (kind == 'song') {
          // Songs.create(  PASS IN DATA  )
        } else if (kind == 'profilePic') {
          // User.update (  PASS IN DATA  )
        } else if (kind == 'beatTrack') {
          // Beats.create(  PASS IN DATA  )
        }
        res.json({ data: { returnData } })
      })
    }
  })
})

module.exports = router
