import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import ProfileImage from './ProfileImage'
import { FaRegCommentDots } from 'react-icons/fa'
import { IoMdShare } from 'react-icons/io'
import axios from 'axios'
import TimeAgo from 'react-timeago'
import LikeDislikePost from './LikeDislikePost'
import TrimText from '../helpers/TrimText'
import BookMarkPost from './BookMarkPost'

const Feed = ({post}) => {
    const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false)
    const userId = useSelector(state => state?.user?.currentUser?.id)

    const location = useLocation()
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
            {showFeedHeaderMenu && userId === post?.creator?._id && location.pathname.includes('users') &&
                <menu className="feed__headermenu">
                    <button onClick={showEditPostModal}>Edit</button>
                    <button onClick={deletePost}>Delete</button>
                </menu>
            }
        </header>
        <Link to={`/posts/${post?._id}`} className='feed__body' >
            <p><TrimText item={post?.body} maxlength={160} /></p>
            {
               post.images.length > 0 && 
                <div className="feed__images">
                    <img src={post?.images[0]} alt="" />
                </div>
            }
           
        </Link>
        <footer className='feed__footer'>
            <div>
                <LikeDislikePost post={post} />
                <button className="feed__footer-component">
                    <Link to={`/posts/${post?._id}`} ><FaRegCommentDots /> </Link>
                    <small>{post?.comments?.length}</small>
                </button>
                <button className="feed__footer-share">
                    <IoMdShare />
                </button>
            </div>
            <BookMarkPost post={post} />
        </footer>
    </article>
  )
}

export default Feed