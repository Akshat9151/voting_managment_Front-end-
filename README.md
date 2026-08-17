# ElectWin – Election Campaign OS & War Room (React + TypeScript)

> Modern, robust, and mobile-first Election Campaign Management & War Room Dashboard for Gram Panchayat and Ward Elections.

---

## 🌟 Overview & Architecture

ElectWin has been migrated from vanilla HTML/CSS/JS to a component-driven, fully typed **React 18 + TypeScript + Vite + Tailwind CSS** single-page application.

### Key Capabilities:
- 🏛️ **Role-Based Hierarchy Engine**: Single-account role switching (*Super Admin > Admin > Volunteer*) with customized permissions and instant live UI views.
- 🗺️ **Interactive 3D/Vector Radar Booth Map**: Interactive ward map with pan, zoom, radar pulses, sensitive booth alerts, and voter turnout targets.
- 🎨 **Searchable Design Studio**: 50+ official Election Commission symbols, 14 poster layouts, 16 categorized print/digital formats, dynamic HTML5 canvas poster rendering, and high-res PNG export.
- 📱 **Smart Broadcast Center**: Live audience split calculation (WhatsApp vs SMS Fallback), message template variables (`{{name}}`, `{{ward}}`, `{{booth}}`, `{{symbol}}`), interactive phone screen simulator, and delivery logs.
- 👥 **Voter Roll & OCR Scanner**: Audience segmentation (*All, WhatsApp, SMS Only, Youth 18-25, Women SHG, Missing Mobile*), CSV/PDF upload, simulated camera OCR slip scanner with editable staged review table, and CSV export.
- 📋 **Booth Operations & Panna Roster**: Polling stations (Booths 01 to 06) with incharge assignments, slip distribution tracker, and volunteer productivity metrics.
- ⚖️ **Citizen Grievance Ledger**: Real-time issue tracking (Water, Roads, Power, Sanitation) with status transitions (*Open, In Progress, Resolved*).
- 💰 **EC Statutory Expense Tracker**: Gram Panchayat ceiling (₹1,50,000 budget limit) with live spent vs. remaining calculations and receipt logging.
- 📊 **Turnout Analytics & Forecast**: Ward reach bar graphs, WhatsApp/SMS doughnut breakdown, campaign material print metrics, and victory margin simulator.
- 📍 **Dedicated Mobile Field Volunteer Desk**: Ward 02 dedicated desk with one-tap status buttons (*Called, Visited, Unreached*), direct phone dial links (`tel:`), and panna voter slip distribution checkboxes.
- 🌐 **Multi-Language (i18n)**: Instant live switching between 8 Indian languages (English, Hindi, Punjabi, Bengali, Marathi, Telugu, Tamil, Gujarati).
- 🎨 **Dynamic Theme Customizer**: Instant theme styling across Sky Blue, Royal Violet, Victory Mint, Saffron Amber, and Crimson Rose.

---

## 📱 Mobile Responsiveness Standards

ElectWin is engineered following modern e-commerce mobile polish (Amazon/Flipkart standards):
- **Mobile (375px+)**: Sticky bottom quick bar (`MobileQuickBar`), slide-over drawer (`Sidebar`), dense cards, and min 44px touch targets.
- **Tablet (768px+)**: Fluid responsive multi-column grids and balanced layout drawers.
- **Desktop (1280px+)**: Sticky top bar, persistent collapsible sidebar, full-scale 3D radar canvas, and dual-column studio canvas views.

---

## 🔌 FastAPI Backend Readiness (`src/services/api.ts`)

The central `src/services/api.ts` file is fully typed and structured so that replacing mock calls with real `fetch` / `axios` endpoints to a FastAPI backend is a drop-in replacement without altering component code.

```typescript
// Example: src/services/api.ts
export const api = {
  getVoters: async (): Promise<Voter[]> => { ... },
  addVoter: async (voter: Omit<Voter, 'id'>): Promise<Voter> => { ... },
  getCandidates: async (): Promise<Candidate[]> => { ... },
  sendBroadcast: async (payload: BroadcastPayload): Promise<{ success: boolean }> => { ... },
  // Plug in FastAPI endpoints:
  // const res = await fetch(`${BASE_URL}/voters`);
  // return res.json();
};
```

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173`.

### 3. Production Build & Verification
```bash
npm run build
```

---

## 📁 Project Folder Structure

```
electwin-dashboard/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/                 # Strict TypeScript interfaces
    ├── context/               # Auth, Language, Theme, Toast providers
    ├── services/              # api.ts and mockData.ts
    ├── hooks/                 # Custom React hooks
    ├── components/
    │   ├── layout/            # Navbar, Sidebar, MobileQuickBar, Modals
    │   ├── ui/                # Button, Card, StatCard, Badge, Modal, FormInput, Select, Dropzone
    │   ├── studio/            # PosterCanvas component
    │   ├── broadcast/         # PhonePreview simulator component
    │   └── map/               # InteractiveBoothMap radar component
    └── pages/                 # All 15 migrated application pages
```

---

## 📄 License & Repository
- Repository: [https://github.com/Akshat9151/voting_managment](https://github.com/Akshat9151/voting_managment)
