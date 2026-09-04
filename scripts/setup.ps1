$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

$Python = Join-Path $RootDir ".venv\Scripts\python.exe"
if (-not (Test-Path $Python)) {
    python -m venv (Join-Path $RootDir ".venv")
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

& $Python -m pip install -r (Join-Path $RootDir "backend\requirements.txt")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Push-Location (Join-Path $RootDir "frontend")
try {
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
    Pop-Location
}

& $Python (Join-Path $RootDir "scripts\seed_data.py")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "ANNAM setup complete"
