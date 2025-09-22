# 🚀 Quick Deploy to Vercel (5 Minutes)

**The fastest way to host your FarmFresh application!**

## 📋 Prerequisites
- Your FarmFresh code ready
- Supabase project configured
- GitHub account

---

## 🎯 Method 1: GitHub Integration (Recommended)

### Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/farmfresh.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. **Import** your GitHub repository
4. **Configure** project:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variables**:
   ```
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = your_anon_key_here
   ```
6. Click **"Deploy"**

**⏱️ Time: ~3 minutes**

---

## 🎯 Method 2: Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
# From your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (choose your account)
# - Found project settings, deploy? Y
```

### Step 4: Add Environment Variables
```bash
vercel env add VITE_SUPABASE_URL
# Enter your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY  
# Enter your Supabase anon key when prompted
```

### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

**⏱️ Time: ~5 minutes**

---

## 🎯 Method 3: Automated Script

We've created a deployment script for you!

### Windows:
```cmd
deploy.bat
```

### Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

**⏱️ Time: ~2 minutes**

---

## 🔧 Configure Supabase for Production

After deployment, update your Supabase settings:

1. **Go to your Supabase Dashboard**
2. **Authentication → Settings**
3. **Add your Vercel domain**:
   ```
   Site URL: https://your-app.vercel.app
   Redirect URLs: https://your-app.vercel.app/**
   ```

---

## ✅ Verify Deployment

Test these features on your live site:

- [ ] **Homepage loads** correctly
- [ ] **User registration** works
- [ ] **Login/logout** functions  
- [ ] **Real-time features** active
- [ ] **Mobile responsive** design

---

## 🎉 Success!

Your FarmFresh application is now live at:
**https://your-app.vercel.app**

### Automatic Updates
- Every push to `main` branch automatically deploys
- Preview deployments for pull requests
- Rollback to previous versions anytime

---

## 🆘 Troubleshooting

**Build Errors:**
```bash
# Test build locally first
npm run build
```

**Environment Variables Not Working:**
- Ensure variables start with `VITE_`
- Check they're added in Vercel dashboard
- Redeploy after adding variables

**Supabase Connection Issues:**
- Verify URL and keys are correct
- Check Supabase auth settings include your domain

---

## 🚀 Next Steps

- **Custom Domain**: Add your own domain in Vercel settings
- **Analytics**: Enable Vercel Analytics for insights
- **Monitoring**: Set up error tracking
- **Performance**: Optimize images and assets

**Your app is live! Share it with the world! 🌟**