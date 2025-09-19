import React, { useState } from 'react';
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

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
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
        <Input
          placeholder="Enter your name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">School ID</label>
        <Input
          placeholder="Enter School ID"
          value={form.schoolId}
          onChange={(e) => handleChange('schoolId', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Amount</label>
        <Input
          type="number"
          placeholder="Enter amount"
          value={form.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Payment Method</label>
        <Select value={form.method} onValueChange={(value) => handleChange('method', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="Netbanking">Netbanking</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
