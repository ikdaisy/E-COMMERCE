import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../Api';

const Home = ({setUser}) => {
  const navigate=useNavigate()
  const api = Api()
  const token = localStorage.getItem("Token")

  useEffect(()=>{
      fetchData()
    },[])
  
    const fetchData=async()=>{
    if(token){
      try {
        const res=await axios.get(`${api}/getuser`,{headers:{"Authorization":`Bearer ${token}`}})
        console.log(res);
        setUser(res.data.username)
      
       } catch (error) {
        console.log(error);
        navigate('/signin')
       }
    }
    else{
      navigate('/signin')


    }
      
  
    }
  

  return (
   <></>
  );
};

export default Home;
