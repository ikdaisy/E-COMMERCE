import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Api from '../Api'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Scart = ({ setUser,setProfile}) => {
    const {_id}=useParams()
    console.log(_id);
    
  useEffect(() => {
    fetchProducts()
  }, []);
  
  const token = localStorage.getItem('Token');
  const api= Api()
  const navigate = useNavigate()
  const [cartItem, setCartItem] = useState({});
  const [product, setProduct] = useState({});

  const [selectedAddress, setSelectedAddress] = useState('');
  const [image,setImage]=useState('')
  const [addresses,setAddresses] = useState([]);
  const [priceTotal, setPriceTotal] = useState(0); // Holds the total price


  const handleIncrement = async (id) => {
    try {
      // Optimistically update the UI
      setCartItem((prevItem) => ({
        ...prevItem,
        quantity: prevItem._id === id ? prevItem.quantity + 1 : prevItem.quantity,
      }));
  
      // Update the quantity on the server
      await axios.put(
        `${api}/updatequantity`,
        { cartItemId: id, action: 'increment' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Refetch the product to ensure data consistency
      fetchProducts();
    } catch (error) {
      console.error("Error incrementing quantity:", error);
      alert("Failed to increment quantity. Please try again.");
    }
  };
  
  const handleDecrement = async (id) => {
    try {
      setCartItem((prevItem) => ({
        ...prevItem,
        quantity:
          prevItem._id === id && prevItem.quantity > 1
            ? prevItem.quantity - 1
            : prevItem.quantity,
      }));
  
      await axios.put(
        `${api}/updatequantity`,
        { cartItemId: id, action: 'decrement' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      fetchProducts();
    } catch (error) {
      console.error("Error decrementing quantity:", error);
      alert("Failed to decrement quantity. Please try again.");
    }
  };
  
 

  const tax = priceTotal * 0.1;
  const totalWithTax = priceTotal + tax;

  const handlePlaceOrder = async() => {
    // console.log(selectedAddress);
    
    if(selectedAddress){
      // alert('Order placed successfully!');
      try {
        
       


        const { status, data } = await axios.post(
          `${api}/buynow`,
          {selectedAddress, productId:product._id, size:cartItem.size, quantity:cartItem.quantity,totalWithTax}, 
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
        alert(error.response.data.msg);
        
        
      }

    }
    else {
      alert("Please select an address.");
  }
  };

  const fetchProducts = async () => {
    if (token) {
    try {
     
        const res = await axios.get(`${api}/getsinglecart/${_id}`, { headers: { "Authorization": `Bearer ${token}` } });
        console.log(res.data.cart);
        setUser(res.data.username);
        setProfile(res.data.profile)
        setCartItem(res.data.cart);
        setProduct(res.data.cart.product)
        
        
        setImage(res.data.cart.product.photo[0])
        setAddresses(res.data.addresses)
        setPriceTotal(res.data.cart.product.price * res.data.cart.quantity);
      
    } catch (error) {
      console.error(error);
    }
  }
  else{
    navigate('/signin')
  }
  };


  if (cartItem.length === 0) {
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
       
            <div
              key={cartItem._id}
              className="flex items-center bg-white p-4 mb-4 rounded-lg shadow-sm"
            >
              <img src={image} 
                className="w-20 h-20 rounded-lg object-cover mr-4"
              />
             <div className="flex-grow">
  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
  <div className="flex items-center mt-1">
    <span className="text-sm font-medium text-gray-600 mr-2">Size:</span>
    <span className="px-2 py-1 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg">
      {cartItem.size}
    </span>
  </div>
  <p className="text-red-700 font-bold mt-2">${product.price}</p>
</div>

              <div className="flex items-center space-x-4">
                {cartItem.quantity > 1 && (
                  <button
                    onClick={() => handleDecrement(cartItem._id)}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                )}
                <span className="text-lg">{cartItem.quantity}</span>
                <button
                  onClick={() => handleIncrement(cartItem._id)}
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
                
              </div>
            </div>
        
        </div>

        {/* Billing Card */}
        <div className="bg-white h-96 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Billing Details</h2>
          <p className="text-gray-700 mb-2">Subtotal: <span className="text-xl font-semibold">${priceTotal.toFixed(2)}</span></p>
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

export default Scart;
