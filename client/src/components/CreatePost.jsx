import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ProfileImage from '../components/ProfileImage'
import { SlPicture } from 'react-icons/sl'

const CreatePost = ({onCreatePost, error}) => {
    const [body, setBody] = useState('')
    const [images, setImages] = useState([])
    const profilePhoto = useSelector((state) => state?.user?.currentUser?.profilePhoto)
    const createPost = (e) => {
      e.preventDefault()
      const postData = new FormData()
      postData.set('body', body)
      for (let i = 0; i < images.length; i++) {
        postData.append('images', images[i])
      }
      setBody('')
      setImages([])
    }
  return (
    <form className="createPost" encType='multipart/form-data' onSubmit={createPost}>
        {error && <p className="createPost__error-message">{error}</p>}
        <div className="createPost__top">
            <ProfileImage image={profilePhoto}/>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What's on your mind?" />
        </div>
        <div className="createPost__bottom">
            <span></span>
            <div className="createPost__actions">
                <label htmlFor="image"><SlPicture /></label>
                <input name="images" type="file" id='image' onChange={(e) => setImages([...e.target.files])} multiple/>
                <button type='submit'>Post</button>
            </div>
        </div>
    </form>
  )
}

export default CreatePost