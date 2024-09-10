import React, { useState } from 'react';
import { CheckCircleIcon, PhoneIcon, MapPinIcon, CreditCardIcon, BanknotesIcon, XMarkIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose }) => {
    const [recipientName, setRecipientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const handleSubmit = () => {
        if (!recipientName || !phoneNumber || !address) {
            toast.error(`Please fill out all required fields.`);
            return;
        }
        // Simulate order submission
        toast.success(
            <div>
                <strong>Order placed successfully!</strong>
                <p>Name: <span className="font-medium">{recipientName}</span></p>
                <p>Phone: <span className="font-medium">{phoneNumber}</span></p>
                <p>Address: <span className="font-medium">{address}</span></p>
                <p>Payment: <span className="font-medium capitalize">{paymentMethod}</span></p>
            </div>
        );

        onClose();
    };

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
                    <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                        <span>Recipient Name</span>
                    </label>
                    <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                        <PhoneIcon className="h-5 w-5 text-gray-500" />
                        <span>Phone Number</span>
                    </label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                        <MapPinIcon className="h-5 w-5 text-gray-500" />
                        <span>Destination Address</span>
                    </label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Shipping Address"
                        className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                        <span>Payment Method</span>
                    </label>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="cash"
                                name="payment"
                                value="cash"
                                checked={paymentMethod === 'cash'}
                                onChange={() => setPaymentMethod('cash')}
                                className="mr-2"
                            />
                            <label htmlFor="cash" className="text-gray-400 flex items-center space-x-2">
                                <CurrencyDollarIcon className="h-5 w-5" />
                                <span>Cash</span>
                            </label>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <input
                                type="radio"
                                id="credit-card"
                                name="payment"
                                value="credit-card"
                                disabled
                                className="mr-2"
                            />
                            <label htmlFor="credit-card" className="text-gray-400 flex items-center space-x-2">
                                <CreditCardIcon className="h-5 w-5" />
                                <span>Credit Card (Incoming feature)</span>
                            </label>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <input
                                type="radio"
                                id="bank-transfer"
                                name="payment"
                                value="bank-transfer"
                                disabled
                                className="mr-2"
                            />
                            <label htmlFor="bank-transfer" className="text-gray-400 flex items-center space-x-2">
                                <BanknotesIcon className="h-5 w-5" />
                                <span>Bank Transfer (Incoming feature)</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
