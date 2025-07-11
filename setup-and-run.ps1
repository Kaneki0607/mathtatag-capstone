# MathTatag Capstone App Auto-Setup PowerShell Script

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   MathTatag Capstone App Auto-Setup" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting auto-setup..." -ForegroundColor Yellow
Write-Host ""

try {
    # Check if Node.js is installed
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js $nodeVersion is installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }

    # Run the setup script
    node scripts/setup-and-run.js
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Setup failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error running setup: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit" 