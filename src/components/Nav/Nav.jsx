
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../Api';
import axios from 'axios';

const Nav = ({user,setUser}) => {
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

 

 

  return (
    <div className="bg-black">
    <header>
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <a href="#" title="" className="flex">
              <h2 className='text-white'>MIRAE</h2>
              {/* <img className="w-auto h-8" src="" alt="Logo" /> */}
            </a>
          </div>
          <span className='text-white text-xl md:text-3xl sm:text-2xl'> Welcome, {user}</span>

          <div className="relative">
           
            <button
              id="profile-btn"
              className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none"
              onClick={toggleDropdown}
            >
              <img
                className="w-full h-full object-cover"
                src="https://www.w3schools.com/w3images/avatar2.png"
                alt="Profile Picture"
              />
            </button>

            <div
              id="dropdown"
              className={`absolute right-0 w-40 mt-2 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${isDropdownVisible ? '' : 'hidden'}`}
            >
             <div className="py-1">

  
<Link className='text-gray-700 block px-4 py-2 text-base hover:bg-slate-50  rounded-md transition-colors duration-200' to={`/profile`}>Profile</Link>
<a
    onClick={()=>{

    localStorage.removeItem('Token')
    setUser("")
navigate('/signin')
}}
  className="text-gray-700 cursor-pointer block px-4 py-2 text-base hover:bg-slate-50  rounded-md transition-colors duration-200"
>
  Log out
</a>
</div>

            </div>
          </div>

         
        </div>
      </div>
    </header>
  </div>
   
  )
}

export default Nav