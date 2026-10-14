@echo off
cd /d "%~dp0"
title pstack zh docs - sync and rebuild
echo ============================================
echo   Sync upstream cursor/plugins and rebuild
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install it from https://nodejs.org/
  pause
  exit /b 1
)

echo [1/3] Syncing upstream...
node tools\sync.mjs
if errorlevel 1 (
  echo [ERROR] sync failed - check network
  pause
  exit /b 1
)

echo.
echo [2/3] Checking translation status...
node tools\translate.mjs

echo.
echo [3/3] Rebuilding site...
node tools\build.mjs
if errorlevel 1 (
  echo [ERROR] build failed
  pause
  exit /b 1
)

echo.
echo Done. Starting server...
node tools\serve.mjs
pause
