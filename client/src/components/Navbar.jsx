import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'
import ProfileImage from './ProfileImage'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.user.currentUser)
  const userId = currentUser?.id
  const profilePhoto = currentUser?.profilePhoto
  useEffect(() => {
    if(!currentUser){
      navigate('/login')
    }
  }, [])
  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <Link to='/' className='navbar__logo'>Mke5</Link>
        <form className='navbar__search'>
          <input type="search" placeholder='Search'/>
          <button type="submit"><CiSearch /></button>
        </form>
        <div className="navbar__right">
          <Link to={`/users/${userId}`} className='navbar__profile'>
            <ProfileImage image={profilePhoto} />
          </Link>
          {
            currentUser ? <Link to='/logout'>Logout</Link> : <Link to='/login'>Login</Link>
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar