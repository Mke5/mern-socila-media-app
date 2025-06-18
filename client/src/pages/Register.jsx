import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from 'axios'

const Register = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const  [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const changeInputHandler = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }

  const registerUser = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData)
      if(response.status === 201){
        navigate('/login')
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
        <h2>Sign Up</h2>
        <form onSubmit={registerUser}>
          {error && 
            <p className="form__error-message">{error}</p>
          }
          <input type="text" name='fullName' placeholder='Full Name:' value={userData.fullName} onChange={changeInputHandler} autoFocus />
          <input type="email" name='email' placeholder='Email:' value={userData.email} onChange={changeInputHandler} />
          <div className="password__controller">
            <input type={showPassword ? 'text' : 'password'} name='password' placeholder='Password:' onChange={changeInputHandler} value={userData.password} />
            <span onClick={() => {setShowPassword(!showPassword)}}>{showPassword ? <FaEyeSlash/> : <FaEye />}</span>
          </div>
          <div className="password__controller">
            <input type={showPassword ? 'text' : 'password'} name='confirmPassword' placeholder='Confirm Password:' onChange={changeInputHandler} value={userData.confirmPassword} />
            <span onClick={() => {setShowPassword(!showPassword)}}>{showPassword ? <FaEyeSlash/> : <FaEye />}</span>
          </div>
          <p>Already have an account? <Link to='/login'>Sign In</Link></p>
          <button className="btn primary" type='submit'>Register</button>
        </form>
      </div>
    </section>
  )
}

export default Register
