'use client';

import { useGetOrders } from '@/app/_api/order/getOrders';
import { formatDateIfValid } from '@/app/_utils/date';
import { ChevronRightIcon, ChevronLeftIcon, FunnelIcon, CalendarIcon, CurrencyDollarIcon, CheckCircleIcon, CreditCardIcon, TruckIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const ORDERS_PER_PAGE = 2;

const OrdersPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    // Build filters based on user inputs
    const filters = {
        status: statusFilter || undefined,
        minTotalAmount: minAmount ? parseFloat(minAmount) : undefined,
        maxTotalAmount: maxAmount ? parseFloat(maxAmount) : undefined,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
    };

    const { data: orders = [], isLoading, isError, error } = useGetOrders(filters);

    const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
    const paginatedOrders = orders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

    const handleCancelOrder = (orderId: string) => {
        console.log(`Cancel Order ID: ${orderId}`);
    };

    if (isLoading) {
        return <div className="text-center text-gray-500">Loading orders...</div>;
    }

    if (isError) {
        return <div className="text-center text-red-500">Error: {error instanceof Error ? error.message : 'Failed to load orders'}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Your Orders</h1>

                {/* Filters */}
                <div className="mb-8 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col">
                            <label className="mb-2 text-gray-700 font-semibold flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-gray-500 mr-2" /> Status:
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Rejected by the Seller">Rejected by the Seller</option>
                            </select>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col w-full">
                                <label className="mb-2 text-gray-700 font-semibold flex items-center">
                                    <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-2" /> Amount Range:
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minAmount}
                                        onChange={(e) => setMinAmount(e.target.value)}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxAmount}
                                        onChange={(e) => setMaxAmount(e.target.value)}
                                        className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-2 text-gray-700 font-semibold flex items-center">
                                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" /> Date Range:
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display Orders */}
                <div className="space-y-8">
                    {paginatedOrders.map((order) => (
                        <div key={order._id} className="bg-white shadow-xl rounded-xl p-8 mb-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-xl font-bold text-gray-800">Order ID: {order._id}</p>
                                    <p className="text-sm text-gray-500">Created: {formatDateIfValid(order.createdDate)}</p>
                                    <p className="text-sm text-gray-500">Updated: {formatDateIfValid(order.updatedDate)}</p>
                                </div>
                                <div
                                    className={`py-1 px-5 rounded-full text-sm font-medium capitalize ${
                                        order.status === 'Completed'
                                            ? 'bg-green-100 text-green-600'
                                            : order.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : 'bg-red-100 text-red-600'
                                    }`}
                                >
                                    {order.status}
                                </div>
                            </div>

                            {/* Products */}
                            <div className="border-t pt-6">
                                <p className="text-xl font-bold text-gray-800 mb-3">Products</p>
                                <ul className="space-y-1">
                                    {order.products.map((product, index) => (
                                        <li key={index} className="flex justify-between py-2 text-gray-700">
                                            <span>
                                                {product.productId.name} -{' '}
                                                <span className="font-medium text-gray-900">${product.price}</span>
                                            </span>
                                            <span className="font-semibold text-gray-900">x{product.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Total and Cancel Button */}
                            <div className="mt-8 flex flex-col gap-4 items-end">
                                <p className="text-xl font-semibold text-gray-800">
                                    Total: <span className="font-bold text-blue-600">${order.totalAmount}</span>
                                </p>
                                {order.status === 'Pending' && (
                                    <button
                                        onClick={() => handleCancelOrder(order._id)}
                                        className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            {/* Payment and Delivery Details */}
                            <div className="mt-8 transition-all w-full flex justify-between border-t pt-6">
                                <div className="mt-4 flex-1">
                                    <div className="flex items-center mb-4">
                                        <CreditCardIcon className="h-6 w-6 text-gray-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-700">Payment Details</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        Method: <span className="font-medium text-gray-800">{order.paymentDetails.method}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        Reference: <span className="font-medium text-gray-800">{order.paymentDetails.reference}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        Status: <span className="font-medium text-gray-800">{order.paymentDetails.status}</span>
                                    </p>
                                </div>

                                <div className="mt-4 flex-1">
                                    <div className="flex items-center mb-4">
                                        <TruckIcon className="h-6 w-6 text-gray-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-700">Delivery Details</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        Destination:{' '}
                                        <span className="font-medium text-gray-800">{order.deliveryDetails.destination}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        Recipient:{' '}
                                        <span className="font-medium text-gray-800">
                                            {order.deliveryDetails.recipientName} - {order.deliveryDetails.recipientPhone}
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        Tracking: <span className="font-medium text-gray-800">{order.deliveryDetails.tracking}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        Status: <span className="font-medium text-gray-800">{order.deliveryDetails.status}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="mt-8 flex items-center justify-center gap-6">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-opacity duration-200 disabled:opacity-50 hover:bg-blue-500 disabled:cursor-not-allowed"
                    >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Previous
                    </button>
                    <span className="text-lg font-semibold">
                        Page <span className="text-blue-600">{currentPage}</span> of <span className="text-blue-600">{totalPages}</span>
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-opacity duration-200 disabled:opacity-50 hover:bg-blue-500 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRightIcon className="h-5 w-5 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
