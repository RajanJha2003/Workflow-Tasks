import React from 'react'
import { useContext } from 'react'
import { authDatacContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {

    const {userData}=useContext(authDatacContext);


    if(!userData){
        <Navigate to={"/login"} />
    }
  return (
    <div>PublicRoute</div>
  )
}

export default ProtectedRoute