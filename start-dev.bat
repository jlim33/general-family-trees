@echo off
title General Family Tree - Local Server
color 0b
cd /d "%~dp0"

echo ================================================================
echo    GENERAL FAMILY TREE - LOCAL PREVIEW SERVER
echo ================================================================
echo.
echo Starting local web server on port 3000...
echo Opening http://localhost:3000 in your browser...
echo.

start http://localhost:3000

if exist "C:\Program Files\nodejs\node.exe" (
    "C:\Program Files\nodejs\node.exe" server.js
) else (
    node server.js
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [Error] Failed to launch server.js. Please check if Node.js is installed.
)
pause