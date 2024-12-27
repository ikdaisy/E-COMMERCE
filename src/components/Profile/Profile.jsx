import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import Api from '../Api';

const Profile = ({setUser}) => {
  const api = Api();
  const [userData, setUserData] = useState({});
  const [address, setAddress] = useState({
    place: "",
    pincode: "",
    city: "",
  });
  const { _id } = useParams();
  const token = localStorage.getItem("Token");

  const [isManagingAddresses, setIsManagingAddresses] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false); // State to toggle edit mode for profile

  const [addressAdded, setAddressAdded] = useState(false); // State to track if address is added

  const handleManageAddressesClick = () => {
    setIsManagingAddresses(true);
  };

  const handleProfileInformationClick = () => {
    setIsManagingAddresses(false);
  };

  const handleEditClick = () => {
    setIsEditingProfile(true); // Enable editing
  };

  const handleSaveClick = async (e) => {
    setIsEditingProfile(false); // Disable editing
    // You can add save functionality here (e.g., save the data to backend)
    e.preventDefault();
    const res = await axios.put(
      `${api}/edituser`,
      userData,
      { headers: { "Authorization": `Bearer ${token}` } }
    );
    console.log(res);
  };

  const handleSaveAddress = async () => {
    setAddressAdded(true);
    const res = await axios.post(
      `${api}/editAddress`,
      address,
      { headers: {"Authorization": `Bearer ${token}` } }
    );
    console.log(res);
  };

  const handleDeleteAddress = async () => {
    try {
      const res = await axios.delete(
        `${api}/deleteAddress`, 
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      setAddress({ place: "", city: "", pincode: "" }); // Clear address from state
      setAddressAdded(false); // Mark address as deleted
      console.log(res);
    } catch (error) {
      console.log("Error deleting address:", error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const res = await axios.delete(`${api}/deleteuser`,{headers:{ "Authorization": `Bearer ${token}`}}
      );
      console.log(res);
      // Optionally, you can log out the user or redirect them after deleting their profile
    } catch (error) {
      console.log("Error deleting profile:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${api}/getuser`, 
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      setUserData(res.data.data);
      setUser(res.data.data.username)
      setAddress(res.data.address || { place: "", pincode: "", city: "" });
      setAddressAdded(Boolean(res.data.address));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUserData((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleAddressChange = (e) => {
    setAddress((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center space-y-4">
              <img
                className="w-32 h-32 rounded-full object-cover"
                src="https://www.w3schools.com/w3images/avatar2.png"
                alt="Profile"
              />
              <h2 className="text-xl font-semibold text-gray-800">{userData.username}</h2>
              <p className="text-gray-600">{userData.email}</p>
              <button
                onClick={handleProfileInformationClick}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
              >
                Profile Information
              </button>
              <button
                onClick={handleManageAddressesClick}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
              >
                {addressAdded ? 'Manage Address' : 'Manage Address'}
              </button>
            </div>
          </div>

          {/* Profile Content or Manage Addresses Content */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            {isManagingAddresses ? (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Manage Address</h3>
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-700">Place</h4>
                    <input
                      type="text"
                      value={address.place}
                      onChange={handleAddressChange}
                      name="place"
                      placeholder="Enter place"
                      className="block py-2 pl-2 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-700">City</h4>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      placeholder="Enter City"
                      onChange={handleAddressChange}
                      className="block py-2 pl-2 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-700">Pincode</h4>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      name="pincode"
                      placeholder="Enter pincode"
                      className="block py-2 pl-2 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                </div>
                {addressAdded ? (
                  <button
                    onClick={handleSaveAddress}
                    className="mt-6 mx-5 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
                  >
                    Edit Address
                  </button>
                ) : (
                  <button
                    onClick={handleSaveAddress}
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
                  >
                    Save Address
                  </button>
                )}
                <button
                  onClick={handleDeleteAddress}
                  className="mt-6 mx-5 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
                >
                  Delete Address
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Profile Information</h3>
                 {/* Sell Button positioned in the top-right corner */}
                <Link to={'/company'}>
                <button
                 
                 className="absolute top-30 right-20 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200"
               >
                 Sell
               </button>
                </Link>
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-700">Full Name</h4>
                    <input
                      type="text"
                      onChange={handleChange}
                      name="username"
                      value={userData.username}
                      placeholder=""
                      disabled={!isEditingProfile} // Disable the input when not editing
                      className="block py-2 pl-2 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-700">Email</h4>
                    <input
                      type="email"
                      onChange={handleChange}
                      name="email"
                      value={userData.email}
                      placeholder=""
                      disabled={!isEditingProfile} // Disable the input when not editing
                      className="block py-2 pl-2 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-700">Phone</h4>
                    <input
                      type="text"
                      value={userData.phone}
                      name="phone"
                      onChange={handleChange}
                      placeholder=""
                      disabled={!isEditingProfile} // Disable the input when not editing
                      className="block py-2 pl-2 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                    />
                  </div>
                </div>
                {isEditingProfile ? (
                  <button
                    onClick={handleSaveClick}
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="mt-6 mx-5 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleDeleteProfile}
                  className="mt-6 mx-5 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
                >
                  Delete Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
