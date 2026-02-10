#!/bin/bash

# Email Engine - Startup Script
# This script starts all required services for the platform

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Email Engine - Starting Services${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please create a .env file with your configuration.${NC}"
    echo -e "${YELLOW}You can copy .env.example to .env and update the values.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Environment file found"
echo ""

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠ Port $1 is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Function to kill process on port
kill_port() {
    echo -e "${YELLOW}Killing process on port $1...${NC}"
    lsof -ti:$1 | xargs kill -9 2>/dev/null || true
}

# Check and clean ports
echo -e "${BLUE}Checking ports...${NC}"
if ! check_port 8000; then
    kill_port 8000
fi
if ! check_port 3000; then
    kill_port 3000
fi
echo -e "${GREEN}✓${NC} Ports are ready"
echo ""

# Create log directory
mkdir -p logs

# Start Backend API (FastAPI)
echo -e "${BLUE}Starting Backend API (FastAPI)...${NC}"
cd platform/api
pkill -f "uvicorn" 2>/dev/null || true
sleep 1
uvicorn main:app --reload --host 0.0.0.0 --port 8000 > ../../logs/api.log 2>&1 &
API_PID=$!
echo -e "${GREEN}✓${NC} Backend API started (PID: $API_PID)"
echo -e "  ${BLUE}→${NC} http://localhost:8000"
echo -e "  ${BLUE}→${NC} Logs: logs/api.log"
cd ../..
echo ""

# Wait for API to be ready
echo -e "${BLUE}Waiting for API to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} API is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ API failed to start${NC}"
        echo -e "${YELLOW}Check logs/api.log for details${NC}"
        exit 1
    fi
    sleep 1
done
echo ""

# Start Worker Service
echo -e "${BLUE}Starting Worker Service...${NC}"
cd platform/services
pkill -f "worker.py" 2>/dev/null || true
sleep 1
python worker.py > ../../logs/worker.log 2>&1 &
WORKER_PID=$!
echo -e "${GREEN}✓${NC} Worker started (PID: $WORKER_PID)"
echo -e "  ${BLUE}→${NC} Logs: logs/worker.log"
cd ../..
echo ""

# Start Frontend (Next.js)
echo -e "${BLUE}Starting Frontend (Next.js)...${NC}"
cd platform/client
npm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓${NC} Frontend started (PID: $FRONTEND_PID)"
echo -e "  ${BLUE}→${NC} http://localhost:3000"
echo -e "  ${BLUE}→${NC} Logs: logs/frontend.log"
cd ../..
echo ""

# Wait for frontend to be ready
echo -e "${BLUE}Waiting for frontend to be ready...${NC}"
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Frontend is ready!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${YELLOW}⚠ Frontend is taking longer than expected${NC}"
        echo -e "${YELLOW}It may still be compiling. Check logs/frontend.log${NC}"
    fi
    sleep 1
done
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ All services started successfully!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Services:${NC}"
echo -e "  ${GREEN}•${NC} Backend API:  http://localhost:8000"
echo -e "  ${GREEN}•${NC} Frontend:     http://localhost:3000"
echo -e "  ${GREEN}•${NC} API Docs:     http://localhost:8000/docs"
echo ""
echo -e "${BLUE}Process IDs:${NC}"
echo -e "  ${GREEN}•${NC} API:     $API_PID"
echo -e "  ${GREEN}•${NC} Worker:  $WORKER_PID"
echo -e "  ${GREEN}•${NC} Frontend: $FRONTEND_PID"
echo ""
echo -e "${BLUE}Logs:${NC}"
echo -e "  ${GREEN}•${NC} API:      tail -f logs/api.log"
echo -e "  ${GREEN}•${NC} Worker:   tail -f logs/worker.log"
echo -e "  ${GREEN}•${NC} Frontend: tail -f logs/frontend.log"
echo ""
echo -e "${YELLOW}To stop all services, run:${NC} ./stop.sh"
echo -e "${YELLOW}Or press Ctrl+C and run:${NC} pkill -f 'uvicorn|worker.py|next'"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""

# Keep script running and monitor processes
trap 'echo -e "\n${YELLOW}Shutting down...${NC}"; kill $API_PID $WORKER_PID $FRONTEND_PID 2>/dev/null; exit' INT TERM

# Wait for any process to exit
# Wait for any process to exit
wait

echo -e "${RED}A service has stopped unexpectedly!${NC}"
echo -e "${YELLOW}Check the logs for details.${NC}"


# # API logs
# tail -f logs/api.log

# # Worker logs
# tail -f logs/worker.log

# # Frontend logs
# tail -f logs/frontend.log

# # All logs at once
# tail -f logs/*.log