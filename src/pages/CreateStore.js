// src/pages/CreateStore.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const StoreCreate = () => {
  const [store, setStore] = useState({ name: '', contact: '', address: '' });
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  const handleChange = e => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('https://pos-and-billing-software.onrender.com/api/auth/store/create/', store, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      localStorage.setItem('hasStore', 'true'); // ✅ Set flag
      navigate('/store/edit'); // ✅ Redirect
    }).catch(err => {
      alert(err.response?.data?.detail || "Failed to create store.");
    });
  };

  return (
    <div className="container mt-4">
      <h2>Create Store</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Store Name</Form.Label>
          <Form.Control name="name" value={store.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contact</Form.Label>
          <Form.Control name="contact" value={store.contact} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control name="address" value={store.address} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="primary">Create Store</Button>
      </Form>
    </div>
  );
};

export default StoreCreate;
