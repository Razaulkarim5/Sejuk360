import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const OrderForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [problem, setProblem] = useState('');
  const [service, setService] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [technicianPhone, setTechnicianPhone] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderId = `ORD-${Date.now()}`;

    const orderData = {
      orderId,
      customerName,
      phone,
      address,
      problem,
      service,
      quotedPrice,
      assignedTechnician: assignedTechnician.toLowerCase(),

      technicianPhone,
      adminNotes,
      status: 'Pending',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      alert('Order saved to Firebase!');

      // WhatsApp Notification to Technician
      const message = `Hi ${assignedTechnician}, you have a new job!\nOrder: ${orderId}\nCustomer: ${customerName}\nService: ${service}\nAddress: ${address}`;
      const waURL = `https://wa.me/${technicianPhone}?text=${encodeURIComponent(message)}`;
      window.open(waURL, "_blank");

      // Reset form
      setCustomerName('');
      setPhone('');
      setAddress('');
      setProblem('');
      setService('');
      setQuotedPrice('');
      setAssignedTechnician('');
      setTechnicianPhone('');
      setAdminNotes('');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <h2 className="text-xl font-bold">Create New Order</h2>
      <input
        type="text"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <input
        type="text"
        placeholder="Problem Description"
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <select
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="border p-2 w-full rounded"
        required
      >
        <option value="">Select Service</option>
        <option value="Cleaning">Cleaning</option>
        <option value="Repair">Repair</option>
        <option value="Installation">Installation</option>
      </select>
      <input
        type="number"
        placeholder="Quoted Price"
        value={quotedPrice}
        onChange={(e) => setQuotedPrice(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <select
        value={assignedTechnician}
        onChange={(e) => setAssignedTechnician(e.target.value)}
        className="border p-2 w-full rounded"
        required
      >
        <option value="">Assign Technician</option>
        <option value="ali">Ali</option>
        <option value="john">John</option>
        <option value="bala">Bala</option>
        <option value="yusoff">Yusoff</option>
      </select>
      <input
        type="text"
        placeholder="Technician WhatsApp Number (e.g., 60123456789)"
        value={technicianPhone}
        onChange={(e) => setTechnicianPhone(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <textarea
        placeholder="Admin Notes"
        value={adminNotes}
        onChange={(e) => setAdminNotes(e.target.value)}
        className="border p-2 w-full rounded"
      ></textarea>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Order
      </button>
    </form>
  );
};

export default OrderForm;
