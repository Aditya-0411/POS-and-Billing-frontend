import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });

  const token = localStorage.getItem('access');

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('https://pos-and-billing-software.onrender.com/api/auth/product/create/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product added!');
      setFormData({ name: '', price: '', stock: '' });
    } catch {
      alert('Failed to add product.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {['name', 'price', 'stock'].map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              type={field === 'price' || field === 'stock' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
