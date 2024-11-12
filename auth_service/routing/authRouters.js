import { Router } from 'express'
import {
  getAllUsers,
  getUserById,
  signIn,
  signUp,
} from '../controllers/authControllers.js'
import authenticateToken from '../auth/auth.js'

const userRouter = Router()

userRouter.get('/', getAllUsers)
userRouter.post('/signUp', signUp)
userRouter.post('/signIn', signIn)
userRouter.get('/user/:id', authenticateToken, getUserById)

export default userRouter
