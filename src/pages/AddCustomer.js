import React, { useState } from 'react';
import axios from 'axios';

const AddCustomer = () => {
  const [data, setData] = useState({ name: '', phone: '', email: '' });
  const token = localStorage.getItem('access');

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('https://pos-and-billing-software.onrender.com/api/auth/customers/create/', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Customer added!');
      setData({ name: '', phone: '', email: '' });
    } catch {
      alert('Failed to add customer.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        {['name', 'phone', 'email'].map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={data[field]}
              onChange={handleChange}
              className="form-control"
              required={field !== 'email'}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-success">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
