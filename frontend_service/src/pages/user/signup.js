import { useRouter } from 'next/router'
import { resolve } from 'styled-jsx/css'

export default function Signup() {
  const router = useRouter()
  const handleSignup = (e) => {
    e.preventDefault()

    const data = new FormData(e.target)

    const name = data.get('name')
    const email = data.get('email')
    const password = data.get('password')

    fetch('http://localhost:8000/users/signUp', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => {
      if (res.status === 201) router.push('/user/login')
    })
  }
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-slate-400">
      <div className="h-1/2 w-[80%] flex flex-col items-center justify-center bg-white rounded-md shadow-sm md:w-1/2 lg:w-1/4">
        <h1 className="m-5 text-lg font-bold">Sign Up</h1>
        <form className="flex flex-col" onSubmit={handleSignup} method="post">
          <input
            className="p-2 m-2 border border-gray-400 border-solid rounded-md"
            type="text"
            name="name"
            id="name"
            placeholder="Enter your Name"
            required
          />
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
            Sign Up
          </button>
        </form>
        <p
          onClick={() => {
            router.push('/user/login')
          }}
          className="py-1 font-semibold text-gray-400 cursor-pointer hover:text-gray-950"
        >
          Already have a Account ?{' '}
        </p>
      </div>
    </div>
  )
}

Signup.getLayout = function PageLayout(page) {
  return <>{page} </>
}
