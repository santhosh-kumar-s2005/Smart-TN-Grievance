@echo off
REM Smart TN Grievance - Windows Setup Script
REM This script automates the project move and fresh installation

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Smart TN Grievance - Windows Setup
echo ========================================
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo WARNING: This script should ideally run as Administrator
    echo Press Ctrl+C to cancel and rerun as Admin, or press any key to continue...
    pause
)

REM Step 1: Create new project folder
echo [STEP 1] Creating project folder at C:\Projects\smart-tn-grievance...
if not exist "C:\Projects" (
    mkdir "C:\Projects"
    echo Created C:\Projects
)
mkdir "C:\Projects\smart-tn-grievance" 2>nul
echo ✓ Folder created

REM Step 2: Copy project files
echo.
echo [STEP 2] Copying project files...
echo Source: C:\Users\%USERNAME%\OneDrive\Desktop\smart-tn-grievance
echo Destination: C:\Projects\smart-tn-grievance
xcopy "C:\Users\%USERNAME%\OneDrive\Desktop\smart-tn-grievance\*" "C:\Projects\smart-tn-grievance" /E /I /Y >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Files copied successfully
) else (
    echo ✗ Error copying files. Check if source folder exists.
    pause
    exit /b 1
)

REM Step 3: Change to new directory
echo.
echo [STEP 3] Navigating to new project folder...
cd /d "C:\Projects\smart-tn-grievance"
echo Current folder: %cd%
echo ✓ Directory changed

REM Step 4: Delete old build artifacts
echo.
echo [STEP 4] Cleaning old build artifacts...
if exist "node_modules" (
    echo Removing node_modules... (this may take a minute)
    rmdir /s /q "node_modules" >nul 2>&1
    echo ✓ node_modules removed
)
if exist ".next" (
    echo Removing .next folder...
    rmdir /s /q ".next" >nul 2>&1
    echo ✓ .next removed
)
if exist "package-lock.json" (
    echo Removing package-lock.json...
    del "package-lock.json" >nul 2>&1
    echo ✓ package-lock.json removed
)

REM Step 5: Verify Node and npm
echo.
echo [STEP 5] Verifying Node and npm installation...
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node installed: && node --version
echo ✓ npm installed: && npm --version

REM Step 6: Clean npm cache
echo.
echo [STEP 6] Cleaning npm cache...
npm cache clean --force >nul 2>&1
echo ✓ Cache cleaned

REM Step 7: Install dependencies
echo.
echo [STEP 7] Installing dependencies...
echo This may take 3-5 minutes...
npm install
if %errorLevel% neq 0 (
    echo ✗ npm install failed. Please check your internet connection.
    pause
    exit /b 1
)
echo ✓ Dependencies installed

REM Step 8: Verify installation
echo.
echo [STEP 8] Verifying installation...
npm list next >nul 2>&1
if %errorLevel% equ 0 (
    echo ✓ Next.js installed successfully
) else (
    echo ✗ Next.js installation verification failed
    pause
    exit /b 1
)

REM Final message
echo.
echo ========================================
echo ✓ SETUP COMPLETE!
echo ========================================
echo.
echo Your project is now ready at:
echo C:\Projects\smart-tn-grievance
echo.
echo To start development, run:
echo   cd C:\Projects\smart-tn-grievance
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Press any key to continue...
pause

REM Optional: Ask if user wants to start dev server now
echo.
set /p start_dev="Do you want to start the dev server now? (y/n): "
if /i "%start_dev%"=="y" (
    echo Starting development server...
    npm run dev
) else (
    echo Setup complete! You can start the dev server manually whenever ready.
    echo.
)
