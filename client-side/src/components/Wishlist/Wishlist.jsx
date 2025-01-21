import React, { useEffect, useState } from "react";
import Api from "../Api";
import axios from "axios";
import Swal from 'sweetalert2';

import { useNavigate,Link } from "react-router-dom";
const Wishlist = ({setUser,setProfile}) => {
  const navigate = useNavigate()
  const token = localStorage.getItem("Token")
 const [wishlist,setWishlist]=useState([])

 useEffect(()=>{
  fetchWishlist()
 },[])

 const fetchWishlist=async()=>{
 if(token){
  try {
    const res = await axios.get(`${Api()}/getwishlist`,{headers: { Authorization: `Bearer ${token}` }})
    console.log(res);
    setUser(res.data.username)
    setWishlist(res.data.products)
    setProfile(res.data.profile)
    
    
  } catch (error) {
    console.log(error);
    
    
  }
 }
 else{
  navigate("/signin")

 }
 }

 const removeFromWishlist=async(id)=>{
 
  try {
    console.log("haha");
    
     const res = await axios.delete(`${Api()}/removewishlist/${id}`, {headers: { Authorization: `Bearer ${token}` }});
     console.log(res);
    //  alert(res.data.msg)
     Swal.fire({
                     title: 'Success!',
                     text: `${res.data.msg}`,
                     icon: 'success',
                     confirmButtonText: 'OK',
                     customClass: {
                       popup: 'bg-white rounded-lg shadow-md ',
                       title: 'text-lg font-semibold text-gray-800',
                       htmlContainer: 'text-sm text-gray-600',
                       confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
                     },
                   });
     fetchWishlist()
     
  } catch (error) {
    console.log(error);
    
    
  }
  


 }

 
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        My Wishlist
       
      </h1>
      {wishlist.length > 0 ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={item.photo[0]}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  {item.name}
                </h2>
                <p className="text-red-500">${item.price}</p>
                <button className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition" onClick={()=>removeFromWishlist(item._id)}>
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
  {/* SVG Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-24 h-24 text-gray-400 mb-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h18M9 6h6M9 10h6m-9 4h9m-12 4h15M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>

  {/* Message */}
  <p className="text-xl text-gray-600 mb-4">Your wishlist is empty!</p>

  {/* Button */}
  <Link to={'/'}>
    <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition">
      Start Shopping
    </button>
  </Link>
</div>

      )}
    </div>
  );
};

export default Wishlist;
