Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting ANNAM AI Engine Microservice" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot

# Free port 8001 if already occupied by a previous process
$port = 8001
$occupied = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($occupied) {
    Write-Host "Clearing existing process on port $port (PID: $($occupied.OwningProcess))..." -ForegroundColor Yellow
    Stop-Process -Id $occupied.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

if (-Not (Test-Path ".\venv\Scripts\python.exe")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    & "C:\Users\kalyaanasundar.a\AppData\Local\Programs\Python\Python314\python.exe" -m venv venv
    & .\venv\Scripts\pip.exe install --only-binary :all: -r requirements.txt
    & .\venv\Scripts\python.exe data\generate_dummy_data.py
}

Write-Host "`nStarting FastAPI server at http://127.0.0.1:$port ..." -ForegroundColor Cyan
Write-Host "Interactive Swagger Documentation: http://127.0.0.1:$port/docs`n" -ForegroundColor Yellow

& .\venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port $port
