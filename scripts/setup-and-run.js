#!/usr/bin/env node

/**
 * Auto-setup script for MathTatag Capstone App
 * This script will:
 * 1. Check if Node.js and npm are installed
 * 2. Install dependencies
 * 3. Start the Expo development server
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.cyan}${step}${colors.reset} ${message}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

// Check if Node.js is installed
function checkNodeJS() {
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    logSuccess(`Node.js ${nodeVersion} is installed`);
    return true;
  } catch (error) {
    logError('Node.js is not installed. Please install Node.js from https://nodejs.org/');
    return false;
  }
}

// Check if npm is installed
function checkNPM() {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    logSuccess(`npm ${npmVersion} is installed`);
    return true;
  } catch (error) {
    logError('npm is not installed. Please install npm.');
    return false;
  }
}

// Check if Expo CLI is installed
function checkExpoCLI() {
  try {
    execSync('npx expo --version', { stdio: 'ignore' });
    logSuccess('Expo CLI is available');
    return true;
  } catch (error) {
    logWarning('Expo CLI not found, will install via npx');
    return false;
  }
}

// Install dependencies
function installDependencies() {
  return new Promise((resolve, reject) => {
    logStep('Step 2', 'Installing dependencies...');
    
    // Try with legacy peer deps first to handle TensorFlow conflicts
    const installProcess = spawn('npm', ['install', '--legacy-peer-deps'], {
      stdio: 'inherit',
      shell: true
    });

    installProcess.on('close', (code) => {
      if (code === 0) {
        logSuccess('Dependencies installed successfully');
        resolve();
      } else {
        logWarning('First install attempt failed, trying with force flag...');
        
        // If legacy peer deps fails, try with force
        const forceInstallProcess = spawn('npm', ['install', '--force'], {
          stdio: 'inherit',
          shell: true
        });

        forceInstallProcess.on('close', (forceCode) => {
          if (forceCode === 0) {
            logSuccess('Dependencies installed successfully with force flag');
            resolve();
          } else {
            logError(`Failed to install dependencies (exit code: ${forceCode})`);
            reject(new Error(`npm install failed with exit code ${forceCode}`));
          }
        });

        forceInstallProcess.on('error', (error) => {
          logError(`Failed to start npm install with force: ${error.message}`);
          reject(error);
        });
      }
    });

    installProcess.on('error', (error) => {
      logError(`Failed to start npm install: ${error.message}`);
      reject(error);
    });
  });
}

// Start Expo development server
function startExpo() {
  logStep('Step 3', 'Starting Expo development server...');
  logInfo('The development server will start shortly. You can:');
  logInfo('- Press r to reload the app');
  logInfo('- Press m to toggle the menu');
  logInfo('- Press j to open debugger');
  logInfo('- Press w to open in web browser');
  logInfo('- Press a to open Android emulator');
  logInfo('- Press i to open iOS simulator');
  logInfo('- Press q to quit');
  
  const expoProcess = spawn('npx', ['expo', 'start'], {
    stdio: 'inherit',
    shell: true
  });

  expoProcess.on('close', (code) => {
    if (code === 0) {
      logSuccess('Expo development server stopped');
    } else {
      logError(`Expo development server stopped with exit code: ${code}`);
    }
  });

  expoProcess.on('error', (error) => {
    logError(`Failed to start Expo: ${error.message}`);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    logInfo('Received SIGINT, stopping Expo server...');
    expoProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    logInfo('Received SIGTERM, stopping Expo server...');
    expoProcess.kill('SIGTERM');
  });
}

// Main setup function
async function setupAndRun() {
  try {
    log(`${colors.bright}${colors.magenta}🚀 MathTatag Capstone App Auto-Setup${colors.reset}`);
    log(`${colors.cyan}==========================================${colors.reset}`);

    // Check prerequisites
    logStep('Step 1', 'Checking prerequisites...');
    
    if (!checkNodeJS()) {
      process.exit(1);
    }
    
    if (!checkNPM()) {
      process.exit(1);
    }
    
    checkExpoCLI();

    // Check if package.json exists
    const packageJsonPath = path.join(root, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      logError('package.json not found. Please run this script from the project root directory.');
      process.exit(1);
    }

    // Install dependencies
    await installDependencies();

    // Start Expo
    startExpo();

  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupAndRun();
}

module.exports = { setupAndRun }; 