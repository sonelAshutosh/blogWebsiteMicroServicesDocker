import React, { useState, useEffect } from 'react'
import Comment from './Comment'
import Router, { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'

function Comments() {
  const router = useRouter()
  const blogId = router.query.id
  const accessToken = getCookie('accessToken')
  const userId = getCookie('userId')

  // console.log(id)

  const [comments, setComments] = useState([])

  useEffect(() => {
    fetch(`http://localhost:8002/comments/comment/${blogId}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        setComments(res.commentsById)
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = new FormData(e.target)
    const content = data.get('comment')

    fetch(`http://localhost:8002/comments`, {
      method: 'POST',
      body: JSON.stringify({
        content,
        blogId,
        userId,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => {
      if (res.status === 200) Router.reload()
    })
  }

  return (
    <div className="py-4 mx-4 border-t-2">
      <h1 className="mb-4 text-2xl font-extrabold tracking-wider">Comments</h1>
      <div className="p-2 bg-gray-100 border border-gray-300 rounded-lg">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="comment"
            className="text-lg font-semibold text-gray-400"
          >
            Write a Comment
          </label>
          <textarea
            name="comment"
            id="comment"
            cols="10"
            rows="2"
            className="w-full p-2 px-4 border border-gray-300 resize-none rounded-xl"
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-slate-300 "
          >
            + Add
          </button>
        </form>
      </div>
      {/* ------------------------------------------------------ */}
      {/* Comments --------------------------------------------- */}
      {/* ------------------------------------------------------ */}
      <div>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment._id}
              id={comment._id}
              content={comment.content}
              userId={comment.userId}
              createdAt={comment.createdAt}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Comments
