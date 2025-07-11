#!/bin/bash

# MathTatag Capstone App Auto-Setup Shell Script

echo ""
echo "=========================================="
echo "   MathTatag Capstone App Auto-Setup"
echo "=========================================="
echo ""
echo "Starting auto-setup..."
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js $NODE_VERSION is installed"
else
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    read -p "Press Enter to exit"
    exit 1
fi

# Make the script executable
chmod +x scripts/setup-and-run.js

# Run the setup script
node scripts/setup-and-run.js

# Check exit code
if [ $? -ne 0 ]; then
    echo "❌ Setup failed"
    read -p "Press Enter to exit"
    exit 1
fi 