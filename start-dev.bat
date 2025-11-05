@echo off
REM AI Recruiter Pro - Development Environment Starter (Batch)
REM This script runs both backend and frontend concurrently

echo ========================================
echo AI Recruiter Pro - Dev Environment
echo ========================================
echo.

REM Kill processes on ports 8000 and 5173
echo Checking and cleaning ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Killing process on port 8000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo Killing process on port 5173 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)
echo Ports are now available
echo.

REM Check if backend virtual environment exists
if not exist "backend\venv" (
    echo Creating backend virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Starting servers...
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop servers
echo.

REM Start backend in new window
start "AI Recruiter - Backend" cmd /k "cd backend && venv\Scripts\activate && echo Backend Server Running... && python main.py"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start frontend in new window
start "AI Recruiter - Frontend" cmd /k "cd frontend && echo Frontend Dev Server Running... && npm run dev"

echo.
echo Both servers started in separate windows!
echo Close the windows to stop the servers.
echo.
pause
