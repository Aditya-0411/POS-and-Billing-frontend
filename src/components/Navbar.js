// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [hasStore, setHasStore] = useState(localStorage.getItem('hasStore') === 'true');
  const isLoggedIn = !!localStorage.getItem('access');
  const token = localStorage.getItem('access');

  useEffect(() => {
    if (isLoggedIn && !hasStore) {
      axios.get('http://localhost:8000/api/auth/store/', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.status === 200) {
          localStorage.setItem('hasStore', 'true'); // Set once on first login
          setHasStore(true);
        }
      }).catch(() => {
        localStorage.removeItem('hasStore'); // If store not found
        setHasStore(false);
      });
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">BillingApp</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {isLoggedIn && (
            <>
              {!hasStore && (
                <li className="nav-item">
                  <Link className="nav-link" to="/store">Create Store</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/store/edit">Edit Store</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/product">Add Product</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Product List</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/customer">Add Customer</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/customers">Customer List</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/invoice">Create Invoice</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/invoices">Invoice List</Link>
              </li>
            </>
          )}
        </ul>

        <ul className="navbar-nav">
          {isLoggedIn ? (
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
