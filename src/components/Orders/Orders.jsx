import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Api from '../Api'
import { Link, useNavigate } from 'react-router-dom'

const Orders = ({setUser,setType}) => {
  const token = localStorage.getItem('Token');
  const api= Api()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState({});


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
   if(token){
    try {
      // Replace with your API endpoint
      const res = await axios(`${api}/getorders`, { headers: { "Authorization": `Bearer ${token}` } });
     console.log(res);
     setUser(res.data.username)
     setType(res.data.accountType)
     setOrders(res.data.orders)

    
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
   }
   else{
    navigate('/signin')
   }
  };


  
  if (orders.length == 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Found</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <button
          onClick={() => navigate('/')} // Redirect to shopping page
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Order ID: <span className="text-blue-600">{order._id}</span>
              </h3>
              <p className="text-grey-900 font-semibold mb-1">Product Name: <span className='text-blue-600 font-bold'>{order.product.name}</span></p>
              <p className="text-gray-900 font-semibold mb-1"> Shipping Address: <span className='text-blue-600 font-bold'>{order.address.house},</span>
              <p className='text-blue-600 font-bold'>{order.address.place},</p>
              <p className='text-blue-600 font-bold'> {order.address.pincode}.</p>

              </p>
             
              <p className="text-gray-900 mb-1 font-semibold">Total Amount: <span className='text-red-600 font-bold'>{order.totalPrice}</span></p>
              <p className="text-gray-900 mb-1 font-semibold">Ordered Date: <span className='text-green-600 font-bold'>{order.createdAt}</span></p>
             
              <button
                onClick={() => navigate(`/displayproduct/${order.product._id}`)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
