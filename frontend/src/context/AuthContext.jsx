


import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react'

export const authDatacContext=createContext();





const AuthContext = ({children}) => {
    const [userData,setUserData]=useState(null);

    const getCurrentUser=async()=>{
       try {
         const res=await axios.get("http://localhost:5000/api/user/current-user",{withCredentials:true});

        setUserData(res.data.user);
        console.log(res);
       } catch (error) {
        console.error("Error fetching current user:", error);
        
       }

    }

    useEffect(()=>{
        getCurrentUser();
    },[])

    const values={
        userData,
        setUserData
    }
  return (
    <authDatacContext.Provider value={values}>
        {children}
    </authDatacContext.Provider>
  )
}

export default AuthContext