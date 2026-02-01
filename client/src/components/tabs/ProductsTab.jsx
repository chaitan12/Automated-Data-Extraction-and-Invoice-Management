import React from "react";
import { useSelector } from "react-redux";

function ProductsTab() {
  const products = useSelector((state) => state.products);

  if (!products.length) {
    return <p>No products available</p>;
  }

  return (
    <table border="1" cellPadding="8" width="100%">
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
        {products.map((prod, index) => (
          <tr key={index}>
            <td>{prod.name}</td>
            <td>{prod.quantity}</td>
            <td>{prod.unitPrice}</td>
            <td>{prod.tax}</td>
            <td>{prod.priceWithTax}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductsTab;
