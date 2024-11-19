import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3, DollarSign, ShoppingCart, Users, FileSpreadsheet, FileText, UserCircle } from 'lucide-react'
import axios from 'axios'

// Dummy sample data (can be removed in production)
const revenueData = [
  { month: 'Jan', revenue: 5000 },
  { month: 'Feb', revenue: 7000 },
  { month: 'Mar', revenue: 6000 },
  { month: 'Apr', revenue: 8000 },
  { month: 'May', revenue: 9000 },
  { month: 'Jun', revenue: 11000 },
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
  
  // New state for extracted data
  const [extractedData, setExtractedData] = useState({
    invoices: [],
    products: [],
    customers: [],
    rawData: []
  })

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

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select files to upload");
      return;
    }

    if (!validateFiles(files)) {
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload/files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            }
          },
        }
      );
console.log(response)
      setUploading(false);
      setExtracting(true);

      // Update extracted data
      if (response.data.success) {
        setExtractedData({
          invoices: response.data.data[0].invoices || [],
          products: response.data.data[0].products || [],
          customers: response.data.data[0].customers || [],
          rawData: response.data.data.rawData || []
        });

        setSuccess(`Extracted data from ${response.data.filesProcessed} file(s)`);
        console.log(extractedData)
        // If there are any processing errors, show them
        if (response.data.errors) {
          setError(response.data.errors.map(e => `${e.filename}: ${e.errorMessage}`).join('; '));
        }
      }

      setExtracting(false);
    } catch (err) {
      setUploading(false);
      setError(
        err.response?.data?.message ||
          "An error occurred during file upload or extraction"
      );
    }
  };

  // Render data table based on active tab
  const renderDataTable = () => {
    let headers = [];
    let data = [];

    switch (activeTab) {
      case 'invoices':
        headers = ['ID', 'Customer', 'Amount', 'Status'];
        data = extractedData.invoices.map(invoice => ({
          id: invoice.id || 'N/A',
          customer: invoice.customer || 'N/A',
          amount: `$${invoice.amount || 0}`,
          status: invoice.status || 'N/A'
        }));
        break;
      case 'products':
        headers = ['ID', 'Name', 'Price', 'Stock'];
        data = extractedData.products.map(product => ({
          id: product.id || 'N/A',
          name: product.name || 'N/A',
          price: `$${product.price || 0}`,
          stock: product.stock || 0
        }));
        break;
      case 'customers':
        headers = ['ID', 'Name', 'Email', 'Total Purchases'];
        data = extractedData.customers.map(customer => ({
          id: customer.id || 'N/A',
          name: customer.name || 'N/A',
          email: customer.email || 'N/A',
          totalPurchases: `$${customer.totalPurchases || 0}`
        }));
        break;
      default:
        return null;
    }

    return <DataTable headers={headers} data={data} />;
  };

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
            value={extractedData.invoices.length.toString()}
            icon={BarChart3}
            subtext={`+${extractedData.invoices.length} this month`}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Products"
            value={extractedData.products.length.toString()}
            icon={ShoppingCart}
            subtext={`+${extractedData.products.length} new`}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Customers"
            value={extractedData.customers.length.toString()}
            icon={Users}
            subtext={`+${extractedData.customers.length} new`}
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
            <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
              Choose files to upload
            </label>
            {files.length > 0 && <div className="mt-2 text-sm text-gray-600">{files.map(file => <div key={file.name}>{file.name}</div>)}</div>}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          {uploading ? (
            <div className="text-blue-500">Uploading...</div>
          ) : (
            <button 
              onClick={handleUpload} 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              disabled={extracting || uploading}
            >
              Upload Files
            </button>
          )}
          {extracting && <div className="text-blue-500">Extracting data...</div>}
          {progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      </Card>

      {/* Extracted Data Section */}
      {extractedData.invoices.length > 0 || 
       extractedData.products.length > 0 || 
       extractedData.customers.length > 0 ? (
        <Card>
          <h2 className="text-xl font-bold mb-4">Extracted Data</h2>
          <div className="flex space-x-4 mb-4">
            {[
              { 
                key: 'invoices', 
                label: 'Invoices', 
                icon: FileText,
                count: extractedData.invoices.length 
              },
              { 
                key: 'products', 
                label: 'Products', 
                icon: FileSpreadsheet,
                count: extractedData.products.length 
              },
              { 
                key: 'customers', 
                label: 'Customers', 
                icon: UserCircle,
                count: extractedData.customers.length 
              }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md
                  ${activeTab === tab.key 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'}
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label} ({tab.count})</span>
              </button>
            ))}
          </div>
          
          {renderDataTable()}
        </Card>
      ) : null}
    </motion.div>
  )
}

export default Dashboard