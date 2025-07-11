import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [editCustomer, setEditCustomer] = useState({});
  const token = localStorage.getItem('access');

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`https://pos-and-billing-software.onrender.com/api/auth/customers/?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(res.data);
    } catch (err) {
      alert("Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const deleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await axios.delete(`https://pos-and-billing-software.onrender.com/api/auth/customers/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCustomers();
    } catch (err) {
      alert("Failed to delete customer.");
    }
  };

  const handleEditChange = (field, value) => {
    setEditCustomer(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`https://pos-and-billing-software.onrender.com/api/auth/customers/${editCustomer.id}/update/`, editCustomer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEdit(false);
      fetchCustomers();
    } catch (err) {
      alert("Failed to update customer");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Customer List</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="🔍 Search by customer name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-dark text-center">
          <tr>
            <th>Name</th><th>Phone</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {customers.map(c => (
            <tr key={c.id}>
              <td className="text-capitalize">{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => { setSelectedCustomer(c); setShowView(true); }}
                >View</Button>

                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => { setEditCustomer(c); setShowEdit(true); }}
                >Edit</Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteCustomer(c.id)}
                >Delete</Button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan="4" className="text-center text-muted">No customers found.</td></tr>
          )}
        </tbody>
      </table>

      {/* ✅ View Modal */}
      <Modal show={showView} onHide={() => setShowView(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {selectedCustomer.name}</p>
          <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
          <p><strong>Email:</strong> {selectedCustomer.email}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowView(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editCustomer.name || ''}
                onChange={e => handleEditChange('name', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={editCustomer.phone || ''}
                onChange={e => handleEditChange('phone', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editCustomer.email || ''}
                onChange={e => handleEditChange('email', e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerList;
