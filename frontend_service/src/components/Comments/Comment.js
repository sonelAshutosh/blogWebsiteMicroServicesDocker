import DeleteIcon from '@/svg/DeleteIcon'
import EditIcon from '@/svg/EditIcon'
import { getCookie } from 'cookies-next'
import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import AddIcon from '@/svg/AddIcon'

function Commment({ id, content, userId, createdAt }) {
  const loggedInUserId = getCookie('userId')
  const accessToken = getCookie('accessToken')

  const [editable, setEditAble] = useState(false)
  const [commentUser, setCommentUser] = useState({})
  const [currentlyEditing, setCurrentlyEditing] = useState(false)
  const [commentContent, setCommentContent] = useState(content)

  useEffect(() => {
    setEditAble(userId === loggedInUserId ? true : false)

    fetch(`http://localhost:8002/users/user/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setCommentUser(res.user)
      })
  }, [])

  const handleCommentEdit = () => {
    setCurrentlyEditing(!currentlyEditing)
  }

  const handleEditCommentChange = (e) => {
    setCommentContent(e.target.value)
  }

  const handleCommentUpdate = () => {
    fetch(`http://localhost:8002/comments/comment/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        content: commentContent,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => {
      setCurrentlyEditing(!currentlyEditing)
      if (res.status === 200) Router.reload()
    })
  }

  const handleCommentDelete = () => {
    fetch(`http://localhost:8002/comments/comment/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => {
      if (res.status === 201) Router.reload()
    })
  }

  return (
    <div
      key={id}
      className="px-8 py-2 my-2 bg-gray-100 border border-gray-200 rounded-lg"
    >
      <div className="flex items-center">
        <h3 className="font-semibold tracking-wider">{commentUser.name}</h3>
        &nbsp;
        <div className="h-[4px] w-[4px] bg-gray-400 rounded-full" />
        &nbsp;
        <p className="text-gray-400">
          {new Date(createdAt).toLocaleDateString('en-US')}
        </p>
        {editable ? (
          <div
            className="px-2 py-1 mx-2 ml-8 rounded-lg cursor-pointer hover:text-gray-300 hover:bg-gray-600"
            onClick={currentlyEditing ? handleCommentUpdate : handleCommentEdit}
          >
            {currentlyEditing ? <AddIcon /> : <EditIcon />}
          </div>
        ) : (
          <div></div>
        )}
        {editable ? (
          <div
            className="px-2 py-1 mx-2 rounded-lg cursor-pointer hover:text-gray-300 hover:bg-gray-600"
            onClick={handleCommentDelete}
          >
            <DeleteIcon />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="font-normal">
        {currentlyEditing ? (
          <textarea
            className="w-full p-2 px-4 my-2 border border-gray-300 resize-none rounded-xl"
            value={commentContent}
            onChange={handleEditCommentChange}
          ></textarea>
        ) : (
          content
        )}
      </div>
    </div>
  )
}

export default Commment
