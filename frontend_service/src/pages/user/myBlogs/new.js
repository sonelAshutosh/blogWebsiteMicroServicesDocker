import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import dummyImage from '../../../../public/assets/blogImage.png'
import Image from 'next/image'

function New() {
  const router = useRouter()
  const accessToken = getCookie('accessToken')

  const [blogImage, setBlogImage] = useState({ myFile: '' })

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    const base64 = await convertToBase64(file)
    // console.log(base64)
    setBlogImage({ ...blogImage, myFile: base64 })
    // setPostImage({ ...postImage, myFile: base64 })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(e.target)

    const title = data.get('title')
    const desc = data.get('desc')
    const image = blogImage
    const category = data.get('category')
    const userId = getCookie('userId')

    fetch(`http://localhost:8001/blogs`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        desc,
        image,
        category,
        userId,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => {
      if (res.status === 201) router.push('/user/myBlogs')
    })
  }

  return (
    <>
      <div className="mx-40 h-[85vh] p-4 overflow-y-auto">
        <form onSubmit={handleSubmit} method="POST" className="flex flex-col">
          <label htmlFor="image">Upload Image</label>
          <label
            htmlFor="image"
            className="h-auto overflow-hidden rounded-lg cursor-pointer w-52 hover:brightness-50"
          >
            <Image
              src={blogImage.myFile || dummyImage}
              className="w-56 h-36"
              alt="Blog Image"
              width="208"
              height="208"
              priority
            />
          </label>
          <input
            className="hidden w-56 h-36"
            type="file"
            name="image"
            id="image"
            accept=".jpeg, .png, .jpg"
            onChange={handleImageUpload}
          />
          <label htmlFor="title">Title</label>
          <input
            className="p-2 my-2 border border-black rounded-md"
            type="text"
            id="title"
            name="title"
            required
          />
          <label htmlFor="title">Description</label>
          <textarea
            className="p-2 my-2 border border-black rounded-md"
            name="desc"
            id="desc"
            cols="30"
            rows="10"
            required
          ></textarea>
          <select
            className="p-2 my-2 border border-black rounded-md"
            name="category"
            id="category"
          >
            <option value="all">All</option>
            <option value="technology">Technology</option>
            <option value="fashion">Fashion</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="news">News</option>
            <option value="health">Health</option>
          </select>

          <button
            type="submit"
            className="absolute flex items-center justify-center px-6 py-2 text-lg font-bold rounded-lg bottom-12 right-10 bg-slate-400 hover:bg-slate-600 hover:text-slate-400"
          >
            {' '}
            + Create
          </button>
        </form>
      </div>
    </>
  )
}

export default New

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}
