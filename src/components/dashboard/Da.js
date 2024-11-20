import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BarChart3, DollarSign, ShoppingCart, Users, FileText, FileSpreadsheet, UserCircle } from 'lucide-react';
import Card from './Card';
import StatCard from './StatCard';
import {DataTable} from './DataTable';
import FileUpload from './FileUploader';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('invoices');
  const { customers, invoices, products, processedFiles } = useSelector(state => state.dashboard);

  const renderDataTable = () => {
    let headers = [];
    let data = [];

    switch (activeTab) {
      case 'invoices':
        headers = ['Serial Number', 'Customer', 'Product', 'Date', 'Quantity', 'Total Amount', 'Tax'];
        data = invoices.map(invoice => ({
          serialNumber: invoice.serialNumber || 'N/A',
          customerName: invoice.customerName || 'N/A',
          productName: invoice.productName || 'N/A',
          date: invoice.date || 'N/A',
          quantity: invoice.quantity || 0,
          totalAmount: `₹${invoice.totalAmount?.toLocaleString() || 0}`,
          tax: `${invoice.tax || 0}%`,
        }));
        break;
      case 'products':
        headers = ['Name', 'Unit Price', 'Price with Tax', 'Quantity', 'Tax'];
        data = products.map(product => ({
          name: product.name || 'N/A',
          unitPrice: `₹${product.unitPrice?.toLocaleString() || 0}`,
          priceWithTax: `₹${product.priceWithTax?.toLocaleString() || 0}`,
          quantity: product.quantity || 0,
          tax: `${product.tax || 0}%`,
        }));
        break;
      case 'customers':
        headers = ['Name', 'Phone Number', 'Address', 'Total Purchase Amount'];
        data = customers.map(customer => ({
          customerName: customer.customerName || 'N/A',
          phoneNumber: customer.phoneNumber || 'N/A',
          address: customer.address || 'N/A',
          totalPurchaseAmount: `₹${customer.totalPurchaseAmount?.toLocaleString() || 0}`,
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
            value={`₹${invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0).toLocaleString()}`}
            icon={DollarSign}
            subtext={`${invoices.length} invoices`}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Invoices"
            value={invoices.length.toString()}
            icon={BarChart3}
            subtext={`${processedFiles.length} files processed`}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Products"
            value={products.length.toString()}
            icon={ShoppingCart}
            subtext={`${products.reduce((sum, prod) => sum + (prod.quantity || 0), 0)} total quantity`}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <StatCard
            title="Customers"
            value={customers.length.toString()}
            icon={Users}
            subtext={`Total Purchase: ₹${customers.reduce((sum, cust) => sum + (cust.totalPurchaseAmount || 0), 0).toLocaleString()}`}
          />
        </motion.div>
      </div>

      <FileUpload />

      {(invoices.length > 0 || products.length > 0 || customers.length > 0) && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Extracted Data</h2>
          <div className="flex space-x-4 mb-4">
            {[
              { key: 'invoices', label: 'Invoices', icon: FileText, count: invoices.length },
              { key: 'products', label: 'Products', icon: FileSpreadsheet, count: products.length },
              { key: 'customers', label: 'Customers', icon: UserCircle, count: customers.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md
                  ${activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label} ({tab.count})</span>
              </button>
            ))}
          </div>

          {renderDataTable()}
        </Card>
      )}
    </motion.div>
  );
}

export default Dashboard;