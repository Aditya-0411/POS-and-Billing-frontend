// src/pages/EditStore.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

const EditStore = () => {
  const [store, setStore] = useState({ name: '', contact: '', address: '' });
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get('https://pos-and-billing-software.onrender.com/api/auth/store/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.status === 200) setStore(res.data);
    }).catch(() => alert('Failed to fetch store'));
  }, []);

  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put('https://pos-and-billing-software.onrender.com/api/auth/store/', store, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => alert('Store updated successfully!'))
      .catch(() => alert('Failed to update store'));
  };

  return (
    <Container className="mt-4">
      <h2>Edit Store</h2>
      <Form onSubmit={handleUpdate}>
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
        <Button type="submit" variant="primary">Update Store</Button>
      </Form>
    </Container>
  );
};

export default EditStore;
