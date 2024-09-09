'use client';

import { useGetProducts } from '@/app/_api/auth/getProducts';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Define Product type based on the data returned by the API
interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string; // Optional field
}

// Define CartItem type based on the product with an added quantity
interface CartItem extends Product {
  quantity: number;
}

const ProductList = () => {
  const { data: products, error, isLoading } = useGetProducts();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = Cookies.get('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Update cookies whenever cartItems change
  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cartItems), { expires: 7 });
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const isProductInCart = prevItems.find((item) => item._id === product._id);

      if (isProductInCart) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

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
              <button
                className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
                onClick={() => addToCart(product)}
              >
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
