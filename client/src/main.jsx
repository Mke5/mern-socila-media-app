import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


// import axios from 'axios'

// axios.defaults.withCredentials = true
// axios.defaults.baseURL = import.meta.env.VITE_API_URL // optional but helpful
