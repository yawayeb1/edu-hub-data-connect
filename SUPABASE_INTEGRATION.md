# Supabase Integration Guide

## ✅ What's Been Set Up

1. **Supabase Client** (`src/lib/supabase.ts`)
   - Configured with environment variables
   - Type-safe database types

2. **Authentication Context** (`src/contexts/AuthContext.tsx`)
   - User authentication state management
   - Profile fetching
   - Sign in/up/out functions

3. **App Integration**
   - AuthProvider wrapped around the app
   - Ready to use `useAuth()` hook anywhere

## 🔧 Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the long JWT token)

### 2. Create Environment File

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** 
- Never commit `.env` to git (it should be in `.gitignore`)
- Use `.env.example` as a template for your team

### 3. Restart Development Server

After creating `.env`, restart your dev server:

```bash
npm run dev
```

## 📝 Usage Examples

### Using Authentication

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, profile, loading, signIn, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div>
      <p>Welcome, {profile?.full_name || user.email}!</p>
      <p>Balance: GH¢{profile?.balance || 0}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Fetching Bundles

```tsx
import { supabase } from '@/lib/supabase';

// Get all active bundles for a network
const { data: bundles, error } = await supabase
  .from('bundles')
  .select('*')
  .eq('network', 'MTN_UP2U')
  .eq('is_active', true)
  .order('sort_order');
```

### Fetching User Orders

```tsx
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

function OrdersList() {
  const { user } = useAuth();
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });
}
```

## 🔐 Security Notes

- The `anon` key is safe to use in the frontend (RLS policies protect your data)
- Never expose your `service_role` key in the frontend
- All tables have Row Level Security (RLS) enabled
- Users can only see their own data (profiles, orders, transactions)

## 🚀 Next Steps

1. ✅ Add your Supabase credentials to `.env`
2. ✅ Test authentication (sign up/in)
3. ✅ Connect dashboard to real data
4. ✅ Update service pages to fetch bundles from Supabase
5. ✅ Implement wallet functionality
6. ✅ Add order creation logic

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in the root directory
- Check that variable names start with `VITE_`
- Restart your dev server after creating `.env`

### "Row Level Security policy violation"
- Make sure user is authenticated
- Check RLS policies in Supabase dashboard
- Verify user_id matches in queries

### Profile not created after signup
- Check that the `handle_new_user()` trigger exists
- Verify trigger is attached to `auth.users` table
- Check Supabase logs for errors

