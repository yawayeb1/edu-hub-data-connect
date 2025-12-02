# Supabase Setup Guide for Edu-Hub Data Connect

## Step 1: Create Supabase Project

### Option A: Via Web Interface (Recommended)
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in the details:
   - **Project Name**: `edu-hub-data-gh`
   - **Database Password**: Use the password generated below (or create your own)
   - **Region**: Choose one of:
     - **Singapore** (closest to Ghana with good latency)
     - **Frankfurt** (EU region, reliable)
     - **US East** (if others are unavailable)
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to initialize

### Option B: Via Supabase CLI
```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Create project (requires Supabase account)
supabase projects create edu-hub-data-gh --region ap-southeast-1
```

## Step 2: Get Your Project Credentials

Once your project is created:

1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

## Step 3: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **"Run"** (or press `Ctrl+Enter`)
5. You should see "Success. No rows returned"

## Step 4: Verify Tables Were Created

1. Go to **Table Editor** in the Supabase dashboard
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `wallet_transactions`
   - ✅ `orders`

## Step 5: Test the Setup

Run this test query in the SQL Editor:

```sql
-- Test query to verify everything works
select 
  (select count(*) from profiles) as profiles_count,
  (select count(*) from wallet_transactions) as transactions_count,
  (select count(*) from orders) as orders_count;
```

## Generated Database Password

**⚠️ IMPORTANT: Save this password securely!**

```
EduHub2025!Secure#DataConnect
```

Or use this alternative (if special characters cause issues):
```
EduHub2025SecureDataConnectGH
```

## Next Steps

After completing the setup:

1. ✅ Install Supabase client in your React app
2. ✅ Add environment variables for Supabase keys
3. ✅ Set up authentication
4. ✅ Connect the dashboard to real data
5. ✅ Implement wallet functionality
6. ✅ Connect to telecom APIs

## Troubleshooting

### If RLS policies block queries:
- Check that you're authenticated
- Verify policies are correctly set up
- Test with service_role key (development only!)

### If tables don't appear:
- Check SQL Editor for errors
- Ensure you ran the entire schema file
- Verify you're in the correct project

### If trigger doesn't work:
- Check that `handle_new_user()` function exists
- Verify trigger is attached to `auth.users`
- Test by creating a new user via Supabase Auth

