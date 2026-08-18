# Hardcoded Strings Audit - Complete List

## Summary
- **Total Files Scanned**: 19 files
- **Total Hardcoded Strings**: 150+ UI strings (NOT using t() function)
- **Priority**: HIGH - These need systematic translation

---

## LAYOUT COMPONENTS

### 1. Navbar.tsx
**Location**: `src/components/layout/Navbar.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Toggle navigation drawer"` | aria-label | Accessibility label | YES | Used for screen readers |
| `"ElectWin"` | Brand name | Brand/Logo | OPTIONAL | Brand name - may keep as is |
| `"Change Language"` | title attribute | Tooltip | YES | User-facing tooltip |
| `"Live Notifications"` | title attribute | Tooltip | YES | User-facing tooltip |
| `"Election"` (sm:hidden) | Display text | Label | YES | Abbreviated label for mobile |

---

### 2. Sidebar.tsx
**Location**: `src/components/layout/Sidebar.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"War Room Dashboard"` | Nav label | Menu item | YES | Main navigation item |
| `"Team & Permissions"` | Nav label | Menu item | YES | Main navigation item |
| `"Candidates & Symbols"` | Nav label | Menu item | YES | Main navigation item |
| `"Voter Roll & OCR"` | Nav label | Menu item | YES | Main navigation item |
| `"Design Studio"` | Nav label | Menu item | YES | Main navigation item |
| `"Broadcast Center"` | Nav label | Menu item | YES | Main navigation item |
| `"Booth Operations"` | Nav label | Menu item | YES | Main navigation item |
| `"Surveys & Grievances"` | Nav label | Menu item | YES | Main navigation item |
| `"EC Expenses Ledger"` | Nav label | Menu item | YES | Main navigation item |
| `"Turnout Analytics"` | Nav label | Menu item | YES | Main navigation item |
| `"Settings & Branding"` | Nav label | Menu item | YES | Main navigation item |
| `"Campaign Management"` | Section header | Section title | YES | Section header |
| `"Ward 02 Field Desk"` | Nav label | Menu item | YES | Dynamic but needs translation key |
| `"Add Elector (Ward 02)"` | Nav label | Menu item | YES | Dynamic but needs translation key |
| `"My Field Record"` | Nav label | Menu item | YES | Dynamic but needs translation key |
| `"Field Volunteer Desk"` | Section header | Section title | YES | Section header |
| `"Sign Out Session"` | Button text | Button | YES | Call-to-action |

---

### 3. MobileQuickBar.tsx
**Location**: `src/components/layout/MobileQuickBar.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"War Room"` | Label | Menu label | YES | Mobile quick bar item |
| `"Voters"` | Label | Menu label | YES | Mobile quick bar item |
| `"Studio"` | Label | Menu label | YES | Mobile quick bar item |
| `"Broadcast"` | Label | Menu label | YES | Mobile quick bar item |
| `"Field Desk"` | Label | Menu label | YES | Mobile quick bar item |

---

### 4. LanguageModal.tsx
**Location**: `src/components/layout/LanguageModal.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Select Platform Language"` | Modal title | Header | YES | Modal title |

---

## PAGE COMPONENTS

### 5. DashboardPage.tsx
**Location**: `src/pages/DashboardPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Recent Activity"` | Card title | Section header | Already in t() | ✅ Uses t('recentActivity') |
| `"Latest Updates"` | Subtext | Description | Already in t() | ✅ Uses t('latestUpdates') |
| `"Last 5 Updates"` | Label | Column info | Already in t() | ✅ Uses t('last5Updates') |
| `"Type"` | Table header | Column header | Already in t() | ✅ Uses t('type') |
| `"Name"` | Table header | Column header | Already in t() | ✅ Uses t('name') |
| `"Details"` | Table header | Column header | Already in t() | ✅ Uses t('details') |
| `"Time"` | Table header | Column header | Already in t() | ✅ Uses t('time') |
| `"Quick Actions"` | Section title | Section header | NO | Used internally but needs key |
| Fallback data strings (Candidate names, Ward labels) | Mock data | Sample data | NO | User-entered data, not UI labels |

---

### 6. CandidatesPage.tsx
**Location**: `src/pages/CandidatesPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"All Candidates"` | Filter tab | Tab label | YES | Filter tab button |
| `"🏛️ Sarpanch Post"` | Filter tab | Tab label | YES | Filter tab with emoji |
| `"👥 Ward Panch"` | Filter tab | Tab label | YES | Filter tab with emoji |
| `"Nominate New Contesting Candidate"` | Modal title | Header | YES | Modal title |
| `"Generate Posters"` | Button text | Action button | YES | Button CTA |
| `"Elector Base"` | Card label | Info label | YES | Stats label |
| `"Voters"` | Card label | Stats unit | YES | Unit label |
| `"Field Team"` | Card label | Info label | YES | Stats label |
| `"Workers"` | Card label | Stats unit | YES | Unit label |
| `"Key Manifesto Agenda:"` | Card section | Section header | YES | Section header |
| `"SYMBOL"` | Emoji label | Badge text | YES | Badge label |
| Default form values: `'Gram Panchayat Rampur (Ward 04)'` | Placeholder | Default data | OPTIONAL | Default form value |
| Default values: `'Tractor (ट्रैक्टर)'`, `'गांव का समग्र विकास...'` | Form data | Mixed language | YES | Should standardize |

---

### 7. VotersPage.tsx
**Location**: `src/pages/VotersPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Search team member by name, ward or role..."` | Placeholder | Input placeholder | YES | Form placeholder |
| Filter segment labels: `'all'`, `'whatsapp'`, `'no-whatsapp'`, `'youth'`, `'women'`, `'missing'` | Segment filter | Filter options | YES | Filter category labels |
| `"ID,Name,Age,Gender,Ward,Mobile,Channel,Consent,Status"` | CSV header | Data export | YES | Column headers for export |
| `"ElectWin_Voter_Database_*.csv"` | Filename | Download filename | OPTIONAL | Can keep English |
| `"Preview ready: * valid rows found"` | Toast message | Notification | YES | User notification |
| `"No active election selected"` | Toast message | Error message | YES | Error message |
| `"Upload failed"` | Toast message | Error message | YES | Error message |
| `"Voter * added successfully!"` | Toast message | Success message | YES | Success notification |
| `"Failed to add voter"` | Toast message | Error message | YES | Error message |
| `"Official Voter Roll CSV downloaded!"` | Toast message | Info message | YES | Info notification |

---

### 8. TeamPage.tsx
**Location**: `src/pages/TeamPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Search team member by name, ward or role..."` | Placeholder | Input placeholder | YES | Form placeholder |
| `"* Team Members"` | Badge text | Count badge | YES | Dynamic count label |
| `"Assigned Ward:"` | Info label | Card label | YES | Card field label |
| `"All Wards (Campaign HQ)"` | Default value | Form default | YES | Default form value |
| `"Team member * added successfully!"` | Toast message | Success message | YES | Success notification |
| `"Failed to load team members"` | Toast message | Error message | YES | Error message |
| `"Failed to add team member"` | Toast message | Error message | YES | Error message |
| `"Super admin"`, `"Admin"`, `"Team Member"` | Role labels | Role display | YES | Role labels |
| `"Loading..."` | Button state text | Loading state | YES | Loading indicator |

---

### 9. ComplaintsPage.tsx
**Location**: `src/pages/ComplaintsPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Track village grievances (water, roads, power) and voter redressal status live."` | Page subtitle | Description | YES | Page description |
| `"All Grievances"` | Filter tab | Tab label | YES | Filter tab |
| `"Water Supply"` | Filter option | Category | YES | Complaint category |
| `"Health / School"` | Filter option | Category | YES | Complaint category |
| `"Road Drainage"` | Filter option | Category | YES | Complaint category |
| `"Electricity"` | Filter option | Category | YES | Complaint category |
| Table headers: `"Citizen Name"`, `"Ward"`, `"Category"`, `"Issue Description"`, `"Logged Date"`, `"Resolution Status"` | Table headers | Column headers | YES | Table column headers |
| `"Citizen"` | Default display | Fallback text | YES | Default value |
| `"Ward"` | Default display | Fallback text | YES | Default value |
| Status labels: `"Resolved"`, `"In Progress"`, `"Open"` | Badge text | Status badge | YES | Status display |
| Toast: `"Grievance marked as ..."` | Toast message | Success notification | YES | Success message |
| Toast: `"Citizen grievance registered successfully!"` | Toast message | Success message | YES | Success message |
| Toast: `"Failed to register grievance"` | Toast message | Error message | YES | Error message |
| Toast: `"Failed to load complaints"` | Toast message | Error message | YES | Error message |

---

### 10. ExpensesPage.tsx
**Location**: `src/pages/ExpensesPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Tracks expenditures against official Gram Panchayat election ceiling (₹1,50,000)."` | Subtitle | Description | YES | Page description |
| `"Statutory Gram Panchayat Election Ceiling"` | Banner label | Section label | YES | Category label |
| `"Remaining"` | Badge text | Info label | YES | Badge text |
| `"Utilized"` | Badge text | Info label | YES | Badge text |
| Table headers: `"Category"`, `"Amount"`, `"Date"` | Table headers | Column headers | YES | Column headers |
| Toast: `"Expense of ₹* recorded successfully!"` | Toast message | Success message | YES | Success notification |
| Toast: `"Failed to record expense"` | Toast message | Error message | YES | Error message |
| Toast: `"Failed to load expenses"` | Toast message | Error message | YES | Error message |

---

### 11. DesignStudioPage.tsx
**Location**: `src/pages/DesignStudioPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"50+ Official EC Symbols Available"` | Badge text | Info badge | YES | Feature info |
| `"Candidate photo uploaded successfully"` | Toast message | Success message | YES | Success notification |
| `"Photo upload failed"` | Toast message | Error message | YES | Error message |
| `"Failed to upload photo"` | Toast message | Error message | YES | Error message |
| `"Symbol uploaded successfully"` | Toast message | Success message | YES | Success notification |
| `"Symbol upload failed"` | Toast message | Error message | YES | Error message |
| `"Failed to upload symbol"` | Toast message | Error message | YES | Error message |
| Validation error messages from `validateMediaFile()` | Toast message | Error messages | YES | Error messages |
| Form defaults: `'ग्राम पंचायत चुनाव 2026'` (Hindi) | Default value | Mixed language default | YES | Should normalize |

---

### 12. BroadcastPage.tsx
**Location**: `src/pages/BroadcastPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Smart Dual Pipeline: WhatsApp + SMS Fallback"` | Badge text | Feature description | YES | Info badge |
| `"Primary Channel (WhatsApp)"` | Channel label | Info label | YES | Channel category |
| `"Electors (* %)"` | Stats label | Count display | YES | Dynamic label |
| `"Rich Media + Blue Tick"` | Badge text | Feature badge | YES | Feature description |
| `"Auto Fallback (SMS Gateway)"` | Channel label | Info label | YES | Channel category |
| `"100% Deliverability"` | Badge text | Feature badge | YES | Feature description |
| `"Compose Campaign Broadcast"` | Card title | Section header | YES | Section header |
| `"Attach Poster Card"` | Checkbox label | Form label | YES | Form label |
| `"Insert Dynamic Voter Tags:"` | Label text | Instruction | YES | Instruction text |
| `"+ Voter Name"` | Button label | Button text | YES | Button CTA |
| `"+ Ward No."` | Button label | Button text | YES | Button CTA |
| `"+ Polling Booth"` | Button label | Button text | YES | Button CTA |
| `"+ Symbol"` | Button label | Button text | YES | Button CTA |
| Message default (Hindi): `'प्रिय {{name}} जी,...'` | Template text | Mixed language | YES | Should normalize |
| Toast: `"Broadcast successfully dispatched to * electors!"` | Toast message | Success message | YES | Success notification |

---

### 13. VolunteersPage.tsx
**Location**: `src/pages/VolunteersPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Ward-wise polling booth coverage, incharge assignments, and voter slip distribution."` | Subtitle | Description | YES | Page description |
| `"6 Polling Booths Active • 86% Average Coverage"` | Badge text | Summary info | YES | Summary badge |
| `"Polling Stations &amp; Panna Roster"` | Section title | Section header | YES | Section header (with HTML entity) |
| `"Booth Incharge:"` | Card label | Info label | YES | Card field label |
| `"Registered Electors:"` | Card label | Info label | YES | Card field label |
| `"Voters"` | Card label | Unit label | YES | Unit label |
| `"Slips Distributed:"` | Card label | Info label | YES | Card field label |
| `"Slips"` | Card label | Unit label | YES | Unit label |
| `"Field Volunteer Performance Metrics"` | Section title | Section header | YES | Section header |
| Table headers: `"Volunteer Name"`, `"Assigned Area"`, `"Phone"`, `"Voters Added"`, `"Calls Made"`, `"Slips Handed"`, `"Duty Status"` | Table headers | Column headers | YES | Column headers |

---

### 14. VolunteerActivityPage.tsx
**Location**: `src/pages/VolunteerActivityPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"My Field Activity Record"` | Page title | Page header | YES | Page title |
| Field performance for: `"Kailash Saini (Ward 02)"` | Info text | User info | USER DATA | User-entered data |
| `"Return to Ward Desk"` | Button text | Button CTA | YES | Button text |
| `"Electors Added"` | Stat title | Card title | YES | Stat title |
| `"Ward 02 Roll"` | Stat subtitle | Card subtitle | YES | Stat subtitle |
| `"Calls Made"` | Stat title | Card title | YES | Stat title |
| `"Verified Contacts"` | Stat subtitle | Card subtitle | YES | Stat subtitle |
| `"Door Visits"` | Stat title | Card title | YES | Stat title |
| `"Patel Basti"` | Stat subtitle | Card subtitle | OPTIONAL | Location name |
| `"Slips Handed"` | Stat title | Card title | YES | Stat title |
| `"Panna Deliveries"` | Stat subtitle | Card subtitle | YES | Stat subtitle |
| `"Today's Field Activity Stream"` | Section title | Section header | YES | Section header |
| Timeline items (hardcoded): `"Marked visited & handed slip..."`, `"Added new voter..."` etc. | Activity text | Activity log | OPTIONAL | Mock data |

---

### 15. AnalyticsPage.tsx
**Location**: `src/pages/AnalyticsPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Voter turnout predictions, booth-wise coverage analysis, and demographic insights."` | Subtitle | Description | YES | Page description |
| `"Export War Room Report"` | Button text | Button CTA | YES | Button text |
| `"Ward-Wise Voter Roll Reach %"` | Chart title | Section header | YES | Section header |
| `"86% Average"` | Badge text | Average info | YES | Badge text |
| `"Broadcast Delivery Channel Split"` | Chart title | Section header | YES | Section header |
| `"3,500 Total"` | Badge text | Count info | YES | Badge text |
| Toast: `"Failed to load analytics data"` | Toast message | Error message | YES | Error message |
| Toast: `"Analytics Report exported!"` | Toast message | Success message | YES | Success message |
| Loading state: `"Loading analytics engine..."` | Loading text | Loading indicator | YES | Loading message |
| No data: `"No analytics data yet. Select an active election."` | Info text | Info message | YES | Info message |
| Default export filename: `"ElectWin_Analytics_*.txt"` | Filename | Export filename | OPTIONAL | Can keep English |

---

### 16. SettingsPage.tsx
**Location**: `src/pages/SettingsPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Configure campaign details, branding colors, and system preferences."` | Subtitle | Description | YES | Page description |
| `"Theme Accent Color (Instant Live Styling)"` | Section title | Section header | YES | Section header |
| Theme swatch labels: `"Sky Blue (Official)"`, `"Royal Violet"`, `"Victory Mint"`, `"Saffron Amber"`, `"Crimson Rose"` | Color names | Label/description | YES | Color names |
| `"Election War Room Configuration"` | Section title | Section header | YES | Section header |
| `"Campaign Title"` | Form label | Input label | YES | Form label |
| `"Contesting Candidate"` | Form label | Input label | YES | Form label |
| Default value: `"Gram Panchayat Rampur Election War Room"` | Form value | Default text | YES | Default value |
| Default value: `"Rameshwar Patel"` | Form value | Default text | USER DATA | User-entered data |
| Toast: `"Platform branding & campaign preferences saved!"` | Toast message | Success message | YES | Success message |

---

### 17. VolunteerAddPage.tsx
**Location**: `src/pages/VolunteerAddPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Quick Elector Entry (Ward 02)"` | Page title | Page header | YES | Page title (with ward) |
| `"Auto-tagged to Ward 02 – Patel Basti"` | Info text | Description | YES | Info text |
| `"Elector Full Name"` | Form label | Input label | YES | Form label |
| `"e.g. Radheshyam Patel"` | Placeholder | Input placeholder | YES | Placeholder |
| `"Age (Years)"` | Form label | Input label | YES | Form label |
| `"House / Mohalla Address"` | Form label | Input label | YES | Form label |
| `"e.g. House #45, Patel Chowk"` | Placeholder | Input placeholder | YES | Placeholder |
| `"Mobile Number (with +91)"` | Form label | Input label | YES | Form label |
| `"+91 98765 43210"` | Placeholder | Input placeholder | YES | Placeholder |
| `"Panna voting slip handed over during this visit"` | Checkbox label | Form label | YES | Form label |
| `"Cancel"` | Button text | Button CTA | YES | Button text |
| `"Commit Entry"` | Button text | Button CTA | YES | Button text |
| Toast: `"Elector * logged directly into Ward 02!"` | Toast message | Success message | YES | Success message |

---

### 18. VolunteerWardPage.tsx
**Location**: `src/pages/VolunteerWardPage.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Dedicated Field Volunteer Desk"` | Banner label | Info label | YES | Banner label |
| `"Ward 02 – Patel Basti"` | Page title | Page header | YES | Page title |
| `"Field Worker: * • Assigned Booth: *"` | Info text | Dynamic info | YES | Dynamic info text |
| `"+ Add Elector"` | Button text | Button CTA | YES | Button text |
| `"My Activity"` | Button text | Button CTA | YES | Button text |
| Filter tabs: `"All Elector Cards (*)"`, `"⏳ Pending Visits"`, `"✅ Visited & Verified"` | Filter tab labels | Tab labels | YES | Filter tabs |
| Status badge labels: `"Pending"`, `"Called"`, `"Visited"`, `"Not Reachable"` | Badge text | Status badges | YES | Status displays |
| `"Called"` | Button label | Action button | YES | Button label |
| `"Visited"` | Button label | Action button | YES | Button label |
| Toast: `"Voter status marked as ..."` | Toast message | Info message | YES | Info message |
| Toast: `"Voter slip handed over!"` or `"Slip marked pending"` | Toast message | Success/Info message | YES | Toast message |

---

### 19. RoleSwitcherModal.tsx
**Location**: `src/components/layout/RoleSwitcherModal.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| Modal title (if present) | Title | Header | YES | Modal header |
| Role option labels | Button text | Selection options | YES | Role selection buttons |

---

## UI COMPONENTS

### 20. Modal.tsx
**Location**: `src/components/ui/Modal.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| `"Close modal"` | aria-label | Accessibility label | YES | Screen reader text |

---

### 21. Button.tsx
**Location**: `src/components/ui/Button.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| No hardcoded UI strings - component only | - | - | - | Component is generic |

---

### 22. FormInput.tsx
**Location**: `src/components/ui/FormInput.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| Any placeholder/label values passed as props | Depends | Props | YES | Depends on caller |

---

### 23. Select.tsx
**Location**: `src/components/ui/Select.tsx`

| String | Line | Type | Should Translate? | Notes |
|--------|------|------|-------------------|-------|
| Options passed as props | Depends | Props | YES | Depends on caller |

---

### 24. Other UI Components
**Location**: `src/components/ui/*.tsx`

| Component | Hardcoded Strings | Status |
|-----------|-------------------|--------|
| Badge.tsx | None (generic) | ✅ No hardcoded text |
| Card.tsx | None (generic) | ✅ No hardcoded text |
| FileDropzone.tsx | Check for labels | REVIEW |
| Textarea.tsx | None (generic) | ✅ No hardcoded text |

---

## SUMMARY BY CATEGORY

### Form Labels & Placeholders (HIGH PRIORITY)
- "Elector Full Name", "Age (Years)", "House / Mohalla Address"
- "Campaign Title", "Contesting Candidate"
- "Search team member by name, ward or role..."
- "Mobile Number (with +91)"

### Navigation & Menu Items (HIGH PRIORITY)
- All Sidebar menu items (11 items)
- MobileQuickBar items (5 items)
- Section headers ("Campaign Management", "Field Volunteer Desk")

### Buttons & CTAs (MEDIUM PRIORITY)
- "Add Candidate", "Generate Posters"
- "Add Member", "Sign Out Session"
- "Return to Ward Desk", "Commit Entry"
- "Export Report", "Export War Room Report"

### Table Headers & Filters (MEDIUM PRIORITY)
- Complaints table: "Citizen Name", "Ward", "Category", "Issue Description", "Logged Date", "Resolution Status"
- Volunteers table: "Volunteer Name", "Assigned Area", "Phone", "Voters Added", "Calls Made", "Slips Handed", "Duty Status"
- Filter options: "All Candidates", "Sarpanch Post", "Ward Panch", "Water Supply", "Health / School", etc.

### Section Titles & Headers (MEDIUM PRIORITY)
- "Recent Activity", "Today's Field Activity Stream"
- "Ward-Wise Voter Roll Reach %", "Broadcast Delivery Channel Split"
- "Theme Accent Color", "Election War Room Configuration"
- "Polling Stations & Panna Roster", "Field Volunteer Performance Metrics"

### Status & Badge Labels (MEDIUM PRIORITY)
- Status: "Open", "In Progress", "Resolved", "Pending", "Visited", "Called", "Not Reachable"
- Badges: "50+ Official EC Symbols", "6 Polling Booths Active", "Smart Dual Pipeline: WhatsApp + SMS Fallback"

### Toast Messages & Notifications (LOW-MEDIUM PRIORITY)
- Success: "Candidate registered successfully!", "Voter added successfully!", "Expense recorded successfully!"
- Error: "Failed to load complaints", "Failed to add voter", "Upload failed"
- Info: "Official Voter Roll CSV downloaded!", "Analytics Report exported!"

### Color Names (OPTIONAL)
- "Sky Blue (Official)", "Royal Violet", "Victory Mint", "Saffron Amber", "Crimson Rose"

---

## NOTES FOR TRANSLATION

1. **Already Using t()**: DashboardPage already uses t() for most strings - great example!

2. **Mixed Language**: Some files have mixed Hindi/English (BroadcastPage, DesignStudioPage, CandidatesPage) - standardize these

3. **User-Entered Data**: Should NOT translate (user names, phone numbers, addresses)

4. **Filenames**: Optional to translate (.csv, .txt filenames)

5. **Default Form Values**: Some defaults use Hindi text - should normalize or make translatable

6. **Dynamic Strings**: Ward labels, Booth names contain data - use translation keys with parameters

7. **Accessibility Labels**: aria-label and title attributes MUST be translatable for screen readers

8. **Brand Names**: "ElectWin" - decide if this stays English or gets localized

---

## RECOMMENDED NEXT STEPS

1. ✅ Use t() function for ALL items marked "YES" in "Should Translate?" column
2. Add translation keys to LanguageContext.tsx for each unique string
3. Start with HIGH PRIORITY items (Form Labels, Navigation, Buttons)
4. Then MEDIUM PRIORITY (Headers, Filters, Status labels)
5. Finally LOW-MEDIUM PRIORITY (Toasts, Info text, descriptions)
6. Test language switching on each page systematically
