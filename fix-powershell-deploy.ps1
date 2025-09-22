# PowerShell Script to Fix Repository and Deploy
# Run this in PowerShell

Write-Host ""
Write-Host "🔧 Fixing PowerShell Git Issues" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""

# Fix 1: Remove .git directory properly in PowerShell
Write-Host "🧹 Cleaning old git configuration..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Remove-Item -Recurse -Force .git
    Write-Host "✅ Old git configuration removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No existing git configuration found" -ForegroundColor Blue
}

# Fix 2: Remove old remote if exists
Write-Host ""
Write-Host "🔧 Checking existing remotes..." -ForegroundColor Yellow
$remotes = git remote
if ($remotes -contains "origin") {
    git remote remove origin
    Write-Host "✅ Old remote origin removed" -ForegroundColor Green
}

# Fix 3: Get correct repository URL
Write-Host ""
Write-Host "📝 Repository Setup" -ForegroundColor Yellow
Write-Host "Your repository URL should be: https://github.com/realreview12/farmfresh-app.git" -ForegroundColor Cyan
Write-Host ""
$repoUrl = Read-Host "Enter your GitHub repository URL (or press Enter to use the suggested one)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    $repoUrl = "https://github.com/realreview12/farmfresh-app.git"
}

Write-Host ""
Write-Host "🚀 Setting up fresh repository..." -ForegroundColor Yellow

# Initialize fresh git
git init
git add .
git commit -m "FarmFresh application - ready for deployment"
git branch -M main
git remote add origin $repoUrl

Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your repository is now live at:" -ForegroundColor Green
    Write-Host $repoUrl -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "🚀 Ready to deploy! Next steps:" -ForegroundColor Green
    Write-Host "1. Go to https://vercel.com" -ForegroundColor White
    Write-Host "2. Click 'New Project'" -ForegroundColor White
    Write-Host "3. Import your GitHub repository" -ForegroundColor White
    Write-Host "4. Add environment variables:" -ForegroundColor White
    Write-Host "   VITE_SUPABASE_URL = https://your-project-id.supabase.co" -ForegroundColor Gray
    Write-Host "   VITE_SUPABASE_ANON_KEY = your_anon_key_here" -ForegroundColor Gray
    Write-Host "5. Click Deploy" -ForegroundColor White
    Write-Host ""
    Write-Host "🌟 Your app will be live in 3 minutes!" -ForegroundColor Green
    
} else {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Error details:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 This usually means:" -ForegroundColor Yellow
    Write-Host "1. The repository doesn't exist on GitHub" -ForegroundColor White
    Write-Host "2. The repository URL is incorrect" -ForegroundColor White
    Write-Host "3. You don't have permission to push" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Solutions:" -ForegroundColor Yellow
    Write-Host "1. Create the repository on GitHub first" -ForegroundColor White
    Write-Host "2. Make sure the repository name matches exactly" -ForegroundColor White
    Write-Host "3. Try force push: git push -u origin main --force" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 Script completed!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue..."