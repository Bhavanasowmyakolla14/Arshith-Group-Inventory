Write-Host "===================================================================" -ForegroundColor Green
Write-Host "  ARSHITH ENTERPRISE - UNIFIED 3-COMPANY ERP & INVENTORY SYSTEM" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Green

$portInUse = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "[OK] Server is already active and running on http://localhost:5000" -ForegroundColor Cyan
    Write-Host "Opening application in your default web browser..." -ForegroundColor Yellow
    Start-Process "http://localhost:5000"
    exit 0
}

Write-Host "Starting Unified Enterprise Server on port 5000..." -ForegroundColor Cyan
Write-Host "Access in browser: http://localhost:5000" -ForegroundColor Yellow
Start-Process "http://localhost:5000"

Set-Location "$PSScriptRoot\server"
node src/server.js
