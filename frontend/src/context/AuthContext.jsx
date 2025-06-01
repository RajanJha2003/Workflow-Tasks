import React, { createContext, useContext, useEffect } from "react";
import { useState } from "react";

import axios from "axios";

export const authDataContext = createContext();

const AuthContext = ({ children }) => {
  let [userData, setUserData] = useState(null);
  const getCurrentUser = async () => {
    try {
      let result = await axios.get("http://localhost:5000/api/user/current-user", {
        withCredentials: true,
      });
      setUserData(result.data.user);

      console.log(result);
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  useEffect(()=>{
    getCurrentUser();
  },[])

  const values = {
    userData,
    setUserData,
  };
  return (
    <authDataContext.Provider value={values}>
      {children}
    </authDataContext.Provider>
  );
};

export default AuthContext;