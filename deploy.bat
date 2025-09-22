@echo off
REM FarmFresh Deployment Script for Windows
REM This script automates the deployment process

echo.
echo 🚀 FarmFresh Deployment Starting...
echo ==================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found. Please run this script from your project root.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ℹ️  Installing dependencies...
    npm install
)

REM Clean previous build
if exist "dist" (
    echo ℹ️  Cleaning previous build...
    rmdir /s /q dist
)

REM Build the application
echo ℹ️  Building application for production...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
)

REM Check if dist directory was created
if not exist "dist" (
    echo ❌ Build directory 'dist' not found. Build may have failed.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.

REM Ask user which deployment platform they want to use
echo 🌐 Choose your deployment platform:
echo 1) Vercel (Recommended)
echo 2) Netlify  
echo 3) Firebase Hosting
echo 4) Manual (just build)
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo ℹ️  Deploying to Vercel...
    where vercel >nul 2>nul
    if %errorlevel% neq 0 (
        echo ⚠️  Vercel CLI not found. Installing...
        npm install -g vercel
        echo ℹ️  Please run 'vercel login' and then run this script again.
        pause
        exit /b 1
    )
    vercel --prod
    echo ✅ Deployed to Vercel successfully!
) else if "%choice%"=="2" (
    echo ℹ️  Deploying to Netlify...
    where netlify >nul 2>nul
    if %errorlevel% neq 0 (
        echo ⚠️  Netlify CLI not found. Installing...
        npm install -g netlify-cli
        echo ℹ️  Please run 'netlify login' and then run this script again.
        pause
        exit /b 1
    )
    netlify deploy --prod --dir=dist
    echo ✅ Deployed to Netlify successfully!
) else if "%choice%"=="3" (
    echo ℹ️  Deploying to Firebase...
    where firebase >nul 2>nul
    if %errorlevel% neq 0 (
        echo ⚠️  Firebase CLI not found. Installing...
        npm install -g firebase-tools
        echo ℹ️  Please run 'firebase login' and 'firebase init' first.
        pause
        exit /b 1
    )
    firebase deploy
    echo ✅ Deployed to Firebase successfully!
) else if "%choice%"=="4" (
    echo ℹ️  Manual deployment selected.
    echo ✅ Your built files are in the 'dist' directory.
    echo ℹ️  You can now upload these files to your hosting provider.
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo ✅ Deployment process completed!
echo.
echo 📋 Post-deployment checklist:
echo    1. Test your application at the deployed URL
echo    2. Verify environment variables are set correctly  
echo    3. Check Supabase authentication settings
echo    4. Test real-time features
echo    5. Monitor for any errors
echo.
echo ✅ 🎉 Your FarmFresh app is now live!
echo.
pause