const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function verifyJWT(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  console.log(token, '---TOKEN---')
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.json({
          success: false,
          message: 'Failed to authenticate user token',
          isLoggedIn: false,
        })
      req.user = {}
      req.user._id = decoded._id
      req.user.user_name = decoded.user_name
      next()
    })
  } else {
    res.json({ success: false, message: 'Incorrect Token Given', isLoggedIn: false })
  }
}
