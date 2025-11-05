#!/bin/bash
# AI Recruiter Pro - Development Environment Starter for Mac/Linux
# This script runs both backend and frontend concurrently

echo "🚀 AI Recruiter Pro - Starting Development Environment"
echo "===================================================="
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
        echo -e "${GREEN}   ✅ Port $port is now available${NC}"
        return 0
    fi
    return 1
}

# Check and kill processes on required ports
echo -e "${YELLOW}🔍 Checking and cleaning ports...${NC}"

port8000_killed=$(kill_port 8000; echo $?)
port5173_killed=$(kill_port 5173; echo $?)

if [ "$port8000_killed" -eq 1 ] && [ "$port5173_killed" -eq 1 ]; then
    echo -e "${GREEN}✅ Ports 8000 and 5173 are available${NC}"
fi
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed!${NC}"
    echo -e "${YELLOW}   Please install Python 3 from https://python.org/${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo -e "${YELLOW}   Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python: $(python3 --version)${NC}"
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo ""

# Setup Backend
echo -e "${CYAN}📂 Setting up Backend...${NC}"

# Check if backend virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo -e "${YELLOW}📦 Creating backend virtual environment...${NC}"
    cd backend
    python3 -m venv venv
    cd ..
    echo -e "${GREEN}✅ Virtual environment created${NC}"
fi

# Activate and check dependencies
cd backend
source venv/bin/activate
if ! pip list 2>/dev/null | grep -q "fastapi"; then
    echo -e "${YELLOW}📥 Installing backend dependencies...${NC}"
    pip install --upgrade pip --quiet
    pip install -r requirements.txt
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
fi
deactivate
cd ..

# Setup Frontend
echo -e "\n${CYAN}📂 Setting up Frontend...${NC}"

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📥 Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
fi

echo -e "\n${GREEN}🎬 Starting servers...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${BLUE}📍 Backend will run on:  http://localhost:8000${NC}"
echo -e "${BLUE}📍 Frontend will run on: http://localhost:5173${NC}"
echo -e "\n${YELLOW}💡 Press Ctrl+C in each terminal to stop servers${NC}\n"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Determine the terminal command based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo -e "${GREEN}🍎 Detected macOS${NC}"
    
    # Start backend
    osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'/backend\" && source venv/bin/activate && echo \"🔥 Backend Server Running\" && python main.py"'
    
    # Wait a moment
    sleep 2
    
    # Start frontend
    osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'/frontend\" && echo \"⚡ Frontend Dev Server Running\" && npm run dev"'
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo -e "${GREEN}🐧 Detected Linux${NC}"
    
    # Try different terminal emulators
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd backend && source venv/bin/activate && echo '🔥 Backend Server Running' && python main.py; exec bash"
        sleep 2
        gnome-terminal -- bash -c "cd frontend && echo '⚡ Frontend Dev Server Running' && npm run dev; exec bash"
    elif command -v konsole &> /dev/null; then
        konsole --hold -e bash -c "cd backend && source venv/bin/activate && echo '🔥 Backend Server Running' && python main.py" &
        sleep 2
        konsole --hold -e bash -c "cd frontend && echo '⚡ Frontend Dev Server Running' && npm run dev" &
    elif command -v xterm &> /dev/null; then
        xterm -hold -e "cd backend && source venv/bin/activate && echo '🔥 Backend Server Running' && python main.py" &
        sleep 2
        xterm -hold -e "cd frontend && echo '⚡ Frontend Dev Server Running' && npm run dev" &
    else
        echo -e "${YELLOW}⚠️  No supported terminal found. Please run manually:${NC}"
        echo -e "${CYAN}Terminal 1:${NC} cd backend && source venv/bin/activate && python main.py"
        echo -e "${CYAN}Terminal 2:${NC} cd frontend && npm run dev"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Both servers are starting in separate terminal windows!${NC}"
echo -e "\n${CYAN}📝 Tips:${NC}"
echo -e "${NC}   • Backend API docs: http://localhost:8000/docs${NC}"
echo -e "${NC}   • Close terminal windows to stop servers${NC}"
echo -e "${NC}   • Check the separate windows for server logs${NC}"
echo ""
