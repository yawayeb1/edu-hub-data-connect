// Paystack configuration
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

if (!PAYSTACK_PUBLIC_KEY && import.meta.env.MODE === 'production') {
  console.warn('Paystack public key is not set. Please add VITE_PAYSTACK_PUBLIC_KEY to your .env file');
}

// Paystack configuration helper
export const getPaystackConfig = (email: string, amount: number, metadata?: Record<string, any>) => {
  return {
    publicKey: PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100, // Convert to kobo (Paystack uses smallest currency unit)
    currency: 'GHS',
    metadata: {
      custom_fields: [
        {
          display_name: 'Payment Type',
          variable_name: 'payment_type',
          value: 'wallet_topup',
        },
        ...(metadata ? Object.entries(metadata).map(([key, value]) => ({
          display_name: key,
          variable_name: key,
          value: String(value),
        })) : []),
      ],
    },
  };
};

