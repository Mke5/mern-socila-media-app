import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileImage from './ProfileImage'
import axios from 'axios'
import TimeAgo from 'react-timeago'

const Feed = (post) => {
    // const [creator, setCreator] = useState({})


    // const getPostCreator = async () => {
    //     try{
    //         const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${post?.creator}`, {withCredentials: true})
    //         setCreator(response?.data)
    //     }catch(error){
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     getPostCreator()
    // }, [])
    // console.log(post.body)
  return (
    <article className="feed">
        <header className="feed__header">
            <Link to={`/users/${post?.creator?._id}`} className='feed__header-profile' >
                <ProfileImage image={post?.creator?.profilePhoto} />
                <div className="feed__header-details">
                    <h4>{post?.creator?.fullName}</h4>
                    <small><TimeAgo date={post?.createdAt} /></small>
                </div>
            </Link>
            {showFeedMenu && userId === }
        </header>
    </article>
  )
}

export default Feed