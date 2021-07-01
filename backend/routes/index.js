const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Songs = require("../models/Songs");
const Beats = require("../models/Beats");
const Comments = require("../models/Comments");
const Likes = require("../models/Likes");
const Follows = require("../models/Follows");
const axios = require("axios");
const jwt = require("jsonwebtoken");

router.get(`/user`, verifyToken, async (req, res, next) => {
  //GETTING OUR USER
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      User.findById(authData.user._id)
        .populate('userFollows')
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => res.status(500).json(err));
    }
  });
});

router.get(`/getOneUserRT`, verifyToken, async (req, res, next) => {
  //GETTING ONE USER
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      User.findById(authData.user._id)
        .populate('userFollows')
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => res.status(500).json(err));
    }
  });

});

router.post(`/getAUserRT`, async (req, res, next) => {
  //GETTING A PARTICULAR USER
  // console.log('hey hey hey hey hey ', req.body)
      await User.findById(req.body.id)
        .populate('userFollows')
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => res.status(500).json(err));
});

//search bar bobby
router.post('/getManyUsersRT', async (req,res,next)=> {
      await User.find({userName: {$regex: req.body.search, $options: "$i"}})
      .then((user)=>{
        res.status(200).json(user)
        console.log('yo its ya boi' + user)
      })
      .catch((err)=> res.status(500).json(err));
})

// changed this to find a single song out of desperate measures.. Should change it back but don't think it's being used anyway lol
router.post(`/getCommentsRT`, async (req, res, next) => {
    console.log("lol not comments, but songs", req.body)
    Songs.findById(req.body.id)
    .populate('songUser')
    .populate('songComments')
    .then((songs) => {
      res.status(200).json(songs);
    })
    .catch((err) => res.status(500).json(err))
})

router.post(`/getUserSongsRT`, async (req, res, next) => {
  console.log("wtf is this shit", req.body)
    Songs.find({ songUser: req.body._id})
    .populate('songUser')
    .populate('songComments')
    .then((songs) => {
        res.status(200).json(songs);
    })
    .catch((err) => res.status(500).json(err))
})

router.post(`/getSongLikesRT`, async (req, res, next) => {
  Songs.findById({ SongTotLikes: req.body._id})
  console.log('getting LIKES from SONG LIKES ROUTE...', req.body._id)
  .then((songLikes) => {
      res.status(200).json(songLikes);
  })
  .catch((err) => res.status(500).json(err))
})

router.post(`/addLikeRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    let likesPush = ''

    if (err) {
      res.status(403).json(err);
    } 
    else {
      body = { likeUser: authData.user._id, likerSong: req.body.likerSong }

      let userId = body.likeUser
      let deleteLikesArray = []

      await Songs.findById(body.likerSong)
        .populate('songLikes')
        .then((song) => {
          song.songLikes.forEach((each) => {
            if (each.likeUser == userId) {
              likesPush = false
              console.log(`holy shit, i found ${each._id}`)
              deleteLikesArray.push(each._id)
            }
              // Likes.findByIdAndRemove(liked._id, (err, likeDeleted) => {
              //   if (err) {
              //     res.status(403).json(err)
              //   }
              //   else {
              //     res.status(200).json(likeDeleted)
              //     console.log(likeDeleted, 'oh shit wtf??!')
              //   }
              // })
            
            else {
              likesPush = true
            }
          })
        })

      if (likesPush === true) {
        let liked = await Likes.create(body)
        let addSong = await Songs.findByIdAndUpdate(liked.likerSong, {$push: {songLikes: liked}})
        res.status(200).json(liked)
        console.log('song like added', liked)
      }
      
      else if (likesPush === false) {
        console.log(deleteLikesArray)
        deleteLikesArray.forEach((each) => {
          let removeLike = Likes.findByIdAndRemove(each, (err, likeDeleted) => {
            if (err) {
              res.status(403).json(err)
            }
            else {
              res.status(200).json(likeDeleted)
              console.log(likeDeleted, 'oh shit wtf??!')
            }
          })
        })

      }
        // console.log(`this is the like that was created`, liked)
        // console.log('the userId liker has liked this already toggle is', likesPush)
        
        // if (likesPush === true) {
        //   let stuff = await Songs.findByIdAndUpdate(liked.likerSong, {$push: {songLikes: liked.likeUser}})
        //   res.status(200).json(liked)
        //   console.log('song like added', liked)
        // }
        // else if (likesPush === false) {
          
        //   let deleteLike = await Likes.findByIdAndRemove(liked._id, (err, likeDeleted) => {
        //     if (err) {
        //       res.status(403).json(err)
        //     }
        //     else {
        //       res.status(200).json(likeDeleted)
        //       console.log(likeDeleted, 'oh shit wtf??!')
        //     }
        //   })
        // }
    }
  })
})

router.post(`/addFollowRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      let body = { followed: req.body.followedUser, follower: req.body.follower._id }
      let followedObject = await Follows.create(body)
      console.log(`added a follow here`, followedObject)
      console.log(req.body.follower)
      // const userFollowers = await User.findById(body.follower)
      // .populate('userFollows')
      // .then((followers) => {
      //   res.status(200).json(followers);
      // })
      // console.log(userFollowers.userFollows)
      // let stuff = await User.findByIdAndUpdate(req.body.user1._id, {$push:{userFollows:followed._id}})
      let stuff = await User.findByIdAndUpdate(req.body.follower, {$push: { userFollows: followedObject.followed }})
      res.status(200).json(followedObject);
    }
  });
});

router.post(`/getMostLikedSongsRT`, (req, res, next) => {
  // Songs.find({$sort: {"songTotLikes": -1}})
  Songs.find({})
  .populate('songUser')
  .populate('songComments')
  .then(songs => {
    res.status(200).json(songs)

  })
  .catch(err => res.status(500).json(err))
  });

router.post(`/addCommentRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      // console.log('Bodied',req.body)
      let body = req.body;
      body.commUser = authData.user._id
      console.log(body, 'this is')
      // console.log(1)
      let comment = await Comments.create(body);
      // console.log(comment)
      // console.log(2)
      let s = await Songs.findByIdAndUpdate(req.body.songId, {$push: { songComments: comment._id }})
      console.log(s)
      // console.log(3)
      res.status(200).json(comment);
    }
  });
});

router.post(`/addUserProfRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      User.findByIdAndUpdate(authData.user._id, req.body)
        .then((ppl) => {
          res.status(200).json(ppl);
        })
        .catch((err) => res.status(500).json(err));
    }
  });
});

router.post(`/addAPost`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      let body = req.body;
      body.userId = authData.user._id;
      let post = await Post.create(body);
      res.status(200).json(post);
    }
  });
});

router.get(`/getUserLikedSongsRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      let songLikes = await Likes.find({ likeUser: authData.user._id })

      res.status(200).json(songLikes)
    }
  })
})

router.post(`/getMostLikedSongsRT`, (req, res, next) => {
  // Songs.find({$sort: {"songTotLikes": -1}})
  Songs.find({})
  .then(songs => {
    res.status(200).json(songs)

  })
  .catch(err => res.status(500).json(err))

    // if (err) {
    //   res.status(403).json(err);
    // } else {
    //   let songPosts = await Songs.find({$sort: {"songTotLikes": -1}});
    //   res.status(200).json(songPosts)
    // }
  });

router.post(`/addSongRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {

      let song = {
        songURL: req.body.songURL,
        songUser: req.body.songUser,
        songBG: req.body.songBG,
        songDate: req.body.songDate,
        songName: req.body.songName,
        songLyricsStr: req.body.songLyricsStr,
        songPBR: req.body.songPBR,
        songBPM: null,
        songTotLikes: req.body.songTotLikes,
        songCaption: req.body.songCaption,
        songBeatTrack: req.body.songBeatTrack,
      };

     
      Songs.create(song)
        .then((theSong) => {
          res.status(200).json(theSong);
        })
        .catch((err) => res.status(500).json(err));
    }
  });
});

router.post(`/addBeatRT`, verifyToken, async (req, res, next) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      let beat = { beatUser: authData.user._id, beatURL: req.body.url };
      Beats.create(beat)
        .then((beet) => {
          res.status(200).json(beet);
        })
        .catch((err) => res.status(500).json(err));
    }
  });
});

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
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    //I'm available via AuthData
    if (err) {
      res.status(403).json(err);
    } else {
      let posts = await Post.find({ userId: authData.user._id });
      res.status(200).json(posts);
    }
  });
});

router.get(`/allPosts`, async (req, res, next) => {
  let allPosts = await Post.find({});
  res.status(200).json(allPosts);
});

router.post(`/logMeIn`, async (req, res, next) => {
  const tokenId = req.header("X-Google-Token");
  if (!tokenId) {
    res.status(401).json({ msg: "Mising Google JWT" });
  }

  const googleResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${encodeURI(
      tokenId
    )}`
  );
  const {
    email,
    email_verified,
    picture,
    given_name,
    family_name,
    error_description,
  } = googleResponse.data;
  if (!email || error_description) {

    res.status(400).json({ msg: error_description });
  } else if (!email_verified) {
    res.status(401).json({ msg: "Email not verified with google" });
  }

  const userData = {
    email,
    email_verified,
    picture,
    given_name,
    family_name,
    error_description,
    googleId: req.body.googleId,
  };

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create(userData);
  }
  jwt.sign({ user }, "secretkey", (err, token) => {
    res.status(200).json({ ...user._doc, token });
  });
});

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.status(403).json({ err: "not logged in" });
  }
}

var aws = require("aws-sdk");
require("dotenv").config(); // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: "us-east-2", // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
});

const S3_BUCKET = process.env.Bucket;

// Now lets export this function so we can call it from somewhere else
// exports.sign_s3 = (req,res) => {
router.post("/sign_s3", verifyToken, (req, res) => {
  let incoming= req.body

  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      res.status(403).json(err);
    } else {
      const s3 = new aws.S3(); // Create a new instance of S3
      const fileName = req.body.fileName;
      const fileType = req.body.fileType;
      const file = req.body.file;
      const kind = req.body.kind;

      // Set up the payload of what we are sending to the S3 api
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 3000,
        ContentType: fileType,
        ACL: "public-read",
      };
      // Make a request to the S3 API to get a signed URL which we can use to upload our file
      s3.getSignedUrl("putObject", s3Params, async (err, data) => {
        if (err) {
          console.log(err);
          res.json({ error: err });
        }
        // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
        const returnData = {
          signedRequest: data,
          url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
        };


        if (kind == "song") {
          // Songs.create(  PASS IN DATA  )
        } else if (kind == "profilePic") {
          // User.update (  PASS IN DATA  )
        } else if (kind == "beatTrack") {
          // Beats.create(  PASS IN DATA  )
        }
        res.json({ data: { returnData } });
      });
    }
  });
});

module.exports = router;
