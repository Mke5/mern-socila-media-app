import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Widget from './components/Widget'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div>
       <Navbar />
       <main className="main">
            <div className="container main__container">
                <Sidebar />
                <Outlet />
                <Widget />
            </div>
        </main> 
    </div>
  )
}

export default RootLayout