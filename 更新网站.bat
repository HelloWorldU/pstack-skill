@echo off
chcp 65001 >nul
cd /d "%~dp0"
title pstack 中文文档站 - 同步更新
echo ============================================
echo   同步上游 cursor/plugins 并重建网站
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未找到 Node.js，请先安装：https://nodejs.org/
  pause
  exit /b 1
)

echo [1/3] 同步上游仓库…
node tools\sync.mjs
if errorlevel 1 (
  echo [错误] 同步失败（检查网络）
  pause
  exit /b 1
)

echo.
echo [2/3] 检查翻译状态…
node tools\translate.mjs

echo.
echo [3/3] 重建网站…
node tools\build.mjs
if errorlevel 1 (
  echo [错误] 构建失败
  pause
  exit /b 1
)

echo.
echo 完成！是否启动网站？
node tools\serve.mjs
pause
