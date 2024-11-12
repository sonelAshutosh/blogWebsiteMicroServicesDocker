import { getCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

function SearchBar() {
  const router = useRouter()
  const accessToken = getCookie('accessToken')

  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState([])

  const handleSearchingTrue = () => {
    setIsSearching(true)
  }

  const handleSearchingFalse = () => {
    setIsSearching(false)
  }

  const handleBlogClick = (blogId) => {
    router.push(`/user/blogs/${blogId}`)
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
  }

  const handleValueChange = (e) => {
    fetch(
      `http://localhost:8001/blogs/search/searchByTitle/${e.target.value}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        // console.log(res.searchResults)
        setSearchResult(res.searchResults)
      })
  }

  return (
    <div className="relative">
      <input
        type="text"
        className="border-2 p-2 px-4 rounded-lg w-[20rem]"
        placeholder="Find a Blog"
        onFocus={handleSearchingTrue}
        onBlur={handleSearchingFalse}
        onChange={handleValueChange}
      />
      {isSearching ? (
        <div
          className="absolute h-[20rem] w-[20rem] bg-gray-100 transition-all duration-300 ease-in-out border border-gray-300 shadow-xl rounded-lg px-4 p-2 overflow-y-auto overflow-visible"
          onMouseDown={handleMouseDown}
        >
          {searchResult?.map((result) => {
            return (
              <div
                key={result._id}
                className="p-2 m-1 border-b-4 rounded-lg hover:bg-gray-200"
                onClick={() => handleBlogClick(result._id)}
              >
                {result.title}
              </div>
            )
          })}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default SearchBar
