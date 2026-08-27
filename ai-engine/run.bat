@echo off
echo ========================================================
echo   Starting ANNAM AI Engine Microservice
echo ========================================================

cd /d "%~dp0"

set PORT=8001

:: Free port if occupied
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT% ^| findstr LISTENING') do (
    echo Freeing port %PORT% from PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

IF NOT EXIST "venv\Scripts\python.exe" (
    echo Creating virtual environment...
    "C:\Users\kalyaanasundar.a\AppData\Local\Programs\Python\Python314\python.exe" -m venv venv
    call .\venv\Scripts\pip.exe install --only-binary :all: -r requirements.txt
    call .\venv\Scripts\python.exe data\generate_dummy_data.py
)

echo.
echo Starting FastAPI server at http://127.0.0.1:%PORT% ...
echo Interactive Swagger Documentation: http://127.0.0.1:%PORT%/docs
echo.

.\venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port %PORT%
