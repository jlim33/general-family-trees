@echo off
title Push General Family Tree to GitHub
color 0a
echo ================================================================
echo    🚀 PUSHING GENERAL FAMILY TREE TO GITHUB
echo ================================================================
echo.
cd /d "%~dp0"

if not exist ".git" (
  git init
  git branch -M main
)

git add .
git commit -m "feat: initial commit for general family tree with onboarding wizard" 2>nul

echo.
echo Enter your GitHub repository URL (e.g. https://github.com/jlim33/general-family-tree.git):
set /p REPO_URL="Repository URL: "

if not "%REPO_URL%"=="" (
  git remote remove origin 2>nul
  git remote add origin %REPO_URL%
  echo.
  echo Pushing to %REPO_URL%...
  git push -u origin main
) else (
  echo No repository URL entered. Skipped push.
)

echo.
echo ================================================================
echo    Done!
echo ================================================================
pause
