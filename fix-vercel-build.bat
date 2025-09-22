@echo off
REM Fix Vercel build issues and redeploy

echo.
echo 🔧 Fixing Vercel Build Issues
echo =============================
echo.

echo ✅ Fixed Files:
echo   - package.json (added vercel-build script)
echo   - vercel.json (added install/build commands)
echo   - .npmrc (disabled optional dependencies)
echo   - vite.config.ts (optimized for Vercel)
echo.

echo 📤 Committing fixes to Git...
git add .
git commit -m "Fix Vercel Rollup native module errors - Force Node.js 20.x runtime"

echo 🚀 Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully pushed fixes to GitHub!
    echo.
    echo 🔄 Vercel will automatically redeploy with these fixes.
    echo.
    echo 📋 What was fixed:
    echo   ✅ Added .npmrc to skip optional dependencies
    echo   ✅ Updated build scripts for Vercel compatibility
    echo   ✅ Optimized Vite configuration
    echo   ✅ Added proper install commands
    echo.
    echo 🌐 Check your Vercel deployment in a few minutes!
    echo Your app should build successfully now.
    echo.
    echo Would you like to open Vercel dashboard? (y/n)
    set /p open_vercel=""
    if /i "%open_vercel%"=="y" (
        start https://vercel.com/dashboard
    )
) else (
    echo ❌ Git push failed!
    echo Please check the error and try again.
)

echo.
pause