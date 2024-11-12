import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <div className="absolute bottom-0 flex items-center justify-center w-full h-8 shadow-md bg-slate-300">
      Design and Developed by &nbsp;
      <span className="font-bold hover:text-gray-600">
        <Link
          href="https://www.linkedin.com/in/ashutosh-s-b8b3a424a/"
          target="_blank"
        >
          @shutoshSonel
        </Link>
      </span>
    </div>
  )
}

export default Footer
