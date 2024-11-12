import { Router } from 'express'
import {
  createNewComment,
  deleteComment,
  getAllComments,
  updateComment,
  getCommentById,
} from '../controller/commentControllers.js'
import authenticateToken from '../auth/auth.js'

const commentRouter = Router()

commentRouter.get('/', getAllComments)
commentRouter.get('/comment/:id', getCommentById)
commentRouter.post('/', authenticateToken, createNewComment)
commentRouter.put('/comment/:id', authenticateToken, updateComment)
commentRouter.delete('/comment/:id', authenticateToken, deleteComment)

export default commentRouter
