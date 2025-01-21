import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../Api';
import axios from 'axios';

const Company = ({ setUser,setProfile }) => {
  const api = Api();
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [companyData, setCompanyData] = useState({});
  const [proBool, setProBool] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchUserData();
    getCategories();
    getProducts();  // Fetch products to count them later
  }, []);

  const getCategories = async () => {
    const res = await axios.get(`${api}/getcategory`);
    console.log(res.data);
    if (res.status === 200) {
      setCategories(res.data); // Assuming `res.data` contains category info
    }
  };

  const getProducts = async () => {
    const res = await axios.get(`${api}/getproducts`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.status === 200) {
      setProducts(res.data); // Assuming `res.data` contains product data
    }
  };

  const fetchUserData = async () => {
    if (token) {
      try {
        const res = await axios.get(`${api}/getcompanydata`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 200) {
          setUser(res.data.userData.username);
          setProfile(res.data.userData.profile)
          setCompanyData(res.data.companyData);
          res.data.companyData ? setProBool(true) : setCompanyData(false);
        }

      } catch (error) {
        console.log(error);
        navigate('/signin');
      }
    } else {
      navigate('/signin');
    }
  };

  // Calculate the product count for each category
  const getCategoryProductCount = (name) => {
    return products.filter(product => product.category === name).length;
  };

  return (
    <>
     <div className="flex flex-col lg:flex-row md:flex-row sm:flex-col gap-6 p-4 bg-blue-50">
  {/* Left Section: Profile Information */}
  <div className="left flex-1 bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold text-blue-900 mb-4">Company Information</h2>
    <table className="table-auto w-full">
      <tbody>
        <tr>
          <th className="text-left p-2 text-blue-800">Profile:</th>
          <td className="p-2">
            {proBool && companyData.profile ? (
              <img
                src={companyData.profile}
                alt="Company"
                className="h-20 w-20 object-cover rounded-full shadow-md"
              />
            ) : (
              <span className="text-gray-500">No Profile</span>
            )}
          </td>
        </tr>
        <tr>
          <th className="text-left p-2 text-blue-800">Name:</th>
          <td className="p-2 text-gray-700">{proBool ? companyData.name : '-'}</td>
        </tr>
        <tr>
          <th className="text-left p-2 text-blue-800">Email:</th>
          <td className="p-2 text-gray-700">{proBool ? companyData.email : '-'}</td>
        </tr>
        <tr>
          <th className="text-left p-2 text-blue-800">Phone:</th>
          <td className="p-2 text-gray-700">{proBool ? companyData.phone : '-'}</td>
        </tr>
        <tr>
          <th className="text-left p-2 text-blue-800">Place:</th>
          <td className="p-2 text-gray-700">{proBool ? companyData.place : '-'}</td>
        </tr>
        <tr>
          <td className="actions p-2 text-center" colSpan="2">
            <Link to={'/editcompany'}>
              <button
                type="button"
                className="edit-btn mt-6 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-all"
              >
                {proBool ? 'EDIT' : 'CREATE'}
              </button>
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Right Section: Category Cards and Add Product Button */}
  <div className="right flex-1 bg-white p-6 rounded-lg shadow-lg">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-blue-900">Categories</h2>
      <Link to={'/addproduct'}>
        <button className="addbtn bg-blue-700 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-all">
          Add Product
        </button>
      </Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((ct) => {
        const productCount = getCategoryProductCount(ct.category); // Get count for this category
        return (
          <Link to={`/catproducts/${ct.category}`} key={ct._id}>
           {productCount>0?( <div className="relative p-4 border border-blue-500  text-blue-700 bg-white rounded-lg shadow-md hover:bg-blue-100 hover:shadow-lg transition-all">
              <div className="absolute top-1 right-1 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                {productCount}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{ct.category}</h3>
              </div>
            </div>):(<></>)}
          </Link>
        );
      })}
    </div>
  </div>
</div>

    </>
  );
};

export default Company;
