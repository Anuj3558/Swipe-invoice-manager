import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  invoices: [],
  products: [],
  processedFiles: [],
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setExtractedData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateProduct: (state, action) => {
      const { id, updates } = action.payload;
      const productIndex = state.products.findIndex(product => product.id === id);
      if (productIndex !== -1) {
        state.products[productIndex] = { ...state.products[productIndex], ...updates };
        // Update corresponding invoices
        state.invoices = state.invoices.map(invoice => {
          if (invoice.productId === id) {
            return { ...invoice, productName: updates.name || invoice.productName };
          }
          return invoice;
        });
      }
    },
    updateCustomer: (state, action) => {
      const { id, updates } = action.payload;
      const customerIndex = state.customers.findIndex(customer => customer.id === id);
      if (customerIndex !== -1) {
        state.customers[customerIndex] = { ...state.customers[customerIndex], ...updates };
        // Update corresponding invoices
        state.invoices = state.invoices.map(invoice => {
          if (invoice.customerId === id) {
            return { ...invoice, customerName: updates.customerName || invoice.customerName };
          }
          return invoice;
        });
      }
    },
  },
});

export const { setExtractedData, updateProduct, updateCustomer } = dashboardSlice.actions;

export default dashboardSlice.reducer;