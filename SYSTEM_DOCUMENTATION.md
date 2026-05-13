# Smart TN Grievance Management System - Refactored Edition

## 📋 Project Overview

The **Smart TN Grievance Management System** is a text-only, cloud-based platform for citizens to submit civic complaints and concerns to the Tamil Nadu government. The system implements automatic priority detection using NLP keyword analysis to categorize complaints and route them efficiently to appropriate departments.

### Key Features

- ✅ **Text-Only Submission**: Simple, lightweight complaint filing (title + description)
- ✅ **Auto Priority Detection**: AI-based keyword analysis for priority assignment
- ✅ **Real-time Tracking**: Live complaint status updates
- ✅ **Admin Dashboard**: Complete control panel for managing complaints
- ✅ **Multi-District Support**: 10+ Tamil Nadu districts covered
- ✅ **Smart Filtering**: Filter & sort by priority, status, category, district
- ✅ **Responsive Design**: Works on all devices (mobile, tablet, desktop)

---

## 🏗️ System Architecture

### Tech Stack

```
Frontend:
  - React 19.2.3
  - Next.js 16.1.6 (App Router)
  - TypeScript 5
  - Tailwind CSS 4
  - Lucide Icons

Backend:
  - Firebase Firestore (Real-time database)
  - Firebase Authentication
  - Next.js API Routes (Serverless functions)

Deployment:
  - Vercel (recommended for Next.js)
  - Firebase (backend)
```

### Project Structure

```
smart-tn-grievance/
├── app/
│   ├── api/
│   │   └── check-role/                    # Role verification API
│   ├── admin/
│   │   └── page.tsx                       # Admin dashboard
│   ├── dashboard/
│   │   └── page.tsx                       # Role-based routing
│   ├── login/
│   │   └── page.tsx                       # Authentication
│   ├── register/
│   │   └── page.tsx                       # User registration
│   ├── user/
│   │   └── page.tsx                       # User dashboard
│   ├── layout.tsx                         # Root layout
│   ├── globals.css                        # Global styles
│   └── page.tsx                           # Home page
├── components/
│   ├── AuthLayout.tsx                     # Auth page template
│   ├── Button.tsx                         # Reusable button
│   ├── Card.tsx                           # Card component
│   ├── ComplaintCard.tsx                  # Complaint display
│   ├── ComplaintForm.tsx                  # Complaint submission
│   ├── Dashboard.tsx                      # Display complaints
│   ├── Input.tsx                          # Input field
│   ├── Loader.tsx                         # Loading spinner
│   ├── Navbar.tsx                         # Navigation
│   └── StatCard.tsx                       # Statistics card
├── lib/
│   ├── firebase.ts                        # Firebase config
│   └── priority.ts                        # Priority detection logic
├── public/                                # Static assets
├── package.json                           # Dependencies
├── tsconfig.json                          # TypeScript config
├── tailwind.config.ts                     # Tailwind config
├── next.config.ts                         # Next.js config
└── eslint.config.mjs                      # ESLint config
```

---

## 🔍 Priority Detection System

### How It Works

The system analyzes complaint descriptions using **keyword-based NLP** to automatically assign priority levels without requiring ML models or external APIs.

### Priority Levels

#### 🔴 **HIGH PRIORITY**
**When to Assign**: Immediate danger, life safety concerns, emergency situations

**Keywords Detected**:
```
- accident
- fire
- violence
- hospital (medical emergencies)
- emergency
- danger
- death
- electrocution
- live wire
- explosion
- injured
- injured person
- unconscious
```

**Examples**:
- "Fire in residential building at ABC Street"
- "Serious accident near market area"
- "Live electric wire hanging dangerously"
- "Person injured after pothole fall"

#### 🟡 **MEDIUM PRIORITY**
**When to Assign**: Service disruption, infrastructure damage affecting public

**Keywords Detected**:
```
- water leakage
- water leak
- electricity (power issues)
- power cut
- no power
- garbage (waste accumulation)
- drainage (clogged drains)
- traffic (congestion issues)
- street light (broken)
- broken (general infrastructure)
- not working
- pothole
- hole in road
- road damage
- water supply (interruption)
- sewage (overflow/backup)
- overflow
```

**Examples**:
- "Water leaking from main pipeline for 3 days"
- "Street light not working at night"
- "Deep pothole creating traffic hazard"
- "Garbage not collected for a week"

#### 🟢 **LOW PRIORITY**
**When to Assign**: Minor issues, general complaints not matching above categories

**Examples**:
- "Footpath needs better drainage"
- "Bus stop needs cleaning"
- "Signage could be improved"
- "Suggestion for better parking"

### Priority Detection Algorithm

```typescript
function calculatePriority(text: string): "HIGH" | "MEDIUM" | "LOW" {
  const lowerText = text.toLowerCase();
  
  // Check HIGH priority keywords first
  if (highKeywords.some(kw => lowerText.includes(kw))) {
    return "HIGH";
  }
  
  // Check MEDIUM priority keywords
  if (mediumKeywords.some(kw => lowerText.includes(kw))) {
    return "MEDIUM";
  }
  
  // Default to LOW
  return "LOW";
}
```

### Complaint Categories

The system supports 8 complaint categories:

| Category | Icon | Purpose |
|----------|------|---------|
| Water Supply | 💧 | Water leaks, supply issues |
| Electricity | ⚡ | Power cuts, electric hazards |
| Roads & Drainage | 🛣️ | Potholes, drainage issues |
| Sanitation | 🧹 | Garbage, cleanliness |
| Traffic | 🚗 | Traffic, parking issues |
| Street Lights | 💡 | Non-working lights |
| Public Health | 🏥 | Health, hygiene issues |
| Others | 📋 | General complaints |

### Supported Districts

- Chennai
- Coimbatore
- Madurai
- Trichy (Tiruchirappalli)
- Salem
- Erode
- Tirunelveli
- Kanyakumari
- Chengalpattu
- Ranipet

---

## 👥 User Roles & Workflows

### 1. **CITIZEN** (Regular User)

**Capabilities**:
- ✅ Register/Login
- ✅ Submit text-only complaints
- ✅ Track complaint status in real-time
- ✅ View priority assignment
- ✅ Delete own complaints
- ✅ View complaint statistics

**Workflow**:
1. Register with email & password
2. Login to dashboard
3. Click "File New Complaint"
4. Enter: Title, Category, District, Description
5. System auto-detects priority
6. Submit complaint
7. Get ticket ID for tracking
8. Monitor progress on dashboard

**Complaint Form Fields**:
```
Title: "Brief complaint title" (5-100 chars)
Category: Select from 8 options
District: Select from 10 districts
Description: "Detailed description" (20-2000 chars)
```

### 2. **ADMIN** (System Administrator)

**Capabilities**:
- ✅ View all complaints system-wide
- ✅ Filter by priority (HIGH, MEDIUM, LOW)
- ✅ Filter by status (PENDING, IN_PROGRESS, RESOLVED)
- ✅ Sort by priority, date, or status
- ✅ Update complaint status
- ✅ View analytics & statistics
- ✅ See category and district breakdowns

**Dashboard Features**:

**Stats Panel**:
- Total complaints
- Pending count
- In-progress count
- Resolved count
- Priority distribution (High/Medium/Low)

**Filtering & Sorting**:
```
Priority Filter: All | High | Medium | Low
Status Filter: All | Pending | In Progress | Resolved
Sort By: Priority | Date | Status
```

**Breakdown Analytics**:
- Complaints by category
- Complaints by district

**Workflow**:
1. Login as admin
2. View dashboard with all metrics
3. Use filters to find specific complaints
4. Sort by priority to handle urgent cases first
5. Click on complaint to view details
6. Update status in real-time
7. Status automatically reflects to citizen

### 3. **DEPARTMENT** (Coming Soon)

Future implementation for department-specific views and actions.

---

## 📊 Database Schema (Firestore)

### **Complaints Collection**

```javascript
{
  id: "doc-id",                    // Firebase doc ID
  ticketId: "TN1698765432",        // User-facing ticket
  userId: "firebase-uid",          // User who submitted
  
  // Complaint Content
  title: "Issue title",            // 5-100 chars
  description: "Full description", // 20-2000 chars
  category: "Water Supply",        // One of 8 categories
  district: "Chennai",             // One of 10 districts
  
  // System Fields
  priority: "HIGH",                // HIGH | MEDIUM | LOW
  status: "PENDING",               // PENDING | IN_PROGRESS | RESOLVED
  
  // Timestamps
  createdAt: Timestamp,            // Firestore server timestamp
  updatedAt: Timestamp             // Last update
}
```

### **Users Collection**

```javascript
{
  id: "firebase-uid",
  email: "user@example.com",
  role: "USER",                    // USER | ADMIN | DEPARTMENT
  displayName: "User Name",
  createdAt: Timestamp
}
```

---

## 🔐 Authentication & Security

### Firebase Authentication
- Email/Password authentication
- Secure token management
- Role-based access control via Firestore

### Firestore Rules (Recommended)

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Complaints - Users see their own, admins see all
    match /complaints/{complaintId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow read: if checkAdmin(request.auth.uid);
      allow write: if request.auth.uid == resource.data.userId;
      allow update: if checkAdmin(request.auth.uid);
      allow create: if request.auth != null;
    }
    
    // Helper function for admin check
    function checkAdmin(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role == 'ADMIN';
    }
  }
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project account
- Environment variables configured

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/smart-tn-grievance.git
cd smart-tn-grievance

# Install dependencies
npm install

# Create .env.local file with Firebase config
cat > .env.local << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
EOF

# Start development server
npm run dev
```

### Deployment

**Deploy to Vercel** (Recommended):

```bash
npm install -g vercel
vercel login
vercel deploy
```

**Or use Vercel GitHub integration**:
1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Auto-deploy on push

---

## 📱 User Interface Walkthrough

### Citizen Dashboard

**Main Screen**:
- Welcome message
- Statistics cards (total, pending, in-progress, resolved)
- Priority distribution sidebar
- "File New Complaint" button
- List of user's complaints with status

**Complaint Submission**:
1. Click "File New Complaint"
2. Fill form with:
   - Title (5-100 chars)
   - Category dropdown
   - District dropdown
   - Description (20-2000 chars)
3. Auto-display: "Detected Priority: HIGH/MEDIUM/LOW"
4. Click "Submit Complaint"
5. See success message with ticket ID
6. Complaint appears in list

**Complaint Card Display**:
- Ticket ID
- Title
- Description (truncated)
- Category icon
- District
- Priority badge (🔴🟡🟢 with color)
- Status badge
- Delete button

### Admin Dashboard

**Main Screen**:
- Welcome message
- Statistics: Total, Pending, In Progress, Resolved
- Priority breakdown: High, Medium, Low counts
- Category breakdown with counts
- District breakdown with counts

**Complaints Table**:
- Filter by priority
- Filter by status
- Sort by priority/date/status
- View complaint details
- Inline status update dropdown
- Shows matched results count

---

## 🧪 Testing the System

### Test Accounts

**Admin Account**:
```
Email: admin@test.com
Password: TestAdmin123@
Role: ADMIN
```

**Citizen Account**:
```
Email: citizen@test.com
Password: TestCitizen123@
Role: USER
```

### Test Complaints (for priority detection)

**HIGH Priority**:
- "There is a fire in the residential area near Market Road"
- "Live wire causing danger at the intersection"
- "Person injured after motorcycle accident"

**MEDIUM Priority**:
- "Water leakage from pipeline for 3 days"
- "Street light not working at night"
- "Deep pothole at main road causing traffic"

**LOW Priority**:
- "Suggestion for better landscaping"
- "Paint peeling at bus stand"

---

## 🔄 API Endpoints

### POST /api/check-role

**Purpose**: Verify user role for access control

**Request**:
```
GET /api/check-role?uid=firebase-uid
```

**Response**:
```json
{
  "role": "ADMIN|USER|DEPARTMENT",
  "default": false,
  "found": true
}
```

---

## 🎨 Design System

### Color Palette

```css
Blue: #3B82F6, #1D4ED8
Indigo: #6366F1, #4F46E5
Red: #EF4444, #DC2626
Yellow: #EAB308, #CA8A04
Green: #22C55E, #16A34A
```

### Typography

```css
Headings: Inter/System font, Bold
Body: Inter/System font, Regular
Code: Monospace, Courier
```

### Components

- **Button**: Blue primary, gray secondary
- **Card**: White with border, shadow on hover
- **Badge**: Colored by priority/status
- **Input**: Bordered, focus ring on input
- **Select**: Styled dropdown with focus state

---

## 📝 Complaint Lifecycle

```
1. CREATION
   └─ Citizen submits complaint
   └─ Priority auto-detected
   └─ Status: PENDING
   └─ Ticket ID generated

2. REVIEW
   └─ Admin views complaint
   └─ Assesses priority accuracy
   └─ Updates status: IN_PROGRESS

3. RESOLUTION
   └─ Department works on issue
   └─ Admin tracks progress
   └─ Status updated to RESOLVED

4. CLOSURE
   └─ Citizen receives notification
   └─ Can view resolution details
   └─ Can file new complaint if needed
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Access Denied - Admin only"
- **Solution**: Verify user role in Firestore users collection

**Issue**: Complaints not loading
- **Solution**: Check Firestore rules and network connectivity

**Issue**: Priority always "MEDIUM"
- **Solution**: Ensure keyword matching is case-insensitive

**Issue**: Auto-detection not working
- **Solution**: Check if `calculatePriority()` function is imported correctly

---

## 🚀 Future Enhancements

- [ ] SMS/Email notifications
- [ ] Complaint attachments (documents only, no images)
- [ ] Department dashboard
- [ ] Advanced analytics & reports
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Complaint templates
- [ ] Integration with local administration
- [ ] Public complaint tracking map
- [ ] Citizen feedback/satisfaction rating

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💼 Project Information

**Version**: 2.0 (Text-Only Edition)
**Last Updated**: 2026
**Status**: Production Ready
**Complexity Level**: Mini Project (Suitable for Viva/Presentation)

---

## 📞 Support & Contact

For issues, suggestions, or questions:
1. Check this documentation
2. Review troubleshooting section
3. Check Firebase console for errors
4. Review browser console for client errors

---

## ✨ Key Improvements from Previous Version

✅ **Removed**:
- Image upload functionality
- Audio recording & transcription
- AWS Rekognition (image analysis)
- OpenAI integration
- Tesseract.js (OCR)

✅ **Added**:
- Simple text-only workflow
- Keyword-based priority detection
- Enhanced filtering & sorting
- Better admin controls
- Cleaner, lighter codebase
- Improved performance
- Reduced dependencies

✅ **Benefits**:
- Faster load times
- Lower infrastructure costs
- Easier maintenance
- More user-friendly
- Better for presentations
- Perfect for mini project
- Production-ready structure

---

**Ready to launch! This system is fully functional, lightweight, and perfect for explaining in a technical presentation or viva.**
