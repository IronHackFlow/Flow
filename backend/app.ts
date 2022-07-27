import express, { Application, Request, Response, NextFunction } from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import { createContext } from './src/utils/trpc'
import { appRouter } from './src/routes/app.router'
import customConfig from './src/config/default'

dotenv.config({ path: path.join(__dirname, './.env') })
const app: Application = express()

const MONGODB_URI = customConfig.dbUri
mongoose
  .connect(MONGODB_URI)
  .then((x: any) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err: any) => console.error('Error connecting to mongo', err))

app.use(cookieparser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
  cors({
    credentials: true,
    origin: customConfig.origin,
    optionsSuccessStatus: 200,
  }),
)
app.use('/api/trpc', trpcExpress.createExpressMiddleware({ router: appRouter, createContext }))
app.use(express.static(path.join(__dirname, '../frontend/build')))

const PORT = customConfig.port

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
