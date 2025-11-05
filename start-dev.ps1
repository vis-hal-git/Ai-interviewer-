# AI Recruiter Pro - Development Environment Starter
# This script runs both backend and frontend concurrently

Write-Host "AI Recruiter Pro - Starting Development Environment" -ForegroundColor Cyan
Write-Host "====================================================`n" -ForegroundColor Cyan

# Function to kill process on a specific port
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
        if ($processes) {
            foreach ($processId in $processes) {
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "   Killing process '$($process.ProcessName)' (PID: $processId) on port $Port..." -ForegroundColor Yellow
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Milliseconds 500
                }
            }
            return $true
        }
    } catch {
        # Port is free or error occurred
    }
    return $false
}

# Check and kill processes on required ports
Write-Host "Checking and cleaning ports..." -ForegroundColor Yellow

$port8000Killed = Stop-ProcessOnPort 8000
if ($port8000Killed) {
    Write-Host "[OK] Port 8000 is now available" -ForegroundColor Green
}

$port5173Killed = Stop-ProcessOnPort 5173
if ($port5173Killed) {
    Write-Host "[OK] Port 5173 is now available" -ForegroundColor Green
}

if (!$port8000Killed -and !$port5173Killed) {
    Write-Host "[OK] Ports 8000 and 5173 are available" -ForegroundColor Green
}

Write-Host "`nSetting up Backend..." -ForegroundColor Cyan

# Check if backend virtual environment exists
if (!(Test-Path "backend\venv")) {
    Write-Host "Creating backend virtual environment..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv venv
    Write-Host "[OK] Virtual environment created" -ForegroundColor Green
    Set-Location ..
}

# Check if backend dependencies are installed
Set-Location backend
. ".\venv\Scripts\Activate.ps1"
$installed = pip list --format=freeze 2>$null
if (!($installed -match "fastapi")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    pip install --upgrade pip --quiet
    pip install -r requirements.txt --quiet
    Write-Host "[OK] Backend dependencies installed" -ForegroundColor Green
}
deactivate
Set-Location ..

Write-Host "`nSetting up Frontend..." -ForegroundColor Cyan

# Check if frontend node_modules exists
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Write-Host "[OK] Frontend dependencies installed" -ForegroundColor Green
    Set-Location ..
}

Write-Host "`nStarting servers..." -ForegroundColor Green
Write-Host "======================================================`n" -ForegroundColor Gray

Write-Host "Backend will run on:  http://localhost:8000" -ForegroundColor Blue
Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Blue
Write-Host "`nPress Ctrl+C in each terminal to stop servers`n" -ForegroundColor Yellow
Write-Host "======================================================`n" -ForegroundColor Gray

# Start backend in a new PowerShell window
$backendCmd = "cd '$PWD\backend'; . .\venv\Scripts\Activate.ps1; Write-Host 'Backend Server Running' -ForegroundColor Green; python main.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in a new PowerShell window
$frontendCmd = "cd '$PWD\frontend'; Write-Host 'Frontend Dev Server Running' -ForegroundColor Green; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "`nTips:" -ForegroundColor Cyan
Write-Host "  - Backend API docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "  - Close both terminal windows to stop servers" -ForegroundColor Gray
Write-Host "  - Check the separate windows for server logs" -ForegroundColor Gray
Write-Host "`nPress any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
