import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("invoices");
  const [data, setData] = useState({
    invoices: [],
    products: [],
    customers: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW

  const handleUpload = async () => {
    if (!file) return;

    setError("");
    setLoading(true); // ✅ START BUFFERING

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError("File processing failed. Please try another file.");
    } finally {
      setLoading(false); // ✅ STOP BUFFERING
    }
  };

  return (
    <div className="app-container">
      <h1>Swipe Invoice Automation</h1>

      {/* UPLOAD CARD */}
      <div className="card">
        <h2>Upload Invoice File</h2>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={loading}
        />

        <br /><br />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Upload"}
        </button>

        {/* 🔄 BUFFERING UI */}
        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Extracting and organizing invoice data…</p>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>

      {/* TABS */}
      {!loading && (
        <>
          <div className="tabs">
            <button
              className={activeTab === "invoices" ? "active" : ""}
              onClick={() => setActiveTab("invoices")}
            >
              Invoices
            </button>
            <button
              className={activeTab === "products" ? "active" : ""}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
            <button
              className={activeTab === "customers" ? "active" : ""}
              onClick={() => setActiveTab("customers")}
            >
              Customers
            </button>
          </div>

          {/* INVOICES */}
          {activeTab === "invoices" && (
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Serial Number</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Tax</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.length === 0 ? (
                    <tr>
                      <td colSpan="7">No invoices available</td>
                    </tr>
                  ) : (
                    data.invoices.map((inv, i) => (
                      <tr key={i}>
                        <td>{inv.serialNumber}</td>
                        <td>{inv.customerName}</td>
                        <td>{inv.productName}</td>
                        <td>{inv.quantity}</td>
                        <td>{inv.tax}</td>
                        <td>{inv.totalAmount}</td>
                        <td>{inv.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Tax</th>
                    <th>Price with Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.length === 0 ? (
                    <tr>
                      <td colSpan="5">No products available</td>
                    </tr>
                  ) : (
                    data.products.map((p, i) => (
                      <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.quantity}</td>
                        <td>{p.unitPrice}</td>
                        <td>{p.tax}</td>
                        <td>{p.priceWithTax}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* CUSTOMERS */}
          {activeTab === "customers" && (
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Total Purchase</th>
                  </tr>
                </thead>
                <tbody>
                  {data.customers.length === 0 ? (
                    <tr>
                      <td colSpan="3">No customers available</td>
                    </tr>
                  ) : (
                    data.customers.map((c, i) => (
                      <tr key={i}>
                        <td>{c.name}</td>
                        <td>{c.phone || "-"}</td>
                        <td>{c.totalPurchaseAmount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
