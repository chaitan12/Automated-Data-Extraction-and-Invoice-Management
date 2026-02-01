import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "./invoiceSlice";
import productReducer from "./productSlice";
import customerReducer from "./customerSlice";

export const store = configureStore({
  reducer: {
    invoices: invoiceReducer,
    products: productReducer,
    customers: customerReducer,
  },
});
