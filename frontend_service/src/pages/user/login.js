import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'

export default function Signin() {
  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()

    const data = new FormData(e.target)

    const email = data.get('email')
    const password = data.get('password')

    fetch('http://localhost:8000/users/signIn', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.cookie)
        if (res.accessToken === undefined || res.userId === undefined) {
          router.push('/user/login')
        } else {
          setCookie('accessToken', res.accessToken, { maxAge: 3600 })
          setCookie('userId', res.userId, { maxAge: 3600 })
          router.push('/user/blogs')
        }
      })
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-400">
      <div className="h-1/2 w-[80%] flex flex-col items-center justify-center bg-white rounded-md shadow-sm md:w-1/2 lg:w-1/4">
        <h1 className="m-5 text-lg font-bold">Login</h1>
        <form className="flex flex-col" onSubmit={handleLogin} method="post">
          {/* <input type="text" name="name" id="name" placeholder="Enter your Name" /> */}
          <input
            className="p-2 m-2 border border-gray-400 border-solid rounded-md"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your Email"
            required
          />
          <input
            className="p-2 m-2 border border-gray-400 border-solid rounded-md"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your Password"
            required
          />
          <button
            className="px-4 py-2 m-2 bg-green-300 rounded-lg shadow-md hover:bg-green-500"
            type="submit"
          >
            Login
          </button>
        </form>
        <p
          onClick={() => {
            router.push('/user/signup')
          }}
          className="py-1 font-semibold text-gray-400 cursor-pointer hover:text-gray-950"
        >
          Don&apos;t have a Account ?
        </p>
      </div>
    </div>
  )
}

Signin.getLayout = function PageLayout(page) {
  return <>{page} </>
}
