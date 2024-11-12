import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './routing/authRouters.js'

const app = express()
dotenv.config()

const PORT = 8000
const URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@blog.ufnd36v.mongodb.net/?retryWrites=true&w=majority`

app.use(express.json())
app.use(
  cors({
    origin: '*',
  })
)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/users', userRouter)

mongoose.connect(URI).then(() => {
  app.listen(PORT, () => {
    console.log('Connected to Database')
    console.log(`App listening on PORT ${PORT}`)
  })
})
