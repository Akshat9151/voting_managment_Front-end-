# Translation Keys Needed - Actionable List

## Overview
This document lists all **unique hardcoded strings** that need translation keys, organized by priority and component.

---

## TIER 1: HIGH PRIORITY (Navigation & Core UI)

### Layout Navigation
**File**: Sidebar.tsx, MobileQuickBar.tsx, Navbar.tsx

```javascript
// Navigation Main Items
'wardDashboard': 'War Room Dashboard',
'teamPermissions': 'Team & Permissions',
'candidatesSymbols': 'Candidates & Symbols',
'voterRollOcr': 'Voter Roll & OCR',
'designStudio': 'Design Studio',
'broadcastCenter': 'Broadcast Center',
'boothOperations': 'Booth Operations',
'surveysGrievances': 'Surveys & Grievances',
'expensesLedger': 'EC Expenses Ledger',
'turnoutAnalytics': 'Turnout Analytics',
'settingsBranding': 'Settings & Branding',

// Section Headers
'campaignManagement': 'Campaign Management',
'fieldVolunteerDesk': 'Field Volunteer Desk',

// Mobile Quick Bar
'warRoom': 'War Room',
'voters': 'Voters',
'studio': 'Studio',
'broadcast': 'Broadcast',
'fieldDesk': 'Field Desk',

// Dynamic Navigation (Ward-based)
'wardFieldDesk': 'Ward {ward} Field Desk',
'addElectorWard': 'Add Elector (Ward {ward})',
'myFieldRecord': 'My Field Record',

// Navbar Actions
'changeLanguage': 'Change Language',
'liveNotifications': 'Live Notifications',
'selectPlatformLanguage': 'Select Platform Language',
'signOutSession': 'Sign Out Session',
```

---

## TIER 2: FORM LABELS & INPUTS

### Voter/Candidate Entry Forms
**Files**: VotersPage.tsx, CandidatesPage.tsx, VolunteerAddPage.tsx, TeamPage.tsx

```javascript
// Voter Page
'voterDatabase': 'Voter Roll & OCR',
'voterDatabaseDesc': 'Manage electoral database, OCR scanning, and voter registration',
'searchTeamMember': 'Search team member by name, ward or role...',
'addVoter': 'Add Voter',
'addCandidate': 'Add Candidate',

// Voter/Elector Form Labels
'electorFullName': 'Elector Full Name',
'electorFullNamePlaceholder': 'e.g. Radheshyam Patel',
'ageYears': 'Age (Years)',
'houseMollahaAddress': 'House / Mohalla Address',
'houseMollahaPlaceholder': 'e.g. House #45, Patel Chowk',
'mobileNumberLabel': 'Mobile Number (with +91)',
'mobileNumberPlaceholder': '+91 98765 43210',
'pannaVotingSlip': 'Panna voting slip handed over during this visit',
'commitEntry': 'Commit Entry',

// Candidate Form
'candidateName': 'Candidate Name',
'hindiName': 'Hindi Name',
'postType': 'Post Type',
'symbol': 'Symbol',
'symbolName': 'Symbol Name',
'slogan': 'Election Slogan',
'manifesto': 'Manifesto',
'nominateNewCandidate': 'Nominate New Contesting Candidate',

// Team Page
'campaignTeam': 'Campaign Team',
'teamDescription': 'Manage team members, permissions, and role assignments',
'firstName': 'First Name',
'lastName': 'Last Name',
'email': 'Email',
'password': 'Password',
'phone': 'Phone',
'roleCode': 'Role',
'ward': 'Ward',
'addMember': 'Add Member',
'assignedWard': 'Assigned Ward',
```

---

## TIER 3: SEARCH & FILTER LABELS

**Files**: CandidatesPage.tsx, VotersPage.tsx, ComplaintsPage.tsx, TeamPage.tsx

```javascript
// Candidate Filters
'allCandidates': 'All Candidates',
'sarpanchPost': '🏛️ Sarpanch Post',
'wardPanch': '👥 Ward Panch',

// Voter Filters
'allSegments': 'All Segments',
'whatsappSegment': 'WhatsApp Users',
'noWhatsappSegment': 'SMS Only Users',
'youthSegment': 'Youth (18-25)',
'womenSegment': 'Women',
'missingMobileSegment': 'Missing Mobile',

// Complaint Categories
'allGrievances': 'All Grievances',
'waterSupply': 'Water Supply',
'healthSchool': 'Health / School',
'roadDrainage': 'Road Drainage',
'electricity': 'Electricity',

// Volunteer Filters
'allElectorCards': 'All Elector Cards',
'pendingVisits': '⏳ Pending Visits',
'visitedVerified': '✅ Visited & Verified',
```

---

## TIER 4: TABLE HEADERS & COLUMNS

**Files**: Multiple pages

```javascript
// Generic Table Headers
'type': 'Type',
'name': 'Name',
'details': 'Details',
'time': 'Time',
'status': 'Status',
'action': 'Action',

// Dashboard Table
'recentActivity': 'Recent Activity',
'latestUpdates': 'Latest Updates',
'last5Updates': 'Last 5 Updates',

// Complaints Table
'citizenName': 'Citizen Name',
'category': 'Category',
'issueDescription': 'Issue Description',
'loggedDate': 'Logged Date',
'resolutionStatus': 'Resolution Status',

// Expenses Table
'expenseCategory': 'Category',
'amount': 'Amount',
'date': 'Date',
'vendor': 'Vendor',
'notes': 'Notes',

// Volunteers Table
'volunteerName': 'Volunteer Name',
'assignedArea': 'Assigned Area',
'phoneMobile': 'Phone',
'votersAdded': 'Voters Added',
'callsMade': 'Calls Made',
'slipsHanded': 'Slips Handed',
'dutyStatus': 'Duty Status',

// Booth Table
'boothIncharge': 'Booth Incharge',
'registeredElectors': 'Registered Electors',
'slipsDistributed': 'Slips Distributed',
```

---

## TIER 5: SECTION TITLES & HEADINGS

**Files**: All pages

```javascript
// Dashboard
'candidateCenter': 'Candidate Center',
'candidateDescription': 'Manage candidate profiles, symbols, and campaign material',
'candidateAndOrganizations': 'Candidates & Organizations',
'liveVoterDatabase': 'Live Voter Database',
'electionPortfolio': 'Election Portfolio',

// Activity & Performance
'todaysFieldActivityStream': "Today's Field Activity Stream",
'fieldPerformanceMetrics': 'Field Volunteer Performance Metrics',
'pollingStationsRoster': 'Polling Stations & Panna Roster',

// Analytics
'wardWiseVoterRoll': 'Ward-Wise Voter Roll Reach %',
'broadcastDeliveryChannel': 'Broadcast Delivery Channel Split',

// Broadcast
'composeCampaignBroadcast': 'Compose Campaign Broadcast',
'attachPosterCard': 'Attach Poster Card',
'insertDynamicVoterTags': 'Insert Dynamic Voter Tags',

// Settings
'themeAccentColor': 'Theme Accent Color (Instant Live Styling)',
'electionWarRoomConfig': 'Election War Room Configuration',
'campaignTitle': 'Campaign Title',
'contestingCandidate': 'Contesting Candidate',
```

---

## TIER 6: BUTTON TEXT & ACTIONS

**Files**: All pages

```javascript
// Primary Actions
'addVoter': 'Add Voter',
'addCandidate': 'Add Candidate',
'addExpense': 'Add Expense',
'addMember': 'Add Member',
'addElector': '+ Add Elector',
'logGrievance': 'Log Grievance',

// Navigation & Modal Actions
'cancel': 'Cancel',
'save': 'Save',
'close': 'Close',
'returnToWardDesk': 'Return to Ward Desk',
'returnToVolunteerDesk': 'Return to Volunteer Desk',

// Export & Report Actions
'exportReport': 'Export Report',
'exportWarRoomReport': 'Export War Room Report',
'downloadVoterDatabase': 'Download Voter Database',
'generatePosters': 'Generate Posters',

// Broadcast Actions
'dispatchBroadcast': 'Dispatch Broadcast',
'sendBroadcast': 'Send Broadcast',

// Broadcast Tag Insertions
'insertVoterName': '+ Voter Name',
'insertWardNo': '+ Ward No.',
'insertPollingBooth': '+ Polling Booth',
'insertSymbol': '+ Symbol',

// Field Volunteer Actions
'markedVisited': 'Visited',
'markedCalled': 'Called',
'myActivity': 'My Activity',
```

---

## TIER 7: STATUS BADGES & LABELS

**Files**: Multiple pages

```javascript
// Complaint Status
'statusOpen': 'Open',
'statusInProgress': 'In Progress',
'statusResolved': 'Resolved',

// Volunteer Status
'statusPending': 'Pending',
'statusVisited': 'Visited',
'statusCalled': 'Called',
'statusNotReachable': 'Not Reachable',
'statusActive': 'Active',
'statusInactive': 'Inactive',

// General Status
'live': 'LIVE',

// Card/Field Labels
'electorBase': 'Elector Base',
'voters': 'Voters',
'fieldTeam': 'Field Team',
'workers': 'Workers',
'keyManifestoAgenda': 'Key Manifesto Agenda:',

// Info Labels
'assignedWard': 'Assigned Ward',
'averageCoverage': '86% Average',
'totalCount': '* Total',
```

---

## TIER 8: TOAST & NOTIFICATION MESSAGES

**Files**: All pages with API calls

```javascript
// Success Messages
'candidateRegisteredSuccess': 'Candidate {name} registered successfully!',
'voterAddedSuccess': 'Voter {name} added successfully!',
'electorLoggedSuccess': 'Elector {name} logged directly into Ward {ward}!',
'teamMemberAddedSuccess': 'Team member {name} {lastName} added successfully!',
'grievanceRegisteredSuccess': 'Citizen grievance registered successfully!',
'expenseRecordedSuccess': 'Expense of ₹{amount} recorded successfully!',
'broadcastDispatchedSuccess': 'Broadcast successfully dispatched to {count} electors!',
'voterStatusUpdated': 'Voter status marked as "{status}"!',
'slipHandedOver': 'Voter slip handed over!',
'slipMarkedPending': 'Slip marked pending',
'csvDownloadedSuccess': 'Official Voter Roll CSV downloaded!',
'reportExportedSuccess': 'Analytics Report exported!',
'platformSaved': 'Platform branding & campaign preferences saved!',
'photoUploadedSuccess': 'Candidate photo uploaded successfully',
'symbolUploadedSuccess': 'Symbol uploaded successfully',
'previewReady': 'Preview ready: {validRows} valid rows found',

// Error Messages
'dashboardLoadError': 'Failed to load dashboard',
'voterLoadError': 'Failed to load voters from backend',
'noActiveElection': 'No active election selected',
'uploadFailed': 'Upload failed',
'photoUploadFailed': 'Photo upload failed',
'symbolUploadFailed': 'Symbol upload failed',
'voterAddFailed': 'Failed to add voter',
'teamMemberLoadFailed': 'Failed to load team members',
'teamMemberAddFailed': 'Failed to add team member',
'complaintLoadFailed': 'Failed to load complaints',
'grievanceRegisterFailed': 'Failed to register grievance',
'statusUpdateFailed': 'Status update failed',
'expenseLoadFailed': 'Failed to load expenses',
'expenseRecordFailed': 'Failed to record expense',
'analyticsLoadFailed': 'Failed to load analytics data',

// Info Messages
'loadingAnalyticsEngine': 'Loading analytics engine...',
'noAnalyticsData': 'No analytics data yet. Select an active election.',
```

---

## TIER 9: PAGE DESCRIPTIONS & SUBTITLES

**Files**: All pages

```javascript
'voterDatabaseDesc': 'Manage electoral database, OCR scanning, and voter registration',
'teamDescription': 'Manage team members, permissions, and role assignments',
'candidateDescription': 'Manage candidate profiles, symbols, and campaign material',
'surveyComplaintsDesc': 'Track village grievances (water, roads, power) and voter redressal status live',
'expensesTracking': 'Tracks expenditures against official Gram Panchayat election ceiling (₹1,50,000)',
'turnoutAnalyticsDesc': 'Voter turnout predictions, booth-wise coverage analysis, and demographic insights',
'boothOperationsDesc': 'Ward-wise polling booth coverage, incharge assignments, and voter slip distribution',
'studioTitle': 'Design Studio',
'studioSub': 'Create professional campaign posters, candidate profiles, and promotional material',
'broadcastTitle': 'Broadcast Center',
'broadcastSub': 'Send personalized messages via WhatsApp & SMS to targeted voter segments',
'settingsBrandingDesc': 'Configure campaign details, branding colors, and system preferences',

// Volunteer Pages
'quickElectorEntry': 'Quick Elector Entry (Ward {ward})',
'autoTaggedWard': 'Auto-tagged to Ward {ward} – {location}',
'dedicatedFieldVolunteerDesk': 'Dedicated Field Volunteer Desk',
'fieldWorkerAssigned': 'Field Worker: {name} • Assigned Booth: {booth}',
'myFieldActivityRecord': 'My Field Activity Record',
'fieldPerformanceReport': 'Field performance report for {name} (Ward {ward})',
```

---

## TIER 10: OPTIONAL (Color Names, Brand, Technical)

```javascript
// Theme Color Names
'colorSkyBlue': 'Sky Blue (Official)',
'colorRoyalViolet': 'Royal Violet',
'colorVictoryMint': 'Victory Mint',
'colorSaffronAmber': 'Saffron Amber',
'colorCrimsonRose': 'Crimson Rose',

// Feature Info Badges
'officialECSymbols': '50+ Official EC Symbols Available',
'pollingBoothsActive': '{count} Polling Booths Active • {coverage}% Average Coverage',
'smartDualPipeline': 'Smart Dual Pipeline: WhatsApp + SMS Fallback',

// Channel Labels
'primaryChannelWhatsapp': 'Primary Channel (WhatsApp)',
'autoFallbackSMS': 'Auto Fallback (SMS Gateway)',
'richMediaBlueTick': 'Rich Media + Blue Tick',
'deliverability100': '100% Deliverability',

// Broadcast Channel Info
'electorInfo': 'Electors ({percent}%)',
'statutoryGramPanchayat': 'Statutory Gram Panchayat Election Ceiling',
'remaining': 'Remaining',
'utilized': 'Utilized',
```

---

## TIER 11: ACCESSIBILITY LABELS (Screen Readers)

```javascript
'toggleNavigationDrawer': 'Toggle navigation drawer',
'closeModal': 'Close modal',
'closeDrawer': 'Close drawer',
```

---

## IMPLEMENTATION CHECKLIST

### Step 1: Add Translation Keys to LanguageContext.tsx
- [ ] Tier 1 (Navigation) - PRIORITY
- [ ] Tier 2 (Forms)
- [ ] Tier 3 (Filters)
- [ ] Tier 4 (Tables)
- [ ] Tier 5 (Headings)
- [ ] Tier 6 (Buttons)
- [ ] Tier 7 (Status)
- [ ] Tier 8 (Toasts)
- [ ] Tier 9 (Descriptions)
- [ ] Tier 10 (Optional)
- [ ] Tier 11 (Accessibility)

### Step 2: Update Files to Use t()
- [ ] Sidebar.tsx
- [ ] MobileQuickBar.tsx
- [ ] Navbar.tsx
- [ ] LanguageModal.tsx
- [ ] CandidatesPage.tsx
- [ ] VotersPage.tsx
- [ ] TeamPage.tsx
- [ ] ComplaintsPage.tsx
- [ ] ExpensesPage.tsx
- [ ] DesignStudioPage.tsx
- [ ] BroadcastPage.tsx
- [ ] VolunteersPage.tsx
- [ ] VolunteerActivityPage.tsx
- [ ] VolunteerAddPage.tsx
- [ ] VolunteerWardPage.tsx
- [ ] AnalyticsPage.tsx
- [ ] SettingsPage.tsx

### Step 3: Translate to All 8 Languages
- [ ] English (en)
- [ ] Hindi (hi)
- [ ] Punjabi (pa)
- [ ] Bengali (bn)
- [ ] Marathi (mr)
- [ ] Telugu (te)
- [ ] Tamil (ta)
- [ ] Gujarati (gu)

### Step 4: Testing
- [ ] Each page loads with t() functions
- [ ] Language switching works on each page
- [ ] No console errors in browser
- [ ] All UI strings update when language changes
- [ ] Accessibility labels are translatable

---

## TRANSLATION PRIORITIES BY IMPACT

### Highest Impact (Do First)
1. Navigation items (users see this immediately)
2. Form labels (needed for any data entry)
3. Button text (users need to understand actions)
4. Error messages (critical for UX)

### Medium Impact (Do Second)
1. Table headers and column labels
2. Section titles and headings
3. Status and badge labels
4. Filter options

### Lower Impact (Do Last)
1. Descriptions and subtitles
2. Info messages
3. Toast notifications
4. Accessibility labels

---

## NOTES FOR TRANSLATORS

1. **Maintain Context**: Some strings have parameters (e.g., {name}, {ward}) - these should NOT be translated, only the surrounding text
2. **Keep Consistency**: Use consistent terminology across all languages
3. **Test Readability**: Translated strings should fit within UI constraints (especially tables, buttons, badges)
4. **Cultural Adaptation**: Some strings may need cultural adjustment per language
5. **Number Formats**: Use locale-appropriate number/currency formats
6. **Date Formats**: Ensure date formats match regional preferences
7. **Gender Forms**: Hindi/other languages may need gender-specific forms
8. **Formal vs Casual**: Maintain the same tone/formality across all languages
