#!/usr/bin/env bash
# ========================================================
#   ANNAM AI Engine — Git Bash & Linux/macOS Startup Script
# ========================================================

echo "========================================================"
echo "  Starting ANNAM AI Engine Microservice"
echo "========================================================"

# Find Python executable
if command -v python &>/dev/null; then
    PY_EXEC="python"
elif command -v python3 &>/dev/null; then
    PY_EXEC="python3"
elif command -v py &>/dev/null; then
    PY_EXEC="py"
else
    echo "Error: Python not found in PATH."
    exit 1
fi

# Create virtual environment if missing
if [ ! -d "venv" ] || [ ! -f "venv/Scripts/python.exe" -a ! -f "venv/bin/python" ]; then
    echo "Creating virtual environment..."
    $PY_EXEC -m venv venv
fi

# Set path to venv python and pip
if [ -f "venv/Scripts/python.exe" ]; then
    VENV_PY="venv/Scripts/python.exe"
    VENV_PIP="venv/Scripts/pip.exe"
elif [ -f "venv/bin/python" ]; then
    VENV_PY="venv/bin/python"
    VENV_PIP="venv/bin/pip"
else
    VENV_PY="$PY_EXEC"
    VENV_PIP="pip"
fi

# Ensure all dependencies are installed
echo "Checking and installing dependencies..."
$VENV_PIP install -r requirements.txt

# Ensure dummy data is generated if missing
if [ ! -f "data/demand_history.csv" ]; then
    echo "Generating initial dataset..."
    $VENV_PY data/generate_dummy_data.py
fi

echo ""
echo "Starting FastAPI server at http://127.0.0.1:8001 ..."
echo "Interactive Swagger Documentation: http://127.0.0.1:8001/docs"
echo ""

$VENV_PY -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
