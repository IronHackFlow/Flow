import jwt from 'jsonwebtoken'

export function signJwt(
  object: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined,
) {
  const secret =
    keyName === 'accessTokenPrivateKey' ? process.env.ACCESS_TOKEN : process.env.REFRESH_TOKEN
  if (!secret) return null

  const signingKey = Buffer.from(secret, 'base64').toString('ascii')

  return jwt.sign(object, secret, { expiresIn: '1m' })
}

export function verifyJwt<T>(
  token: string,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
): T | null {
  const secret =
    keyName === 'accessTokenPrivateKey' ? process.env.ACCESS_TOKEN : process.env.REFRESH_TOKEN
  if (!secret) return null

  const publicKey = Buffer.from(secret, 'base64').toString('ascii')

  try {
    const decoded = jwt.verify(token, secret) as T
    return decoded
  } catch (e) {
    return null
  }
}
