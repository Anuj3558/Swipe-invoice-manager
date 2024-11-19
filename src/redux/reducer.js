// src/redux/reducer.js
import {
  SET_CUSTOMERS,
  SET_INVOICES,
  SET_PRODUCTS,
  SET_UPLOAD_STATUS,
  SET_ERROR,
} from "./actions";

// Initial State
const initialState = {
  customers: [],
  invoices: [],
  products: [],
  uploadStatus: "idle",
  error: null,
};

// Root Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
      };
    case SET_INVOICES:
      return {
        ...state,
        invoices: action.payload,
      };
    case SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case SET_UPLOAD_STATUS:
      return {
        ...state,
        uploadStatus: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
