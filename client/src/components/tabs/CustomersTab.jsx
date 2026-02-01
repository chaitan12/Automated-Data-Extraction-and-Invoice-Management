import React from "react";
import { useSelector } from "react-redux";

function CustomersTab() {
  const customers = useSelector((state) => state.customers);

  if (!customers.length) {
    return <p>No customers available</p>;
  }

  return (
    <table border="1" cellPadding="8" width="100%">
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Phone</th>
          <th>Total Purchase</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((cust, index) => (
          <tr key={index}>
            <td>{cust.name}</td>
            <td>{cust.phone}</td>
            <td>{cust.totalPurchaseAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CustomersTab;
