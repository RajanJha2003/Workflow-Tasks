import React from 'react'
import { useContext } from 'react'
import { authDataContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {

    const {userData}=useContext(authDataContext);


    if(!userData){
        return <Navigate to={"/login"} />
    }
  return children;
}

export default ProtectedRoute