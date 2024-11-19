import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3, DollarSign, ShoppingCart, Users, Upload, AlertTriangle, CheckCircle } from 'lucide-react'

// Sample data (unchanged)
const revenueData = [
  { month: 'Jan', revenue: 5000 },
  { month: 'Feb', revenue: 7000 },
  { month: 'Mar', revenue: 6000 },
  { month: 'Apr', revenue: 8000 },
  { month: 'May', revenue: 9000 },
  { month: 'Jun', revenue: 11000 },
]

const invoicesData = [
  { id: 'INV001', customer: 'Acme Corp', amount: 1000, status: 'Paid' },
  { id: 'INV002', customer: 'Globex Inc', amount: 1500, status: 'Pending' },
  { id: 'INV003', customer: 'Initech', amount: 800, status: 'Paid' },
  { id: 'INV004', customer: 'Umbrella Corp', amount: 2000, status: 'Overdue' },
]

const productsData = [
  { id: 'P001', name: 'Widget A', price: 50, stock: 100 },
  { id: 'P002', name: 'Gadget B', price: 75, stock: 50 },
  { id: 'P003', name: 'Doohickey C', price: 30, stock: 200 },
  { id: 'P004', name: 'Thingamajig D', price: 100, stock: 25 },
]

const customersData = [
  { id: 'C001', name: 'John Doe', email: 'john@example.com', totalPurchases: 5000 },
  { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', totalPurchases: 7500 },
  { id: 'C003', name: 'Bob Johnson', email: 'bob@example.com', totalPurchases: 3000 },
  { id: 'C004', name: 'Alice Brown', email: 'alice@example.com', totalPurchases: 6000 },
]

function Card({ children, className }) {
  return <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>{children}</div>
}

function StatCard({ title, value, icon: Icon, subtext }) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500">{subtext}</p>
    </Card>
  )
}

function DataTable({ headers, data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Dashboard() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeTab, setActiveTab] = useState('invoices')

  const handleFileChange = (event) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files)
      setFiles(selectedFiles)
      setError(null)
    }
  }

  const validateFiles = (files) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'application/pdf', 
      'image/jpeg', 
      'image/png'
    ]
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      setError(`Unsupported file format(s): ${invalidFiles.map(f => f.name).join(', ')}`)
      return false
    }
    return true
  }

  const simulateExtraction = async () => {
    setExtracting(true)
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    setExtracting(false)
    setSuccess('Data extracted successfully!')
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload')
      return
    }

    if (!validateFiles(files)) {
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    // Simulating file upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploading(false)

    // Simulating AI extraction process
    await simulateExtraction()
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 space-y-8 "
    >
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button className="px-4 py-2 bg-white text-gray-800 rounded-md shadow hover:bg-gray-50">Settings</button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Total Revenue"
            value="$46,800"
            icon={DollarSign}
            subtext="+20.1% from last month"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Invoices"
            value="234"
            icon={BarChart3}
            subtext="+12.5% from last month"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Products"
            value="45"
            icon={ShoppingCart}
            subtext="+5 new this month"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Customers"
            value="573"
            icon={Users}
            subtext="+18 new this month"
          />
        </motion.div>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Revenue Overview</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-4">Upload Files for AI Extraction</h2>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-300">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".xlsx,.pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="file-upload"
              disabled={uploading || extracting}
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer block"
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-sm text-gray-500">
                Supports Excel (.xlsx), PDF, and image files (JPEG, PNG)
              </p>
            </label>
          </div>

          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li 
                    key={index} 
                    className="bg-white p-2 rounded-lg flex justify-between items-center"
                  >
                    <span>{file.name}</span>
                    <span className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button 
            onClick={handleUpload} 
            disabled={uploading || extracting || files.length === 0}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : extracting ? 'Extracting Data...' : 'Upload and Extract Data'}
          </button>

          {(uploading || extracting) && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {uploading ? 'Uploading files...' : 'Extracting data with AI...'}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <AlertTriangle className="inline-block mr-2" />
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <CheckCircle className="inline-block mr-2" />
              <span className="block sm:inline">{success}</span>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'invoices' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'customers' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
        </div>

        {activeTab === 'invoices' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Invoices</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Create Invoice</button>
            </div>
            <DataTable
              headers={['Invoice ID', 'Customer', 'Amount', 'Status']}
              data={invoicesData}
            />
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Products</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Product</button>
            </div>
            <DataTable
              headers={['Product ID', 'Name', 'Price', 'Stock']}
              data={productsData}
            />
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customers</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Customer</button>
            </div>
            <DataTable
              headers={['Customer ID', 'Name', 'Email', 'Total Purchases']}
              data={customersData}
            />
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default Dashboard