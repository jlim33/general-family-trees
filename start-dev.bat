@echo off
title General Family Tree - Local Server
color 0b
echo ================================================================
echo    🌳 GENERAL FAMILY TREE - LOCAL PREVIEW SERVER
echo ================================================================
echo.
cd /d "%~dp0"
echo Starting local web server on port 3000...
echo Visit http://localhost:3000 in your browser!
echo.
"C:\Program Files\nodejs\npx.cmd" serve -l 3000 .
pause
