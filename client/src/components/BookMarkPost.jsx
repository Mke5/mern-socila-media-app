import React, { useEffect, useState } from 'react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import axios from 'axios'

const BookMarkPost = ({post}) => {
    const [user, setUser] = useState({})
    const  [postBookmarked, setPostBookMarked] = useState(user?.bookmarks?.includes(post?._id))
    const userId = useSelector(state => state?.user?.currentUser?.id)

    const getUser = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {withCredentials: true})
            setUser(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const createBookmark = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`, {withCredentials: true})
            if(response?.data?.bookmarks?.includes(post?._id)){
                setPostBookMarked(true)
            }else{
                setPostBookMarked(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [user, postBookmarked])
  return (
    <button className="feed__footer-bookmark" onClick={createBookmark}>
        {postBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  )
}

export default BookMarkPost