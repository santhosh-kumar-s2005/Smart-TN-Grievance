# ✅ TURBOPACK ERROR - YOUR COMPLETE ACTION PLAN

## STATUS: Your package.json has been updated ✓

Your `package.json` now has:
```json
"dev": "next dev --no-turbopack",
```

This change is ready. Now you just need to execute the steps below.

---

## 📋 YOUR COMPLETE CHECKLIST

### PHASE 1: PREPARATION (2 minutes)

- [ ] Close VS Code completely
- [ ] Open PowerShell and right-click → "Run as Administrator"
- [ ] Stop any running `npm run dev` (Ctrl+C)

**Command to verify nothing is running:**
```powershell
Get-Process node -ErrorAction SilentlyContinue
```
(Should return nothing)

---

### PHASE 2: MOVE PROJECT OUTSIDE ONEDRIVE (3 minutes)

**Copy and paste this block:**

```powershell
# Step 1: Create new folder
New-Item -ItemType Directory -Path "C:\Projects\smart-tn-grievance" -Force | Out-Null

# Step 2: Copy all files from OneDrive to new location
$source = "C:\Users\$env:USERNAME\OneDrive\Desktop\smart-tn-grievance"
$destination = "C:\Projects\smart-tn-grievance"
Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force -ErrorAction SilentlyContinue

# Step 3: Navigate to new location
cd C:\Projects\smart-tn-grievance

# Step 4: Verify you're in the right place
Get-Location
```

**Expected output from Step 4:**
```
C:\Projects\smart-tn-grievance
```

**Verify the path does NOT contain "OneDrive":**
```powershell
(Get-Location) -like "*OneDrive*"
```
(Should show: False)

---

### PHASE 3: DELETE BUILD ARTIFACTS (1 minute)

**Copy and paste this block:**

```powershell
# Delete all cached files
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".turbo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue

# Verify deletion
Write-Host "node_modules deleted: $(-not (Test-Path 'node_modules'))"
Write-Host ".next deleted: $(-not (Test-Path '.next'))"
Write-Host "package-lock.json deleted: $(-not (Test-Path 'package-lock.json'))"
```

**Expected output:**
```
node_modules deleted: True
.next deleted: True
package-lock.json deleted: True
```

---

### PHASE 4: VERIFY PACKAGE.JSON CHANGE (10 seconds)

**Copy and paste this:**

```powershell
# Check if dev script is updated
Get-Content package.json | Select-String '"dev"'
```

**Expected output:**
```
    "dev": "next dev --no-turbopack",
```

If you see `"dev": "next dev"` (without --no-turbopack), the change wasn't applied. Run this to fix it:

```powershell
$json = Get-Content package.json | ConvertFrom-Json
$json.scripts.dev = "next dev --no-turbopack"
$json | ConvertTo-Json -Depth 10 | Set-Content package.json
Write-Host "✓ Fixed. Current dev script:"
Get-Content package.json | Select-String '"dev"'
```

---

### PHASE 5: CLEAN NPM CACHE (1 minute)

**Copy and paste this:**

```powershell
npm cache clean --force
npm cache verify
```

**Expected output:**
```
Verified 1 package
```

---

### PHASE 6: FRESH NPM INSTALL (3-5 minutes)

**Copy and paste this and WAIT for it to complete:**

```powershell
npm install
```

**You'll see:**
```
npm notice
...
added 262 packages, and audited 263 packages in XXXs
```

**DO NOT INTERRUPT THIS PROCESS.** Let it complete fully.

---

### PHASE 7: VERIFY INSTALLATION (30 seconds)

**Copy and paste this:**

```powershell
Write-Host "=== FINAL VERIFICATION ==="
Write-Host ""
Write-Host "Node version: $(node --version)"
Write-Host "npm version: $(npm --version)"
Write-Host ""
Write-Host "Current location:"
Get-Location
Write-Host ""
Write-Host "Is in OneDrive: $((Get-Location) -like '*OneDrive*')"
Write-Host ""
Write-Host "Files exist:"
Write-Host "  node_modules: $(Test-Path 'node_modules')"
Write-Host "  next installed: $(Test-Path 'node_modules/next')"
Write-Host "  .next (build): $(Test-Path '.next')"
Write-Host ""
Write-Host "Dev script:"
Get-Content package.json | Select-String '"dev"'
```

**Expected output:**
```
=== FINAL VERIFICATION ===

Node version: v18.x.x (or higher)
npm version: 10.x.x (or higher)

Current location:
C:\Projects\smart-tn-grievance

Is in OneDrive: False

Files exist:
  node_modules: True
  next installed: True
  .next (build): False

Dev script:
    "dev": "next dev --no-turbopack",
```

---

### PHASE 8: START DEVELOPMENT SERVER (15 seconds)

**Copy and paste this:**

```powershell
npm run dev
```

**WAIT 10-15 SECONDS for the build to complete.**

**Expected output:**
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000

  ✓ Ready in X.Xs
```

**If you see this without any TurbopackInternalError, YOU'RE FIXED!** ✅

---

### PHASE 9: VERIFY IN BROWSER (30 seconds)

1. Open browser: `http://localhost:3000`
2. Should see your Smart TN Grievance login page
3. Press F12 to open developer console
4. Should be CLEAN (no red errors)
5. Dev server running smoothly

---

### PHASE 10: VERIFY NO TURBOPACK

**In a NEW PowerShell window (keep dev server running):**

```powershell
Get-Process node | Select-Object CommandLine
```

**Expected output:** Should show `next dev --no-turbopack` in the command line

Should NOT show `turbopack` as a separate process.

---

## ✅ FINAL CHECKLIST - IF ALL ARE TRUE, YOU'RE FIXED

- [ ] Project is at `C:\Projects\smart-tn-grievance` (NOT OneDrive)
- [ ] `package.json` has `"dev": "next dev --no-turbopack"`
- [ ] `npm install` completed without errors
- [ ] `npm run dev` shows "✓ Ready" message
- [ ] No TurbopackInternalError appears
- [ ] Browser loads http://localhost:3000
- [ ] Console is clean (no red errors in F12)
- [ ] Login page appears

**If ALL checked: YOU'RE COMPLETELY FIXED!** ✅

---

## ⚠️ IF SOMETHING GOES WRONG

### Problem: Still getting TurbopackInternalError

**Solution:**
```powershell
# Verify you're NOT in OneDrive
Get-Location  # Should show C:\Projects, NOT OneDrive

# Verify package.json change
Get-Content package.json | Select-String '"dev"'  # Should have --no-turbopack

# Check for stray turbopack processes
Get-Process turbopack -ErrorAction SilentlyContinue  # Should return nothing

# If above is wrong, you skipped steps. Go back and redo.
```

---

### Problem: npm install fails

**Solution:**
```powershell
# Full reset
Remove-Item "node_modules" -Recurse -Force
Remove-Item ".package-lock.json" -Force
npm cache clean --force
npm install --verbose  # See detailed errors
```

---

### Problem: Still in OneDrive path

**Solution:**
```powershell
# Check current location
Get-Location

# If it shows OneDrive, you didn't copy Phase 2 correctly
# Start over from Phase 1
```

---

### Problem: Command not found (node, npm)

**Solution:**
```powershell
# Node.js not installed
# Install from: https://nodejs.org (get LTS version)

# After installing, restart PowerShell and try again
node --version  # Should work now
```

---

## 🎯 QUICK REFERENCE: What Changes What Stays Same

| What | Before | After | Status |
|-----|--------|-------|--------|
| Project Path | OneDrive | C:\Projects | ✓ CHANGED |
| package.json dev | `next dev` | `next dev --no-turbopack` | ✓ CHANGED |
| Bundler | Turbopack | Webpack | ✓ CHANGED |
| Error 362 | Occurs | Fixed | ✓ FIXED |
| node_modules | Corrupted | Fresh | ✓ FIXED |
| All other files | Unchanged | Unchanged | ✓ SAME |
| All other scripts | Unchanged | Unchanged | ✓ SAME |
| Dependencies | Same | Same | ✓ SAME |

---

## 📞 TROUBLESHOOTING ORDER

If something fails, check in this order:

1. **Are you in PowerShell as Admin?** → Right-click PowerShell → Run as Administrator
2. **Are you NOT in OneDrive?** → `Get-Location` should show `C:\Projects`
3. **Did package.json change?** → `Get-Content package.json | Select-String '"dev"'` should show --no-turbopack
4. **Did npm install complete?** → `npm list next` should show next@16.1.6
5. **Did you wait for dev server?** → Wait 10-15 seconds, should see "✓ Ready"

If all above are TRUE and it still fails, something unexpected happened. Follow **EXACT_STEP_BY_STEP_FIX.md** for detailed troubleshooting.

---

## 🏆 YOU'RE NOW READY

**Next steps:**
1. Close this file
2. Open PowerShell as Administrator
3. Copy **Phase 1** and execute
4. Then copy **Phase 2**, then **Phase 3**, etc.
5. Each phase takes 1-5 minutes

**Total time: ~15 minutes** (mostly waiting for npm install)

**Then you'll have a stable Next.js development setup on Windows!** ✅

---

**Good luck! You've got this!** 🚀
