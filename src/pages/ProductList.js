import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get(`https://pos-and-billing-software.onrender.com/api/auth/products/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Product List</h2>
      <table className="table table-striped shadow mt-3">
        <thead className="table-dark">
          <tr><th>Name</th><th>Price</th><th>Stock</th></tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id}>
              <td>{prod.name}</td>
              <td>₹{prod.price}</td>
              <td>{prod.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
