import { useState } from "react";




function Products() {
//   const [searchTerm, setSearchTerm] = useState("");
  
 

  return (
    <div className="container mx-auto p-6">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter products..."
          value=""
         
          className=" w-2/4 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
          <div  className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
            <img
              src=""
             
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">product.name</h3>
              <p className="text-gray-600">product.category</p>
              <p className="text-lg font-bold text-gray-900">$product.price</p>
            </div>
          </div>
      
      </div>
    </div>
  );
}

export default Products;
