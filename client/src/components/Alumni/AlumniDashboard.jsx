import React from 'react'
import Chat from '../../components/Chat/Chat'
import AdminNavbar from '../Admin/AdminNavbar'
import AlumniNavbar from './AlumniNavbar'
import Sidebar from './Sidebar'
import ConnectionsSidebar from './ConnectionsSidebar'
import Feed from './Feed'

const AlumniDashboard = () => {
  return (
    <div>
      <AlumniNavbar/>
      
      <div className="flex flex-1">
        <Sidebar />
        <Feed />
        <ConnectionsSidebar />
      </div>
      {/* <Chat/> */}
    </div>
  )
}

export default AlumniDashboard
