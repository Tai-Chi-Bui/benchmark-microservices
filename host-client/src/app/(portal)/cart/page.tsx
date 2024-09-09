'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { TrashIcon, ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import styles from './CartPage.module.css'; // Import the CSS module

// Define CartItem type
interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from cookies
  useEffect(() => {
    const savedCart = Cookies.get('cart');
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  // Update quantity of an item in the cart
  const updateQuantity = (id: string, newQuantity: number) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    Cookies.set('cart', JSON.stringify(updatedCart)); // Update the cookie as well
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    Cookies.set('cart', JSON.stringify(updatedCart)); // Update the cookie as well
  };

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
        <ShoppingBagIcon className="h-8 w-8 mr-2 text-blue-500" />
        Your Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-700">
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/products" className="text-blue-500 hover:underline flex items-center justify-center">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Browse products
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <ul className="space-y-6">
            {cartItems.map((item) => (
              <li key={item._id} className="border-b border-gray-200 pb-6 last:border-none">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold text-gray-900">{item.name}</div>
                    <div className="text-gray-600">- ${item.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Quantity: </span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                        className={styles.quantityInput} // Apply the CSS module class
                      />
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition duration-300 ease-in-out flex items-center"
                    >
                      <TrashIcon className="h-5 w-5 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Total amount section */}
          <div className="mt-6 border-t border-gray-200 pt-6 text-right">
            <p className="text-xl font-semibold text-gray-900">
              Total: ${totalAmount.toFixed(2)}
            </p>
          </div>

          {/* Checkout button (disabled for now) */}
          <div className="mt-6 text-right">
            <button
              className="bg-gray-300 text-white py-2 px-6 rounded-md shadow-md cursor-not-allowed"
              disabled
            >
              Checkout (coming soon)
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Link href="/products" className="inline-block bg-blue-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
