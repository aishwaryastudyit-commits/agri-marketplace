$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent $PSScriptRoot
$BackendDir = Join-Path $RootDir "backend"
$PythonCandidates = @(
    (Join-Path $RootDir ".venv\Scripts\python.exe"),
    "D:\ANNAM\.venv\Scripts\python.exe"
)
$Python = $PythonCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $Python) {
    $Python = "python"
}

Push-Location $BackendDir
try {
    & $Python -m uvicorn app.main:app --reload --port 8000
}
finally {
    Pop-Location
}