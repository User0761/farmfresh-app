@echo off
REM Fresh Repository Setup and Deployment Script

echo.
echo 🆕 Fresh Repository & Deployment Setup
echo ======================================
echo.

REM Clean old git configuration
echo 🧹 Cleaning old git configuration...
if exist ".git" (
    rmdir /s /q .git
    echo ✅ Old git configuration removed
) else (
    echo ℹ️  No existing git configuration found
)

echo.
echo 📝 Setting up fresh repository...
echo.

REM Get repository URL from user
set /p repo_url="Enter your NEW GitHub repository URL (e.g., https://github.com/username/farmfresh-app.git): "

if "%repo_url%"=="" (
    echo ❌ Repository URL is required!
    pause
    exit /b 1
)

echo.
echo 🔧 Initializing fresh git repository...

REM Initialize fresh git
git init
git add .
git commit -m "Initial commit - FarmFresh application with Supabase integration"
git branch -M main
git remote add origin %repo_url%

echo.
echo 🚀 Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 🌐 Your repository is now live at:
    echo %repo_url%
    echo.
    
    echo 🚀 Ready to deploy! Choose your platform:
    echo 1) Deploy to Vercel (Recommended)
    echo 2) Deploy to Netlify
    echo 3) Just finish here - I'll deploy manually
    echo.
    set /p deploy_choice="Enter your choice (1-3): "
    
    if "%deploy_choice%"=="1" (
        echo.
        echo 🎯 Next steps for Vercel deployment:
        echo 1. Go to https://vercel.com
        echo 2. Click "New Project"
        echo 3. Import your GitHub repository
        echo 4. Add these environment variables:
        echo    VITE_SUPABASE_URL = https://your-project-id.supabase.co
        echo    VITE_SUPABASE_ANON_KEY = your_anon_key_here
        echo 5. Click Deploy
        echo.
        echo 🌟 Your app will be live in 3 minutes!
        echo.
        echo Would you like to open Vercel now? (y/n)
        set /p open_vercel=""
        if /i "%open_vercel%"=="y" (
            start https://vercel.com
        )
        
    ) else if "%deploy_choice%"=="2" (
        echo.
        echo 🎯 Next steps for Netlify deployment:
        echo 1. Go to https://netlify.com
        echo 2. Click "New site from Git"
        echo 3. Choose your repository
        echo 4. Build command: npm run build
        echo 5. Publish directory: dist
        echo 6. Add environment variables
        echo 7. Deploy
        echo.
        echo Would you like to open Netlify now? (y/n)
        set /p open_netlify=""
        if /i "%open_netlify%"=="y" (
            start https://netlify.com
        )
        
    ) else (
        echo.
        echo ✅ Repository setup complete!
        echo 📋 Your code is now on GitHub and ready for deployment.
        echo.
        echo Check the DEPLOYMENT_GUIDE.md file for detailed deployment instructions.
    )
    
) else (
    echo ❌ Push failed!
    echo.
    echo 🔍 This might be because:
    echo 1. The repository URL is incorrect
    echo 2. You don't have permission to push to this repository
    echo 3. The repository already has content
    echo.
    echo 💡 Solutions:
    echo 1. Double-check the repository URL
    echo 2. Try force push: git push -u origin main --force
    echo 3. Make sure the repository is completely empty
)

echo.
echo 🎉 Fresh repository setup completed!
echo.
pause