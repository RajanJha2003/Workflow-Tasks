import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { authDataContext } from '../context/AuthContext';

const Login = () => {

  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const {userData,setUserData}=useContext(authDataContext);

  const navigate=useNavigate();


  const handleSubmit=async(e)=>{
    try {
      e.preventDefault();

    const res=await axios.post("http://localhost:5000/api/user/login",{
      email,password
    },{withCredentials:true})

    console.log(res);
    setUserData(res.data);
    navigate("/");

    setEmail('');
    setPassword('');
    } catch (error) {
      console.log(error);
      
    }

  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4 ' >
        <h2 className='text-2xl font-bold text-center text-blue-600'>Login</h2>
        <input type="text" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} className='w-full p-3 border rounded border-gray-300' />
        <input type="text" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} className='w-full p-3 border rounded border-gray-300' />
       <button type='submit' 
       className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'
       >
        Login
       </button>
       <p className='text-sm text-center'>
        Don&apos;t have an account?
        <Link className='text-blue-600 hover:underline' to={"/sign-up"}>Sign Up here</Link>
       </p>
      </form>
    </div>
  )
}

export default Login