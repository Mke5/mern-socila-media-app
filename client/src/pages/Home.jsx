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
    const logFormData = (formData) => {
      console.log("--- FormData Contents ---");
      
      // Log text fields
      if (formData.has('body')) {
        console.log(`body: "${formData.get('body')}"`);
      }
    
      // Log files
      const images = formData.getAll('images');
      console.log(`Found ${images.length} images:`);
      
      images.forEach((file, index) => {
        console.log(`Image ${index + 1}:`);
        console.log(`  Name: ${file.name}`);
        console.log(`  Type: ${file.type}`);
        console.log(`  Size: ${file.size} bytes`);
        console.log(`  Last modified: ${new Date(file.lastModified).toLocaleString()}`);
      });
      
      console.log("-------------------------");
  };
    logFormData(data)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, data, {withCredentials: true})
      const newPost = response?.data?.data
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
