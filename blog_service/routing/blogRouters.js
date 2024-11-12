import { Router } from 'express'
import {
  getAllBlogs,
  getOneBlog,
  createNewBlog,
  getBlogByUser,
  getBlogByCategory,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  getBlogByPage,
  getBlogByCategoryAndPage,
  getBlogBySearch,
} from '../controller/blogControllers.js'
import authenticateToken from '../auth/auth.js'

const blogRouter = Router()

blogRouter.get('/', getAllBlogs)
blogRouter.get('/:id', authenticateToken, getOneBlog)
blogRouter.post('/', authenticateToken, createNewBlog)
blogRouter.post('/update/:id', authenticateToken, updateBlog)
blogRouter.get('/users/:id', authenticateToken, getBlogByUser)
blogRouter.get('/category/:category', authenticateToken, getBlogByCategory)
blogRouter.delete('/delete/:id', authenticateToken, deleteBlog)

blogRouter.post('/like/:id', authenticateToken, likeBlog)
blogRouter.post('/dislike/:id', authenticateToken, dislikeBlog)

blogRouter.get('/pages/:page', authenticateToken, getBlogByPage)

blogRouter.get(
  '/category/:category/pages/:page',
  authenticateToken,
  getBlogByCategoryAndPage
)

blogRouter.get(
  '/search/searchByTitle/:searchQuery',
  authenticateToken,
  getBlogBySearch
)

export default blogRouter
