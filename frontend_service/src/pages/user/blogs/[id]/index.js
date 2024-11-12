import Image from 'next/image'
import cookie from 'cookie'
import { getCookie } from 'cookies-next'
import dummyImage from '../../../../../public/assets/blogImage.png'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import LikeIcon from '@/svg/LikeIcon'
import DislikeIcon from '@/svg/DislikeIcon'
import EditIcon from '@/svg/EditIcon'
import DeleteIcon from '@/svg/DeleteIcon'
import Comments from '@/components/Comments/Comments'

export default function Index({ blogData, userData }) {
  const router = useRouter()
  const accessToken = getCookie('accessToken')
  const loggedInUserId = getCookie('userId')

  const [editAble, setEditAble] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [disLiked, setDisLiked] = useState(false)
  const [disLikesCount, setDisLikesCount] = useState(0)

  useEffect(() => {
    const loggedInUserId = getCookie('userId')
    setEditAble(blogData.userId === loggedInUserId ? true : false)
    setLiked(blogData.likes.includes(loggedInUserId) ? true : false)
    setDisLiked(blogData.disLikes.includes(loggedInUserId) ? true : false)

    setLikesCount(blogData.likes.length)
    setDisLikesCount(blogData.disLikes.length)
  }, [])

  const handleLike = () => {
    setLiked(true)
    setDisLiked(false)

    fetch(`http://localhost:8001/blogs/like/${blogData._id}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: loggedInUserId,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => {
      if (res.status === 201) {
        setLikesCount(likesCount + 1)
        setDisLikesCount(disLikesCount - 1)
      }
    })
  }

  const handleDisLike = () => {
    setDisLiked(true)
    setLiked(false)

    fetch(`http://localhost:8001/blogs/dislike/${blogData._id}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: loggedInUserId,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => {
      if (res.status === 201) {
        setDisLikesCount(disLikesCount + 1)
        setLikesCount(likesCount - 1)
      }
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete !')) {
      fetch(`http://localhost:8001/blogs/delete/${blogData._id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          blogId: blogData._id,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then((res) => {
        if (res.status === 201) router.push('/user/myBlogs')
      })
    }
  }

  return (
    <div className="mx-40 h-[85vh] px-4 pt-0 pb-4 overflow-y-auto">
      <div className="flex items-center m-4">
        <div className="w-56 overflow-hidden rounded-lg shadow-md aspect-auto">
          <Image
            src={blogData.image ? blogData.image : dummyImage}
            alt="Blog Image"
            priority
            height="208"
            width="360"
          />
        </div>
        <div className="mx-8">
          <h1 className="text-4xl font-extrabold">{blogData.title}</h1>
          <div className="flex">
            <div className="flex flex-col items-start">
              <div className="flex my-1 place-content-center place-items-center">
                <p className="text-lg font-bold">Author: </p>
                <p className="mx-2 text-lg font-normal light">
                  {userData.name}
                </p>
              </div>
              <div className="font-semibold text-gray-400">
                {new Date(blogData.createdAt).toLocaleDateString('en-US')}
              </div>
            </div>
          </div>
        </div>
        <div className="m-auto mr-2">
          <div
            className={
              liked
                ? 'flex p-2 text-blue-700 hover:text-blue-700 hover:bg-slate-200 rounded-md cursor-pointer'
                : 'flex p-2 text-black hover:text-blue-700 hover:bg-slate-200 rounded-md cursor-pointer'
            }
            onClick={handleLike}
          >
            <LikeIcon />
            <span className="px-2">{likesCount}</span>
          </div>
          <div
            className={
              disLiked
                ? 'flex p-2 text-red-700 hover:text-red-700 hover:bg-slate-200 rounded-md cursor-pointer'
                : 'flex p-2 text-black hover:text-red-700 hover:bg-slate-200 rounded-md cursor-pointer'
            }
            onClick={handleDisLike}
          >
            <DislikeIcon /> <span className="px-2">{disLikesCount}</span>
          </div>
          <Link href={`/user/blogs/${blogData._id}/edit`}>
            {editAble ? (
              <div className="flex justify-center p-2 rounded-md cursor-pointer hover:text-slate-600 hover:bg-slate-200">
                <EditIcon />
              </div>
            ) : (
              <div></div>
            )}
          </Link>
          {editAble ? (
            <div
              className="flex justify-center p-2 rounded-md cursor-pointer hover:text-slate-600 hover:bg-slate-200"
              onClick={handleDelete}
            >
              <DeleteIcon />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div className="m-4">{blogData.desc}</div>

      <Comments />
    </div>
  )
}

export async function getServerSideProps(context) {
  const blogId = context.params.id
  const { req } = context
  const cookies = cookie.parse(req ? req.headers.cookie || '' : document.cookie)
  const { accessToken, userId } = cookies

  const blogResponse = await fetch(`http://blog-service:8001/blogs/${blogId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  const blogData = await blogResponse.json()
  const { blog } = blogData

  const userResponse = await fetch(
    `http://auth-service:8000/users/user/${blog.userId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
  )
  const userData = await userResponse.json()
  const { user } = userData

  return {
    props: {
      blogData: blog,
      userData: user,
    },
  }
}
