import express, { Request, Response, NextFunction } from 'express'
require('dotenv').config()
import jwt from 'jsonwebtoken'
import { User } from '../_models/User'
import { IUserRequest } from '../interfaces/IUserRequest'

export const verifyJWT = (req: IUserRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(403).json({ message: 'Token not found' })

  const secret = process.env.ACCESS_TOKEN
  if (!secret) return res.json({ message: 'JWT secret not found' })

  jwt.verify(token, secret, async (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: 'Token expired' })

    const user = await User.findOne({ username: decoded.username })
    req.user = user
    req.user.email = decoded.email
    req.user.username = decoded.username

    next()
  })
}
