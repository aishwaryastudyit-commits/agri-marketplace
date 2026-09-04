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

:: Create venv if missing
IF NOT EXIST "venv\Scripts\python.exe" GOTO CREATE_VENV
IF NOT EXIST "venv\Scripts\pip.exe" GOTO CREATE_VENV
GOTO INSTALL_DEPS

:CREATE_VENV
IF EXIST "venv" (
    echo Replacing incomplete virtual environment...
    rmdir /S /Q "venv"
)
echo Creating virtual environment...
    python -m venv venv 2>nul || py -m venv venv 2>nul || python3 -m venv venv

:INSTALL_DEPS
echo Checking and installing dependencies...
.\venv\Scripts\python.exe -m pip install -r requirements.txt

IF NOT EXIST "data\demand_history.csv" (
    echo Generating initial dataset...
    call .\venv\Scripts\python.exe data\generate_dummy_data.py
)

echo.
echo Starting FastAPI server at http://127.0.0.1:%PORT% ...
echo Interactive Swagger Documentation: http://127.0.0.1:%PORT%/docs
echo.

.\venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port %PORT%
