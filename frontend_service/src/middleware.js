import { NextResponse } from 'next/server'

function middleware(request) {
  const cookies = request.cookies
  const accessToken = cookies.get('accessToken')
  const url = request.url

  let isLoggedSession = false

  if (accessToken !== undefined || accessToken === {}) isLoggedSession = true

  // console.log(accessToken)

  if (
    !isLoggedSession &&
    url.includes('/user') &&
    !url.includes('/user/login') &&
    !url.includes('/user/signup')
  ) {
    return NextResponse.redirect(new URL('/user/login', request.url))
  }

  // if (!isLoggedSession && url.includes('/') && !url.includes('/client')) {
  //   return NextResponse.redirect(new URL('/client', request.url))
  // }

  if (isLoggedSession && url.includes('/user/login')) {
    return NextResponse.redirect(new URL('/user/blogs', request.url))
  }

  if (isLoggedSession && url.includes('/user/signup')) {
    return NextResponse.redirect(new URL('/user/blogs', request.url))
  }

  // Add a default response in case no redirect is needed
  return NextResponse.next()
}

const config = {
  matcher: '/user/:path*',
}

module.exports = {
  middleware,
  config,
}
