@echo off
echo.
echo 🔧 Testing Build Process Locally
echo ===============================
echo.

echo Step 1: Cleaning previous build...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo Step 2: Installing dependencies...
npm install --legacy-peer-deps

echo Step 3: Running build command...
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo ==================
    echo.
    echo The build completed without errors.
    echo You can now deploy safely to Netlify.
    echo.
    echo Contents of dist folder:
    if exist dist (
        dir dist /b
    ) else (
        echo ❌ dist folder not found
    )
    echo.
    echo Ready to deploy to Netlify!
) else (
    echo.
    echo ❌ BUILD FAILED!
    echo ==============
    echo.
    echo The build process encountered errors.
    echo Please check the error messages above.
    echo.
    echo Common issues:
    echo - Missing environment variables
    echo - TypeScript errors
    echo - Missing dependencies
)

echo.
pause