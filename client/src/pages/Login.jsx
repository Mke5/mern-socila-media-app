import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { userActions } from '../store/user-slice'

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })

  const  [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeInputHandler = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const loginUser = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, userData, {withCredentials: true})
      if(response.status === 200){
        dispatch(userActions.changeCurrentUser(response?.data?.user))
        localStorage.setItem('currentUser', JSON.stringify(response?.data?.user))
        navigate('/')
      }
    } catch (error) {
      if(error.response){
        setError(error.response?.data?.message)
      }
    }
  }
  
  return (
    <section className="register">
      <div className="container register__container">
        <h2>Sign In</h2>
        <form onSubmit={loginUser}>
          {error && 
            <p className="form__error-message">{error}</p>
          }
          <input type="email" name='email' placeholder='Email:' value={userData.email} onChange={changeInputHandler} autoFocus />
          <div className="password__controller">
            <input type={showPassword ? 'text' : 'password'} name='password' placeholder='Password:' onChange={changeInputHandler} value={userData.password} />
            <span onClick={() => {setShowPassword(!showPassword)}}>{showPassword ? <FaEyeSlash/> : <FaEye />}</span>
          </div>
          <p>Don't have an account? <Link to='/register'>Sign Up</Link></p>
          <button className="btn primary" type='submit'>Login</button>
        </form>
      </div>
    </section>
  )
}

export default Login