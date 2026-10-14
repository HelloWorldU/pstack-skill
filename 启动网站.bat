@echo off
cd /d "%~dp0"
title pstack zh docs
echo ============================================
echo   pstack zh docs - start
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install it from https://nodejs.org/
  pause
  exit /b 1
)

if not exist site\index.html (
  echo First run, building site...
  node tools\build.mjs
  if errorlevel 1 (
    echo [ERROR] build failed
    pause
    exit /b 1
  )
)

echo Starting local server and opening browser...
node tools\serve.mjs
pause
