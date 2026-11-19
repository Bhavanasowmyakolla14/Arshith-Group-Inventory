@echo off
echo ===================================================================
echo   ARSHITH ENTERPRISE - UNIFIED 3-COMPANY ERP ^& INVENTORY SYSTEM
echo ===================================================================
echo Checking server status on port 5000...
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
  echo [OK] Server is already running on http://localhost:5000
  echo Opening application in your web browser...
  start http://localhost:5000
  timeout /t 3 >nul
  exit /b 0
)

echo Starting Unified Enterprise Server on port 5000...
echo Access in browser: http://localhost:5000
echo.
start http://localhost:5000
cd /d "%~dp0server"
node src/server.js
pause
