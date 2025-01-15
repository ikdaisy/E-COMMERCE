import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../Api';
import axios from 'axios';

const Company = ({ setUser }) => {
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
    const res = await axios.get(`${api}/getproducts`);
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
      <div className=" flex  flex-col lg:flex-row md:flex-row sm:flex-row gap-6 p-4">
        {/* Left Section: Profile Information */}
        <div className="left flex-1 bg-white p-4 rounded-lg shadow-lg">
          <table className="table-auto w-full">
            <tbody>
              <tr>
                <th className="text-left p-2">Name:</th>
                <td className="p-2">{proBool ? companyData.name : '-'}</td>
              </tr>
              <tr>
                <th className="text-left p-2">Email:</th>
                <td className="p-2">{proBool ? companyData.email : '-'}</td>
              </tr>
              <tr>
                <th className="text-left p-2">Phone:</th>
                <td className="p-2">{proBool ? companyData.phone : '-'}</td>
              </tr>
              <tr>
                <th className="text-left p-2">Place:</th>
                <td className="bio p-2">{proBool ? companyData.place : '-'}</td>
              </tr>
              <tr>
                <td className="actions p-2 " colSpan="2">
                  <Link to={'/editcompany'}>
                    <button type="button" className="edit-btn mt-12 mx-12 bg-blue-900 text-white px-10 py-2 rounded-lg hover:bg-blue-800">
                      {proBool ? 'EDIT' : 'CREATE'}
                    </button>
                  </Link>
                  {/* <button type="button" className="delete-btn mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                    DELETE
                  </button> */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Section: Category Cards and Add Product Button */}
        <div className="right flex-1 bg-white p-4 rounded-lg shadow-lg h-96">
          <Link to={'/addproduct'}>
            <button className="addbtn bg-blue-900 text-white px-5 py-2 rounded-full hover:bg-blue-500 mb-6">
              Add Product
            </button>
          </Link>
          

          <div className="flex flex-wrap gap-6 mx-3 mt-6 ">
            {/* Display Category Cards with dynamic count */}
            {categories.map((ct) => {
              const productCount = getCategoryProductCount(ct.category); // Get count for this category
              return (
               <Link to={`/catproducts/${ct.category}`}>
                <div key={ct._id} className="relative w-full sm:w-40 md:w-48 lg:w-56 h-10 py-2 px-4 border border-blue-500 text-blue-600 rounded-md hover:bg-grey hover:text-blue-900 transition-all shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <div className="absolute top-1 right-2 bg-blue-900  text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                    {productCount} {/* Display the dynamic count */}
                  </div>
                  <div className="flex flex-col justify-center items-center h-full">
                    <div className="text-xl font-semibold text-center">{ct.category}</div> {/* Display category name */}
                  </div>
                </div>
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
