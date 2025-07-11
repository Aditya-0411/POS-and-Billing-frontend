import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <h1 className="display-4 fw-bold">Welcome to Billing System</h1>
          <p className="lead">A lightweight and modern POS billing application for your store.</p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Manage Store</Card.Title>
              <Card.Text>Setup your store and manage subscription plans.</Card.Text>
              <Link to="/store">
                <Button variant="primary">Go to Store</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Products</Card.Title>
              <Card.Text>Add, update, and manage your product inventory.</Card.Text>
              <Link to="/products">
                <Button variant="success">Manage Products</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Invoices</Card.Title>
              <Card.Text>Create and track invoices for your customers.</Card.Text>
              <Link to="/invoices">
                <Button variant="info">View Invoices</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Customers</Card.Title>
              <Card.Text>Manage customer information and billing history.</Card.Text>
              <Link to="/customers">
                <Button variant="warning">Customer List</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <Card.Title>Add Invoice</Card.Title>
              <Card.Text>Create a new invoice directly from the dashboard.</Card.Text>
              <Link to="/invoice">
                <Button variant="dark">Add Invoice</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
