import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Api from '../Api'
import { useNavigate } from 'react-router-dom'

const Orders = ({ setUser, setType,setProfile }) => {
  const token = localStorage.getItem('Token');
  const api = Api();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (token) {
      try {
        const res = await axios(`${api}/getorders`, { headers: { "Authorization": `Bearer ${token}` } });
        setUser(res.data.username);
        setType(res.data.accountType);
        setProfile(res.data.profile)
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    } else {
      navigate('/signin');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">No Orders Found</h2>
        <p className="text-gray-600 mb-8 text-lg">You haven't placed any orders yet.</p>
        <button
          onClick={() => navigate('/')} // Redirect to shopping page
          className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl text-center font-semibold mb-8 text-gray-800">My Orders</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Order ID: <span className="text-blue-600">{order._id}</span>
              </h3>
              <p className="text-gray-700 font-medium mb-2">Product Name: <span className="text-blue-600 font-bold">{order.product.name}</span></p>
              <div className="text-gray-700 font-medium mb-4">
                <p>Shipping Address:</p>
                <p>{order.address.house}, {order.address.place}, {order.address.pincode}</p>
              </div>
              <p className="text-gray-700 font-medium mb-3">Total Amount: <span className="text-red-600 font-bold">{order.totalPrice}</span></p>
              <p className="text-gray-700 font-medium mb-3">Ordered Date: <span className="text-green-600 font-bold">{formatDate(order.createdAt)}</span></p>
              
              {/* Display Order Status */}
              <p className="text-gray-700 font-medium mb-4">
                Status: <span className={`font-bold ${order.status === 'Pending' ? 'text-yellow-600' : order.status === 'Shipped' ? 'text-blue-600' : 'text-green-600'}`}>
                  {order.status}
                </span>
              </p>

              <button
                onClick={() => navigate(`/displayproduct/${order.product._id}`)}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition duration-300 ease-in-out"
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
