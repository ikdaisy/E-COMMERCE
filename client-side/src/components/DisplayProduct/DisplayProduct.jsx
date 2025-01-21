import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import Api from "../Api";
import Swal from 'sweetalert2';

import { Link, useNavigate, useParams } from "react-router-dom";

const DisplayProduct = ({ setUser,setProfile }) => {
  const { _id } = useParams();
  const token = localStorage.getItem("Token");
  const api = Api();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [isOnWishlist, setIsOnWishlist] = useState(false);
  const [isOnCart, setIsOnCart] = useState(false);

  const [cart, setCart] = useState({
    product: {},
    size: "",
    quantity: 0
  });

  useEffect(() => {
    fetchProductDetails();
    
  }, []);

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`${api}/getproduct/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.username);
      setProfile(res.data.profile)
      setProduct(res.data.product);
      setSizes(res.data.product.sizes);
      setImages(res.data.product.photo);
      setMainImage(res.data.product.photo[0]);
      if(res.data.isOnWishlist){
        setIsOnWishlist(true);
      }
      if(res.data.isOnCart){
        setIsOnCart(true)
      }
      
    } catch (error) {
      console.log(error);
      navigate("/signin");
    }
  };
 
  

  const toggleWishlist = async (id) => {
    try {
        console.log(id);
        
      let res;
      if (isOnWishlist) {
        
        // Use DELETE for removing from wishlist
        const endpoint = `${api}/removewishlist/${id}`;
        res = await axios.delete(endpoint, {headers: { Authorization: `Bearer ${token}` }});
      } else {
        // Use POST for adding to wishlist
        const endpoint = `${api}/addwishlist`;
        res = await axios.post(endpoint,{ id },{ headers: { Authorization: `Bearer ${token}` } });
      }
  
      if (res.status === 200) {
        setIsOnWishlist(!isOnWishlist);
       
         Swal.fire({
                title:  isOnWishlist?"Deleted !":"Added ! ",
                text: isOnWishlist? "Removed from wishlist": "Added to wishlist",
                icon: 'success',
                confirmButtonText: 'OK',
                customClass: {
                  popup: 'bg-white rounded-lg shadow-md ',
                  title: 'text-lg font-semibold text-gray-800',
                  htmlContainer: 'text-sm text-gray-600',
                  confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
                },
              });
      } else {
        // alert("Operation failed");
        Swal.fire({
          title: 'Error!',
          text: 'Operation failed',
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
    } catch (error) {
      alert(error.response.data.msg)
    }
  };
  

  const handleSize = (size) => {
    setCart({ size: size, product: product, quantity: 1 });
  };

  const handleAddToCart = async() => {
    console.log(token);
    
    if(cart.size){
      try {
        const res = await axios.post(`${api}/addtocart`,cart,{ headers: { Authorization: `Bearer ${token}` } });
        console.log(res);
        
        if (res.status === 201) {
          Swal.fire({
                 title: 'Success!',
                 text: `${res.data.msg}`,
                 icon: 'success',
                 confirmButtonText: 'OK',
                 customClass: {
                   popup: 'bg-white rounded-lg shadow-md ',
                   title: 'text-lg font-semibold text-gray-800',
                   htmlContainer: 'text-sm text-gray-600',
                   confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
                 },
               });
          fetchProductDetails()
        }
      } catch (error) {
        // alert("Failed to add product to cart.");
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add product to cart.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'bg-white rounded-lg shadow-md',
            title: 'text-lg font-semibold text-gray-800',
            htmlContainer: 'text-sm text-gray-600',
            confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
          },
        });
       
        console.error(error);
      }

    }
    else{
     
       Swal.fire({
              title: 'Please..',
              text: `Please select a size before adding to cart.`,
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                popup: 'bg-white rounded-lg shadow-md ',
                title: 'text-lg font-semibold text-gray-800',
                htmlContainer: 'text-sm text-gray-600',
                confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
              },
            });

    }
   
   
  };

  const handleBuyNow = async() => {
    if (cart.size) {
      const { status, data } = await axios.post(`${api}/addtocart`, cart, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (status === 201) {
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
        navigate(`/scart/${product._id}`);
      } else {
       
        Swal.fire({
                    title: 'Error!',
                    text: 'Could not add to cart',
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
    } else {
      Swal.fire({
        title: 'Please..',
        text: `Please select a size.`,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'bg-white rounded-lg shadow-md ',
          title: 'text-lg font-semibold text-gray-800',
          htmlContainer: 'text-sm text-gray-600',
          confirmButton: 'bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700',
        },
      });
    }
  };

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
                alt={product.name}
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
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-green-600 mt-2 font-bold leading-relaxed">
              {product.category}
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {product.description}
            </p>

           {/* Size Selection */}
<div className="flex gap-4">
  {sizes.map((dt) => (
    <button
      key={dt.size}
      className={`py-2 px-4 border rounded-md text-sm font-medium ${
        dt.quantity === 0
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : cart.size === dt.size
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      }`}
      onClick={() => dt.quantity > 0 && handleSize(dt.size)}
      disabled={dt.quantity === 0} // Disable button if quantity is 0
    >
      {dt.size}
    </button>
  ))}
</div>



            {/* Pricing and Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-between">
              <p className="text-2xl font-bold text-red-800">${product.price}</p>
              <div className="flex items-center gap-4">
                {isOnWishlist ? (
                  <AiFillHeart
                    className="text-red-600 text-4xl cursor-pointer"
                    onClick={()=>toggleWishlist(product._id)}
                  />
                ) : (
                  <AiOutlineHeart
                    className="text-4xl text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    onClick={()=>toggleWishlist(product._id)}
                  />
                )}
               {isOnCart?( <Link to={'/cart'}><button
                  className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 py-2 px-6 rounded-md transition"
                 
                >
                  Go to Cart
                </button></Link>):( <button
                  className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 py-2 px-6 rounded-md transition"
                  onClick={() => handleAddToCart()}
                >
                  Add to Cart
                </button>)}
                <button
                  className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 py-2 px-6 rounded-md transition"
                  onClick={() => handleBuyNow(product._id)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayProduct;
