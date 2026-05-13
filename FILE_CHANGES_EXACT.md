# EXACT FILE CHANGES REQUIRED

## FILE 1: package.json

### CURRENT (BROKEN):
```json
{
  "name": "smart-tn-grievance",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "firebase": "^12.9.0",
    "lucide-react": "^0.574.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  ...
}
```

### WHAT TO CHANGE:

Line 5, change from:
```json
    "dev": "next dev",
```

To:
```json
    "dev": "next dev --no-turbopack",
```

### UPDATED (FIXED):
```json
{
  "name": "smart-tn-grievance",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --no-turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "firebase": "^12.9.0",
    "lucide-react": "^0.574.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  ...
}
```

### VERIFY CHANGE:
After making change, run:
```powershell
Get-Content package.json | Select-String '"dev"'
```

Should output:
```
    "dev": "next dev --no-turbopack",
```

---

## NO OTHER FILES NEED CHANGING

- app/layout.tsx - NO CHANGE NEEDED
- app/page.tsx - NO CHANGE NEEDED
- components/* - NO CHANGE NEEDED
- lib/firebase.ts - NO CHANGE NEEDED
- next.config.ts - NO CHANGE NEEDED
- tsconfig.json - NO CHANGE NEEDED
- .env.local - NO CHANGE NEEDED

**ONLY package.json needs changing.**

---

## EXACT COMMAND TO MODIFY package.json

**One-line command to make the change:**

```powershell
$json = Get-Content package.json | ConvertFrom-Json; $json.scripts.dev = "next dev --no-turbopack"; $json | ConvertTo-Json -Depth 10 | Set-Content package.json
```

**Then verify:**

```powershell
Get-Content package.json | Select-String '"dev"'
```

---

## IF YOU WANT TO MODIFY MANUALLY

1. Open package.json in VS Code
2. Go to line 5
3. Find: `"dev": "next dev",`
4. Replace with: `"dev": "next dev --no-turbopack",`
5. Save file (Ctrl+S)
6. Close file

That's it. Only this one line changes.

---

## VERIFY NO ACCIDENTAL CHANGES

After modification, run:
```powershell
$json = Get-Content package.json | ConvertFrom-Json
Write-Host "scripts.dev = $($json.scripts.dev)"
Write-Host "scripts.build = $($json.scripts.build)"
Write-Host "scripts.start = $($json.scripts.start)"
Write-Host "scripts.lint = $($json.scripts.lint)"
```

Should output:
```
scripts.dev = next dev --no-turbopack
scripts.build = next build
scripts.start = next start
scripts.lint = eslint
```

---

## EVERYTHING ELSE STAYS THE SAME

- Dependencies: ✓ No change
- DevDependencies: ✓ No change
- Build script: ✓ No change
- Start script: ✓ No change
- Lint script: ✓ No change
- Version: ✓ No change

Only the "dev" script line changes.

---

## SUMMARY

| What | Before | After |
|------|--------|-------|
| Dev script | `next dev` | `next dev --no-turbopack` |
| All others | Unchanged | Unchanged |
| Number of lines changed | 1 | 1 |

**That's the ONLY file change needed.**
