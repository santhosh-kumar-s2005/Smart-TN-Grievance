# QUICK COMMAND COPY-PASTE REFERENCE

## DO NOT SKIP THIS STEP: READ FIRST

Make sure:
1. You have PowerShell open (NOT Command Prompt)
2. VS Code is closed
3. No `npm run dev` is running (stop it with Ctrl+C)
4. Right-click PowerShell and choose "Run as Administrator"

---

## ⏱️ FASTEST FIX (10 MINUTES)

Copy and paste each block **one at a time**. Wait for each to complete before moving to next.

### BLOCK 1: Create new folder outside OneDrive
```powershell
New-Item -ItemType Directory -Path "C:\Projects\smart-tn-grievance" -Force | Out-Null
Test-Path "C:\Projects\smart-tn-grievance"
```
**Expected**: `True`

---

### BLOCK 2: Copy files from OneDrive to new location
```powershell
$source = "C:\Users\$env:USERNAME\OneDrive\Desktop\smart-tn-grievance"
$destination = "C:\Projects\smart-tn-grievance"
Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem $destination | Select-Object Name | Head -10
```
**Expected**: Shows app, components, lib, node_modules, package.json, etc.

---

### BLOCK 3: Navigate to new project location
```powershell
cd C:\Projects\smart-tn-grievance
Get-Location
```
**Expected**: `C:\Projects\smart-tn-grievance`

---

### BLOCK 4: Delete all build artifacts
```powershell
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
Write-Host "Deletions complete. Verifying..."
Write-Host "node_modules: $(Test-Path 'node_modules')" # Should be False
Write-Host ".next: $(Test-Path '.next')"               # Should be False
Write-Host "package-lock.json: $(Test-Path 'package-lock.json')"  # Should be False
```
**Expected**: All should show `False`

---

### BLOCK 5: Disable Turbopack in package.json
```powershell
$packageJsonPath = "package.json"
$content = Get-Content $packageJsonPath -Raw
$json = $content | ConvertFrom-Json
$json.scripts.dev = "next dev --no-turbopack"
$json | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
Write-Host "✓ Turbopack disabled"
Get-Content $packageJsonPath | Select-String '"dev"'
```
**Expected**: `"dev": "next dev --no-turbopack",`

---

### BLOCK 6: Clear npm cache
```powershell
npm cache clean --force
Write-Host "✓ Cache cleaned"
```
**Expected**: Clean cache message

---

### BLOCK 7: Fresh npm install (WAIT 3-5 MINUTES)
```powershell
npm install
```
**Expected**: `added XXX packages`

---

### BLOCK 8: Verify installation
```powershell
Write-Host "=== VERIFICATION ==="
Write-Host "Node: $(node --version)"
Write-Host "npm: $(npm --version)"
Write-Host "Next.js: $(npm list next | Select-String 'next@')"
Write-Host ""
Write-Host "Files exist:"
Write-Host "  node_modules: $(Test-Path 'node_modules')"
Write-Host "  .next: $(Test-Path '.next')"
Write-Host ""
Write-Host "Dev script:"
Get-Content package.json | Select-String '"dev"'
```
**Expected**: node_modules = True, .next = False, dev script has --no-turbopack

---

### BLOCK 9: START DEVELOPMENT SERVER
```powershell
npm run dev
```

**Wait 10-15 seconds for build to complete.**

**Expected output:**
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000

  ✓ Ready in X.Xs
```

---

### BLOCK 10: Verify in browser
1. Open: http://localhost:3000
2. Should see login page
3. Press F12 to check console (should be clean)
4. Dev server running without crashes = **SUCCESS** ✅

---

## 🔍 IF IT FAILS AT ANY STEP

### If Block fails - Copy/paste for diagnosis:

**To see detailed errors:**
```powershell
npm install --verbose
```

**To see what dev script is running:**
```powershell
Get-Content package.json | ConvertFrom-Json | Select-Object -ExpandProperty scripts
```

**To verify you're NOT in OneDrive:**
```powershell
$cwd = Get-Location
Write-Host "Current: $cwd"
Write-Host "In OneDrive: $($cwd -like '*OneDrive*')"  # Should be False
```

**To verify Turbopack is NOT running:**
```powershell
Get-Process node | Select-Object CommandLine
```
Should NOT show "turbopack" in the output.

---

## 📋 BEFORE/AFTER CHECKLIST

### BEFORE (Current - Broken):
- ✗ Project in: C:\Users\santy\OneDrive\Desktop\smart-tn-grievance
- ✗ package.json dev: "next dev"
- ✗ Using Turbopack
- ✗ Error 362 occurs
- ✗ Crashes on startup

### AFTER (Target - Fixed):
- ✓ Project in: C:\Projects\smart-tn-grievance
- ✓ package.json dev: "next dev --no-turbopack"
- ✓ Using Webpack
- ✓ No Error 362
- ✓ Starts successfully

---

## ⚡ TLDR

1. **Open PowerShell as Admin**
2. **Copy Block 1-8 one by one** (takes ~5 minutes)
3. **Copy Block 9**: `npm run dev`
4. **Open browser**: http://localhost:3000
5. **Done!** ✅

---

## IMPORTANT NOTES

- **MUST** use PowerShell (not Command Prompt)
- **MUST** run as Administrator
- **MUST** wait for `npm install` to complete (3-5 min)
- **MUST** verify each block before moving to next
- **DO NOT** skip any steps
- **DO NOT** go back to OneDrive for this project

---

If any block fails, copy its output and refer to **EXACT_STEP_BY_STEP_FIX.md** for detailed troubleshooting.
