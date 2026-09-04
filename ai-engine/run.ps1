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

# Auto-detect Python executable
$pyCmd = "python"
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pyCmd = "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pyCmd = "py"
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pyCmd = "python3"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    $pyCmd = "python"
}

if ((-Not (Test-Path ".\venv\Scripts\python.exe")) -or (-Not (Test-Path ".\venv\Scripts\pip.exe"))) {
    if (Test-Path ".\venv") {
        Write-Host "Replacing incomplete virtual environment..." -ForegroundColor Yellow
        Remove-Item -LiteralPath ".\venv" -Recurse -Force
    }
    Write-Host "Creating virtual environment using $pyCmd..." -ForegroundColor Yellow
    & $pyCmd -m venv venv
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path ".\venv\Scripts\python.exe")) {
        throw "Unable to create the AI Engine virtual environment. Check that Python is installed and available in PATH."
    }
}

Write-Host "Checking and installing dependencies..." -ForegroundColor Cyan
& .\venv\Scripts\python.exe -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    throw "Unable to install AI Engine dependencies."
}

if (-Not (Test-Path ".\data\demand_history.csv")) {
    Write-Host "Generating initial dataset..." -ForegroundColor Yellow
    & .\venv\Scripts\python.exe data\generate_dummy_data.py
}

Write-Host "`nStarting FastAPI server at http://127.0.0.1:$port ..." -ForegroundColor Cyan
Write-Host "Interactive Swagger Documentation: http://127.0.0.1:$port/docs`n" -ForegroundColor Yellow

& .\venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port $port
