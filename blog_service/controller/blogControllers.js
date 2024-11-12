import Blog from '../models/Blog.js'

export const getAllBlogs = async (req, res) => {
  let blogs

  try {
    blogs = await Blog.find().sort({ createdAt: -1 }).exec()
  } catch (err) {
    console.log(err)
  }

  if (!blogs) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  return res.status(200).json({ blogs })
}

export const getOneBlog = async (req, res) => {
  let blog

  try {
    blog = await Blog.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }

  if (!blog) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  return res.status(200).json({ blog })
}

export const getBlogByUser = async (req, res) => {
  let userBlogs

  try {
    userBlogs = await Blog.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .exec()
  } catch (err) {
    console.log(err)
  }

  if (!userBlogs) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  return res.status(200).json({ userBlogs })
}

export const createNewBlog = async (req, res) => {
  const { title, desc, image, userId, category } = req.body

  const imgString = image.myFile

  if (
    !title &&
    title.trim() === '' &&
    !desc &&
    desc.trim() === '' &&
    !userId &&
    userId.trim() === '' &&
    !image &&
    !image.trim() === '' &&
    !category &&
    !category.trim() === ''
  ) {
    return res.status(422).json({ message: 'Invalid Data' })
  }

  let blog

  try {
    blog = new Blog({ title, desc, userId, category, image: imgString })
    await blog.save()
  } catch (err) {
    console.log(err)
  }
  if (!blog) {
    return res.status(500).json({ message: 'Unexpected Error' })
  }

  return res.status(201).json({ blog })
}

export const updateBlog = async (req, res) => {
  let existingBlog
  try {
    existingBlog = await Blog.findById(req.params.id)
  } catch (err) {
    console.log(err)
  }

  const { title, desc, image, userId, category } = req.body
  const imgString = image.myFile

  if (
    !title &&
    title.trim() === '' &&
    !desc &&
    desc.trim() === '' &&
    !userId &&
    userId.trim() === '' &&
    !image &&
    !image.trim() === '' &&
    !category &&
    !category.trim() === ''
  ) {
    return res.status(422).json({ message: 'Invalid Data' })
  }

  existingBlog.title = title
  existingBlog.desc = desc
  existingBlog.image = imgString
  existingBlog.category = category

  try {
    existingBlog = await existingBlog.save()
  } catch (err) {
    console.log(err)
  }

  if (!existingBlog) {
    return res.status(500).json({ message: 'Unexpected Error' })
  }

  return res.status(201).json({ existingBlog })
}

export const getBlogByCategory = async (req, res) => {
  let categoryBlogs
  const category = req.params.category

  try {
    if (category === 'all')
      categoryBlogs = await Blog.find().sort({ createdAt: -1 }).exec()
    else
      categoryBlogs = await Blog.find({ category })
        .sort({ createdAt: -1 })
        .exec()
  } catch (err) {
    console.log(err)
  }

  if (!categoryBlogs) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  return res.status(200).json({ categoryBlogs })
}

export const deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  return res.status(201).json({ message: 'Blog deleted successfully' })
}

export const likeBlog = async (req, res) => {
  let blog

  try {
    blog = await Blog.findById(req.params.id)
  } catch (err) {
    console.error(err)
  }

  let likesCount = blog.likes.length

  if (blog.likes.includes(req.body.userId)) {
    return res.status(201).json({ message: 'Already Liked', likesCount })
  }

  const indexofUser = blog.disLikes.indexOf(req.body.userId)
  if (indexofUser !== -1) {
    blog.disLikes.splice(indexofUser, 1)
  }

  blog.likes.push(req.body.userId)
  try {
    blog = await blog.save()
  } catch (err) {
    console.log(err)
  }

  likesCount = blog.likes.length

  return res.status(201).json({ message: 'Blog Liked', likesCount })
}

export const dislikeBlog = async (req, res) => {
  let blog

  try {
    blog = await Blog.findById(req.params.id)
  } catch (err) {
    console.error(err)
  }

  let disLikesCount = blog.disLikes.length

  if (blog.disLikes.includes(req.body.userId)) {
    return res.status(201).json({ message: 'Already disLiked', disLikesCount })
  }

  const indexofUser = blog.likes.indexOf(req.body.userId)
  if (indexofUser !== -1) {
    blog.likes.splice(indexofUser, 1)
  }

  blog.disLikes.push(req.body.userId)
  try {
    blog = await blog.save()
  } catch (err) {
    console.log(err)
  }

  disLikesCount = blog.disLikes.length

  return res.status(201).json({ message: 'Blog disLiked', disLikesCount })
}

export const getBlogByPage = async (req, res) => {
  const pgNo = req.params.page
  const blogsPerPage = 5

  let blogs

  try {
    blogs = await Blog.find().sort({ createdAt: -1 }).exec()
  } catch (err) {
    console.log(err)
  }

  const totalBlogs = blogs.length
  const startIndex = (pgNo - 1) * blogsPerPage
  const endIndex = startIndex + blogsPerPage

  if (startIndex >= totalBlogs) {
    return res.status(200).json({ blogs: [] })
  }

  blogs = blogs.slice(startIndex, endIndex)
  const totalPages = Math.ceil(totalBlogs / blogsPerPage)

  return res.status(200).json({ blogs, totalPages })
}

export const getBlogByCategoryAndPage = async (req, res) => {
  const category = req.params.category
  const pgNo = req.params.page
  const blogsPerPage = 5
  let totalPages = 0

  let categoryBlogPerPage
  try {
    if (category === 'all')
      categoryBlogPerPage = await Blog.find().sort({ createdAt: -1 }).exec()
    else
      categoryBlogPerPage = await Blog.find({ category })
        .sort({ createdAt: -1 })
        .exec()
  } catch (err) {
    console.log(err)
  }
  const totalBlogs = categoryBlogPerPage.length
  const startIndex = (pgNo - 1) * blogsPerPage
  const endIndex = startIndex + blogsPerPage

  if (startIndex >= totalBlogs) {
    return res.status(200).json({ blogs: [] })
  }
  const blogs = categoryBlogPerPage.slice(startIndex, endIndex)
  totalPages = Math.ceil(totalBlogs / blogsPerPage)

  if (!blogs) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  return res.status(200).json({ blogs, totalPages })
}

export const getBlogBySearch = async (req, res) => {
  const { searchQuery } = req.params

  if (searchQuery === '' || searchQuery === undefined)
    return res.status(200).json({ searchResults: [] })

  let searchResults

  try {
    searchResults = await Blog.find({
      title: { $regex: searchQuery, $options: 'i' },
    }).sort({ createdAt: -1 })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unexpected Error Occurred' })
  }

  return res.status(200).json({ searchResults })
}
