import React from 'react'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import Link from 'next/link'

function Navbar() {
  const router = useRouter()

  const handleLogout = () => {
    deleteCookie('accessToken')
    deleteCookie('userId')
    router.reload()
  }

  return (
    <>
      <div className="px-40 shadow-md bg-slate-300">
        <div className="flex items-center w-full h-12">
          <Link href="/">
            <h1 className="mx-4 text-2xl font-extrabold cursor-pointer hover:text-gray-600">
              Blog
            </h1>
          </Link>
          <ul className="flex m-auto mr-0 font-semibold ">
            <Link href="/">
              <li className="mx-4 cursor-pointer hover:border-b-black hover:border-b-2">
                All Blogs
              </li>
            </Link>
            <Link href="/user/myBlogs">
              <li className="mx-4 cursor-pointer hover:border-b-black hover:border-b-2">
                My Blogs
              </li>
            </Link>
            <li
              className="mx-4 cursor-pointer hover:border-b-black hover:border-b-2"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Navbar
