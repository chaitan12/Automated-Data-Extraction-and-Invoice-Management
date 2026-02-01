import { createSlice } from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    setInvoices: (state, action) => {
      return action.payload;
    },
  },
});

export const { setInvoices } = invoiceSlice.actions;
export default invoiceSlice.reducer;
