#!/usr/bin/env node

/**
 * Test script for MathTatag Capstone App Auto-Setup
 * This script tests the setup process without starting the full Expo server
 */

const { execSync } = require('child_process');
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

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

// Test Node.js installation
function testNodeJS() {
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    logSuccess(`Node.js ${nodeVersion} is installed`);
    return true;
  } catch (error) {
    logError('Node.js is not installed');
    return false;
  }
}

// Test npm installation
function testNPM() {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    logSuccess(`npm ${npmVersion} is installed`);
    return true;
  } catch (error) {
    logError('npm is not installed');
    return false;
  }
}

// Test Expo CLI
function testExpoCLI() {
  try {
    execSync('npx expo --version', { stdio: 'ignore' });
    logSuccess('Expo CLI is available');
    return true;
  } catch (error) {
    logError('Expo CLI is not available');
    return false;
  }
}

// Test if dependencies are installed
function testDependencies() {
  const nodeModulesPath = path.join(root, 'node_modules');
  const packageLockPath = path.join(root, 'package-lock.json');
  
  if (fs.existsSync(nodeModulesPath) && fs.existsSync(packageLockPath)) {
    logSuccess('Dependencies are installed');
    return true;
  } else {
    logError('Dependencies are not installed');
    return false;
  }
}

// Test if package.json exists
function testPackageJson() {
  const packageJsonPath = path.join(root, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    logSuccess('package.json exists');
    return true;
  } else {
    logError('package.json not found');
    return false;
  }
}

// Main test function
function runTests() {
  log(`${colors.bright}${colors.magenta}🧪 MathTatag Capstone App Setup Test${colors.reset}`);
  log(`${colors.cyan}==========================================${colors.reset}`);

  let allTestsPassed = true;

  // Run all tests
  if (!testNodeJS()) allTestsPassed = false;
  if (!testNPM()) allTestsPassed = false;
  if (!testExpoCLI()) allTestsPassed = false;
  if (!testPackageJson()) allTestsPassed = false;
  if (!testDependencies()) allTestsPassed = false;

  log('\n' + '='.repeat(50));
  
  if (allTestsPassed) {
    logSuccess('All tests passed! The setup is ready to run.');
    logInfo('You can now run: npm run setup');
  } else {
    logError('Some tests failed. Please check the issues above.');
  }

  return allTestsPassed;
}

// Run the tests
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runTests }; 