export const API_ENDPOINTS = {
  TRANSACTIONS: '/transactions',
  SCHOOL_TRANSACTIONS: '/transactions/school',
  TRANSACTION_STATUS: '/transaction-status',
  WEBHOOK: '/webhook'
};

export const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  FAILED: 'failed'
};

export const PAYMENT_GATEWAYS = [
  'PhonePe',
  'Paytm',
  'Razorpay',
  'GooglePay'
];

export const ITEMS_PER_PAGE = 10;