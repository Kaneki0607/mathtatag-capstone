# MathTatag Capstone App - Auto Setup Guide

This guide will help you quickly set up and run the MathTatag Capstone App on your local machine.

## Prerequisites

Before running the auto-setup, make sure you have the following installed:

- **Node.js** (version 16 or higher) - Download from [https://nodejs.org/](https://nodejs.org/)
- **npm** (comes with Node.js)

## Quick Start

### Option 1: Using npm script (Recommended)

```bash
npm run setup
```

### Option 2: Test the setup first (Optional)

```bash
npm run test-setup
```

### Option 3: Using the setup script directly

```bash
node scripts/setup-and-run.js
```

### Option 3: Platform-specific scripts

#### Windows (Command Prompt)
```cmd
setup-and-run.bat
```

#### Windows (PowerShell)
```powershell
.\setup-and-run.ps1
```

#### macOS/Linux
```bash
chmod +x setup-and-run.sh
./setup-and-run.sh
```

## What the Auto-Setup Does

The auto-setup script will:

1. **Check Prerequisites**
   - Verify Node.js is installed
   - Verify npm is installed
   - Check if Expo CLI is available

2. **Install Dependencies**
   - Run `npm install` to install all project dependencies
   - Handle any installation errors gracefully

3. **Start Development Server**
   - Run `npx expo start` to start the Expo development server
   - Display helpful information about available commands

## After Setup

Once the setup is complete, you'll see the Expo development server running. You can:

- **Press 'r'** to reload the app
- **Press 'm'** to toggle the menu
- **Press 'j'** to open debugger
- **Press 'w'** to open in web browser
- **Press 'a'** to open Android emulator
- **Press 'i'** to open iOS simulator
- **Press 'q'** to quit

## Troubleshooting

### Common Issues

1. **Node.js not found**
   - Install Node.js from [https://nodejs.org/](https://nodejs.org/)
   - Make sure it's added to your system PATH

2. **npm install fails**
   - Check your internet connection
   - Try clearing npm cache: `npm cache clean --force`
   - Delete `node_modules` folder and `package-lock.json`, then run setup again

3. **Expo CLI issues**
   - The script will automatically install Expo CLI via npx
   - If you have global Expo CLI installed, you can use that instead

4. **Permission errors (Linux/macOS)**
   - Make sure the shell script is executable: `chmod +x setup-and-run.sh`

### Manual Setup (if auto-setup fails)

If the auto-setup doesn't work, you can manually set up the project:

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

## Development Commands

After setup, you can use these npm scripts:

- `npm start` - Start Expo development server
- `npm run setup` - Auto-setup and start the development server
- `npm run test-setup` - Test if the setup is ready
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start in web browser
- `npm run lint` - Run ESLint

## Project Structure

```
mathtatag-capstone-app/
├── app/                    # Main app screens
├── assets/                 # Images, fonts, and other assets
├── components/             # Reusable React components
├── constants/              # App constants and configuration
├── hooks/                  # Custom React hooks
├── scripts/                # Setup and utility scripts
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## Support

If you encounter any issues with the setup, please:

1. Check the troubleshooting section above
2. Ensure you have the latest version of Node.js
3. Try running the manual setup steps
4. Check the project's main README.md for additional information

---

**Happy coding! 🚀** 