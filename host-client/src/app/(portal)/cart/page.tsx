'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { ShoppingBagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import CartItemComponent from './CartItemComponent'; // Import the new component

// Define CartItem type
interface CartItem {
  _id: string;
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemTotals, setItemTotals] = useState<{ [key: string]: number }>({});

  // Load cart items from cookies
  useEffect(() => {
    const savedCart = Cookies.get('cart');
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  // Memoize the function to avoid recreating it on each render
  const updateItemTotal = useCallback((id: string, itemTotal: number) => {
    setItemTotals((prevTotals) => ({
      ...prevTotals,
      [id]: itemTotal,
    }));
  }, []);

  // Update quantity of an item in the cart
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove the item if quantity is 0 or less
      removeFromCart(id);
    } else {
      // Update the quantity if it's positive
      const updatedCart = cartItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      Cookies.set('cart', JSON.stringify(updatedCart)); // Update the cookie as well
    }
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    Cookies.set('cart', JSON.stringify(updatedCart)); // Update the cookie as well

    // Also remove the total for this item
    setItemTotals((prevTotals) => {
      const { [id]: _, ...rest } = prevTotals;
      return rest;
    });
  };

  // Calculate the total amount by summing up all item totals
  const totalAmount = Object.values(itemTotals).reduce((acc, curr) => acc + curr, 0);

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
              <CartItemComponent
                key={item._id}
                itemId={item._id}
                quantity={item.quantity}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onUpdateItemTotal={updateItemTotal}
              />
            ))}
          </ul>
          {/* Total amount section */}
          <div className="mt-6 border-t border-gray-200 pt-6 text-right">
            <p className="text-xl font-semibold text-gray-900">
              Total: ${totalAmount.toFixed(2)}
            </p>
          </div>
          {/* Order button (disabled for now) */}
          <div className="mt-6 text-right">
            <button
              className="bg-gray-300 text-white py-2 px-6 rounded-md shadow-md cursor-not-allowed"
              disabled
            >
              Place an order
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
