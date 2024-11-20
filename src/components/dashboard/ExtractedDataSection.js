import React from "react";
import Card from "./Card";
import DataTable from "./DataTable";

function ExtractedDataSection({ extractedData, activeTab, setActiveTab }) {
  const renderDataTable = () => {
    let headers = [];
    let data = [];

    switch (activeTab) {
      case "invoices":
        headers = [
          "Serial Number",
          "Customer",
          "Date",
          "Quantity",
          "Total Amount",
          "Tax",
        ];
        data = extractedData.invoices.map((invoice) => ({
          serialNumber: invoice.serialNumber || "N/A",
          customerName: invoice.customerName || "N/A",
          date: invoice.date || "N/A",
          quantity: invoice.quantity || 0,
          totalAmount: `₹${invoice.totalAmount?.toLocaleString() || 0}`,
          tax: `${invoice.tax || 0}%`,
        }));
        break;
      case "products":
        headers = ["Name", "Unit Price", "Price with Tax", "Quantity", "Tax"];
        data = extractedData.products.map((product) => ({
          name: product.name || "N/A",
          unitPrice: `₹${product.unitPrice?.toLocaleString() || 0}`,
          priceWithTax: `₹${product.priceWithTax?.toLocaleString() || 0}`,
          quantity: product.quantity || 0,
          tax: `${product.tax || 0}%`,
        }));
        break;
      case "customers":
        headers = ["Name", "Phone Number", "Address", "Total Purchase Amount"];
        data = extractedData.customers.map((customer) => ({
          customerName: customer.customerName || "N/A",
          phoneNumber: customer.phoneNumber || "N/A",
          address: customer.address || "N/A",
          totalPurchaseAmount: `₹${
            customer.totalPurchaseAmount?.toLocaleString() || 0
          }`,
        }));
        break;
      default:
        return null;
    }

    return <DataTable headers={headers} data={data} />;
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Extracted Data</h2>
      <div className="flex space-x-4 mb-4">
        {["invoices", "products", "customers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderDataTable()}
    </Card>
  );
}

export default ExtractedDataSection;
