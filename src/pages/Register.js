import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('https://pos-and-billing-software.onrender.com/api/auth/register/', formData);
      setMessage('User registered successfully!');
    } catch (err) {
      setError(err.response.data.error || 'Registration failed');
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow-sm p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Register</h3>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="password2" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" name="password2" value={formData.password2} onChange={handleChange} required />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">Register</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
