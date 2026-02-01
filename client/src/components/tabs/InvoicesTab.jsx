import React from "react";
import { useSelector } from "react-redux";

function InvoicesTab() {
  const invoices = useSelector((state) => state.invoices);

  if (!invoices.length) {
    return <p>No invoices available</p>;
  }

  return (
    <table border="1" cellPadding="8" width="100%">
      <thead>
        <tr>
          <th>Serial No</th>
          <th>Customer</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Tax</th>
          <th>Total Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv, index) => (
          <tr key={index}>
            <td>{inv.serialNumber}</td>
            <td>{inv.customerName}</td>
            <td>{inv.productName}</td>
            <td>{inv.quantity}</td>
            <td>{inv.tax}</td>
            <td>{inv.totalAmount}</td>
            <td>{inv.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InvoicesTab;
