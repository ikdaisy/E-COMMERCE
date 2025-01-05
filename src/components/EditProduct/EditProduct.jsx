import { useEffect, useState } from "react";
import Api from '../Api';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const navigate = useNavigate();
  const { _id } = useParams(); // Get product ID from URL
  const api = Api();
  const [sizes, setSizes] = useState([{ size: "", quantity: "" }]);
  const [name, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    getCategories();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`${api}/getproduct/${_id}`);
      const data = res.data;
      setProductName(data.name);
      setPrice(data.price);
      setDescription(data.description);
      setCategory(data.category);
      setSizes(data.sizes);
      setImages(data.photo);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${api}/getcategory`);
      const data = res.data.map((ct) => ct.category);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${api}/updateproduct/${_id}`, {
        name,
        price,
        category,
        sizes,
        photo,
        description,
      });
      console.log(res);
      
      if (res.status === 200) {
        alert("Product updated successfully");
        navigate(`/proddesc/${_id}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleFile = async (e) => {
    const arr = Object.values(e.target.files);
    arr.map(async (file) => {
      const photo = await convertToBase64(file);
        
    });
    setImages(photo)
  };

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="product-name">
            Product Name
          </label>
          <input
            type="text"
            id="product-name"
            name="name"
            value={name}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="product-desc">
            Description
          </label>
          <input
            type="text"
            id="product-desc"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="photo">Photos:</label>
          <input
            type="file"
            id="photo"
            className="photo"
            accept="image/*"
            multiple
            name="photo"
            onChange={handleFile}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Category
          </label>
          <div className="flex items-center gap-2">
            <select
              id="category"
              value={category}
              name="category"
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
              <option>Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
           
          </div>

          {showCategoryInput && (
            <div className="mt-4">
              <input
                type="text"
                value={newCategory}
                onChange={handleNewCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter new category"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Add Category
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          {sizes.map((size, index) => (
            <div key={index} className="flex gap-4 mb-3">
              <input
                type="text"
                placeholder="Size"
                value={size.size}
                onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={size.quantity}
                onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddSize}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md mt-4"
          >
            + Add Size
          </button>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
