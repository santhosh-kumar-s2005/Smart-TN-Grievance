# TurbopackInternalError - Exact Fix (Step-by-Step)

## WHY ONEDRIVE CAUSES THIS

**Error 362 = ERROR_FILE_INVALID_FOR_REPARSE_POINT**

OneDrive uses a "cloud file provider" that creates reparse points (Windows system feature). When Turbopack tries to read files:

```
Turbopack reads file → OneDrive intercepts → File not yet hydrated → Error 362
```

**Why Turbopack is affected but Webpack isn't:**
- Turbopack = Rust-based, direct OS file calls, NO error recovery
- Webpack = JavaScript-based, uses Node.js APIs, HAS retry logic for cloud files

**Why node_modules specifically:**
- Turbopack tries to read ~10,000 files at startup
- OneDrive hasn't downloaded them all yet
- Each missing file = one crash

---

## EXACT STEPS TO FIX

### STEP 1: Stop Everything
```powershell
# Press Ctrl+C in any terminal running npm or dev server
# Close VS Code if it has the project open

# Verify nothing is running (all should return nothing)
Get-Process node -ErrorAction SilentlyContinue
Get-Process npm -ErrorAction SilentlyContinue
```

**Expected output**: Empty (nothing should be running)

---

### STEP 2: Create New Project Folder Outside ONEDRIVE

**Run this EXACT command:**

```powershell
# Open PowerShell (NOT Command Prompt)

# Create the directory
New-Item -ItemType Directory -Path "C:\Projects" -Force | Out-Null
New-Item -ItemType Directory -Path "C:\Projects\smart-tn-grievance" -Force | Out-Null

# Verify it was created
Test-Path "C:\Projects\smart-tn-grievance"
```

**Expected output**: `True`

---

### STEP 3: COPY FILES FROM ONEDRIVE TO NEW LOCATION

**Run this EXACT command:**

```powershell
# Define paths
$source = "C:\Users\$env:USERNAME\OneDrive\Desktop\smart-tn-grievance"
$destination = "C:\Projects\smart-tn-grievance"

# Copy all files
Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force -ErrorAction SilentlyContinue

# Verify copy worked (should show many items)
Get-ChildItem $destination -Force | Select-Object Name | Head -20
```

**Expected output**: Should show app, components, lib, node_modules, package.json, etc.

---

### STEP 4: NAVIGATE TO NEW LOCATION

**Run this EXACT command:**

```powershell
# Change to new project folder
cd C:\Projects\smart-tn-grievance

# Verify you're in the right place
Get-Location
```

**Expected output**: `C:\Projects\smart-tn-grievance`

---

### STEP 5: DELETE BUILD CACHE AND NODE_MODULES

**Run these EXACT commands in sequence:**

```powershell
# Delete node_modules (takes 30-60 seconds)
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ node_modules deleted"

# Delete .next folder
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ .next deleted"

# Delete .turbo folder (Turbopack cache)
Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ .turbo deleted"

# Delete package-lock.json
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
Write-Host "✓ package-lock.json deleted"

# Verify deletions
Write-Host ""
Write-Host "Verification:"
Write-Host "node_modules exists: $(Test-Path 'node_modules')"  # Should be False
Write-Host ".next exists: $(Test-Path '.next')"                # Should be False
Write-Host "package-lock.json exists: $(Test-Path 'package-lock.json')"  # Should be False
```

**Expected output**:
```
✓ node_modules deleted
✓ .next deleted
✓ .turbo deleted
✓ package-lock.json deleted

Verification:
node_modules exists: False
.next exists: False
package-lock.json exists: False
```

---

### STEP 6: VERIFY YOU'RE NOT IN ONEDRIVE FOLDER

**Run this EXACT command:**

```powershell
# Check current path
$currentPath = Get-Location
$onedrivePath = "OneDrive"

if ($currentPath -like "*$onedrivePath*") {
    Write-Host "❌ ERROR: You're still in OneDrive!" -ForegroundColor Red
    Write-Host "Current path: $currentPath" -ForegroundColor Red
    Write-Host "Expected: C:\Projects\smart-tn-grievance" -ForegroundColor Red
} else {
    Write-Host "✓ Confirmed: You're NOT in OneDrive" -ForegroundColor Green
    Write-Host "Current path: $currentPath" -ForegroundColor Green
}
```

**Expected output**:
```
✓ Confirmed: You're NOT in OneDrive
Current path: C:\Projects\smart-tn-grievance
```

---

### STEP 7: UPDATE package.json TO DISABLE TURBOPACK

**Read the current package.json:**

```powershell
Get-Content package.json
```

**You should see this:**

```json
{
  "name": "smart-tn-grievance",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "firebase": "^12.9.0",
    "lucide-react": "^0.574.0",
    "next": "16.1.6",
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  ...
}
```

**CHANGE THIS LINE:**

```json
"dev": "next dev",
```

**TO THIS LINE:**

```json
"dev": "next dev --no-turbopack",
```

**Use this exact command to modify:**

```powershell
# Read file
$packageJsonPath = "package.json"
$content = Get-Content $packageJsonPath -Raw
$json = $content | ConvertFrom-Json

# Modify the dev script
$json.scripts.dev = "next dev --no-turbopack"

# Write back
$json | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath

# Verify change
Get-Content $packageJsonPath | Select-String '"dev"'
```

**Expected output:**
```
"dev": "next dev --no-turbopack",
```

**Verify the entire file is valid JSON:**

```powershell
# Test if JSON is valid
$json = Get-Content package.json | ConvertFrom-Json
Write-Host "✓ package.json is valid JSON"
Write-Host "Dev script: $($json.scripts.dev)"
```

**Expected output**:
```
✓ package.json is valid JSON
Dev script: next dev --no-turbopack
```

---

### STEP 8: CLEAR NPM CACHE

**Run this EXACT command:**

```powershell
npm cache clean --force

# Verify cache is clean
npm cache verify
```

**Expected output**: Cache verification success message

---

### STEP 9: FRESH NPM INSTALL

**Run this EXACT command:**

```powershell
npm install

# This will take 3-5 minutes
# You should see: "added XXX packages, and audited YYY packages"
```

**Wait for completion. Expected final output:**
```
added 262 packages, and audited 263 packages
```

---

### STEP 10: VERIFY INSTALLATION

**Run these EXACT verification commands:**

```powershell
# Check Node version (should be 18+)
Write-Host "Node version:"
node --version

# Check npm version (should be 9+)
Write-Host ""
Write-Host "npm version:"
npm --version

# Check Next.js is installed
Write-Host ""
Write-Host "Next.js version:"
npm list next

# Check Turbopack is NOT being used
Write-Host ""
Write-Host "Dev script (should have --no-turbopack):"
Get-Content package.json | Select-String '"dev"'

# Check node_modules exists
Write-Host ""
Write-Host "Verification:"
Write-Host "node_modules exists: $(Test-Path 'node_modules')"  # Should be True
Write-Host "next installed: $(Test-Path 'node_modules/next')"  # Should be True
Write-Host ".next exists: $(Test-Path '.next')"                # Should be False (not built yet)
```

**Expected output:**
```
Node version:
v18.20.0

npm version:
10.5.0

Next.js version:
smart-tn-grievance@1.0.0 /C/Projects/smart-tn-grievance
└── next@16.1.6

Dev script (should have --no-turbopack):
"dev": "next dev --no-turbopack",

Verification:
node_modules exists: True
next installed: True
.next exists: False
```

---

### STEP 11: START DEVELOPMENT SERVER

**Run this EXACT command:**

```powershell
npm run dev
```

**Expected output (wait 10-15 seconds for first build):**
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000

  ✓ Ready in 8.4s
```

**If you see this without errors, you're FIXED!** ✅

---

### STEP 12: VERIFY IN BROWSER

1. Open browser
2. Go to: `http://localhost:3000`
3. Should see your Smart TN Grievance login page
4. No errors in console (press F12)
5. Dev server should be running without crashes

---

## VERIFY YOU'RE NOT USING TURBOPACK

**Run this in a NEW PowerShell window (don't stop dev server):**

```powershell
# Check the actual dev process
Get-Process node | Select-Object Name, CommandLine

# Should NOT show turbopack in command line
```

**Also check the dev server output:**
- If you see "Turbopack", Turbopack is running ❌
- If you see NO mention of Turbopack, Webpack is running ✅

---

## VERIFY YOU'RE NOT IN ONEDRIVE

**Run this command:**

```powershell
# Get current working directory
$cwd = Get-Location
$env:USERPROFILE  # Your user home

Write-Host "Current project: $cwd"
Write-Host "Contains 'OneDrive': $($cwd -like '*OneDrive*')"  # Should be False

# Also check the path visually
# It should look like: C:\Projects\smart-tn-grievance
# NOT like: C:\Users\santy\OneDrive\...
```

**Expected output**:
```
Current project: C:\Projects\smart-tn-grievance
Contains 'OneDrive': False
```

---

## ABOUT VIEWPORT METADATA WARNINGS

**Answer: NOT CRITICAL ❌**

If you see:
```
Warning: viewport metadata mismatch
```

This is a development warning only:
- ✓ Won't affect production build
- ✓ Won't affect functionality
- ✓ Safe to ignore for now
- ✓ Optional to fix

**If you want to fix it, add to app/layout.tsx:**

```typescript
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

But this is OPTIONAL - focus on fixing the Turbopack error first.

---

## FINAL VERIFICATION CHECKLIST

Before considering this fixed, verify ALL of these:

- [ ] Project path is `C:\Projects\smart-tn-grievance` (NOT OneDrive)
- [ ] `package.json` has `"dev": "next dev --no-turbopack"`
- [ ] `npm run dev` works without TurbopackInternalError
- [ ] Dev server shows `✓ Ready` message
- [ ] Browser loads http://localhost:3000 successfully
- [ ] No errors in browser console (F12)
- [ ] Page source shows login form

✅ If ALL are checked, **YOU'RE COMPLETELY FIXED!**

---

## IF SOMETHING STILL FAILS

### If npm install fails:
```powershell
npm cache clean --force
npm install --verbose  # See detailed error messages
```

### If dev server won't start:
```powershell
# Delete everything and start over
Remove-Item "node_modules" -Recurse -Force
Remove-Item ".next" -Recurse -Force
Remove-Item "package-lock.json" -Force
npm cache clean --force
npm install
npm run dev -- --verbose  # See detailed startup info
```

### If you're somehow still in OneDrive:
```powershell
# Navigate correctly
cd C:\Projects\smart-tn-grievance
Get-Location  # Verify output
```

### If Turbopack is still being used:
```powershell
# Verify package.json change
Get-Content package.json | ConvertFrom-Json | Select-Object -ExpandProperty scripts

# Should show: @{dev=next dev --no-turbopack; ...}
```

---

## SUMMARY OF CHANGES

| Item | Before | After |
|------|--------|-------|
| Project Location | C:\Users\santy\OneDrive\Desktop\smart-tn-grievance | C:\Projects\smart-tn-grievance |
| Package.json dev script | `next dev` | `next dev --no-turbopack` |
| Bundler | Turbopack (Rust) | Webpack (JavaScript) |
| Error 362 | ✗ Occurs | ✓ Fixed |
| OneDrive interference | ✗ Yes | ✓ No |
| Startup time | 2-3s | 8-15s (acceptable) |
| Stability | ✗ Crashes | ✓ Stable |

---

**Everything is copy-paste ready. Execute step by step.**
