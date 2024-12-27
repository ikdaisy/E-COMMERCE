import { useEffect, useState } from "react";
import Api from '../Api';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct({setUser}) {
  const navigate= useNavigate()
  const api=Api()
  const [sizes, setSizes] = useState([{ size: "", quantity: "" }]);
  const [name, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [photo,setImages]=useState([])
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // Initial categories

  useEffect(()=>{
    getCategories()
  },[])

  const getCategories=async(e)=>{
    const res = await axios.get(`${api}/getcategory`)
    console.log(res.data);
    const data = res.data
     const category=data.map((ct)=>{
      return ct.category
    })
    setCategories(category)
  }

  const [newCategory, setNewCategory] = useState(""); // State to store new category input
  const [showCategoryInput, setShowCategoryInput] = useState(false); // State to toggle category input visibility

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

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = async() => {
    const res =await axios.post(`${api}/addcategory`,{newCategory})
    console.log(res);
    

    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setCategory(newCategory); // Set the newly added category as the selected category
      setNewCategory(""); // Clear the input field
      setShowCategoryInput(false); // Hide the category input field
    } else if (!newCategory) {
      alert("Category cannot be empty");
    } else {
      alert("Category already exists");
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log({ name, price, category, sizes,photo });
    console.log(photo);
    
    const res = await  axios.post(`${api}/addproduct`,{ name, price, category, sizes,photo })
    console.log(res);
    if(res.status==201){
      alert(res.data.msg)
      navigate('/company')

    }
    
  };

  const handleFile=async(e)=>{
    const arr=Object.values(e.target.files)
    console.log(arr);
    arr.map(async(m)=>{
      const photo=await convertToBase64(m)
      setImages((pre)=>([...pre,photo]))
    })
  }

function convertToBase64(file){
    return new Promise((resolve,reject)=>{
        const fileReader=new FileReader()
        // console.log(fileReader);
        fileReader.readAsDataURL(file)
        fileReader.onload=()=>{
            resolve(fileReader.result);

        }
        fileReader.onerror=(error)=>{
            reject(error);
        }
        
    })

}


  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="product-name">
            Product Name
          </label>
          <input
            type="text"
            id="product-name"  name="name"
            value={name}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="number" name="price"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div  className="mb-4" >
        <label htmlFor="inputField">Profile:</label>
        <input type="file"  id="photo" className="photo" accept="image/*" multiple name="photo" onChange={handleFile} />
        </div>

        {/* Category Dropdown with Add Button */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Category
          </label>
          <div className="flex items-center gap-2">
            <select
              id="category"
              value={category} name="category"
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            >
               <option>Select a category
                </option>
              {categories.map((cat, index) => (
                
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => setShowCategoryInput(true)} className="px-5 py-1 bg-blue-500 text-white rounded">+</button>

          </div>

          {/* New Category Input */}
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

        {/* Sizes and Quantities */}
        <div className="mb-4">
          {sizes.map((size, index) => (
            <div key={index} className="flex gap-4 mb-3">
              <input
                type="text"
                placeholder="Size" 
                value={size.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={size.quantity}
                onChange={(e) =>
                  handleSizeChange(index, "quantity", e.target.value)
                }
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

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md"
          >
            Submit Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
