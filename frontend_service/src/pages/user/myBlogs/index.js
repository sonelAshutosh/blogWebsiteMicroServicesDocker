import Link from 'next/link'
import cookie from 'cookie'
import BlogCard from '@/components/BlogCard'

export default function index({ data }) {
  const { userBlogs } = data
  return (
    <>
      <div className="mx-40 h-[85vh] p-4 overflow-y-auto">
        {userBlogs.map((blog) => {
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
      <Link href="/user/myBlogs/new">
        <div className="absolute flex items-center justify-center px-8 py-2 text-lg font-bold rounded-lg bottom-12 right-10 bg-slate-400 hover:bg-slate-600 hover:text-slate-400">
          + New
        </div>
      </Link>
    </>
  )
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req ? req.headers.cookie || '' : document.cookie)
  const { accessToken, userId } = cookies

  const response = await fetch(
    `http://blog-service:8001/blogs/users/${userId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
  )
  const userBlogs = await response.json()

  return {
    props: {
      data: userBlogs,
    },
  }
}
