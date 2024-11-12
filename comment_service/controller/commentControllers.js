import Comment from '../models/Comments.js'

export const getAllComments = async (req, res) => {
  let comments

  try {
    comments = await Comment.find().sort({ createdAt: -1 }).exec()
  } catch (err) {
    console.log(err)
  }

  if (!comments) {
    return res.status(500).json({ message: 'Unexpected Error Occurred' })
  }

  return res.status(200).json({ comments })
}

export const getCommentById = async (req, res) => {
  let commentsById

  try {
    commentsById = await Comment.find({ blogId: req.params.id })
      .sort({ createdAt: -1 })
      .exec()
  } catch (err) {
    console.log(err)
  }

  if (!commentsById)
    return res.status(500).json({ message: 'Unexpected Error Occurred' })

  return res.status(200).json({ commentsById })
}

export const createNewComment = async (req, res) => {
  const { content, userId, blogId } = req.body

  if (
    !content ||
    !content.trim() ||
    !blogId.trim() ||
    (!userId.trim() && !userId && !blogId)
  ) {
    return res.status(404).json({ message: 'Invalid Data' })
  }

  let comment

  try {
    comment = new Comment({ content, userId, blogId })
    await comment.save()
  } catch (err) {
    console.log(err)
  }

  if (!comment) {
    return res.status(500).json({ message: 'Unexpected Error Occoured' })
  }

  return res
    .status(200)
    .json({ message: 'Comment Added Successfully', comment })
}

export const updateComment = async (req, res) => {
  const commentId = req.params.id
  const { content } = req.body

  if (!content || !content.trim()) {
    return res.status(500).status({ message: 'Invalid Data' })
  }

  let comment
  try {
    comment = await Comment.findById(commentId)
  } catch (err) {
    console.log(err)
  }

  comment.content = content

  try {
    await comment.save()
  } catch (err) {
    console.log(err)
  }
  if (!comment)
    return res.status(500).json({ message: 'Unexpected Error Occoured' })

  return res.status(200).json({ message: 'Comment Updated Successfully' })
}

export const deleteComment = async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id)
  return res.status(201).json({ message: 'Comment deleted successfully' })
}
