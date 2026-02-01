import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setInvoices } from "../redux/invoiceSlice";
import { setProducts } from "../redux/productSlice";
import { setCustomers } from "../redux/customerSlice";

function FileUpload() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:5000/api/extract",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { invoices, products, customers } = response.data;

      dispatch(setInvoices(invoices || []));
      dispatch(setProducts(products || []));
      dispatch(setCustomers(customers || []));

    } catch (err) {
      setError("File processing failed. Please try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Invoice File</h2>

      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.xlsx"
        onChange={handleFileUpload}
      />

      {loading && <p>Processing file with AI...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default FileUpload;
