import React, { useState } from 'react';
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";

import api from '../services/api'; // axios instance

const Payment = () => {
  const [form, setForm] = useState({ name: '', schoolId: '', amount: '', method: 'UPI' });
  const [paymentLink, setPaymentLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handlePayment = async () => {
    if (!form.name || !form.schoolId || !form.amount) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Replace with real backend endpoint
      const res = await api.post('/payment/create-payment', form);
      
      // For mock, if backend not ready:
      // const res = { data: { payment_link: `https://mockpay.com/pay/${Date.now()}` } };
      
      setPaymentLink(res.data.payment_link);
    } catch (err) {
      alert('Payment creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Make a Payment</h1>
      
      <Input
        label="Name"
        placeholder="Enter your name"
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />

      <Input
        label="School ID"
        placeholder="Enter School ID"
        value={form.schoolId}
        onChange={(e) => handleChange('schoolId', e.target.value)}
      />

      <Input
        label="Amount"
        type="number"
        placeholder="Enter amount"
        value={form.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
      />

      <Select
        label="Payment Method"
        value={form.method}
        onChange={(e) => handleChange('method', e.target.value)}
        options={['UPI', 'Card', 'Netbanking']}
      />

      <Button
        onClick={handlePayment}
        loading={loading}
        className="mt-4 w-full bg-primary-500 hover:bg-primary-600 text-white"
      >
        Generate Payment Link
      </Button>

      {paymentLink && (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 rounded">
          <p className="text-green-800 dark:text-green-200 mb-2">Payment link generated:</p>
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            {paymentLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default Payment;
