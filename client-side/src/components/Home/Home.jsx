import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../Api';

const Home = ({ setUser, setType, setProfile }) => {
  const navigate = useNavigate();
  const api = Api();
  const token = localStorage.getItem("Token");
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState("All"); // State for selected category

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (token) {
      console.log("hihi");
      
      try {
        const res = await axios.get(`${api}/home`, {
          headers: { authorization: `Bearer ${token}` },
        });
        console.log(res);
        setUser(res.data.username);
        setProfile(res.data.profile);
        setProducts(res.data.products);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(res.data.products.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);

        setType(res.data.accountType);
      } catch (error) {
        console.log(error);
        navigate('/signin');
      }
    } else {
      console.log("haha");
      
      // localStorage.removeItem('Token')
      navigate('/signin');
    }
  };

  const filterProducts = products.filter((product) => {
    const matchesSearchQuery = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearchQuery && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6">
      {/* Search and Filter Options */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search here..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-2/4 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700"
        />
       <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="w-full sm:w-2/4 lg:w-1/4 p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-200"
>

  {categories.map((category, index) => (
    <option key={index} value={category} className="text-gray-700">
      {category}
    </option>
  ))}
</select>

      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filterProducts.map((dt) => (
          <Link to={`displayproduct/${dt._id}`} key={dt._id}>
            <div className="border cursor-pointer border-gray-200 rounded-lg overflow-hidden shadow-md">
              <img
                src={dt.photo[0]}
                className="w-full h-48 object-cover"
                alt={dt.name}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {dt.name}
                </h3>
                <p className="text-gray-600">{dt.category}</p>
                <p className="text-lg font-bold text-red-900">${dt.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filterProducts.length === 0 && (
        <p className="text-xl text-gray-600 mt-4">No products found !!</p>
      )}
    </div>
  );
};

export default Home;
