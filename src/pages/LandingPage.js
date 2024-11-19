import React from 'react';
import {  FaUsers, FaBox, FaArrowRight } from 'react-icons/fa';


function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Swipe Invoice AI</h1>
          <button 
            className="px-4 py-2 border rounded hover:bg-gray-700"
            onClick={() => window.location.href = '/dashboard'}
          >
            Launch App
          </button>
        </nav>
      </header>
      
      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Revolutionize Your Invoice Management
        </h2>
        
        <p className="text-xl mb-12 max-w-2xl mx-auto">
          Harness the power of AI to extract, process, and manage your invoices effortlessly.
          Upload any file format and watch the magic happen.
        </p>
        
        <button 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg animate-pulse flex items-center mx-auto"
          onClick={() => window.location.href = '/dashboard'}
        >
          Get Started <FaArrowRight className="ml-2" />
        </button>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            
            title="Smart Invoices"
            description="AI-powered extraction from various file formats including Excel, PDF, and images."
          />
          <FeatureCard
            icon={<FaBox className="w-12 h-12 mb-4 text-purple-400" />}
            title="Product Insights"
            description="Automatically organize and track your products with real-time updates across the platform."
          />
          <FeatureCard
            icon={<FaUsers className="w-12 h-12 mb-4 text-green-400" />}
            title="Customer Management"
            description="Keep track of your customers and their purchase history with ease."
          />
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        © 2024 Swipe Invoice AI. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-lg bg-gray-800 bg-opacity-50 backdrop-blur-lg hover:bg-opacity-75 transition-all duration-300">
      {icon}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

export default LandingPage;