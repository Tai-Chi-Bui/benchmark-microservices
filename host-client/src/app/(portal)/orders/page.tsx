'use client'

import { ChevronRightIcon, ChevronLeftIcon, FunnelIcon, CalendarIcon, CurrencyDollarIcon, CheckCircleIcon, ChevronUpIcon, ChevronDownIcon, CreditCardIcon, TruckIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

interface Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    createdDate: string;
    updatedDate: string;
    products: Product[];
    totalAmount: number;
    paymentDetails: {
        method: 'Cash' | 'Credit Card' | 'Bank Transfer';
        status: 'Pending' | 'Received';
        reference: string; // Transaction number or identifier
    };
    deliveryDetails: {
        location: 'Warehouse' | 'In Transit' | `Customer's Door`;
        status: 'Pending' | 'Completed';
    };
    status: 'Pending' | 'Completed' | 'Cancelled' | 'Rejected by the Seller';
}

const initialOrders: Order[] = [
    {
        id: '12345',
        createdDate: '2024-09-01',
        updatedDate: '2024-09-02',
        products: [
            { id: 'p1', name: 'Product A', quantity: 2, price: 50 },
            { id: 'p2', name: 'Product B', quantity: 1, price: 50 },
        ],
        totalAmount: 150,
        paymentDetails: {
            method: 'Credit Card',
            status: 'Received',
            reference: 'txn12345',
        },
        deliveryDetails: {
            location: 'Customer\'s Door',
            status: 'Completed',
        },
        status: 'Completed',
    },
    {
        id: '67890',
        createdDate: '2024-08-25',
        updatedDate: '2024-08-26',
        products: [
            { id: 'p3', name: 'Product C', quantity: 3, price: 75 },
            { id: 'p4', name: 'Product D', quantity: 1, price: 25 },
        ],
        totalAmount: 250,
        paymentDetails: {
            method: 'Bank Transfer',
            status: 'Pending',
            reference: 'txn67890',
        },
        deliveryDetails: {
            location: 'Warehouse',
            status: 'Pending',
        },
        status: 'Pending',
    },
    {
        id: '98765',
        createdDate: '2024-08-15',
        updatedDate: '2024-08-16',
        products: [
            { id: 'p5', name: 'Product E', quantity: 1, price: 100 },
            { id: 'p6', name: 'Product F', quantity: 2, price: 37.5 },
        ],
        totalAmount: 175,
        paymentDetails: {
            method: 'Cash',
            status: 'Pending',
            reference: 'txn98765',
        },
        deliveryDetails: {
            location: 'In Transit',
            status: 'Pending',
        },
        status: 'Cancelled',
    },
    {
        id: '54321',
        createdDate: '2024-08-05',
        updatedDate: '2024-08-06',
        products: [
            { id: 'p7', name: 'Product G', quantity: 1, price: 60 },
            { id: 'p8', name: 'Product H', quantity: 1, price: 40 },
        ],
        totalAmount: 100,
        paymentDetails: {
            method: 'Credit Card',
            status: 'Pending',
            reference: 'txn54321',
        },
        deliveryDetails: {
            location: 'Warehouse',
            status: 'Pending',
        },
        status: 'Rejected by the Seller',
    },
    {
        id: '11223',
        createdDate: '2024-09-03',
        updatedDate: '2024-09-04',
        products: [
            { id: 'p9', name: 'Product I', quantity: 1, price: 200 },
            { id: 'p10', name: 'Product J', quantity: 3, price: 30 },
        ],
        totalAmount: 290,
        paymentDetails: {
            method: 'Credit Card',
            status: 'Received',
            reference: 'txn11223',
        },
        deliveryDetails: {
            location: 'Customer\'s Door',
            status: 'Completed',
        },
        status: 'Completed',
    },
    {
        id: '33445',
        createdDate: '2024-08-18',
        updatedDate: '2024-08-19',
        products: [
            { id: 'p11', name: 'Product K', quantity: 2, price: 45 },
            { id: 'p12', name: 'Product L', quantity: 1, price: 120 },
        ],
        totalAmount: 210,
        paymentDetails: {
            method: 'Bank Transfer',
            status: 'Received',
            reference: 'txn33445',
        },
        deliveryDetails: {
            location: 'In Transit',
            status: 'Completed',
        },
        status: 'Completed',
    },
    {
        id: '99887',
        createdDate: '2024-07-22',
        updatedDate: '2024-07-23',
        products: [
            { id: 'p13', name: 'Product M', quantity: 1, price: 60 },
            { id: 'p14', name: 'Product N', quantity: 4, price: 30 },
        ],
        totalAmount: 180,
        paymentDetails: {
            method: 'Cash',
            status: 'Pending',
            reference: 'txn99887',
        },
        deliveryDetails: {
            location: 'Warehouse',
            status: 'Pending',
        },
        status: 'Pending',
    },
    {
        id: '66789',
        createdDate: '2024-08-02',
        updatedDate: '2024-08-03',
        products: [
            { id: 'p15', name: 'Product O', quantity: 3, price: 55 },
            { id: 'p16', name: 'Product P', quantity: 1, price: 25 },
        ],
        totalAmount: 190,
        paymentDetails: {
            method: 'Credit Card',
            status: 'Received',
            reference: 'txn66789',
        },
        deliveryDetails: {
            location: 'In Transit',
            status: 'Completed',
        },
        status: 'Completed',
    },
    {
        id: '44556',
        createdDate: '2024-07-30',
        updatedDate: '2024-07-31',
        products: [
            { id: 'p17', name: 'Product Q', quantity: 2, price: 80 },
            { id: 'p18', name: 'Product R', quantity: 1, price: 35 },
        ],
        totalAmount: 195,
        paymentDetails: {
            method: 'Bank Transfer',
            status: 'Pending',
            reference: 'txn44556',
        },
        deliveryDetails: {
            location: 'Warehouse',
            status: 'Pending',
        },
        status: 'Pending',
    },
    {
        id: '77889',
        createdDate: '2024-09-07',
        updatedDate: '2024-09-08',
        products: [
            { id: 'p19', name: 'Product S', quantity: 5, price: 40 },
            { id: 'p20', name: 'Product T', quantity: 1, price: 20 },
        ],
        totalAmount: 220,
        paymentDetails: {
            method: 'Cash',
            status: 'Received',
            reference: 'txn77889',
        },
        deliveryDetails: {
            location: 'Customer\'s Door',
            status: 'Completed',
        },
        status: 'Completed',
    }
];

const ORDERS_PER_PAGE = 2;

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null); // Track which order is expanded

    const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
    const paginatedOrders = orders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

    const handleCancelOrder = (orderId: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId && order.status === 'Pending'
                    ? { ...order, status: 'Cancelled' }
                    : order
            )
        );
    };
    const handleFilter = () => {
        let filteredOrders = initialOrders;

        // Filter by status
        if (statusFilter) {
            filteredOrders = filteredOrders.filter((order) => order.status === statusFilter);
        }

        // Filter by amount range
        if (minAmount || maxAmount) {
            filteredOrders = filteredOrders.filter((order) => {
                const min = parseFloat(minAmount) || 0;
                const max = parseFloat(maxAmount) || Infinity;
                return order.totalAmount >= min && order.totalAmount <= max;
            });
        }

        // Filter by date range
        if (dateRange.startDate || dateRange.endDate) {
            const startDate = new Date(dateRange.startDate).getTime() || -Infinity;
            const endDate = new Date(dateRange.endDate).getTime() || Infinity;
            filteredOrders = filteredOrders.filter((order) => {
                const createdDate = new Date(order.createdDate).getTime();
                return createdDate >= startDate && createdDate <= endDate;
            });
        }

        setOrders(filteredOrders);
        setCurrentPage(1); // Reset to page 1 after filtering
    };

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

                    <button
                        onClick={handleFilter}
                        className="w-full bg-blue-400 text-white py-3 rounded-lg hover:bg-blue-500 transition duration-300 flex items-center justify-center gap-2"
                    >
                        <FunnelIcon className="h-5 w-5" /> Apply Filters
                    </button>
                </div>

                {/* Display Orders */}
                <div className="space-y-8">
                    {paginatedOrders.map((order) => (
                        <div key={order.id} className="bg-white shadow-xl rounded-xl p-8 mb-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className='flex flex-col gap-1'>
                                    <p className="text-xl font-bold text-gray-800">Order ID: {order.id}</p>
                                    <p className="text-sm text-gray-500">Created: {order.createdDate}</p>
                                    <p className="text-sm text-gray-500">Updated: {order.updatedDate}</p>
                                </div>
                                <div
                                    className={`py-1 px-5 rounded-full text-sm font-medium capitalize ${order.status === 'Completed'
                                        ? 'bg-green-100 text-green-600'
                                        : order.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : 'bg-red-100 text-red-600'
                                        }`}
                                >
                                    {order.status}
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <p className="text-xl font-bold text-gray-800 mb-3">Products</p>
                                <ul className="space-y-1">
                                    {order.products.map((product, index) => (
                                        <li key={index} className="flex justify-between py-2 text-gray-700">
                                            <span>{product.name} - <span className="font-medium text-gray-900">${product.price}</span></span>
                                            <span className="font-semibold text-gray-900">x{product.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 flex flex-col gap-4 items-end">
                                <p className="text-xl font-semibold text-gray-800">Total: <span className="font-bold text-blue-600">${order.totalAmount}</span></p>
                                {order.status === 'Pending' && (
                                    <button
                                        onClick={() => handleCancelOrder(order.id)}
                                        className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            {/* Payment and Deliver Details */}
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
                                        Status: <span className="font-medium text-gray-800">{order.paymentDetails.status}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        Reference: <span className="font-medium text-gray-800">{order.paymentDetails.reference}</span>
                                    </p>
                                </div>

                                <div className="mt-4 flex-1">
                                    <div className="flex items-center mb-4">
                                        <TruckIcon className="h-6 w-6 text-gray-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-700">Delivery Details</h3>
                                    </div>
                                    <p className="text-gray-600">
                                        Location: <span className="font-medium text-gray-800">{order.deliveryDetails.location}</span>
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
