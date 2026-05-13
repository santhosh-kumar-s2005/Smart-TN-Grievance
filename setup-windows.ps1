# Smart TN Grievance - Windows Setup Script (PowerShell)
# Run this script to automatically move project and fix TurbopackInternalError

param(
    [switch]$SkipCleanup = $false,
    [switch]$DisableTurbopack = $false
)

# Colors for output
$Colors = @{
    Success = [System.ConsoleColor]::Green
    Error   = [System.ConsoleColor]::Red
    Warning = [System.ConsoleColor]::Yellow
    Info    = [System.ConsoleColor]::Cyan
}

function Write-Status {
    param([string]$Message, [string]$Status)
    
    $color = switch ($Status) {
        "success" { $Colors.Success }
        "error"   { $Colors.Error }
        "warning" { $Colors.Warning }
        "info"    { $Colors.Info }
        default   { [System.ConsoleColor]::White }
    }
    
    $symbol = switch ($Status) {
        "success" { "✓" }
        "error"   { "✗" }
        "warning" { "⚠" }
        "info"    { "ℹ" }
        default   { " " }
    }
    
    Write-Host "$symbol $Message" -ForegroundColor $color
}

function Test-AdminRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Header
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Smart TN Grievance - Windows Setup" -ForegroundColor Cyan
Write-Host "  Turbopack Error Fix & Project Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check admin rights
if (-not (Test-AdminRights)) {
    Write-Status "Note: Running without admin rights. Some operations may fail." "warning"
    Write-Host "  Recommendation: Right-click PowerShell → Run as Administrator" -ForegroundColor Yellow
    Read-Host "  Press Enter to continue anyway"
}

# Step 1: Create project folder
Write-Host ""
Write-Host "[STEP 1] Creating project folder" -ForegroundColor Yellow
Write-Status "Creating: C:\Projects\smart-tn-grievance" "info"

if (-not (Test-Path "C:\Projects")) {
    New-Item -ItemType Directory -Path "C:\Projects" -Force | Out-Null
    Write-Status "Created C:\Projects" "success"
}

if (-not (Test-Path "C:\Projects\smart-tn-grievance")) {
    New-Item -ItemType Directory -Path "C:\Projects\smart-tn-grievance" -Force | Out-Null
}
Write-Status "Folder ready" "success"

# Step 2: Copy project files
Write-Host ""
Write-Host "[STEP 2] Copying project files" -ForegroundColor Yellow

$sourcePath = "C:\Users\$env:USERNAME\OneDrive\Desktop\smart-tn-grievance"
$destPath = "C:\Projects\smart-tn-grievance"

if (-not (Test-Path $sourcePath)) {
    Write-Status "Source folder not found: $sourcePath" "error"
    Write-Status "Please ensure your project is at: $sourcePath" "error"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Status "Source: $sourcePath" "info"
Write-Status "Destination: $destPath" "info"

try {
    Copy-Item -Path "$sourcePath\*" -Destination $destPath -Recurse -Force -ErrorAction Stop
    Write-Status "Files copied successfully" "success"
} catch {
    Write-Status "Error copying files: $_" "error"
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Navigate to new directory
Write-Host ""
Write-Host "[STEP 3] Changing to new project folder" -ForegroundColor Yellow
Set-Location -Path $destPath
Write-Status "Current location: $(Get-Location)" "success"

# Step 4: Clean build artifacts
Write-Host ""
Write-Host "[STEP 4] Cleaning build artifacts" -ForegroundColor Yellow

$itemsToRemove = @("node_modules", ".next", "package-lock.json", ".turbo")

foreach ($item in $itemsToRemove) {
    if (Test-Path $item) {
        Write-Status "Removing $item..." "info"
        Remove-Item -Path $item -Recurse -Force -ErrorAction SilentlyContinue
        Write-Status "$item removed" "success"
    }
}

# Step 5: Verify Node and npm
Write-Host ""
Write-Host "[STEP 5] Verifying Node.js and npm" -ForegroundColor Yellow

try {
    $nodeVersion = & node --version
    Write-Status "Node installed: $nodeVersion" "success"
} catch {
    Write-Status "Node.js not found. Install from: https://nodejs.org" "error"
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    $npmVersion = & npm --version
    Write-Status "npm installed: $npmVersion" "success"
} catch {
    Write-Status "npm not found." "error"
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 6: Clean npm cache
Write-Host ""
Write-Host "[STEP 6] Cleaning npm cache" -ForegroundColor Yellow
Write-Status "Running: npm cache clean --force" "info"
& npm cache clean --force | Out-Null
Write-Status "Cache cleaned" "success"

# Step 7: Install dependencies
Write-Host ""
Write-Host "[STEP 7] Installing dependencies" -ForegroundColor Yellow
Write-Status "This may take 3-5 minutes..." "info"

& npm install
if ($LASTEXITCODE -ne 0) {
    Write-Status "npm install failed" "error"
    Write-Status "Check your internet connection and try again" "error"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Status "Dependencies installed successfully" "success"

# Step 8: Verify installation
Write-Host ""
Write-Host "[STEP 8] Verifying installation" -ForegroundColor Yellow

try {
    & npm list next | Out-Null
    Write-Status "Next.js verified" "success"
} catch {
    Write-Status "Next.js verification failed" "warning"
}

# Step 9: Disable Turbopack if requested
if ($DisableTurbopack) {
    Write-Host ""
    Write-Host "[STEP 9] Disabling Turbopack" -ForegroundColor Yellow
    Write-Status "Modifying package.json..." "info"
    
    $packageJsonPath = "package.json"
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    $packageJson.scripts.dev = "next dev --no-turbopack"
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
    
    Write-Status "Turbopack disabled (using Webpack)" "success"
}

# Final summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Project Location:" -ForegroundColor Cyan
Write-Host "  C:\Projects\smart-tn-grievance" -ForegroundColor White
Write-Host ""

Write-Host "To start development:" -ForegroundColor Cyan
Write-Host "  1. cd C:\Projects\smart-tn-grievance" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White
Write-Host "  3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""

Write-Host "Status:" -ForegroundColor Cyan
Write-Host "  • Project moved outside OneDrive ✓" -ForegroundColor Green
Write-Host "  • Dependencies fresh installed ✓" -ForegroundColor Green
Write-Host "  • Ready for development ✓" -ForegroundColor Green
Write-Host ""

# Ask if user wants to start dev server
$response = Read-Host "Start dev server now? (y/n)"
if ($response -eq "y" -or $response -eq "yes") {
    Write-Host ""
    Write-Status "Starting development server..." "info"
    Write-Host ""
    & npm run dev
} else {
    Write-Status "Setup complete! Start the dev server when ready with: npm run dev" "success"
}
