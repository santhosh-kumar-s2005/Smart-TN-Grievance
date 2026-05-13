# Quick Command Reference - Manual Steps

## ⚡ FASTEST FIX (Copy & Paste These Commands)

Open **PowerShell** and run these commands one by one:

### Step 1: Create and navigate to new folder
```powershell
New-Item -ItemType Directory -Path "C:\Projects\smart-tn-grievance" -Force
cd C:\Projects\smart-tn-grievance
```

### Step 2: Copy files from OneDrive
```powershell
Copy-Item -Path "C:\Users\$env:USERNAME\OneDrive\Desktop\smart-tn-grievance\*" `
          -Destination "C:\Projects\smart-tn-grievance" `
          -Recurse -Force
```

### Step 3: Verify copy worked
```powershell
Get-ChildItem | Select-Object Name
# Should show: app, components, lib, node_modules, package.json, etc.
```

### Step 4: Clean old build files
```powershell
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path ".next" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force
```

### Step 5: Clear npm cache
```powershell
npm cache clean --force
```

### Step 6: Fresh install
```powershell
npm install
# Wait 3-5 minutes for completion
```

### Step 7: Start development
```powershell
npm run dev
# Open http://localhost:3000 in browser
```

---

## ✅ VERIFICATION CHECKLIST

After running commands above, verify:

```powershell
# Check current location
Get-Location  # Should show: C:\Projects\smart-tn-grievance

# Check node_modules exists
Test-Path "node_modules"  # Should return: True

# Check .next doesn't exist
Test-Path ".next"  # Should return: False

# Check node version
node --version  # Should show: v18.x.x or higher

# Check npm version
npm --version  # Should show: v9.x.x or higher

# Check Next.js is installed
npm list next  # Should show: next@16.1.6
```

---

## 🎯 IF ERROR OCCURS AT ANY STEP

### Error: "The cloud file provider is not running"
→ You're still in the OneDrive folder. Run Step 1-2 again and make sure you're in `C:\Projects`

### Error: "Cannot find module"
→ Run Step 4-5-6 again (clean and reinstall)

### Error: "Permission denied"
→ Right-click PowerShell → "Run as Administrator" → retry

### Error: "Node not found"
→ Install Node.js from https://nodejs.org (download LTS version)

---

## 🔧 IF PROBLEM PERSISTS - NUCLEAR RESET

```powershell
# Go to project folder
cd C:\Projects\smart-tn-grievance

# Delete EVERYTHING build-related
Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item ".turbo" -Recurse -Force -ErrorAction SilentlyContinue

# Clean cache
npm cache clean --force

# Reinstall
npm install

# Run with Turbopack disabled (if still having issues)
npm run dev -- --no-turbopack
```

---

## 🚀 ALTERNATIVE: Use Automated Script

If copying commands is tedious, run the automated script instead:

### Option A: PowerShell Script (Recommended)
```powershell
# Right-click PowerShell → Run as Administrator
# Then run:
C:\Users\{YourUsername}\OneDrive\Desktop\smart-tn-grievance\setup-windows.ps1

# If script won't run, first allow it:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Then run the script again
```

### Option B: Batch Script
```batch
# Right-click Command Prompt → Run as Administrator
# Then run:
C:\Users\{YourUsername}\OneDrive\Desktop\smart-tn-grievance\SETUP_WINDOWS.bat
```

---

## 📌 KEEP IN MIND

- **First time fix**: 15-20 minutes (install large)
- **Subsequent npm installs**: 2-3 minutes (cache hit)
- **dev server startup**: 2-5 seconds (Turbopack)
- **Don't**: Use OneDrive for node_modules (causes this issue)
- **Do**: Keep project in `C:\Projects` (stable location)

---

## 📞 IF ALL ELSE FAILS

1. **Completely uninstall Node.js**:
   - Control Panel → Add/Remove Programs → Find "Node.js" → Uninstall

2. **Delete node_modules manually**:
   - Press Windows + R
   - Type: `%appdata%\npm-cache`
   - Delete entire folder

3. **Reinstall Node.js**:
   - Download from https://nodejs.org (LTS)
   - Install fresh

4. **Start over**:
   - Delete `C:\Projects\smart-tn-grievance` entirely
   - Follow "Step 1: Create and navigate" above

---

## 💡 TIPS FOR SMOOTH DEVELOPMENT

### Disable Turbopack (if you still get errors)
Edit `package.json`:
```json
{
  "scripts": {
    "dev": "next dev --no-turbopack"
  }
}
```

Then restart dev server.

### Keep Project Outside OneDrive Forever
Once working, keep project at: `C:\Projects\smart-tn-grievance`

Never save back to OneDrive for development.

### Use Git for Backup
```powershell
cd C:\Projects\smart-tn-grievance
git init
git add .
git commit -m "Initial commit"
```

Then push to GitHub for true backup (not OneDrive).

### Environment Variables
Keep `.env.local` in your project:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
```

Never push to Git!

---

## 🎓 UNDERSTANDING THE PROBLEM

**Simple Explanation**:
- OneDrive stores files in cloud (lazy download)
- Turbopack reads files very quickly (Rust-based)
- OneDrive can't keep up with file access speed
- Files appear "unavailable" to Turbopack
- Error 362 = "File not ready yet"
- **Solution**: Keep project on regular disk (not cloud)

**Technical Explanation**:
- OneDrive uses "reparse points" (Windows feature)
- When Turbopack tries to access node_modules (10,000+ files)
- OneDrive's Cloud File Provider hasn't hydrated them all yet
- Rust file system calls don't handle delays well
- Node.js (Webpack) has built-in retry logic
- **Fix**: Move to regular folder with faster file access

---

## ✨ YOU'RE SET!

After running these steps, your project should:
- ✅ Run without TurbopackInternalError
- ✅ Have fast development server (2-5s startup)
- ✅ Reload quickly when you save files
- ✅ No OneDrive interference
- ✅ Production-ready setup

Questions? Refer to:
- TURBOPACK_ERROR_FIX.md (full diagnosis)
- SYSTEM_DOCUMENTATION.md (project overview)
- VIVA_GUIDE.md (if for presentation)
