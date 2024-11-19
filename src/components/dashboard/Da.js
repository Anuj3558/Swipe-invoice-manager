import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, DollarSign, ShoppingCart, Users } from 'lucide-react';
import UploadPage from './UploadPage';

// Sample data for charts and tables
const revenueData = [
  { month: 'Jan', revenue: 5000 },
  { month: 'Feb', revenue: 7000 },
  { month: 'Mar', revenue: 6000 },
  { month: 'Apr', revenue: 8000 },
  { month: 'May', revenue: 9000 },
  { month: 'Jun', revenue: 11000 },
];

const invoicesData = [
  { id: 'INV001', customer: 'Acme Corp', amount: 1000, status: 'Paid' },
  { id: 'INV002', customer: 'Globex Inc', amount: 1500, status: 'Pending' },
  { id: 'INV003', customer: 'Initech', amount: 800, status: 'Paid' },
  { id: 'INV004', customer: 'Umbrella Corp', amount: 2000, status: 'Overdue' },
];

const productsData = [
  { id: 'P001', name: 'Widget A', price: 50, stock: 100 },
  { id: 'P002', name: 'Gadget B', price: 75, stock: 50 },
  { id: 'P003', name: 'Doohickey C', price: 30, stock: 200 },
  { id: 'P004', name: 'Thingamajig D', price: 100, stock: 25 },
];

const customersData = [
  { id: 'C001', name: 'John Doe', email: 'john@example.com', totalPurchases: 5000 },
  { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', totalPurchases: 7500 },
  { id: 'C003', name: 'Bob Johnson', email: 'bob@example.com', totalPurchases: 3000 },
  { id: 'C004', name: 'Alice Brown', email: 'alice@example.com', totalPurchases: 6000 },
];

function Card({ title, value, icon, subtext }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold text-blue-400">{value}</div>
      <p className="text-xs text-gray-400">{subtext}</p>
    </div>
  );
}

function Table({ headers, data }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left text-gray-300 bg-gray-700">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 text-gray-300">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('invoices');

  return (
    <div className="flex flex-col space-y-6 p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-blue-400">Dashboard</h1>
    <UploadPage />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Revenue"
          value="$46,800"
          icon={<DollarSign className="w-4 h-4 text-blue-400" />}
          subtext="+20.1% from last month"
        />
        <Card
          title="Invoices"
          value="234"
          icon={<BarChart3 className="w-4 h-4 text-blue-400" />}
          subtext="+12.5% from last month"
        />
        <Card
          title="Products"
          value="45"
          icon={<ShoppingCart className="w-4 h-4 text-blue-400" />}
          subtext="+5 new this month"
        />
        <Card
          title="Customers"
          value="573"
          icon={<Users className="w-4 h-4 text-blue-400" />}
          subtext="+18 new this month"
        />
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Revenue Overview</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'invoices' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'customers' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
        </div>

        {activeTab === 'invoices' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-400">Invoices</h2>
              <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Create Invoice</button>
            </div>
            <Table
              headers={['Invoice ID', 'Customer', 'Amount', 'Status']}
              data={invoicesData}
            />
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-400">Products</h2>
              <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Add Product</button>
            </div>
            <Table
              headers={['Product ID', 'Name', 'Price', 'Stock']}
              data={productsData}
            />
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-400">Customers</h2>
              <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Add Customer</button>
            </div>
            <Table
              headers={['Customer ID', 'Name', 'Email', 'Total Purchases']}
              data={customersData}
            />
          </div>
        )}
      </div>
    </div>
  );
}