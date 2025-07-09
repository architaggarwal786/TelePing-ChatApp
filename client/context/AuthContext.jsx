import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Set token in headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
  }, [token]);

  // Check authentication
  const checkAuth = async () => {
    try {
      const { data } = await axios.get('/api/auth/check');
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const connectSocket = (userData)=>{
    if(!userData || socket?.connected)return;
    const newSocket=io(backendUrl,{
        query: {
            userId: userData._id,
        }
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnline", (users) => {
      setOnlineUsers(users);
    });
  } 

  useEffect(() => {
    checkAuth();
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
