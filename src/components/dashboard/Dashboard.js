import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  
} from "lucide-react";
import React, { useState } from "react";


// Card Component
function Card({ children, className }) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}

// Stat Card Component
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
  );
}

// Data Table Component
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
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main Dashboard Component
function Dashboard() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Updated state for extracted data
  const [extractedData, setExtractedData] = useState({
    originalData: [],
    processedFiles: [],
  });

  // File Change Handler
  const handleFileChange = (event) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
      setError(null);
    }
  };

  // File Validation
  const validateFiles = (files) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
    ];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError(
        `Unsupported file format(s): ${invalidFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return false;
    }
    return true;
  };

  // Process response data
  const processResponseData = (response) => {
    if (!response.data?.data?.[0]?.extractedData?.originalData) {
      throw new Error("Invalid response format");
    }

    const originalData = response.data.data[0].extractedData.originalData;

    // Filter out summary rows and process data
    const transactionData = originalData.filter(
      (item) =>
        item["Serial Number"] &&
        item["Serial Number"] !== "Totals" &&
        ![
          "CGST",
          "SGST",
          "IGST",
          "ITEM NET AMOUNT",
          "ITEM TOTAL AMOUNT",
          "QTY",
          "EXTRA DISCOUNT",
          "ROUND OFF AMOUNT",
          "CESS",
        ].includes(item.Qty)
    );

    return {
      originalData: transactionData,
      processedFiles: [response.data.data[0].filename],
    };
  };

  // File Upload Handler
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
        "https://invoice-backend-ypxy.onrender.com/api/upload/files",
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

      setUploading(false);
      setExtracting(true);

      if (response.data.success) {
        const processedData = processResponseData(response);
        setExtractedData(processedData);
        setSuccess(
          `Successfully processed ${processedData.processedFiles.length} file(s)`
        );
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
    const headers = [
      "Serial Number",
      "Invoice Date",
      "Product Name",
      "Quantity",
      "Item Total Amount",
    ];

    const data = extractedData.originalData.map((item) => ({
      serialNumber: item["Serial Number"] || "N/A",
      invoiceDate: item["Invoice Date"] || "N/A",
      productName: item["Product Name"] || "N/A",
      quantity: item["Qty"] || "0",
      totalAmount: item["Item Total Amount"] || "0",
    }));

    return <DataTable headers={headers} data={data} />;
  };

  // Calculate statistics for dashboard
  const calculateStats = () => {
    const data = extractedData.originalData;
    return {
      totalRevenue: data.reduce(
        (sum, item) => sum + parseFloat(item["Item Total Amount"] || 0),
        0
      ),
      totalInvoices: new Set(data.map((item) => item["Serial Number"])).size,
      totalProducts: new Set(data.map((item) => item["Product Name"])).size,
      totalQuantity: data.reduce(
        (sum, item) => sum + parseFloat(item["Qty"] || 0),
        0
      ),
    };
  };

  const stats = calculateStats();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 space-y-8"
    >
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button className="px-4 py-2 bg-white text-gray-800 rounded-md shadow hover:bg-gray-50">
          Settings
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            subtext={`${stats.totalInvoices} invoices`}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Total Invoices"
            value={stats.totalInvoices.toString()}
            icon={BarChart3}
            subtext={`${extractedData.processedFiles.length} files processed`}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Unique Products"
            value={stats.totalProducts.toString()}
            icon={ShoppingCart}
            subtext={`${stats.totalQuantity} total quantity`}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Average Transaction"
            value={`₹${(
              stats.totalRevenue / stats.totalInvoices || 0
            ).toLocaleString()}`}
            icon={Users}
            subtext={`${extractedData.originalData.length} transactions`}
          />
        </motion.div>
      </div>

      {/* File Upload Section */}
      <Card>
        <h2 className="text-xl font-bold mb-4">
          Upload Files for Data Processing
        </h2>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-300">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".xlsx,.pdf"
              className="hidden"
              id="file-upload"
              disabled={uploading || extracting}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-500"
            >
              Choose files to upload
            </label>
            {files.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {files.map((file) => (
                  <div key={file.name}>{file.name}</div>
                ))}
              </div>
            )}
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
          {extracting && (
            <div className="text-blue-500">Processing data...</div>
          )}
          {progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </Card>

      {/* Extracted Data Section */}
      {extractedData.originalData.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Processed Data</h2>
          {renderDataTable()}
        </Card>
      )}
    </motion.div>
  );
}

export default Dashboard;
