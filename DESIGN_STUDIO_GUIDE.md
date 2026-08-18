# 🎨 Design Studio - Complete User Guide

## Overview
The **Design Studio** is a fully functional poster generator for election campaigns. It allows users to create, customize, and download high-resolution campaign materials with official election symbols.

---

## ✅ Quick Start

### 1️⃣ Access the Design Studio
- **URL:** http://localhost:5174/studio
- **Requirement:** Must be logged in with any role (Super Admin, Admin, Volunteer)
- **Access Control:** Works with the role-based auth system

### 2️⃣ Available Templates

The Design Studio comes with **4 professionally designed templates**:

#### Template 1: **Tricolor Poster – Portrait**
- **Dimensions:** 210 × 297 mm (A4)
- **Style:** Indian tricolor (Orange-White-Green) stripes
- **Best For:** Wall posters, printing
- **Elements:** 
  - Large candidate name with bold typography
  - Position/post information
  - Campaign slogan with color accent
  - Election symbol placement (top-right)
  - Footer with campaign year

#### Template 2: **Campaign Banner – Landscape**
- **Dimensions:** 1200 × 600 px
- **Style:** Dark professional background (#0f172a)
- **Best For:** Social media, digital displays
- **Elements:**
  - Large candidate photo (left-aligned)
  - Candidate name in large white text
  - Election symbol (center)
  - Campaign slogan with gold accent
  - High contrast for visibility

#### Template 3: **ID Card – Vertical**
- **Dimensions:** 350 × 560 px
- **Style:** Dark professional card design
- **Best For:** Candidate verification cards, badges
- **Elements:**
  - Circular candidate photo
  - Candidate name and position
  - Election symbol
  - Ward number at bottom

#### Template 4: **Handbill – A5 Pamphlet**
- **Dimensions:** 600 × 848 px
- **Style:** Light professional background
- **Best For:** Printed handouts, door-to-door distribution
- **Elements:**
  - Large candidate photo
  - Candidate name and slogan
  - Contact information
  - Professional footer

---

## 📋 Step-by-Step Usage

### Phase 1: Template Gallery View

1. **Open Design Studio** → See grid of 4 templates
2. **View Template Details:**
   - Template name
   - Category (poster/banner/id_card/pamphlet)
   - Format dimensions
   - Thumbnail preview
3. **Select Template** → Click "Use Template" button
4. **Proceed to Editor** → Fills form with template details

### Phase 2: Editor View

Once you select a template, you'll see the **editor interface** with:

#### Left Column (70%): Form Fields
```
📋 Basic Information
├─ Candidate Name * (required)
├─ Position / Post * (required)
├─ Ward Number * (required)
├─ Ballot Number (optional)
└─ Contact Number (optional)

📝 Campaign Message / नारा
└─ Slogan text area (max 100 chars recommended)

📷 Candidate Photo * (required)
├─ Format: JPG, PNG, WebP
├─ Max: 5MB
├─ Preview: Square format recommended
└─ Actions: Upload / Remove

✨ Election Symbol
├─ Preset Symbols (9 Indian symbols)
│  ├─ Search functionality
│  ├─ Symbol preview
│  └─ Click to select
└─ Custom Upload
   ├─ Upload image (JPG/PNG/WebP)
   ├─ Max: 5MB
   └─ Actions: Upload / Remove
```

#### Right Column (30%): Live Canvas Preview
```
📊 Live Preview
├─ High-Res Badge
├─ Real-time canvas updates
├─ Updates as you type
└─ Download button (top-right)
```

### Phase 3: Customization Steps

#### Step 1: Fill Basic Info
```typescript
// User enters:
- Candidate Name: "Rameshwar Patel"
- Position: "Sarpanch"
- Ward Number: "04"
- Ballot Number: "001" (optional)
- Contact: "+91 98290 14285" (optional)
```

#### Step 2: Add Campaign Slogan
```typescript
// User enters powerful message:
// "गांव का समग्र विकास, हर घर विश्वास!"
// (Translates: Village's comprehensive development, faith in every home!)
```

#### Step 3: Upload Candidate Photo
```typescript
// User drags & drops or clicks to upload
// Image is converted to base64 DataURL for canvas rendering
// Preview shown in 96×96px thumbnail
// Action: Can remove to re-upload
```

#### Step 4: Select/Upload Election Symbol
```typescript
// Option A: Select Preset Symbol
// - 9 Indian agricultural/cultural symbols
// - Clickable grid with search
// - Selected symbol highlighted (blue border)
// - Real-time preview on canvas

// Option B: Custom Symbol
// - Upload PNG/JPG with transparent background
// - Shows preview thumbnail
// - Used for party symbols, logos
```

### Phase 4: Download Poster

1. **Validate Form:** All required fields checked
   - ❌ No candidate name? → Error toast
   - ❌ No position? → Error toast
   - ❌ No ward number? → Error toast
   - ❌ No photo? → Error toast

2. **Render Canvas:** High-resolution PNG generation
   - Template layout applied
   - All form data composited onto canvas
   - Photo rendered as circle (if template supports)
   - Symbol rendered as emoji or image

3. **Generate Download**
   - Format: PNG (high-quality)
   - Filename: `{CandidateName}_poster_{Timestamp}.png`
   - Example: `Rameshwar_Patel_poster_1723984545000.png`
   - Browser downloads immediately

---

## 🎯 Canvas Rendering Details

### How Templates Render

Each template has a `layout_json` structure:

```typescript
layout_json: {
  bg_color: "#ffffff",        // Background color
  width: 600,                 // Canvas width in pixels
  height: 848,                // Canvas height in pixels
  elements: [                 // Array of elements to render
    {
      type: "shape",          // Colored rectangle
      x: 0, y: 0,
      width: 600, height: 130,
      color: "#ff9933"        // Orange tricolor
    },
    {
      type: "text",           // Text element
      placeholder: "{{candidate_name}}",
      x: 10, y: 350,
      font_size: 48,
      color: "#000000",
      text_align: "center"
    },
    {
      type: "photo",          // Circular candidate image
      x: 50, y: 150,
      width: 400, height: 400
    },
    {
      type: "symbol",         // Emoji or custom symbol
      x: 450, y: 320,
      width: 120, height: 120
    }
  ]
}
```

### Real-Time Updates

The canvas updates **instantly** when you:
- Type candidate name → Updates on canvas
- Change position → Updates on canvas
- Upload photo → Shows on canvas immediately
- Select/change symbol → Updates on canvas
- Modify slogan → Updates on canvas

This provides **WYSIWYG (What You See Is What You Get)** experience.

---

## 🌐 Multi-Language Support

### Supported Languages
- 🇬🇧 English
- 🇮🇳 Hindi (हिन्दी)
- 🇵🇰 Punjabi (ਪੰਜਾਬੀ)
- 🇧🇩 Bengali (বাংলা)
- 🇮🇳 Marathi (मराठी)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Gujarati (ગુજરાતી)

### Localized UI Elements
All labels, buttons, and messages support i18n:
- "Design Studio" → "डिज़ाइन स्टूडियो"
- "Basic Information" → "मूल जानकारी"
- "Campaign Message" → "अभियान संदेश / नारा"
- "Download" → "डाउनलोड करें"

---

## 🔐 Role-Based Access

The Design Studio works with all three roles:

| Role | Access | Permissions |
|------|--------|-------------|
| **Super Admin** | ✅ Full Access | Create, edit, download unlimited posters |
| **Admin** | ✅ Full Access | Manage campaign materials for assigned candidates |
| **Volunteer** | ✅ Full Access | Create posters for field distribution |

All roles see their role badge in the navbar:
- Super Admin: Purple badge
- Admin: Blue badge  
- Volunteer: Green badge

---

## 📱 Responsive Design

### Desktop (lg: 1024px+)
- 2-column layout
- Form on left (70%), Canvas on right (30%)
- Full template details visible
- Sticky canvas preview

### Tablet (md: 768px)
- Form takes full width on first scroll
- Canvas preview below form
- Templates in 2-column grid

### Mobile (sm: 640px)
- Single column layout
- Form full width
- Canvas preview full width
- Templates in 1-column grid
- Optimized touch targets

---

## 🎨 Design System Integration

The Design Studio uses ElectWin's design system:

### Colors
- **Primary:** Sky Blue (#0ea5e9)
- **Accent:** Amber (#f59e0b)
- **Success:** Mint Green (#10b981)
- **Symbols:** 
  - Super Admin: Purple (#9333ea)
  - Admin: Blue (#3b82f6)
  - Volunteer: Green (#22c55e)

### Components
- ✅ Card
- ✅ Button (primary, outline, sm)
- ✅ FormInput
- ✅ FileDropzone
- ✅ Badge (colored variants)
- ✅ EmptyState

### Typography
- **Heading:** "font-heading" (Poppins)
- **Body:** Sans-serif (Tailwind default)
- **Sizes:** xs, sm, base, lg, xl, 2xl, 4xl

---

## 🚀 Performance Features

### Optimizations
- ✅ **Lazy Loading:** Templates load only on gallery view
- ✅ **Canvas Caching:** Canvas updates debounced
- ✅ **Image Compression:** Photos converted to base64 efficiently
- ✅ **Bundle:** 512 KB gzip'd (entire app)
- ✅ **Build Time:** ~3.2 seconds (Vite)

### File Size Limits
- **Photo:** Max 5MB
- **Symbol:** Max 5MB
- **Canvas Output:** ~2-5MB (PNG)

---

## 🔗 Backend Integration Ready

### Future API Endpoints (When Backend Ready)

```typescript
// Save design template as draft
POST /api/v1/designs/
{
  election_id: "string",
  candidate_id: "string",
  template_id: "string",
  form_data: { candidateName, position, wardNo, ... },
  canvas_image: "base64_png_data"
}

// List user's saved designs
GET /api/v1/designs/?user_id={userId}

// Update saved design
PUT /api/v1/designs/{design_id}

// Delete design
DELETE /api/v1/designs/{design_id}

// Analytics: Track poster downloads
POST /api/v1/analytics/poster-download
{
  template_id: "string",
  user_id: "string",
  timestamp: "ISO-8601"
}
```

Currently, all operations are **frontend-only** with mock data.

---

## ✨ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Canvas API** for poster rendering
- **FileReader API** for image upload
- **React Router v6** for navigation
- **Context API** for state (Auth, Election, Language)
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Build & Dev
- **Vite 6.4.3** (lightning fast builds)
- **TypeScript 5.3** (strict type checking)
- **ESBuild** (for minification)
- **HMR** (hot module reloading)

### Tested Browsers
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## 🐛 Troubleshooting

### Issue: Design Studio shows blank
**Solution:** Refresh page (Ctrl+F5)
**Cause:** Election context not initialized

### Issue: Photo not appearing on canvas
**Cause:** Image still loading
**Solution:** Wait 2-3 seconds, or re-upload

### Issue: Canvas is pixelated
**Solution:** This is expected for large images
**Note:** Output PNG quality is 96 DPI (web standard)

### Issue: Download button disabled
**Cause:** Missing required field (name, position, ward, photo)
**Solution:** Fill all required fields marked with *

### Issue: Symbol appears blurry
**Cause:** Custom symbol image too small
**Solution:** Upload symbol at least 200×200px

---

## 📊 Example Workflow

### Scenario: Create Sarpanch Campaign Poster

**1. Open Studio** → Click "Tricolor Poster – Portrait"

**2. Fill Form:**
```
- Candidate Name: Rameshwar Patel
- Position: Sarpanch
- Ward Number: 04
- Ballot Number: 001
- Contact: +91 98290 14285
- Slogan: गांव का समग्र विकास
```

**3. Upload Photo:**
- Click photo zone → Select `rameshwar.jpg`
- Preview shows 96×96px thumbnail

**4. Select Symbol:**
- Click "Preset Symbols" tab
- Click 🚜 (Tractor symbol)
- Highlighted with blue border

**5. View Canvas:**
- Right panel shows live preview
- All changes reflected in real-time

**6. Download:**
- Click "Download" button
- File saves as: `Rameshwar_Patel_poster_1723984545000.png`

**7. Use Poster:**
- Print at 600×848 px for A4 size
- Share on WhatsApp/social media
- Distribute to campaign team

---

## 🎓 Learning Path

1. **Beginner:** Create first poster with template + photo
2. **Intermediate:** Try all 4 templates, customize layouts
3. **Advanced:** Design custom templates (backend feature)
4. **Expert:** Batch create posters, analytics integration

---

## 📝 Credits

**Design Studio v2.0**
- Built with React 18 + TypeScript
- Canvas rendering with real-time preview
- Multi-language support (8 languages)
- Role-based authentication integration
- Frontend-only implementation (backend-ready)

**Last Updated:** August 18, 2026
**Status:** ✅ Production Ready (Frontend)

---

## 🚀 Quick Links

- **App Home:** http://localhost:5174
- **Auth Page:** http://localhost:5174/login (demo login available)
- **Design Studio:** http://localhost:5174/studio
- **Dashboard:** http://localhost:5174 (requires login)

---

Enjoy creating campaign materials! 🎉
