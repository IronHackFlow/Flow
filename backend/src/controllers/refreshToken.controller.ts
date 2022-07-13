import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { verifyJwt } from '../utils/jwt'
import { signJwt } from '../utils/jwt'
import { User } from '../_models/User'

const handleRefreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies
  const secret = process.env.REFRESH_TOKEN
  const accessSecret = process.env.ACCESS_TOKEN

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
  if (!secret) return res.status(401).json({ message: 'Invalid secret key' })
  const refreshToken = cookies.jwt

  jwt.verify(refreshToken, secret, async (err: any, decoded: any) => {
    if (err) return res.json({ message: 'redirect' })

    const user = await User.findOne({ username: decoded.username })
    if (!user) return res.status(401).json({ message: 'Could not refresh access token' })

    const accessToken = signJwt({ username: user.username }, 'accessTokenPrivateKey', {
      expiresIn: '1m',
    })

    return res.json({ accessToken })
  })
}
export default handleRefreshAccessToken
