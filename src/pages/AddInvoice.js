import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Form, Button, Row, Col } from 'react-bootstrap';

const AddInvoice = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [useNewCustomer, setUseNewCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '' });
  const [items, setItems] = useState([{ product: '', quantity: 1, price: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [total, setTotal] = useState(0);
  const [showPrintPanel, setShowPrintPanel] = useState(false);

  const invoiceRef = useRef();
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get('https://pos-and-billing-software.onrender.com/api/auth/customers/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCustomers(res.data));

    axios.get('https://pos-and-billing-software.onrender.com/api/auth/products/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProducts(res.data));
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'product') {
      const productObj = products.find(p => p.id == value);
      if (productObj) {
        newItems[index]['price'] = productObj.price;
      }
    }

    setItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (items) => {
    let sub = 0;
    items.forEach(item => {
      const q = parseFloat(item.quantity || 0);
      const p = parseFloat(item.price || 0);
      sub += q * p;
    });

    const gstAmount = sub * 0.18; // 18% GST
    const final = sub + gstAmount;

    setSubtotal(sub);
    setGst(gstAmount);
    setTotal(final);
  };

  const addItem = () => {
    setItems([...items, { product: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    calculateTotals(newItems);
  };

  const handleDownloadPDF = async (ref) => {
    const input = ref.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice.pdf');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity
      }))
    };

    if (useNewCustomer) {
      payload.new_customer = newCustomer;
    } else {
      payload.customer = selectedCustomer;
    }

    try {
      await axios.post('https://pos-and-billing-software.onrender.com/api/auth/invoice/create/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Invoice created successfully!");
      setShowPrintPanel(true); // show preview panel
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Invoice</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Create for new customer"
            checked={useNewCustomer}
            onChange={e => setUseNewCustomer(e.target.checked)}
          />
        </Form.Group>

        {useNewCustomer ? (
          <Row className="mb-3">
            <Col><Form.Control placeholder="Name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} required /></Col>
            <Col><Form.Control placeholder="Phone" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} /></Col>
            <Col><Form.Control placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} /></Col>
          </Row>
        ) : (
          <Form.Group className="mb-3">
            <Form.Select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} required>
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <h5>Invoice Items</h5>
        {items.map((item, index) => (
          <Row className="mb-2" key={index}>
            <Col md={4}>
              <Form.Select value={item.product} onChange={e => handleItemChange(index, 'product', e.target.value)} required>
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} required />
            </Col>
            <Col md={3}>
              <Form.Control value={item.price || ''} disabled />
            </Col>
            <Col md={2}>
              <Button variant="danger" onClick={() => removeItem(index)}>Remove</Button>
            </Col>
          </Row>
        ))}
        <Button className="mb-3" variant="secondary" onClick={addItem}>Add Item</Button>

        <div className="mb-3">
          <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
          <p><strong>GST (18%):</strong> ₹{gst.toFixed(2)}</p>
          <p><strong>Total:</strong> ₹{total.toFixed(2)}</p>
        </div>

        <Button type="submit" variant="primary">Create Invoice</Button>
      </Form>

      {/* 👇 Invoice Preview and Print Section */}
      {showPrintPanel && (
        <div className="mt-4">
          <h3>Invoice Preview</h3>
          <div ref={invoiceRef} id="invoice-content" className="p-3 border bg-white">
            <h4>Customer: {useNewCustomer ? newCustomer.name : customers.find(c => c.id == selectedCustomer)?.name}</h4>
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const productName = products.find(p => p.id == item.product)?.name || '';
                  return (
                    <tr key={idx}>
                      <td>{productName}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.quantity * item.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
            <p><strong>GST (18%):</strong> ₹{gst.toFixed(2)}</p>
            <h5><strong>Total:</strong> ₹{total.toFixed(2)}</h5>
          </div>

          <div className="mt-3 d-flex gap-2">
            <Button variant="success" onClick={() => handleDownloadPDF(invoiceRef)}>📥 Download PDF</Button>
            <Button variant="primary" onClick={() => window.print()}>🖨️ Print</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddInvoice;
