import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Api from '../Api'
import { Link, useNavigate } from 'react-router-dom'

const Cart = ({ setUser }) => {
  useEffect(() => {
    fetchProducts()
  }, []);
  
  const token = localStorage.getItem('Token');
  const api= Api()
  const navigate = useNavigate()
  const [cart, setCart] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [addresses,setAddresses] = useState([]);

  const handleIncrement =async (id) => {
    
    try {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      const { data } = await axios.put(
        `${api}/updatequantity`,
        { cartItemId: id, action: 'increment' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Fetch updated cart data after increment
      fetchProducts();
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const handleDecrement = async(id) => {
    
    try {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      )
      const { data } = await axios.put(
        `${api}/updatequantity`,
        { cartItemId: id, action: 'decrement' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Fetch updated cart data after decrement
      fetchProducts();
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    }
  };

  const handleRemove = async(_id) => {
    // setCart((prevCart) => prevCart.filter((item) => item._id !== id));
    if(confirm('Are you sure to delete this product?')){
      try {
        const { data } = await axios.delete(`${api}/deletecart/${_id}`);
        alert(data.msg)
        fetchProducts()
      } catch (error) {
        console.log(error);
      }
    }

  };

  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = totalPrice * 0.1;
  const totalWithTax = totalPrice + tax;

  const handlePlaceOrder = async() => {
    // console.log(selectedAddress);
    
    if(selectedAddress){
      // alert('Order placed successfully!');
      try {
        const { status, data } = await axios.post(
          `${api}/placeorder`,
          {selectedAddress,totalWithTax}, 
          {
              headers: {
                  "Authorization": `Bearer ${token}`,
              },
          }
      );

      if (status === 201) {
            navigate('/purchasecompleted')
      } else {
          alert("Order placement failed. Please try again.");
      }

        
      } catch (error) {
        console.log(error);
        
        
      }

    }
    else {
      alert("Please select an address.");
  }
  };

  const fetchProducts = async () => {
    if (token) {
    try {
     
        const res = await axios.get(`${Api()}/getcart`, { headers: { "Authorization": `Bearer ${token}` } });
        console.log(res);
        setUser(res.data.username);
        setCart(res.data.cart);
        setAddresses(res.data.address)
      
    } catch (error) {
      console.error(error);
    }
  }
  else{
    navigate('/signin')
  }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">It looks like you haven't added anything to your cart yet.</p>
        <Link to={'/'}>
        <button
          // Replace '/shop' with your shopping page route
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back to Shopping
        </button>
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cart.map((dt) => (
            <div
              key={dt.product._id}
              className="flex items-center bg-white p-4 mb-4 rounded-lg shadow-sm"
            >
              <img
                src={dt.product.photo[0]}
                alt={dt.product.name}
                className="w-20 h-20 rounded-lg object-cover mr-4"
              />
            <div className="flex-grow">
  <h3 className="text-lg font-semibold text-gray-800">{dt.product.name}</h3>
  <div className="flex items-center mt-1">
    <span className="text-sm font-medium text-gray-600 mr-2">Size:</span>
    <span className="px-2 py-1 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg">
      {dt.size}
    </span>
  </div>
  <p className="text-red-700 font-bold mt-2">${dt.product.price}</p>
</div>

              <div className="flex items-center space-x-4">
                {dt.quantity > 1 && (
                  <button
                    onClick={() => handleDecrement(dt._id)}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                )}
                <span className="text-lg">{dt.quantity}</span>
                <button
                  onClick={() => handleIncrement(dt._id)}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(dt._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Billing Card */}
        <div className="bg-white h-96 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Billing Details</h2>
          <p className="text-gray-700 mb-2">Subtotal: <span className="text-xl font-semibold">${totalPrice.toFixed(2)}</span></p>
          <p className="text-gray-700 mb-2">Tax (10%): <span className="text-xl font-semibold">${tax.toFixed(2)}</span></p>
          <p className="text-gray-700 mb-2">Total: <span className="text-xl font-semibold">${totalWithTax.toFixed(2)}</span></p>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Address
            </label>
            <div className="space-y-2">
              {addresses.map((address, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`address-${index}`}
                    name="address"
                    value={address._id}
                    checked={selectedAddress === address._id}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor={`address-${index}`} className="text-sm text-gray-700">
                    {address.house} {address.place} {address.pincode}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
