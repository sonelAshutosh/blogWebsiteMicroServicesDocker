import mongoose, { model } from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'All',
  },
  likes: [
    {
      type: String,
    },
  ],
  disLikes: [
    {
      type: String,
    },
  ],
})

export default model('Blog', blogSchema)
