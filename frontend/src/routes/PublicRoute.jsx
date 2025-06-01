import React from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}) => {

    const {userData}=useContext(authDataContext);


    if(userData){
       return <Navigate to={"/"} />
    }
  return children;
}

export default PublicRoute