@echo off
title Deploy General Family Tree to Vercel
color 0b
cd /d "%~dp0"

echo ================================================================
echo    DEPLOY GENERAL FAMILY TREE TO VERCEL
echo ================================================================
echo.
echo Launching Vercel Production Deploy...
echo.

if exist "C:\Program Files\nodejs\node.exe" (
    "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" --yes vercel --prod
) else (
    npx --yes vercel --prod
)

echo.
echo ================================================================
echo    Deployment Completed!
echo ================================================================
pause