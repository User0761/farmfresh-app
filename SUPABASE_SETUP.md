# Supabase Integration Setup Guide

This guide will help you integrate Supabase as the database backend for your FarmFresh application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your FarmFresh project cloned locally

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `farmfresh-db` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Copy the `env.example` file to `.env`:
   ```bash
   cp env.example .env
   ```

2. Open `.env` and replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste it into the SQL editor
4. Click **Run** to execute the schema creation

This will create:
- User management tables
- Product catalog tables
- Order management tables
- Row Level Security (RLS) policies
- Database triggers and functions

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/**`
   - **Email Templates**: Customize if desired

## Step 6: Set Up Storage (Optional)

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `product-images`
3. Set the bucket to **Public**
4. Configure policies for image uploads

## Step 7: Install Dependencies

The Supabase client is already installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js
```

## Step 8: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the browser console and run:
   ```javascript
   // Test Supabase connection
   import { migrateMockDataToSupabase } from './src/utils/migrateData';
   migrateMockDataToSupabase();
   ```

3. Check your Supabase dashboard to see if data was inserted

## Step 9: Deploy to Production

1. Update your environment variables for production
2. Add your production domain to Supabase Auth settings
3. Update the Site URL and Redirect URLs in Supabase Auth

## Features Enabled

With Supabase integration, you now have:

### ✅ **Authentication**
- User registration and login
- Email verification
- Password reset
- Role-based access control

### ✅ **Database**
- PostgreSQL database with full SQL support
- Real-time subscriptions
- Row Level Security (RLS)
- Automatic API generation

### ✅ **Real-time Features**
- Live order updates
- Real-time inventory changes
- Instant notifications

### ✅ **Storage**
- Product image uploads
- File management
- CDN delivery

### ✅ **Advanced Features**
- Database triggers
- Custom functions
- Full-text search
- Analytics and reporting

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check your `.env` file has the correct variables
   - Restart your development server

2. **"Invalid API key"**
   - Verify your Supabase URL and anon key
   - Check if your project is active

3. **"Permission denied"**
   - Check RLS policies in Supabase
   - Verify user authentication

4. **"Table doesn't exist"**
   - Run the SQL schema in Supabase SQL Editor
   - Check table names match exactly

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Next Steps

1. **Customize the UI** for better user experience
2. **Add more features** like push notifications
3. **Set up monitoring** and analytics
4. **Optimize performance** with database indexes
5. **Add tests** for reliability

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables in production
- Regularly rotate your API keys
- Monitor your database usage and costs
- Set up proper RLS policies for data protection

