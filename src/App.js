// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Register from './pages/Register';
import Login from './pages/Login';
import StoreCreate from './pages/CreateStore';
import AddProduct from './pages/AddProduct';
import ProductList from './pages/ProductList';
import AddCustomer from './pages/AddCustomer';
import CustomerList from './pages/CustomerList';
import AddInvoice from './pages/AddInvoice';
import InvoiceList from './pages/InvoiceList';
import CustomerDetail from './pages/CustomerDetail';
import InvoicePrint from './pages/InvoicePrint';
import EditStore from './pages/EditStore';
import Footer from './components/Footer'; // ✅ Import footer

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <div className="flex-grow-1 container mt-4">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/store" element={<StoreCreate />} />
            <Route path="/product" element={<AddProduct />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/customer" element={<AddCustomer />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/invoice" element={<AddInvoice />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/invoice/:id/print" element={<InvoicePrint />} />
            <Route path="/store/edit" element={<EditStore />} />
          </Routes>
        </div>

        <Footer /> {/* ✅ Footer always at the bottom */}
      </div>
    </Router>
  );
}

export default App;
