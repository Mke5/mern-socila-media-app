import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userActions } from '../store/user-slice'
import axios from 'axios'

const Logout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`, {}, {
          withCredentials: true
        }) 

        dispatch(userActions.changeCurrentUser(null)) 
        localStorage.removeItem('currentUser') 
        navigate('/login') 
      } catch (error) {
        console.error('Logout failed', error) 
      }
    } 

    logout() 
  }, [dispatch, navigate]) 

  return null  // or a loading spinner
}
export default Logout
