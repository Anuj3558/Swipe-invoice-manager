import React from 'react';
import { FaUsers, FaBox, FaArrowRight, FaFileInvoiceDollar, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+')] opacity-75"></div>
      <div className="relative">
        <header className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center">
            <motion.h1 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Swipe Invoice AI
            </motion.h1>
            <motion.button 
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => window.location.href = '/dashboard'}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Launch App
            </motion.button>
          </nav>
        </header>
        
        <main className="container mx-auto px-4 py-16 text-center">
          <motion.h2 
            className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Revolutionize Your Invoice Management
          </motion.h2>
          
          <motion.p 
            className="text-2xl mb-12 max-w-3xl mx-auto text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Harness the power of AI to extract, process, and manage your invoices effortlessly.
            Upload any file format and watch the magic happen.
          </motion.p>
          
          <motion.button 
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center mx-auto"
            onClick={() => window.location.href = '/dashboard'}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started <FaArrowRight className="ml-2" />
          </motion.button>
          
          <motion.div 
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <FeatureCard
              icon={<FaFileInvoiceDollar className="w-16 h-16 mb-6 text-blue-500" />}
              title="Smart Invoices"
              description="AI-powered extraction from various file formats including Excel, PDF, and images."
            />
            <FeatureCard
              icon={<FaBox className="w-16 h-16 mb-6 text-purple-500" />}
              title="Product Insights"
              description="Automatically organize and track your products with real-time updates across the platform."
            />
            <FeatureCard
              icon={<FaUsers className="w-16 h-16 mb-6 text-green-500" />}
              title="Customer Management"
              description="Keep track of your customers and their purchase history with ease."
            />
          </motion.div>
        </main>
        
        <motion.footer 
          className="container mx-auto px-4 py-8 text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          © 2024 Swipe Invoice AI. All rights reserved.
        </motion.footer>
      </div>
      <motion.div
        className="fixed bottom-8 right-8 text-6xl text-blue-500"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <FaRocket className="animate-bounce" />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      className="p-8 rounded-2xl bg-white bg-opacity-50 backdrop-blur-lg hover:bg-opacity-75 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className="mb-6"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

export default LandingPage;