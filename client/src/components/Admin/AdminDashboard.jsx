import React from 'react'
import AdminAlumniRequests from './AdminAlumniRequests'
import AdminNavbar from './AdminNavbar'

const AdminDashboard = () => {
  return (
    <>
        <AdminNavbar/>
    <div className=''>
        <AdminAlumniRequests/>
    </div>   
    </>
  )
}

export default AdminDashboard
