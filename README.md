# CivicAI — "Report. Resolve. Improve Your City."

An AI-powered civic issue reporting, automated area routing, SLA escalation monitoring, and resolution platform built exclusively on Google ecosystem technologies (**React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Firebase Auth**, **Cloud Firestore**, **Firebase Storage**, **Firebase Cloud Messaging**, **Google Maps Platform**, and **Google Gemini 2.0 Vision**).

---

## 🏛️ Core Workflow

$$\text{Citizen} \longrightarrow \text{Complaint} \longrightarrow \text{Google Gemini AI Triage} \longrightarrow \text{Area Detection} \longrightarrow \text{Responsible Officer} \longrightarrow \text{Binding SLA Timer} \longrightarrow \text{Hierarchical Auto-Escalation} \longrightarrow \text{Field Team} \longrightarrow \text{Resolution Proof} \longrightarrow \text{Citizen Notified}$$

---

## 🚀 Key Features

1. **Mobile-First Citizen Portal**
   - 6-step multi-step complaint submission with live camera/file upload.
   - GPS auto-geolocation with automatic Ward/Zone assignment & manual override fallback.
   - **Google Gemini 2.0 Visual Inspection**: Real-time visual analysis classifying issue type, severity level (Critical/High/Medium/Low), confidence %, suggested department, and estimated SLA.
   - Citizen confirmation & category correction.
   - Real-time complaint tracking with responsive SLA countdown progress bars.

2. **Automated 4-Tier Hierarchical Escalation UI**
   - **Level 1**: Area Officer (Ward queue, 24h default SLA).
   - **Level 2**: Department Officer (supervisory oversight if SLA breaches).
   - **Level 3**: Zonal Supervisor (emergency dispatch).
   - **Level 4**: District Manager (executive intervention).
   - Clear non-accusatory escalation tracking: *Why it escalated*, *When it escalated*, *Who currently owns it*, *Who previously owned it*, and *What action is pending*.

3. **Officer Operational Console & Priority Queue**
   - 6 Key operational cards: *Total Assigned*, *New*, *Pending Action*, *In Progress*, *Escalated*, *Resolved*.
   - Priority Queue table ranked by AI severity score and SLA urgency with filtering by area, category, priority, status, and escalation.
   - Action controls: Accept Complaint, Dispatch Field Crew, Escalate, and Mark Resolved with audit history.

4. **Field Team Mobile Operations**
   - Work Order dispatch queue with detailed engineer instructions.
   - Status progression: *Assigned* $\rightarrow$ *Accepted* $\rightarrow$ *In Progress* $\rightarrow$ *Completed*.
   - Photo proof upload (**Before Photo** vs. **After Photo**) uploaded to Firebase Storage.

5. **Executive GIS Hotspots & City Analytics**
   - Vector-based interactive GIS heatmap depicting incident clusters with severity glow (High $\rightarrow$ Red, Medium $\rightarrow$ Amber, Low $\rightarrow$ Emerald).
   - Interactive cluster inspector displaying open vs. resolved counts, top categories, and average response times.
   - Real-time aggregated KPIs and weekly trend inflow charts.

6. **1-Click Hackathon Persona Switcher**
   - Located directly in the top navigation bar. Evaluators can switch instantly between:
     - 👤 **Citizen** (*Priya Ramanathan*)
     - 👮 **Area Officer** (*Rajesh Kumar - Ward 102*)
     - 🏢 **Department Officer** (*Kavitha Sundaram - Roads & Infra*)
     - 🛡️ **Zonal Supervisor** (*M. Sundararajan*)
     - 🏛️ **District Manager** (*Dr. A. Arunkumar IAS*)
     - 👷 **Field Team** (*Rapid Road Repair Team Bravo*)
     - ⚙️ **System Admin**

---

## 📁 Complete Folder Structure

```
hack1/
├── .env.example                     # Environment variable blueprint
├── .env                             # Local environment config (Demo Mode active by default)
├── index.html                       # HTML template with Plus Jakarta Sans & JetBrains Mono
├── package.json                     # Dependencies & build scripts
├── tsconfig.app.json                # TypeScript app configuration
├── tsconfig.json                    # Root TypeScript config
├── vite.config.ts                   # Vite bundler config with @ path alias and Tailwind v4
├── public/                          # Static assets
└── src/
    ├── main.tsx                     # React application entry point
    ├── App.tsx                      # Root layout, router, and AuthProvider
    ├── index.css                    # Tailwind CSS v4 design tokens and custom animations
    ├── types/                       # TypeScript interfaces
    │   └── index.ts                 # Complaint, UserProfile, WorkOrder, Hotspots, Escalation types
    ├── constants/                   # Static configurations
    │   └── index.ts                 # Categories, Roles, SLAs, Escalation Levels, Demo Areas
    ├── utils/                       # Utility functions
    │   └── index.ts                 # SLA calculation, relative formatting, cn class merger
    ├── services/                    # Service layer (Google ecosystem only)
    │   ├── firebase/
    │   │   └── config.ts            # Firebase app, auth, db, storage initialization
    │   ├── store/
    │   │   └── demoStore.ts         # Reactive demo store with persistent state & event bus
    │   ├── authService.ts           # Firebase Auth + Firestore user document synchronization
    │   ├── complaintService.ts      # Cloud Firestore complaints collection + real-time listeners
    │   ├── officerService.ts        # Area officer actions & workflow transitions
    │   ├── supervisorService.ts     # Zonal supervisor escalations & team assignments
    │   ├── fieldTeamService.ts      # Field work orders & proof uploads
    │   ├── managementService.ts     # Executive hotspot aggregation & analytics
    │   ├── notificationService.ts   # Firestore notifications & Web Push (FCM)
    │   ├── storageService.ts        # Firebase Storage with data URI fallback
    │   ├── geminiService.ts         # Google Gemini 2.0 Vision inspection engine
    │   └── demoData.ts              # High-fidelity synthetic dataset with lifecycle complaints
    ├── store/
    │   └── AuthContext.tsx          # Application-wide authentication context & role checks
    ├── hooks/                       # Custom React hooks
    │   ├── useComplaints.ts         # Real-time list subscription with count memoization
    │   ├── useComplaint.ts          # Single complaint real-time snapshot hook
    │   ├── useNotifications.ts      # Push notification & alerts subscription
    │   ├── useGeolocation.ts        # Geolocation API with manual ward selection fallback
    │   └── useHotspots.ts           # Geographic cluster intelligence hook
    ├── components/
    │   ├── common/                  # Reusable design system components
    │   │   ├── Button.tsx           # Button with variants, sizes, and loading spinners
    │   │   ├── Input.tsx            # Form input with prefix/suffix icons and error states
    │   │   ├── Select.tsx           # Accessible styled dropdown
    │   │   ├── Badge.tsx            # Badge, StatusBadge, PriorityBadge
    │   │   ├── Card.tsx             # Card, CardHeader, CardTitle, CardContent, CardFooter
    │   │   ├── Modal.tsx            # Accessible modal dialog with backdrop blur
    │   │   ├── Drawer.tsx           # Mobile bottom sheet & slide-out panels
    │   │   ├── FeedbackStates.tsx   # LoadingState, ErrorState, EmptyState
    │   │   ├── StatsAndDialog.tsx   # StatsCard & ConfirmationDialog
    │   │   ├── FileUploader.tsx     # Camera capture & file dropzone with preview
    │   │   ├── ImagePreview.tsx     # Lightbox zoom modal for photo inspection
    │   │   └── DataTable.tsx        # Responsive tabular data grid
    │   ├── layout/                  # Structural components
    │   │   ├── Navbar.tsx           # Top navigation with 1-click role switcher
    │   │   ├── MobileNav.tsx        # Mobile bottom navigation bar
    │   │   └── OfficerSidebar.tsx   # Operational sidebar navigation
    │   ├── complaints/              # Specialized complaint domain components
    │   │   ├── ComplaintCard.tsx    # Summary card with SLA indicators
    │   │   ├── ComplaintTimeline.tsx# Detailed sequential workflow timeline
    │   │   ├── EscalationTracker.tsx# 4-tier hierarchical escalation visualization
    │   │   ├── SLAIndicator.tsx     # SLA countdown timer & overdue warning
    │   │   └── AreaHierarchyBreadcrumb.tsx # City → District → Zone → Ward hierarchy
    │   ├── maps/                    # Geospatial intelligence
    │   │   ├── HotspotMap.tsx       # Vector GIS heatmap with cluster inspection
    │   │   └── LocationPicker.tsx   # GPS detection & manual area assignment
    │   └── notifications/
    │       ├── NotificationItem.tsx # Notification list item with action routes
    │       └── NotificationCenter.tsx # Notification popover dropdown
    ├── layouts/                     # Page layout wrappers
    │   ├── CitizenLayout.tsx        # Citizen desktop sub-nav & mobile shell
    │   ├── DashboardLayouts.tsx     # OfficerLayout, SupervisorLayout, ManagementLayout
    │   └── OtherLayouts.tsx         # FieldTeamLayout, AdminLayout, AuthLayout
    ├── pages/                       # Application screens
    │   ├── auth/
    │   │   ├── Login.tsx            # Firebase Auth & quick demo persona switch
    │   │   ├── Register.tsx         # Citizen signup
    │   │   └── Profile.tsx          # User profile & authorization audit
    │   ├── citizen/
    │   │   ├── CitizenHome.tsx      # Dashboard with category grid & quick report
    │   │   ├── ReportIssue.tsx      # 6-step complaint flow with Google Gemini AI
    │   │   ├── ComplaintSuccess.tsx # Success acknowledgment with SLA response window
    │   │   ├── MyComplaints.tsx     # Filterable citizen complaint list
    │   │   ├── ComplaintDetail.tsx  # Detailed tracking dossier & proof verification
    │   │   ├── NearbyMap.tsx        # Incident cluster map
    │   │   └── CitizenNotifications.tsx # Real-time notification center
    │   ├── officer/
    │   │   ├── OfficerDashboard.tsx # 6 KPI cards & assigned queue
    │   │   ├── PriorityQueue.tsx    # Table view with SLA & hazard scores
    │   │   └── OfficerComplaintDetail.tsx # Inspection dossier & action modals
    │   ├── supervisor/
    │   │   └── SupervisorEscalations.tsx # Escalated complaints & overdue SLA monitor
    │   ├── management/
    │   │   └── ManagementDashboard.tsx # Executive KPIs, GIS map, and inflow trends
    │   ├── fieldTeam/
    │   │   └── FieldTeamDashboard.tsx # Work orders & Before/After photo evidence upload
    │   └── admin/
    │       └── AdminDashboard.tsx   # Diagnostics, ward matrix, and demo reset
    └── routes/
        ├── RoleGuard.tsx            # Role-based route guard
        └── AppRoutes.tsx            # All defined application routes
```

---

## ⚙️ Installation & Local Development

### 1. Prerequisites
- Node.js `v20.x` or later (Tested on `v24.x`)
- npm `v10.x` or later

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Environment Variables Configuration

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
# Toggle Demo Mode ('true' runs with pre-seeded synthetic data; 'false' connects to live Firebase)
VITE_USE_DEMO_MODE=true

# Google Firebase Web SDK Credentials
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=civicai-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=civicai-prod
VITE_FIREBASE_STORAGE_BUCKET=civicai-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Google Maps Platform API Key (for live satellite tile maps)
VITE_GOOGLE_MAPS_API_KEY=

# Optional: Google Gemini API Key (for direct client-side Gemini Vision analysis)
VITE_GEMINI_API_KEY=
```

---

## 🗄️ Firestore Data Contracts

The frontend expects and integrates with these standard Cloud Firestore collections:

```typescript
// 1. complaints (Main grievance entity)
interface Complaint {
  id: string;                      // e.g. "CIV-2026-001245"
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
  organizationId: string;
  category: "Road" | "Water" | "Drainage" | "Street Light" | "Waste" | ...;
  description: string;
  landmark?: string;
  imageUrls: string[];
  location: {
    latitude: number;
    longitude: number;
    readableAddress: string;
    area: string;
    ward: string;
    zone?: string;
    district?: string;
  };
  aiAnalysis: {
    issueType: string;
    category: ComplaintCategory;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    confidence: number;            // 0.91 (91%)
    detectedDescription: string;
    suggestedDepartment: string;
    suggestedPriority: PriorityLevel;
    tags: string[];
    reasoning?: string;
  };
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  priorityScore: number;           // 0 - 100
  departmentId: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  fieldTeamId?: string;
  fieldTeamName?: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "ASSIGNED" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED" | "REJECTED";
  escalationLevel: 0 | 1 | 2 | 3 | 4;
  escalationReason?: string;
  previousOfficerName?: string;
  createdAt: string;              // ISO timestamp
  updatedAt: string;              // ISO timestamp
  responseDeadline: string;       // ISO timestamp (SLA)
  resolutionDeadline: string;     // ISO timestamp
  resolvedAt?: string;
  resolutionEvidence?: {
    beforeImageUrl?: string;
    afterImageUrl?: string;
    notes: string;
    resolvedAt: string;
    verifiedBy?: string;
  };
  statusHistory?: StatusHistoryEntry[];
}

// 2. workOrders (Field team dispatches)
interface WorkOrder {
  id: string;                      // e.g. "WO-2026-0081"
  complaintId: string;
  complaintTitle: string;
  category: ComplaintCategory;
  priority: PriorityLevel;
  location: ComplaintLocation;
  fieldTeamId: string;
  fieldTeamName: string;
  status: "ASSIGNED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
  assignedDate: string;
  deadline: string;
  instructions: string;
  beforePhoto?: string;
  afterPhoto?: string;
  completionNotes?: string;
  completedAt?: string;
}

// 3. notifications (Civic alerts)
interface CivicNotification {
  id: string;
  userId: string;
  complaintId: string;
  type: "COMPLAINT_SUBMITTED" | "COMPLAINT_ACCEPTED" | "OFFICER_ASSIGNED" | "WORK_STARTED" | "COMPLAINT_ESCALATED" | "FIELD_TEAM_ASSIGNED" | "WORK_COMPLETED" | "COMPLAINT_RESOLVED" | "SLA_WARNING";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// 4. users (Profile & role authorization)
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: "CITIZEN" | "AREA_OFFICER" | "DEPARTMENT_OFFICER" | "SUPERVISOR" | "DISTRICT_MANAGER" | "ADMIN" | "FIELD_TEAM";
  organizationId?: string;
  wardId?: string;
  areaId?: string;
  departmentId?: string;
  badgeNumber?: string;
}
```

---

## 🌐 Production Deployment (Firebase Hosting)

### 1. Build the Production Bundle
```bash
npm run build
```
This compiles the TypeScript code and produces a production-optimized static bundle in `dist/`.

### 2. Deploy to Firebase Hosting
```bash
# Log in to Google Firebase
npx -y firebase-tools login

# Initialize or deploy
npx -y firebase-tools deploy --only hosting
```

`firebase.json` configuration:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 🔒 Security Best Practices

- **Zero Client Secrets**: No Firebase Admin credentials, private keys, or backend master tokens exist in the frontend.
- **Server-Enforced Authorization**: Frontend role switching controls UI views; ultimate data read/write permissions are validated by Firestore Security Rules.
- **Auditable History**: Status transitions record actor name, actor role, timestamp, and notes into an append-only `statusHistory` array.
