import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import CreatPost from '../components/CreatePost'
import Feeds from '../components/Feeds'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const user = useSelector((state) => state?.user?.currentUser)

  const createPost = async (data) => {
    setError(null)
    logFormData(data)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, data, {withCredentials: true})
      const newPost = response?.data?.data
      console.log(newPost)
      setPosts([newPost, ...posts])
    } catch (error) {
      setError(error?.response?.data?.message)
    }
  }

  const getPosts = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {withCredentials: true})
      setPosts(response?.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPosts
  }, [setPosts])

  console.log(posts)
  return (
    <section className="mainArea">
      <CreatPost onCreatePost={createPost} error={error} />
      <Feeds posts={posts} onSetPosts={setPosts} />
    </section>
  )
}

export default Home
