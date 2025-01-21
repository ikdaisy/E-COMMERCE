
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../Api';
import axios from 'axios';

const Nav = ({user,setUser,type,cartCount,setCartCount,profile}) => {
    const navigate = useNavigate()
    const api = Api()
  const token = localStorage.getItem("Token")
  const [userData,setUserData]=useState({})
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsDropdownVisible(!isDropdownVisible);
  };

  const hideDropdown = () => {
    setIsDropdownVisible(false);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (event.target.closest('#profile-btn') || event.target.closest('#dropdown')) return;
    hideDropdown();
  };

  // Use effect hook to add and remove event listener for body click
  React.useEffect(() => {
    document.body.addEventListener('click', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(()=>{
    fetchCartCount()
  },[])

  const fetchCartCount=async()=>{
  if(token){
    try {
      const res=await axios.get(`${api}/getcartcount`, { headers: { "authorization": `Bearer ${token}` } })
      console.log(res);
      setCartCount(res.data.cartCount)
    
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
    <div className="bg-blue-900 py-2 shadow-lg">
  <header>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between flex-wrap">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <h2 className="text-white text-3xl font-bold">MIRAE</h2>
        </Link>

        {/* Welcome Text (Hidden on very small screens) */}
        <span className="hidden md:block text-white text-xl sm:text-2xl md:text-3xl">
          Welcome, {user}
        </span>

        {/* Icons Section */}
        <div className="flex items-center space-x-4">
          {/* User Type */}
          <span className="hidden sm:block text-white text-lg sm:text-xl">{type}</span>

          {/* Cart Icon */}
          <Link to="/cart">
            <button
              title="Cart"
              className="relative p-2 text-white hover:text-blue-300 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.857 5.143M7 13h10l4-8H6.857M7 13l-2 6h16m-14 0a2 2 0 104 0m6 0a2 2 0 104 0"
                />
              </svg>
              {/* Cart Badge */}
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              id="profile-btn"
              className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-gray-300 focus:outline-none"
              onClick={toggleDropdown}
            >
              <img
                alt="User Icon" src={profile}
                className="w-full h-full object-cover rounded-full"
              />
            </button>

            {/* Dropdown Menu */}
            <div
              id="dropdown"
              className={`absolute right-0 w-40 mt-2 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${
                isDropdownVisible ? '' : 'hidden'
              }`}
            >
              <div className="py-1">
                <Link
                  className="text-gray-700 block px-4 py-2 text-base hover:bg-gray-100 rounded-md transition-colors duration-200"
                  to={`/profile`}
                >
                  Profile
                </Link>
                <a
                  onClick={() => {
                    localStorage.removeItem('Token');
                    setUser('');
                    navigate('/signin');
                  }}
                  className="text-gray-700 cursor-pointer block px-4 py-2 text-base hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  Log out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Text for Small Screens */}
      <div className="block md:hidden mt-2 text-center text-white text-lg">
        Welcome, {user}
      </div>
    </div>
  </header>
</div>


   
  )
}

export default Nav