@echo off
chcp 65001 >nul
cd /d "%~dp0"
title pstack 中文文档站
echo ============================================
echo   pstack 中文文档站 - 一键启动
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未找到 Node.js，请先安装：https://nodejs.org/
  pause
  exit /b 1
)

if not exist site\index.html (
  echo 首次运行，正在构建网站…
  node tools\build.mjs
  if errorlevel 1 (
    echo [错误] 构建失败
    pause
    exit /b 1
  )
)

echo 正在启动本地服务并打开浏览器…
node tools\serve.mjs
pause
