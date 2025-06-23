import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaRegHeart } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { FcLike } from 'react-icons/fc'

const LikeDislikePost = (props) => {
  const [post, setpost] = useState(props.post)
  const userId = useSelector(state => state?.user?.currentUser?.id)
  const [postLiked, setPostLiked] = useState(post?.likes?.includes(userId))

  const handleLikeDislikePost = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, {withCredentials: true})
      setpost(response?.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCheckIfUserLikedPost = () => {
    if(post?.likes?.includes(userId)){
      setPostLiked(true)
    }else{
      setPostLiked(false)
    }
  }

  useEffect(() => {
    handleCheckIfUserLikedPost()
  }, [post])

  return (
    <button className="feed__footer-comments" onClick={handleLikeDislikePost}>
      {postLiked ? <FcLike /> : <FaRegHeart /> }
      <small>{post?.likes?.length}</small>
    </button>
  )
}

export default LikeDislikePost