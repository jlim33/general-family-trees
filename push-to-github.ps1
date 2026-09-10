Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   PUSH GENERAL FAMILY TREE TO GITHUB" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path $PSScriptRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[Error] Git is not found on your system PATH." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

Write-Host "Staging files..." -ForegroundColor Gray
git add -A

git commit -m "feat: general family tree with 3-step onboarding wizard" 2>$null

Write-Host ""
$repoUrl = Read-Host "Enter your GitHub repository URL (e.g. https://github.com/your-username/general-family-tree.git)"

if ($repoUrl -and $repoUrl.Trim() -ne "") {
    git remote remove origin 2>$null
    git remote add origin $repoUrl.Trim()
    Write-Host "`nPushing to $($repoUrl.Trim())..." -ForegroundColor Green
    git push -u origin main
} else {
    Write-Host "No repository URL entered. Push skipped." -ForegroundColor Yellow
}

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "   All Done!" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit"