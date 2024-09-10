'use client';

import React, { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useGetProductById } from '@/app/_api/product/getProductById';
import styles from './CartPage.module.css';
import toast, { Toaster } from 'react-hot-toast';

interface CartItemProps {
  itemId: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onUpdateItemTotal: (id: string, itemTotal: number) => void;
  onRemove: (id: string) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  itemId,
  quantity,
  onUpdateQuantity,
  onUpdateItemTotal,
  onRemove,
}) => {
  const { data: product, error, isLoading } = useGetProductById(itemId);
  const [localQuantity, setLocalQuantity] = useState(quantity);

  // Ensure the quantity doesn't exceed stock
  useEffect(() => {
    if (product && product.quantity !== undefined && localQuantity > product.quantity) {
      // Trigger toast notification if the quantity exceeds stock
      toast.error(`Only ${product.quantity} items are in stock.`);
      setLocalQuantity(product.quantity);
      onUpdateQuantity(itemId, product.quantity);
    }
  }, [product?.quantity, localQuantity, onUpdateQuantity, itemId]);

  // Handle quantity change locally and propagate to parent
  const handleQuantityChange = (newQuantity: number) => {
    if (product && product.quantity) {
      // If product.quantity is positive, check if the newQuantity exceeds it
      if (newQuantity > product.quantity) {
        toast.error(`Only ${product.quantity} items are in stock.`);
        setLocalQuantity(product.quantity); // Set to the max available stock
        onUpdateQuantity(itemId, product.quantity);
      } else {
        setLocalQuantity(newQuantity); // Set to the user's input
        onUpdateQuantity(itemId, newQuantity);
      }
    } else {
      // If product.quantity is not positive, just reduce it to zero
      setLocalQuantity(0);
      onUpdateQuantity(itemId, 0);
    }
  };

  // Notify the parent component when the product price or quantity changes
  useEffect(() => {
    if (product && product.price && localQuantity) {
      onUpdateItemTotal(itemId, product.price * localQuantity);
    }
  }, [product?.price, localQuantity, onUpdateItemTotal, itemId]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !product) return <div>Failed to load product</div>;

  return (
    <li className="border-b border-gray-200 pb-6 last:border-none">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-lg font-semibold text-gray-900">{product.name}</div>
          <div className="text-gray-600">- ${product.price.toFixed(2)}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Quantity: </span>
            <input
              type="number"
              min="0"
              value={localQuantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className={styles.quantityInput}
            />
          </div>
          <button
            onClick={() => onRemove(itemId)}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition duration-300 ease-in-out flex items-center"
          >
            <TrashIcon className="h-5 w-5 mr-1" />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItemComponent;
