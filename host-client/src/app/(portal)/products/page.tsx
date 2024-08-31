'use client';

import { useGetProducts } from '@/app/_api/auth/getProducts';
import React from 'react';

const ProductList = () => {
  const { data: products, error, isLoading } = useGetProducts();

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Product List</h2>
      
      {isLoading && <div>Loading products...</div>}
      
      {error && (
        <div className="text-red-600 font-semibold">
          Error fetching products: {error.message}
        </div>
      )}

      {!isLoading && products && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                ${product.price.toFixed(2)}
              </p>
              {product.description && (
                <p className="text-gray-500 mb-6">{product.description}</p>
              )}
              <button className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
