import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Session expires when browser closes
    autoRefreshToken: false, // Don't auto-refresh
  },
});

// Database types (we'll expand these as needed)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          balance: number;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          balance?: number;
          role?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          balance?: number;
          role?: string;
        };
      };
      bundles: {
        Row: {
          id: number;
          network: 'MTN' | 'AT_ISHARE' | 'AT_BIGTIME' | 'TELECEL' | 'MTN_UP2U';
          display_name: string;
          data_amount_gb: number;
          price_ghc: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          network: 'MTN' | 'AT_ISHARE' | 'AT_BIGTIME' | 'TELECEL' | 'MTN_UP2U';
          display_name: string;
          data_amount_gb: number;
          price_ghc: number;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          network?: 'MTN' | 'AT_ISHARE' | 'AT_BIGTIME' | 'TELECEL' | 'MTN_UP2U';
          display_name?: string;
          data_amount_gb?: number;
          price_ghc?: number;
          is_active?: boolean;
          sort_order?: number;
        };
      };
      orders: {
        Row: {
          id: number;
          user_id: string;
          order_id: string;
          network: string;
          msisdn: string;
          package: string;
          amount: number;
          cost: number;
          profit: number;
          status: 'pending' | 'delivered' | 'failed' | 'refunded';
          api_response: any;
          created_at: string;
        };
      };
      wallet_transactions: {
        Row: {
          id: number;
          user_id: string;
          amount: number;
          type: 'credit' | 'debit';
          description: string | null;
          reference: string | null;
          status: string;
          created_at: string;
        };
      };
    };
  };
};

