@echo off
echo.
echo 🌐 Alternative Deployment Solution - Netlify
echo ==========================================
echo.

echo The Rollup native module issue is persistent on Vercel.
echo Let's try deploying to Netlify instead, which handles this better.
echo.

echo 📤 Committing Netlify configuration...
git add .
git commit -m "Fix Node.js version in Netlify config - Use v20.11.1"

echo 🚀 Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 🎯 NETLIFY DEPLOYMENT STEPS:
    echo =============================
    echo.
    echo 1. Go to https://app.netlify.com/
    echo 2. Click "New site from Git"
    echo 3. Choose GitHub and select your farmfresh repository
    echo 4. Netlify will auto-detect the settings from netlify.toml
    echo 5. Add environment variables:
    echo    - VITE_SUPABASE_URL
    echo    - VITE_SUPABASE_ANON_KEY
    echo.
    echo ✨ Netlify should build successfully without Rollup issues!
    echo.
    echo Would you like to open Netlify? (y/n)
    set /p open_netlify=""
    if /i "%open_netlify%"=="y" (
        start https://app.netlify.com/
    )
) else (
    echo ❌ Git push failed!
    echo Please check the error and try again.
)

echo.
pause