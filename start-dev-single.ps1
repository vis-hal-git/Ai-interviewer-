# AI Recruiter Pro - Single Window Development Starter
# This script runs both backend and frontend in the same terminal using concurrently

Write-Host "AI Recruiter Pro - Development Environment (Single Window)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

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

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if (!$nodeVersion) {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "   Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# Check if Python is installed
$pythonVersion = python --version 2>$null
if (!$pythonVersion) {
    Write-Host "[ERROR] Python is not installed!" -ForegroundColor Red
    Write-Host "   Please install Python from https://python.org/" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "[OK] Python: $pythonVersion" -ForegroundColor Green
Write-Host ""

# Install root dependencies (concurrently)
if (!(Test-Path "node_modules")) {
    Write-Host "Installing root dependencies (concurrently)..." -ForegroundColor Yellow
    npm install
}

# Setup backend
Write-Host ""
Write-Host "Setting up Backend..." -ForegroundColor Cyan
if (!(Test-Path "backend\venv")) {
    Write-Host "Creating backend virtual environment..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv venv
    Set-Location ..
}

Set-Location backend
. ".\venv\Scripts\Activate.ps1"
$installed = pip list --format=freeze 2>$null
if (!($installed -match "fastapi")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    pip install --upgrade pip --quiet
    pip install -r requirements.txt
}
deactivate
Set-Location ..
Write-Host "[OK] Backend ready" -ForegroundColor Green

# Setup frontend
Write-Host ""
Write-Host "Setting up Frontend..." -ForegroundColor Cyan
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}
Write-Host "[OK] Frontend ready" -ForegroundColor Green

Write-Host ""
Write-Host "Starting both servers in this window..." -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Gray
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Blue
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Blue
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""
Write-Host "======================================================" -ForegroundColor Gray
Write-Host ""

# Run both using npm script (which uses concurrently)
npm run dev
