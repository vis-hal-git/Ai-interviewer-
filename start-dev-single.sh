#!/bin/bash
# AI Recruiter Pro - Single Window Development Starter for Mac/Linux
# This script runs both backend and frontend in the same terminal

echo "AI Recruiter Pro - Development Environment (Single Window)"
echo "============================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to kill process on a specific port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}   Killing process(es) on port $port...${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null
        sleep 0.5
        echo -e "${GREEN}   [OK] Port $port is now available${NC}"
        return 0
    fi
    return 1
}

# Check and kill processes on required ports
echo -e "${YELLOW}Checking and cleaning ports...${NC}"

port8000_killed=$(kill_port 8000; echo $?)
port5173_killed=$(kill_port 5173; echo $?)

if [ "$port8000_killed" -eq 1 ] && [ "$port5173_killed" -eq 1 ]; then
    echo -e "${GREEN}[OK] Ports 8000 and 5173 are available${NC}"
fi
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[ERROR] Python 3 is not installed!${NC}"
    echo -e "${YELLOW}   Please install Python 3 from https://python.org/${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed!${NC}"
    echo -e "${YELLOW}   Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] Python: $(python3 --version)${NC}"
echo -e "${GREEN}[OK] Node.js: $(node --version)${NC}"
echo ""

# Install root dependencies (concurrently)
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing root dependencies (concurrently)...${NC}"
    npm install
fi

# Setup backend
echo ""
echo -e "${CYAN}Setting up Backend...${NC}"
if [ ! -d "backend/venv" ]; then
    echo -e "${YELLOW}Creating backend virtual environment...${NC}"
    cd backend
    python3 -m venv venv
    cd ..
fi

cd backend
source venv/bin/activate
if ! pip list 2>/dev/null | grep -q "fastapi"; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    pip install --upgrade pip --quiet
    pip install -r requirements.txt
fi
deactivate
cd ..
echo -e "${GREEN}[OK] Backend ready${NC}"

# Setup frontend
echo ""
echo -e "${CYAN}Setting up Frontend...${NC}"
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
fi
echo -e "${GREEN}[OK] Frontend ready${NC}"

echo ""
echo -e "${GREEN}Starting both servers in this window...${NC}"
echo -e "${BLUE}======================================================${NC}"
echo ""
echo -e "${BLUE}Backend:  http://localhost:8000${NC}"
echo -e "${BLUE}Frontend: http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""
echo -e "${BLUE}======================================================${NC}"
echo ""

# Run both using npm script (which uses concurrently)
npm run dev
