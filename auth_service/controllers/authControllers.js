import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const getAllUsers = async (req, res) => {
  let users
  try {
    users = await User.find()
  } catch (e) {
    return console.log(e)
  }

  if (!users) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  return res.status(200).json({ users })
}

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body

  if (!name.trim() || !email.trim() || (!password && password.length < 6)) {
    return res.status(422).json({ message: 'Invalid Data' })
  }

  let user
  const hashedPassword = bcrypt.hashSync(password)

  try {
    user = new User({ name, email, password: hashedPassword })
    await user.save()
  } catch (err) {
    return console.log(err)
  }

  if (!user) {
    res.status(500).json({ message: 'Unexpected Error' })
  }

  return res.status(201).json({ message: 'SignUp Successful' })
}

export const signIn = async (req, res, next) => {
  const { email, password } = req.body

  if (!email.trim() || !password || password.length < 6) {
    return res.status(422).json({ message: 'Invalid Data' })
  }

  let existingUser

  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    console.error(err)
  }

  if (!existingUser) {
    res.status(404).json({ message: 'No User Found' })
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Incorrect Password' })
  }

  const existingUserAccessToken = jwt.sign(
    { email: existingUser.email },
    process.env.ACCESS_TOKEN_SECRET
  )

  return res.status(200).json({
    message: 'Login Successfull',
    accessToken: existingUserAccessToken,
    userId: existingUser._id,
  })
}

export const getUserById = async (req, res) => {
  const userId = req.params.id
  let user

  try {
    user = await User.findOne({ _id: userId })
  } catch (err) {
    console.log(err)
  }

  if (!user) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  return res.status(200).json({ user })
}
