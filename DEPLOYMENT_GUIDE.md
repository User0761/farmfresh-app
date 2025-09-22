# 🚀 FarmFresh Deployment Guide

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- ✅ Working Supabase database with applied schema
- ✅ Environment variables configured
- ✅ Application tested locally
- ✅ Build process working correctly

---

## 🏗️ Build Your Application

First, let's prepare your application for production:

### 1. Update Environment Variables
Create a production `.env` file:

```bash
# Production Environment Variables
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_ENV=production
```

### 2. Build the Application
```bash
npm run build
```

This creates a `dist` folder with your production-ready files.

---

## 🌐 Hosting Options

## Option 1: Vercel (Recommended - Free & Easy)

### Why Vercel?
- ✅ **Free tier available**
- ✅ **Automatic deployments from Git**
- ✅ **Excellent for React/Vite apps**
- ✅ **Built-in CDN and SSL**
- ✅ **Environment variable management**

### Deployment Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy your app**
```bash
vercel
```

4. **Configure Environment Variables**
- Go to your Vercel dashboard
- Select your project
- Go to Settings → Environment Variables
- Add your Supabase credentials

### Alternative: Deploy via GitHub
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Automatic deployments on every push

---

## Option 2: Netlify (Great Alternative)

### Why Netlify?
- ✅ **Free tier with generous limits**
- ✅ **Drag-and-drop deployment**
- ✅ **Form handling and serverless functions**
- ✅ **Branch-based deployments**

### Deployment Steps:

1. **Build your app**
```bash
npm run build
```

2. **Manual Deployment**
- Go to [Netlify](https://netlify.com)
- Drag your `dist` folder to the deploy area

3. **Git-based Deployment**
- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `dist`

4. **Environment Variables**
- Go to Site Settings → Environment Variables
- Add your Supabase credentials

---

## Option 3: Firebase Hosting

### Why Firebase?
- ✅ **Google's reliable infrastructure**
- ✅ **Free SSL certificates**
- ✅ **Global CDN**
- ✅ **Integration with other Google services**

### Deployment Steps:

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize your project**
```bash
firebase init hosting
```

4. **Configure firebase.json**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

5. **Build and Deploy**
```bash
npm run build
firebase deploy
```

---

## Option 4: Traditional VPS/Server

### For More Control

If you need more control, you can deploy on a VPS:

1. **Server Requirements**
- Node.js 18+ (recommended 20+)
- Nginx (for serving static files)
- SSL certificate (Let's Encrypt)

2. **Server Setup Script**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Clone your repository
git clone your-repository-url
cd your-app
npm install
npm run build
```

3. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/your/app/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔧 Production Configuration

### 1. Update Supabase Settings

In your Supabase dashboard:

1. **Authentication Settings**
   - Add your production domain to "Redirect URLs"
   - Update "Site URL" to your production domain

2. **API Settings**
   - Note your production Supabase URL and anon key
   - Configure RLS policies for production

### 2. Environment Variables for Production

```bash
# Required for all hosting platforms
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_ENV=production
VITE_APP_URL=https://your-app-domain.com
```

### 3. Security Considerations

- ✅ **HTTPS Only**: Ensure SSL is enabled
- ✅ **Environment Variables**: Never commit sensitive data
- ✅ **CORS Settings**: Configure in Supabase
- ✅ **RLS Policies**: Review database security

---

## 🚦 Deployment Script

Create this script to automate your deployment:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting FarmFresh deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy based on your chosen platform
echo "🌐 Deploying to production..."

# For Vercel
# vercel --prod

# For Netlify
# netlify deploy --prod --dir=dist

# For Firebase
# firebase deploy

echo "✅ Deployment complete!"
echo "🌟 Your app is live!"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🔍 Post-Deployment Testing

After deployment, test these features:

### 1. Authentication Flow
- [ ] User registration works
- [ ] Login/logout functions
- [ ] Role-based access control

### 2. Database Operations
- [ ] Create, read, update, delete operations
- [ ] Real-time subscriptions working
- [ ] File uploads (if implemented)

### 3. Performance
- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 4. Security
- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] Database access properly restricted

---

## 📊 Monitoring & Analytics

### 1. Add Analytics (Optional)
```typescript
// Add to your main component
import { useEffect } from 'react';

useEffect(() => {
  // Google Analytics or your preferred analytics
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_title: document.title,
    page_location: window.location.href,
  });
}, []);
```

### 2. Error Monitoring
Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

---

## 🎯 Quick Start Recommendation

**For beginners, I recommend Vercel:**

1. **Push your code to GitHub**
2. **Connect GitHub to Vercel**
3. **Add environment variables**
4. **Automatic deployment!**

**Total time: ~10 minutes** ⚡

---

## 🆘 Troubleshooting

### Common Issues:

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Working:**
- Ensure variables start with `VITE_`
- Restart development server after changes
- Check hosting platform variable configuration

**Supabase Connection Issues:**
- Verify URL and keys are correct
- Check CORS settings in Supabase
- Ensure domain is added to auth settings

---

## 🎉 You're Ready to Deploy!

Choose your preferred hosting option and follow the steps above. Your FarmFresh application will be live and accessible to users worldwide!

**Need help?** Check the troubleshooting section or reach out for support.