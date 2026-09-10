@echo off
title Push General Family Tree to GitHub
color 0a
cd /d "%~dp0"

echo ================================================================
echo    PUSH GENERAL FAMILY TREE TO GITHUB
echo ================================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [Error] Git is not installed or not in PATH!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

if not exist ".git" (
    echo Initializing Git repository...
    git init
    git branch -M main
)

echo Staging files...
git add -A

echo Committing changes...
git commit -m "feat: general family tree with 3-step onboarding wizard" 2>nul

echo.
echo ================================================================
echo Enter your GitHub repository URL:
echo (Example: https://github.com/your-username/general-family-tree.git)
echo ================================================================
set /p REPO_URL="Repository URL: "

if not "%REPO_URL%"=="" (
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
    echo.
    echo Pushing main branch to %REPO_URL%...
    git push -u origin main
) else (
    echo.
    echo No repository URL entered. Push skipped.
)

echo.
echo ================================================================
echo    All Done!
echo ================================================================
pause