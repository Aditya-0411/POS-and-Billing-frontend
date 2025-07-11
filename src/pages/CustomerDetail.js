// src/pages/CustomerDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get('https://pos-and-billing-software.onrender.com/api/auth/customers/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const match = res.data.find(c => c.id === parseInt(id));
      if (match) setCustomer(match);
      else alert("Customer not found");
    })
    .catch(() => alert("Failed to fetch customer"));
  }, [id]);

  const handleChange = e => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const handleUpdate = () => {
    axios.put(`https://pos-and-billing-software.onrender.com/api/auth/customers/${id}/`, customer, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => alert("Customer updated successfully"))
    .catch(() => alert("Update failed"));
  };

  return (
    <div className="container mt-4">
      <h2>Edit Customer</h2>
      <div className="card p-4 shadow-sm">
        {['name', 'phone', 'email'].map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field.toUpperCase()}</label>
            <input
              name={field}
              className="form-control"
              value={customer[field] || ''}
              onChange={handleChange}
              required={field !== 'email'}
            />
          </div>
        ))}
        <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
        <button className="btn btn-secondary ms-2" onClick={() => navigate('/customers')}>Back</button>
      </div>
    </div>
  );
};

export default CustomerDetail;
