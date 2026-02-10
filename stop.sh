#!/bin/bash

# Email Engine - Stop Script
# This script stops all running services

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Email Engine - Stopping Services${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Stop FastAPI
echo -e "${YELLOW}Stopping Backend API...${NC}"
pkill -f "uvicorn" 2>/dev/null && echo -e "${GREEN}✓${NC} Backend API stopped" || echo -e "${YELLOW}⚠${NC} Backend API was not running"

# Stop Worker
echo -e "${YELLOW}Stopping Worker Service...${NC}"
pkill -f "worker.py" 2>/dev/null && echo -e "${GREEN}✓${NC} Worker stopped" || echo -e "${YELLOW}⚠${NC} Worker was not running"

# Stop Next.js
echo -e "${YELLOW}Stopping Frontend...${NC}"
pkill -f "next" 2>/dev/null && echo -e "${GREEN}✓${NC} Frontend stopped" || echo -e "${YELLOW}⚠${NC} Frontend was not running"

echo ""
echo -e "${GREEN}✓ All services stopped${NC}"
echo ""
