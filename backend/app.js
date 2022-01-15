require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/authRoutes')
const songRoutes = require('./routes/songRoutes')
const likeRoutes = require('./routes/likeRoutes')
const followRoutes = require('./routes/followRoutes')
const commentRoutes = require('./routes/commentRoutes')

const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/localIronPlate`

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err))
// "https://iron-flow.netlify.app"

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://iron-flow.herokuapp.com'], //Swap this with the client url
    optionSuccessStatus: 200,
  }),
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../frontend/build')))

app.use('/api', indexRoutes)
app.use('/api', authRoutes)
app.use('/api', songRoutes)
app.use('/api', likeRoutes)
app.use('/api', followRoutes)
app.use('/api', commentRoutes)

const PORT = process.env.PORT || 5000

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`))
