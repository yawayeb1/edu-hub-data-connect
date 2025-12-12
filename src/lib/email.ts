// Email API endpoint (Netlify Functions)
// In production, this will be /.netlify/functions/send-email
// In development with Netlify Dev, it's also /.netlify/functions/send-email
const EMAIL_API_URL = import.meta.env.VITE_EMAIL_API_URL || '/.netlify/functions/send-email';

export interface WelcomeEmailData {
  fullName: string;
  email: string;
}

export interface BundlePurchaseEmailData {
  fullName: string;
  email: string;
  orderId: string;
  network: string;
  package: string;
  phoneNumber: string;
  amount: number;
  status: string;
}

export interface WalletTopUpEmailData {
  fullName: string;
  email: string;
  amount: number;
  reference: string;
  newBalance: number;
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  try {
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'welcome',
        fullName: data.fullName,
        email: data.email,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log('Welcome email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

/**
 * Send bundle purchase confirmation email
 */
export async function sendBundlePurchaseEmail(data: BundlePurchaseEmailData): Promise<boolean> {
  try {
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'bundle-purchase',
        fullName: data.fullName,
        email: data.email,
        orderId: data.orderId,
        network: data.network,
        package: data.package,
        phoneNumber: data.phoneNumber,
        amount: data.amount,
        status: data.status,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log('Bundle purchase email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending bundle purchase email:', error);
    return false;
  }
}

/**
 * Send wallet top-up confirmation email
 */
export async function sendWalletTopUpEmail(data: WalletTopUpEmailData): Promise<boolean> {
  try {
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'wallet-topup',
        fullName: data.fullName,
        email: data.email,
        amount: data.amount,
        reference: data.reference,
        newBalance: data.newBalance,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log('Wallet top-up email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending wallet top-up email:', error);
    return false;
  }
}
