'use client'
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
    CheckCircleIcon,
    XMarkIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { createOrder } from '@/app/_api/order/createOrder'; // Adjust import path as needed
import { CartItem } from './page';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose }) => {
    const [recipientName, setRecipientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [isLoading, setIsLoading] = useState(false);
    const [cartItems, setCartItems] = useState<any>()

    const handleSubmit = async () => {
        if (!recipientName || !phoneNumber || !address) {
            toast.error('Please fill out all required fields.');
            return;
        }

        const orderData = {
            products: [...cartItems],
            totalAmount: 730, // Replace with calculated total in future
            paymentDetails: {
                method: paymentMethod,
                status: 'Pending',
                reference: paymentMethod === 'Cash' ? undefined : 'PAY12345', // Simulated reference
            },
            deliveryDetails: {
                recipientName,
                recipientPhone: phoneNumber,
                destination: address,
                tracking: 'Warehouse',
                status: 'Pending',
            },
            status: 'Pending',
        };

        try {
            setIsLoading(true);
            await createOrder(orderData);
            toast.success('Order placed successfully!');
            onClose();
            Cookies.remove("cart")
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to place order. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const cartItems = Cookies.get("cart")
        const parsedCartItems = cartItems ? JSON.parse(cartItems) : []
        if (parsedCartItems?.length) {
            const filterdCartItems = parsedCartItems.map((item : CartItem) => {
                return {
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }
            })
            console.log("filterdCartItems", filterdCartItems)
            setCartItems([...filterdCartItems])
        }
    },[])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-20">
            <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-900"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
                    <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                    <span>Enter Order Details</span>
                </h2>

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Recipient Name</label>
                    <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Destination Address</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Shipping Address"
                        className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="Cash"
                                name="payment"
                                value="Cash"
                                checked={paymentMethod === 'Cash'}
                                onChange={() => setPaymentMethod('Cash')}
                                className="mr-2"
                            />
                            <label htmlFor="Cash" className="text-gray-600 flex items-center space-x-2">
                                <CurrencyDollarIcon className="h-5 w-5" />
                                <span>Cash</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Placing Order...' : 'Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
