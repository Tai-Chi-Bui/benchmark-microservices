'use client';

import { useGetProducts } from '@/app/_api/product/getProducts';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';

// Define Product type based on the data returned by the API
interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string; // Optional field
  quantity?: number; // Ensure this is included if it's part of the API response
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

  const [isAdding, setIsAdding] = useState<string | null>(null); // Track the product being added to disable button

  // Update cookies whenever cartItems change
  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cartItems), { expires: 7 });
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setIsAdding(product._id); // Disable the button for this product during the process

    try {
      setCartItems((prevItems) => {
        const isProductInCart = prevItems.find((item) => item._id === product._id);

        if (isProductInCart) {
          toast.success(`Increased quantity of ${product.name} in your cart.`);
          return prevItems.map((item) =>
            item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          toast.success(`${product.name} has been added to your cart.`);
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    } catch (e) {
      toast.error('There was an error adding the product to your cart.');
    } finally {
      setIsAdding(null); // Re-enable the button after the process
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" reverseOrder={false} />
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
              className="border rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between bg-white transform hover:scale-105 transition-transform ease-in-out"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-500 transition-colors duration-200">
                {product.name}
              </h3>
              <p className="text-lg font-medium text-gray-700 mb-4">
                ${product.price.toFixed(2)}
              </p>
              {product.description && (
                <p className="text-sm text-gray-500 italic mb-6">{product.description}</p>
              )}
              {product.quantity !== undefined && (
                <p className="text-md font-medium mb-4">
                  {product.quantity > 0 ? (
                    <span className="text-green-600">In Stock: {product.quantity}</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  )}
                </p>
              )}
              <button
                className={`mt-auto text-white py-2 px-5 rounded-full transition-all duration-300 transform ${isAdding === product._id || product.quantity === 0
                    ? 'bg-gray-400 cursor-not-allowed opacity-70'
                    : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 hover:scale-105'
                  }`}
                onClick={() => addToCart(product)}
                disabled={isAdding === product._id || product.quantity === 0}
              >
                {isAdding === product._id ? 'Adding...' : 'Add to cart'}
              </button>

            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
