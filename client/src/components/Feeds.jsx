import React from 'react'
import Feed from './Feed'

const Feeds = ({posts, onSetPosts}) => {
  return (
    <div className="feeds">
        {
            posts?.length < 1 ? <p className="center">No posts yet</p> : posts.map((post) => <Feed key={post?._id} post={post} />)
        }
        <p className="center"></p>
    </div>
  )
}

export default Feeds