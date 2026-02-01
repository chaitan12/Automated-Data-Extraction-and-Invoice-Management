import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customers",
  initialState: [],
  reducers: {
    setCustomers: (state, action) => {
      return action.payload;
    },
  },
});

export const { setCustomers } = customerSlice.actions;
export default customerSlice.reducer;
