import express, { Request, Response, NextFunction } from 'express'
require('dotenv').config()
const jwt = require('jsonwebtoken')
// import jwt from 'jsonwebtoken'
import User from '../_models/User'
import { IUser } from '../../frontend/src/interfaces/IModels'

export interface IUserRequest extends Request {
  user?: any
}
const verifyJWT = (req: IUserRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]
  console.log(token, '---TOKEN---')
  if (token) {
    const secret = process.env.JWT_SECRET
    if (!secret) return res.json({ error: 'Invalid token' })

    jwt.verify(token, secret, async (err: any, decoded: any) => {
      console.log(decoded, err, 'what diss??')
      if (err)
        return res.json({
          success: false,
          message: 'Failed to authenticate user token',
          isLoggedIn: false,
        })

      const user = await User.findOne({ _id: decoded._id })
      req.user = user
      req.user._id = decoded._id
      req.user.username = decoded.username

      next()
    })
  } else {
    res.json({ success: false, message: 'Incorrect Token Given', isLoggedIn: false })
  }
}
module.exports = verifyJWT
