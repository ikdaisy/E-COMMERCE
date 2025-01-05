import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from '../Api';
import { Link, useParams } from "react-router-dom";


const ProductDesc = () => {
    const {_id}=useParams()
    const api=Api()
    const [product,setProduct]=useState({})
    const [sizes,setSizes]=useState([])
    const [images,setImages]=useState([])
    useEffect(()=>{
        fetchProductDetails()
    },[])

    const  fetchProductDetails=async()=>{
        try {
            const res=await axios.get(`${api}/getproduct/${_id}`)
        console.log(res);
        setProduct(res.data)
        setSizes(res.data.sizes)
        setImages(res.data.photo)
        setMainImage(res.data.photo[0])
        
        } catch (error) {
            console.log(error);   
        }
    }
   
    

  

  // State to manage the currently displayed image
  const [mainImage, setMainImage] = useState();

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Image Section */}
          <div>
            {/* Main Image */}
            <div className="w-full h-72 md:h-96">
              <img
                src={mainImage}
                alt=""
                className="rounded-lg w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex justify-center gap-4 mt-4">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-black transition"
                  onMouseOver={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {product.name}
            </h1>
            <p className="text-green-600 mt-2 font-bold leading-relaxed">{product.category}</p>
            <p className="text-gray-600 mt-4 leading-relaxed">
             {product.description}
            </p>
           
            {/* Size Selection */}
            <div className="mt-4">
  <label className="block text-sm font-medium text-gray-800 mb-2">
     Size
  </label>
  <div className="flex gap-4">
    {sizes.map((dt) => (
      <button
        key={dt}
        className={`py-2 px-4 border rounded-md text-sm font-medium ${
          product.selectedSize === dt.size
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
        onClick={() =>
          setProduct((prev) => ({ ...prev, selectedSize: dt.size }))
        }
      >
        {dt.size}
      </button>
    ))}
  </div>
</div>


            {/* Pricing and Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-between">
              <p className="text-2xl font-bold text-red-800">${product.price}</p>
              <div className="flex  items-center gap-4">
  {/* Edit Button */}
  <Link to={`/editproduct/${product._id}`}><button className="flex items-center gap-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-6 rounded-md transition">
   
   Edit
 </button></Link>

  {/* Delete Button */}
  <button className="flex items-center gap-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-6 rounded-md transition">
   
    Delete
  </button>
</div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDesc;
