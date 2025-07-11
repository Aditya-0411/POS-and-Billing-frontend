import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get('https://pos-and-billing-software.onrender.com/api/auth/invoices/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      setInvoices(res.data);
    }).catch(() => {
      alert("Error fetching invoices.");
    });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Invoice List</h2>
      <table className="table table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Subtotal</th>
            <th>GST (%)</th>
            <th>GST Amount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td>{inv.customer_name}</td>
              <td>{new Date(inv.created_at).toLocaleDateString()}</td>
              <td>₹{inv.subtotal}</td>
              <td>{inv.gst_percentage}%</td>
              <td>₹{inv.gst_amount}</td>
              <td><strong>₹{inv.total}</strong></td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr><td colSpan="6" className="text-center">No invoices available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
