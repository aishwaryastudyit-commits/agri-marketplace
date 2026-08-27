#!/usr/bin/env bash
# ========================================================
#   ANNAM AI Engine — Git Bash & Linux/macOS Startup Script
# ========================================================

echo "========================================================"
echo "  Starting ANNAM AI Engine Microservice"
echo "========================================================"

# Find Python executable
if command -v python3 &>/dev/null; then
    PY_EXEC="python3"
elif command -v python &>/dev/null; then
    PY_EXEC="python"
elif command -v py &>/dev/null; then
    PY_EXEC="py"
else
    echo "Error: Python not found in PATH."
    exit 1
fi

# Initialize virtual environment if needed
if [ ! -f "venv/Scripts/python.exe" ] && [ ! -f "venv/bin/python" ]; then
    echo "Creating virtual environment..."
    $PY_EXEC -m venv venv
    if [ -f "venv/Scripts/pip.exe" ]; then
        venv/Scripts/pip.exe install --only-binary :all: -r requirements.txt
        venv/Scripts/python.exe data/generate_dummy_data.py
    elif [ -f "venv/bin/pip" ]; then
        venv/bin/pip install --only-binary :all: -r requirements.txt
        venv/bin/python data/generate_dummy_data.py
    fi
fi

echo ""
echo "Starting FastAPI server at http://127.0.0.1:8001 ..."
echo "Interactive Swagger Documentation: http://127.0.0.1:8001/docs"
echo ""

if [ -f "venv/Scripts/python.exe" ]; then
    venv/Scripts/python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
elif [ -f "venv/bin/python" ]; then
    venv/bin/python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
else
    $PY_EXEC -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
fi
