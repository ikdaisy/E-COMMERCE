import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../Api';

const Home = ({setUser,setType}) => {
  const navigate=useNavigate()
  const api = Api()
  const token = localStorage.getItem("Token")
  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");





  useEffect(()=>{
      fetchData()
    },[])
  
    const fetchData=async()=>{
    if(token){
      try {
        const res=await axios.get(`${api}/home`, { headers: { "authorization": `Bearer ${token}` } })
        console.log(res);
        setUser(res.data.username)
        setProducts(res.data.products)
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
const filterProducts= products.filter((product)=>product.name.toLowerCase().startsWith(searchQuery.toLowerCase()))

  

  return (
    <div className="container mx-auto p-6">
    {/* Search Input */}
    <div className="mb-6">
      <input
        type="text"
        placeholder="Filter products..." onChange={(e)=>setSearchQuery(e.target.value)}
        className=" w-2/4 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Product Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      
        {filterProducts.map((dt)=><Link to={`displayproduct/${dt._id}`}><div  className="border cursor-pointer border-gray-200 rounded-lg overflow-hidden shadow-md">
          <img
            src={dt.photo[0]} className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800">{dt.name}</h3>
            <p className="text-gray-600">{dt.category}</p>
            <p className="text-lg font-bold text-red-900">${dt.price}</p>
          </div>
        </div></Link>)}
    
    
    </div>
    { filterProducts.length==0 && (
      <p  className="text-xl text-gray-600 mt-4">No products found !!</p>
    )}
  </div>
  );
};

export default Home;
