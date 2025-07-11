import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';

const InvoicePrint = () => {
  const { id } = useParams(); // Assumes you are passing invoice ID via route
  const [invoice, setInvoice] = useState(null);
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get(`https://pos-and-billing-software.onrender.com/api/auth/invoices/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setInvoice(res.data))
      .catch(() => alert('Failed to fetch invoice'));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById('invoice-content');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${id}.pdf`);
    });
  };

  if (!invoice) return <div className="text-center mt-5">Loading Invoice...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={handlePrint}>🖨️ Print</button>
        <button className="btn btn-success" onClick={handleDownloadPDF}>📥 Download PDF</button>
      </div>

      {/* Printable Invoice Content */}
      <div id="invoice-content" className="p-4 border shadow bg-white">
        {/* ✅ Store Details */}
        {invoice.store && (
          <div className="mb-3 text-center">
            <h3>{invoice.store.name}</h3>
            <p>{invoice.store.address}</p>
            <p>{invoice.store.contact}</p>
          </div>
        )}

        <h2 className="text-center mt-4">INVOICE #{invoice.id}</h2>
        <p><strong>Customer:</strong> {invoice.customer_name}</p>
        <p><strong>Date:</strong> {new Date(invoice.created_at).toLocaleString()}</p>

        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.product}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{item.quantity * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-end mt-3">
          <p><strong>Subtotal:</strong> ₹{invoice.subtotal}</p>
          <p><strong>GST ({invoice.gst_percentage}%):</strong> ₹{invoice.gst_amount}</p>
          <h5><strong>Total:</strong> ₹{invoice.total}</h5>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;
