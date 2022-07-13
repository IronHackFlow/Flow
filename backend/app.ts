require('dotenv').config()
import express, { Application, Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieparser from 'cookie-parser'
import path from 'path'
import indexRoutes from './src/_routes/index'
import authRoutes from './src/_routes/authRoutes'
import songRoutes from './src/_routes/songRoutes'
import likeRoutes from './src/_routes/likeRoutes'
import followRoutes from './src/_routes/followRoutes'
import commentRoutes from './src/_routes/commentRoutes'
const app: Application = express()

const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/localIronPlate`

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((x: any) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err: any) => console.error('Error connecting to mongo', err))
// "https://iron-flow.netlify.app"

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://iron-flow.herokuapp.com'], //Swap this with the client url
    optionsSuccessStatus: 200,
  }),
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieparser())

app.use(express.static(path.join(__dirname, '../frontend/build')))

app.use('/api', indexRoutes)
app.use('/api', authRoutes)
app.use('/api', songRoutes)
app.use('/api', likeRoutes)
app.use('/api', followRoutes)
app.use('/api', commentRoutes)

const PORT = process.env.PORT || 5000

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`))

// const express = require('express')
// const indexRoutes = require('./routes/index')
// const authRoutes = require('./routes/authRoutes')
// const songRoutes = require('./routes/songRoutes')
// const likeRoutes = require('./routes/likeRoutes')
// const followRoutes = require('./routes/followRoutes')
// const commentRoutes = require('./routes/commentRoutes')
