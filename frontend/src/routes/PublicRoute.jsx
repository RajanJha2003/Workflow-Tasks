import React from 'react'
import { useContext } from 'react'
import { authDatacContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

const PublicRoute = () => {

    const {userData}=useContext(authDatacContext);


    if(userData){
        <Navigate to={"/"} />
    }
  return (
    <div>PublicRoute</div>
  )
}

export default PublicRoute