// src/redux/actions.js
import axios from "axios";

// Action Types
export const SET_CUSTOMERS = "SET_CUSTOMERS";
export const SET_INVOICES = "SET_INVOICES";
export const SET_PRODUCTS = "SET_PRODUCTS";
export const SET_UPLOAD_STATUS = "SET_UPLOAD_STATUS";
export const SET_ERROR = "SET_ERROR";

// Action Creators
export const setCustomers = (customers) => ({
  type: SET_CUSTOMERS,
  payload: customers,
});

export const setInvoices = (invoices) => ({
  type: SET_INVOICES,
  payload: invoices,
});

export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products,
});

export const setUploadStatus = (status) => ({
  type: SET_UPLOAD_STATUS,
  payload: status,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

// Async Action Creator for File Upload
export const uploadFiles = (files) => {
  return async (dispatch) => {
    dispatch(setUploadStatus("uploading"));

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
        }
      );

      if (response.data.success) {
        const extractedData = response.data.data[0].extractedData;

        dispatch(setCustomers(extractedData.customers || []));
        dispatch(setInvoices(extractedData.invoices || []));
        dispatch(setProducts(extractedData.products || []));
        dispatch(setUploadStatus("success"));
      } else {
        dispatch(setError("File upload failed"));
        dispatch(setUploadStatus("error"));
      }
    } catch (error) {
      dispatch(setError(error.message || "An error occurred"));
      dispatch(setUploadStatus("error"));
    }
  };
};
