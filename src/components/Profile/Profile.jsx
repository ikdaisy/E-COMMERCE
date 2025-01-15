import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Api from '../Api';
import { useNavigate, Link } from 'react-router-dom';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import Swal from 'sweetalert2';

const Profile = ({setUser,type,setType}) => {
  const token = localStorage.getItem('Token');
  const navigate = useNavigate();
  const api = Api();
  const [currentView, setCurrentView] = useState('profile'); // Track current view (profile, address, add address)
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownStates, setDropdownStates] = useState([]); // Dropdown state for each address
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [addressData, setAddressData] = useState([]);
  const [newAddress, setNewAddress] = useState({
    place: '',
    house: '',
    pincode: '',
  });

  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  useEffect(() => {
    fetchProfileData();
    fetchAddressData();
  }, []);

  const fetchProfileData = async () => {
    if (token) {
      const { data } = await axios.get(`${api}/getuser`, { headers: { "authorization": `Bearer ${token}` } });
      console.log(data);
      setUser(data.username)
      setType(data.accountType)
      setProfileData(data);
    } else {
      navigate('/signin');
    }
  };

  const fetchAddressData = async () => {
    const { data } = await axios.get(`${api}/getAddress`,{ headers: { "authorization": `Bearer ${token}` } });
    setAddressData(data);
    setDropdownStates(new Array(data.length).fill(false)); // Initialize dropdown states for each address
  };

  const handleClick = () => {
    { isEditing ? profilehandleSubmit() : setIsEditing(!isEditing) };
  };

  const addrhandleClick = () => {
    handleAddrSubmit();
  };

  const profilehandleSubmit = async () => {
    try {
      const { data } = await axios.put(`${api}/edituser`, profileData, { headers: { "authorization": `Bearer ${token}` } });
      Swal.fire({
        title: 'Success!',
        text: `${data.msg}`,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'bg-white rounded-lg shadow-md ',
          title: 'text-lg font-semibold text-gray-800',
          htmlContainer: 'text-sm text-gray-600',
          confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddrSubmit = async () => {
    const { data } = await axios.post(`${api}/address`, newAddress,{ headers: { "authorization": `Bearer ${token}` } });
    Swal.fire({
      title: 'Success!',
      text: `${data.msg}`,
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'bg-white rounded-lg shadow-md ',
        title: 'text-lg font-semibold text-gray-800',
        htmlContainer: 'text-sm text-gray-600',
        confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
      },
    });
    setNewAddress({
      place: '',
      house: '',
      pincode: '',
    });
    fetchAddressData(); // Fetch updated address list after adding new address
    setCurrentView('address');
  };

  const handleEdit = (index) => {
    setEditingAddressIndex(index); // Set the address index to be edited
    // Update newAddress with the current values of the address to be edited
    setNewAddress({
      place: addressData[index].place,
      house: addressData[index].house,
      pincode: addressData[index].pincode,
    });
  };

  const handleDelete = async(id,index) => {
    // console.log(id);
    // Add deletion logic here if needed
    Swal.fire({
      title: 'Are you sure?',
      text: 'Please confirm that you want to delete this address.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'bg-white rounded-lg shadow-md',
        title: 'text-lg font-semibold text-gray-800',
        htmlContainer: 'text-sm text-gray-600',
        confirmButton: 'bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700',
        cancelButton: 'bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.delete(`${api}/deleteAddress/${id}`);
          Swal.fire({
            title: 'Deleted!',
            text: data.msg,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'bg-white rounded-lg shadow-md',
              title: 'text-lg font-semibold text-gray-800',
              htmlContainer: 'text-sm text-gray-600',
              confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
            },
          });
          fetchAddressData()
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.msg || 'Something went wrong.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'bg-white rounded-lg shadow-md',
              title: 'text-lg font-semibold text-gray-800',
              htmlContainer: 'text-sm text-gray-600',
              confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
            },
          });
        }
      }
    });
  };

  const handleSave = async (id, index) => {
    const updatedAddress = { ...addressData[index], ...newAddress }; // Merge newAddress into the current address
    try {
      const { data } = await axios.put(`${api}/editAddress/${id}`, updatedAddress);
      Swal.fire({
        title: 'Updated!',
        text: data.msg,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'bg-white rounded-lg shadow-md',
          title: 'text-lg font-semibold text-gray-800',
          htmlContainer: 'text-sm text-gray-600',
          confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
        },
      });
      setEditingAddressIndex(null); // Stop editing
      fetchAddressData(); // Refresh the address data
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDropdown = (index) => {
    const updatedDropdownStates = [...dropdownStates];
    updatedDropdownStates[index] = !updatedDropdownStates[index];
    setDropdownStates(updatedDropdownStates);
  };

  const handleProfileChange = (e) => {
    setProfileData((pre) => ({...pre,[e.target.name]: e.target.value}));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen  font-sans px-10 flex justify-center flex-col md:flex-row">
      <div className="  p-6 bg-white border-b md:border-r border-gray-300 text-center md:text-center">
        <div className='md:grid justify-center flex-wrap mt-10'>
        <img
  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJ3LTI0IGgtMjQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZVdpZHRoPSIyIj48cGF0aCBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIiBkPSJNMTIgMTJjMi40ODUgMCA0LjUtMi4wMTUgNC41LTQuNVMxNC40ODUgMyAxMiAzIDcuNSA1LjAxNSA3LjUgNy41IDkuNTE1IDEyIDEyIDEyWk0xOS41IDIxdjEtMi41YzAtMi40ODUtMi4wMTUtNC41LTQuNS00LjVoLTZjLTIuNDg1IDAtNC41IDIuMDE1LTQuNSA0LjVWMjEiLz48L3N2Zz4="
  alt="User Icon"
  className="w-24 h-24 border border-black font-bold rounded-full p-1"
/>
          <p className="text-xs text-gray-500"></p>
          <p className="text-2xl font-semibold text-gray-800 mt-3">{profileData.username}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-16 md:grid-cols-2 md:gap-6">
  <button
    onClick={() => setCurrentView('profile')}
    className="py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all"
  >
    View Profile
  </button>
  <button
    onClick={() => setCurrentView('address')}
    className="py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all"
  >
    Manage Address
  </button>
 <Link to={'/orders'}>
 <button
    className="py-2 px-12 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all"
  >
    My Orders
  </button>
 </Link>
 <Link to={'/cart'}> <button
    className="py-2 px-12 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all"
  >
    My Cart
  </button></Link>
  <Link to={'/wishlist'}><button
    className="py-2   px-9 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all"
  >
    My Wishlist
  </button></Link>
</div>

      </div>

      <div className="w-full border-b md:w-2/3 p-6 bg-white">
        {currentView === 'profile' ? (
          <div>
            {type=="Seller"?(<Link to={'/company'} className='float-right'>
              <button className='bg-black text-white border font-semibold rounded-md px-2 shadow-md py-1 '>SELL</button>
            </Link>):(<></>)}
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Profile Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <button
                onClick={handleClick}
                className="w-1/6 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700"
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
          </div>
        ) : currentView === 'address' ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Address</h2>
            
            {addressData.length === 0 ? (
              <>
              <div>
              <button
                  onClick={() => setCurrentView('addAddress')}
                  className="w-1/4 py-2 px-4 text-green-600 text-start text-lg font-semibold rounded-md mt-4 hover:text-green-500 "
                >
                  +Add Address
                </button>
              </div>
              <p className="text-gray-600">No addresses added yet.</p>

              </>
            ) : (
              <div className='w-3/4'>
              <div>
              <button
                  onClick={() => setCurrentView('addAddress')}
                  className="w-1/4 py-2 px-4 text-green-600 text-start text-lg font-semibold rounded-md mt-4 hover:text-green-500 "
                >
                  +Add Address
                </button>
              </div>
                {addressData.map((address, index) => (
                  <div key={index} className="bg-gray-50 p-4 mb-4 rounded-lg shadow-md">
                    <div className="relative">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <th className="text-left">Place: </th>
                            <td>
                              <input
                                type="text"
                                name="place"
                                value={editingAddressIndex === index ? newAddress.place : address.place} // Show either newAddress or the current address
                                onChange={handleAddressChange} // Update newAddress on change
                                disabled={editingAddressIndex !== index} // Allow editing only if this address is selected
                                className="w-5/6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th className="text-left">House: </th>
                            <td>
                              <input
                                type="text"
                                name="house"
                                value={editingAddressIndex === index ? newAddress.house : address.house} // Show either newAddress or the current address
                                onChange={handleAddressChange} // Update newAddress on change
                                disabled={editingAddressIndex !== index} // Allow editing only if this address is selected
                                className="w-5/6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th className="text-left">Pincode: </th>
                            <td>
                              <input
                                type="text"
                                name="pincode"
                                value={editingAddressIndex === index ? newAddress.pincode : address.pincode} // Show either newAddress or the current address
                                onChange={handleAddressChange} // Update newAddress on change
                                disabled={editingAddressIndex !== index} // Allow editing only if this address is selected
                                className="w-5/6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div
                        onClick={() => toggleDropdown(index)}
                        className="absolute right-0 top-0 mt-3 mr-3 cursor-pointer"
                      >
                        <DotsVerticalIcon className="w-6 h-6 text-gray-600" />
                      </div>

                      {dropdownStates[index] && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-md mt-2 w-32">
                          <ul className="space-y-2 py-2 text-gray-700 text-sm">
                            <li
                              className="px-4 py-2 cursor-pointer font-semibold text-blue-500 hover:bg-gray-100"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </li>
                            <li
                              className="px-4 py-2 cursor-pointer font-semibold text-green-500  hover:bg-gray-100"
                              onClick={() => handleDelete(address._id,index)}
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    {editingAddressIndex === index && (
                      <button
                        onClick={() => handleSave(address._id, index)} // Save changes for this address
                        className="w-1/4 py-2 px-4 bg-blue-600 text-white rounded-md mt-4 hover:bg-blue-700"
                      >
                        Save
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
           
          </div>
        ) : currentView === 'addAddress' ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Address</h2>
            <div>
              <label className="block text-gray-700">Place</label>
              <input
                type="text"
                name="place"
                value={newAddress.place}
                onChange={handleAddressChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">House</label>
              <input
                type="text"
                name="house"
                value={newAddress.house}
                onChange={handleAddressChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={newAddress.pincode}
                onChange={handleAddressChange}
                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={addrhandleClick}
              className="w-1/4 py-2 px-4 bg-green-600 text-white rounded-md mt-4 hover:bg-green-700"
            >
              Add Address
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;