@echo off
REM Git Push Fix Script for Windows
REM This script helps resolve common git push errors

echo.
echo 🔧 Git Push Error Fix Tool
echo ========================
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Not a git repository. Please run 'git init' first.
    pause
    exit /b 1
)

echo 📊 Current git status:
git status
echo.

echo ⬇️ Attempting to pull latest changes...
git pull origin main

if %errorlevel% equ 0 (
    echo ✅ Pull successful! Now pushing...
    git push origin main
    if %errorlevel% equ 0 (
        echo ✅ Push successful!
        goto end
    )
)

echo.
echo ⚠️ Pull/Push failed. Let's try alternative solutions...
echo.

REM Fetch to see what's different
git fetch origin
echo.

echo 🔍 Repository status:
git log --oneline -5
echo.

echo Choose a solution:
echo 1) Pull and merge (safe)
echo 2) Reset to remote and re-add files
echo 3) Force push (⚠️ DANGEROUS - overwrites remote)
echo 4) Exit and fix manually
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🔄 Attempting pull with merge strategy...
    git pull origin main --strategy=recursive -X theirs
    if %errorlevel% equ 0 (
        git add .
        git commit -m "Merge remote changes with local FarmFresh app"
        git push origin main
        echo ✅ Merge and push completed!
    ) else (
        echo ❌ Merge failed. Manual resolution needed.
        echo Please resolve conflicts manually:
        echo 1. Edit conflicted files
        echo 2. Run: git add .
        echo 3. Run: git commit -m "Resolve conflicts"
        echo 4. Run: git push origin main
    )
) else if "%choice%"=="2" (
    echo.
    echo 🔄 Resetting to remote and re-adding files...
    git reset --hard origin/main
    git add .
    git commit -m "Re-add FarmFresh application after reset"
    git push origin main
    echo ✅ Reset and push completed!
) else if "%choice%"=="3" (
    echo.
    echo ⚠️ WARNING: This will overwrite the remote repository!
    set /p confirm="Are you sure? Type 'YES' to confirm: "
    if "%confirm%"=="YES" (
        git push origin main --force
        echo ✅ Force push completed!
    ) else (
        echo Operation cancelled.
    )
) else if "%choice%"=="4" (
    echo.
    echo 📋 Manual resolution steps:
    echo 1. Run: git pull origin main
    echo 2. Resolve any conflicts in your editor
    echo 3. Run: git add .
    echo 4. Run: git commit -m "Resolve conflicts"
    echo 5. Run: git push origin main
    echo.
    echo If that doesn't work, check the FIX_GIT_PUSH_ERROR.md file for more solutions.
) else (
    echo ❌ Invalid choice.
)

:end
echo.
echo 🎯 Git push fix process completed!
echo.
pause