# Paystack Integration Setup Guide

## ✅ What's Been Set Up

1. **Paystack Package** - `react-paystack` installed
2. **Payment Hook** - `usePaystackPaymentHook` for handling payments
3. **Wallet Top-Up Component** - Full UI for wallet top-ups
4. **Transaction History** - View wallet transactions
5. **Auto Balance Update** - Balance updates automatically after payment

## 🔧 Setup Steps

### 1. Get Your Paystack Public Key

1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Sign in or create an account
3. Navigate to **Settings** → **API Keys & Webhooks**
4. Copy your **Public Key**:
   - **Test Mode**: `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Live Mode**: `pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Add to Environment Variables

Add your Paystack public key to your `.env` file:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:**
- Use `pk_test_...` for development/testing
- Use `pk_live_...` for production
- Never commit your live keys to public repositories

### 3. Restart Development Server

After adding the key, restart your dev server:

```bash
npm run dev
```

## 📝 How It Works

### Payment Flow

1. User enters amount (preset or custom)
2. Clicks "Pay with Paystack"
3. Paystack payment modal opens
4. User completes payment
5. On success:
   - Transaction recorded in `wallet_transactions` table
   - User balance updated in `profiles` table
   - Success notification shown
   - UI refreshes with new balance

### Components

#### `WalletTopUp`
- Preset amounts (GH¢10, 20, 50, 100, 200, 500)
- Custom amount input
- Paystack payment integration
- Real-time balance display

#### `WalletTransactions`
- Shows last 10 transactions
- Credit/Debit indicators
- Transaction status badges
- Formatted dates

#### `usePaystackPaymentHook`
- Handles payment initialization
- Processes payment callbacks
- Updates Supabase database
- Error handling and notifications

## 🧪 Testing

### Test Mode

1. Use test public key: `pk_test_...`
2. Use test card numbers from [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)
3. Common test cards:
   - **Success**: `4084084084084081`
   - **Declined**: `5060666666666666666`
   - **Insufficient Funds**: `5060666666666666667`

### Test Card Details

- **CVV**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)
- **PIN**: Any 4 digits (e.g., `0000`)
- **OTP**: Any digits (e.g., `123456`)

## 🔐 Security Notes

- Public keys are safe to use in frontend
- Never expose your **Secret Key** in frontend code
- Always verify transactions on your backend
- Use webhooks for production payment verification
- Implement rate limiting for payment attempts

## 🚀 Production Checklist

Before going live:

- [ ] Switch to live public key (`pk_live_...`)
- [ ] Set up Paystack webhooks
- [ ] Implement server-side transaction verification
- [ ] Test with real cards (small amounts)
- [ ] Set up transaction monitoring
- [ ] Configure email notifications
- [ ] Test refund process
- [ ] Review Paystack dashboard settings

## 🐛 Troubleshooting

### Payment Modal Not Opening

- Check browser console for errors
- Verify `VITE_PAYSTACK_PUBLIC_KEY` is set
- Ensure public key starts with `pk_test_` or `pk_live_`
- Check that user email is available

### Payment Success But Balance Not Updated

- Check Supabase logs for errors
- Verify RLS policies allow updates
- Check browser console for errors
- Verify user is authenticated

### "Paystack is not configured" Error

- Check `.env` file exists
- Verify variable name: `VITE_PAYSTACK_PUBLIC_KEY`
- Restart dev server after adding key
- Check for typos in public key

## 📚 Resources

- [Paystack Documentation](https://paystack.com/docs)
- [React Paystack Package](https://www.npmjs.com/package/react-paystack)
- [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)
- [Paystack Dashboard](https://dashboard.paystack.com)

