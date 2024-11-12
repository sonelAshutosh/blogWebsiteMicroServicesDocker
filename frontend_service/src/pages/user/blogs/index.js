import BlogCard from '@/components/BlogCard'
import { useState, useEffect } from 'react'
import { getCookie } from 'cookies-next'
import LeftIcon from '@/svg/LeftIcon'
import RightIcon from '@/svg/RightIcon'
import cookie from 'cookie'
import SearchBar from '@/components/SearchBar'

export default function Index({ data }) {
  const accessToken = getCookie('accessToken')

  const [blogs, setBlogs] = useState(data.blogs)
  const [pageNumber, setPageNumber] = useState(1)
  const [blogCategory, setBlogCategory] = useState('all')
  const [totalPages, setTotalPages] = useState(
    data.totalPages ? data.totalPages : null
  )

  const handleFilter = (e) => {
    setBlogCategory(e.target.value)
    setPageNumber(1)
  }

  const handlePageNumberDecrease = () => {
    if (pageNumber > 1) {
      setPageNumber((pageNumber) => pageNumber - 1)
    }
  }

  const handlePageNumberIncrease = () => {
    if (pageNumber < totalPages) {
      setPageNumber((pageNumber) => pageNumber + 1)
    }
  }

  useEffect(() => {
    const handleNextPagesFetch = async () => {
      const response = await fetch(
        `http://localhost:8001/blogs/category/${blogCategory}/pages/${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      )
      const data = await response.json()

      setBlogs(data.blogs)
    }

    handleNextPagesFetch()
  }, [pageNumber, blogCategory])

  return (
    <>
      <div>
        <div className="sticky top-0 z-10 flex justify-between p-4 mx-40">
          <div className="flex items-center">
            <label className="pr-2" htmlFor="category">
              Filter :
            </label>
            <select
              className="p-1 border-2 rounded-md"
              name="category"
              id="category"
              onChange={(e) => handleFilter(e)}
            >
              <option value="all">All</option>
              <option value="technology">Technology</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="news">News</option>
              <option value="health">Health</option>
            </select>
          </div>
          <div className="flex items-center">
            <SearchBar />
          </div>
        </div>
        <div className="mx-40 h-[70vh] px-4 pb-4 overflow-y-auto">
          <div>
            {blogs?.map((blog) => {
              return (
                <BlogCard
                  key={blog._id}
                  _id={blog._id}
                  title={blog.title}
                  desc={blog.desc}
                  imgSrc={blog.image}
                  createdAt={blog.createdAt}
                />
              )
            })}
          </div>
        </div>
        <div className="h-[4vh] flex items-center justify-center">
          <button
            className={
              pageNumber <= 1
                ? 'text-gray-400 rounded-md border border-gray-400 mx-2 cursor-not-allowed'
                : 'hover:text-gray-400 hover:bg-gray-700  rounded-md border border-gray-400 mx-2'
            }
            onClick={handlePageNumberDecrease}
          >
            <LeftIcon />
          </button>
          <div className="p-2 text-xl font-extrabold"> {pageNumber} </div>
          <button
            className={
              pageNumber >= data.totalPages
                ? 'text-gray-400 rounded-md border border-gray-400 mx-2 cursor-not-allowed'
                : 'hover:text-gray-400 hover:bg-gray-700  rounded-md border border-gray-400 mx-2'
            }
            onClick={handlePageNumberIncrease}
          >
            <RightIcon />
          </button>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { req } = context
  const cookies = cookie.parse(req ? req.headers.cookie || '' : document.cookie)
  const { accessToken, userId } = cookies

  const response = await fetch(
    `http://blog-service:8001/blogs/category/all/pages/1`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
  )
  const data = await response.json()

  const { blogs, totalPages } = data

  return {
    props: {
      data: {
        blogs,
        totalPages: totalPages || null,
      },
    },
  }
}
