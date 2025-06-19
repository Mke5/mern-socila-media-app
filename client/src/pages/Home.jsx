import React, { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import CreatPost from '../components/CreatePost'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const user = useSelector((state) => state?.user?.currentUser)

  const createPost = async (data) => {
    setError(null)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, data, {withCredentials: true})
      const newPost = response?.data
      setPosts([newPost, ...posts])
    } catch (error) {
      setError(error?.response?.data?.message)
    }
  }
  return (
    <section className="mainArea">
      <CreatPost onCreatePost={createPost} error={error} />
    </section>
  )
}

export default Home
