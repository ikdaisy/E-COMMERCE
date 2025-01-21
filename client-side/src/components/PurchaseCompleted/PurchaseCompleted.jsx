import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Api from '../Api';


const PurchaseCompleted = ({setUser,setType,setProfile}) => {
    const navigate=useNavigate()
    const api= Api()
    const token = localStorage.getItem('Token')
    useEffect(()=>{
        fetchData()
      },[])
    
      const fetchData=async()=>{
      if(token){
        try {
          const res=await axios.get(`${api}/getuser`,{headers:{"Authorization":`Bearer ${token}`}})
          console.log(res);
          setUser(res.data.username)
          setProfile(res.data.profile)
        
          setType(res.data.accountType)
        
         } catch (error) {
          console.log(error);
          // navigate('/signin')
         }
      }
      else{
        navigate('/signin')
  
  
      }
        
    
      }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Completed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={() => navigate('/') }
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PurchaseCompleted;
