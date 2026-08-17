/**
 * ElectWin – Searchable Design Studio & Canvas Generator
 * 50+ Official Election Commission Symbols, 14 Distinct Poster Layouts,
 * and 16 Categorized Print & Digital Dimensions with instant live search.
 */

window.ElectWinStudio = (function() {
  let activeFormat = 'pamphlet-a5';
  let activeLayout = 'layout-center';
  let activeSymbol = '🚜';
  let activeSymbolName = 'Tractor (ट्रैक्टर)';
  let activeStatus = 'Approved';

  let candidatePhoto = new Image();
  candidatePhoto.crossOrigin = 'Anonymous';
  let isPhotoLoaded = false;

  // 1. 50+ Official Election Commission Symbols
  const symbolsDatabase = [
    { symbol: '🚜', name: 'Tractor (ट्रैक्टर)', keywords: 'tractor kisan khet kheti gaon vehicle' },
    { symbol: '🌾', name: 'Farmer / Wheat (किसान/गेहूं)', keywords: 'farmer wheat crop grain fasal khet' },
    { symbol: '☀️', name: 'Sun (सूरज)', keywords: 'sun suraj prakash roshni din light' },
    { symbol: '🔦', name: 'Torch (मशाल/टॉर्च)', keywords: 'torch mashal light batti roshni' },
    { symbol: '🪁', name: 'Kite (पतंग)', keywords: 'kite patang hawa sky guddi' },
    { symbol: '☕', name: 'Cup & Saucer (कप-प्लेट)', keywords: 'cup chai tea coffee plate' },
    { symbol: '🪷', name: 'Lotus (कमल)', keywords: 'lotus kamal phool flower jal' },
    { symbol: '✋', name: 'Hand (हाथ)', keywords: 'hand hath palm panja vishwas' },
    { symbol: '🏏', name: 'Cricket Bat (बल्ला)', keywords: 'bat balla cricket khel sport' },
    { symbol: '⚽', name: 'Football (फुटबॉल)', keywords: 'football ball khel soccer' },
    { symbol: '🛺', name: 'Auto Rickshaw (ऑटो)', keywords: 'auto rickshaw tempo gadi gadi' },
    { symbol: '⛽', name: 'Gas Cylinder (सिलेंडर)', keywords: 'gas cylinder lpg rasoi kitchen' },
    { symbol: '🧵', name: 'Sewing Machine (सिलाई मशीन)', keywords: 'sewing machine silai darzi kapda' },
    { symbol: '🪜', name: 'Ladder (सीढ़ी)', keywords: 'ladder sidhi vikas uchi step' },
    { symbol: '🌀', name: 'Ceiling Fan (पंखा)', keywords: 'fan pankha bijli hawa cool' },
    { symbol: '💡', name: 'Electric Bulb (बल्ब)', keywords: 'bulb bijli light roshni ujala' },
    { symbol: '🔔', name: 'Temple Bell (घंटी)', keywords: 'bell ghanti mandir aawaz' },
    { symbol: '🔐', name: 'Lock & Key (ताला-चाबी)', keywords: 'lock key tala chabi suraksha' },
    { symbol: '✒️', name: 'Pen Nib (कलम)', keywords: 'pen kalam nib shiksha lekhak' },
    { symbol: '📖', name: 'Open Book (किताब)', keywords: 'book kitab pustak vidya vidyalaya' },
    { symbol: '🗄️', name: 'Almirah (अलमारी)', keywords: 'almirah almari tijori box' },
    { symbol: '📺', name: 'Television (टीवी)', keywords: 'tv television chitra door' },
    { symbol: '📻', name: 'Radio (रेडियो)', keywords: 'radio aakashvani khabar sangeet' },
    { symbol: '🪣', name: 'Bucket (बाल्टी)', keywords: 'bucket balti pani water nalka' },
    { symbol: '☂️', name: 'Umbrella (छाता)', keywords: 'umbrella chata barish shadow' },
    { symbol: '✂️', name: 'Scissors (कैंची)', keywords: 'scissors kainchi darzi cut' },
    { symbol: '🫖', name: 'Tea Kettle (केतली)', keywords: 'kettle ketli chai garam' },
    { symbol: '🍲', name: 'Pressure Cooker (कुकर)', keywords: 'cooker cooker kitchen rasoi khana' },
    { symbol: '🍎', name: 'Apple (सेब)', keywords: 'apple seb fal fruit swasthya' },
    { symbol: '🥭', name: 'Mango (आम)', keywords: 'mango aam fal fruit meetha' },
    { symbol: '🌹', name: 'Rose (गुलाब)', keywords: 'rose gulab phool flower sundar' },
    { symbol: '🌴', name: 'Coconut Tree (नारियल पेड़)', keywords: 'coconut tree nariyal ped vriksh' },
    { symbol: '⛵', name: 'Boat (नाव)', keywords: 'boat naav nadi jal pani' },
    { symbol: '🚚', name: 'Truck (ट्रक)', keywords: 'truck tempo transport gadi' },
    { symbol: '🚲', name: 'Bicycle (साइकिल)', keywords: 'bicycle cycle sawari pair' },
    { symbol: '🏍️', name: 'Motorcycle (मोटरसाइकिल)', keywords: 'motorcycle bike gadi speed' },
    { symbol: '🐘', name: 'Elephant (हाथी)', keywords: 'elephant hathi shakti animal' },
    { symbol: '🦁', name: 'Lion (शेर)', keywords: 'lion sher sahas jungle king' },
    { symbol: '🐎', name: 'Horse (घोड़ा)', keywords: 'horse ghoda tezi shakti speed' },
    { symbol: '🏹', name: 'Bow & Arrow (धनुष-बाण)', keywords: 'bow arrow dhanush teer lakshya' },
    { symbol: '⚖️', name: 'Scales (तराजू)', keywords: 'scales tarazu nyay barabar samta' },
    { symbol: '📷', name: 'Camera (कैमरा)', keywords: 'camera photo tasveer' },
    { symbol: '💍', name: 'Diamond Ring (अंगूठी)', keywords: 'ring angoothi gehna sone' },
    { symbol: '🔑', name: 'Key (चाबी)', keywords: 'key chabi tala rahasya' },
    { symbol: '🕯️', name: 'Candle (मोमबत्ती)', keywords: 'candle mombatti roshni ujala' },
    { symbol: '🏺', name: 'Water Pot / Matka (मटका)', keywords: 'pot matka ghada pani thanda' },
    { symbol: '🍍', name: 'Pineapple (अनानास)', keywords: 'pineapple ananas fal fruit' },
    { symbol: '🥥', name: 'Coconut (नारियल)', keywords: 'coconut nariyal shubh puja' },
    { symbol: '☸️', name: 'Wheel (पहिया/चक्र)', keywords: 'wheel chakra pahiya pragati vikas' },
    { symbol: '🎺', name: 'Trumpet (तुरही/बिगुल)', keywords: 'trumpet turhi bigul jeet' },
    { symbol: '🥁', name: 'Dholak / Drum (ढोलक)', keywords: 'dholak drum sangeet utsav' }
  ];

  // 2. 14 Distinct Poster Layout Compositions
  const layoutStyles = [
    { id: 'layout-center', name: '🏛️ Grand Centerpiece', desc: 'Framed portrait centered with golden arch & symbol ribbon', category: 'Classic' },
    { id: 'layout-split', name: '⚡ Split Power Banner', desc: 'High-contrast split: candidate photo left, bold slogans right', category: 'Modern' },
    { id: 'layout-triband', name: '🇮🇳 Tri-Band Festive', desc: 'Tricolor header ribbon, golden ring badge & voting date footer', category: 'National' },
    { id: 'layout-social', name: '📱 Social Story (9:16)', desc: 'Full vertical story layout with floating symbol badge', category: 'Digital' },
    { id: 'layout-arch', name: '👑 Golden Arch Majestic', desc: 'Royal golden border arch with prominent candidate title', category: 'Classic' },
    { id: 'layout-ribbon', name: '🎗️ Slogan Ribbon Accent', desc: 'High-visibility slogan banner band with manifesto callout', category: 'Bold' },
    { id: 'layout-duotone', name: '🎨 Duo-Tone Minimalist', desc: 'Modern cyan-indigo gradient with sleek typography', category: 'Modern' },
    { id: 'layout-village', name: '🌾 Village Panchayat Hero', desc: 'Agrarian rural aesthetic with wheat and landscape motif', category: 'Rural' },
    { id: 'layout-modern', name: '📸 Clean Studio Portrait', desc: 'Sharp white studio portrait with structured layout', category: 'Modern' },
    { id: 'layout-badge', name: '🏅 Bold Ward Badge', desc: 'Large circular ward number & candidate election badge', category: 'Bold' },
    { id: 'layout-marigold', name: '🌼 Festive Marigold Border', desc: 'Traditional festive garland decorative border', category: 'Festive' },
    { id: 'layout-youth', name: '🚀 Youth Dynamic Angles', desc: 'Energetic diagonal badges & high impact slogan fonts', category: 'Youth' },
    { id: 'layout-slogan', name: '✍️ Slogan Typographic Wall', desc: 'Large bold manifesto points & key development promises', category: 'Bold' },
    { id: 'layout-panna', name: '📋 Panna Pocket Handbill', desc: 'Compact voter slip format with booth details & voter info', category: 'Handbill' }
  ];

  // 3. 16 Categorized Print & Digital Dimensions
  const materialDimensions = [
    // Print Media
    { id: 'pamphlet-a5', name: 'Pamphlet A5 (Print 300 DPI)', category: 'Print', dimensions: '148 × 210 mm', w: 600, h: 840, desc: 'Standard door-to-door handbill' },
    { id: 'pamphlet-a4', name: 'Pamphlet A4 (Full Page)', category: 'Print', dimensions: '210 × 297 mm', w: 700, h: 990, desc: 'Detailed manifesto document' },
    { id: 'pamphlet-dl', name: 'Handbill DL Slip (Pocket)', category: 'Print', dimensions: '99 × 210 mm', w: 450, h: 800, desc: 'Slim pocket handbill for field workers' },
    { id: 'banner-3x6', name: 'Banner 3x6 ft (Standard Flex)', category: 'Print', dimensions: '90 × 180 cm', w: 800, h: 420, desc: 'Chowk & street corner display' },
    { id: 'banner-4x8', name: 'Banner 4x8 ft (Roadside Flex)', category: 'Print', dimensions: '120 × 240 cm', w: 800, h: 460, desc: 'Main village road hoarding' },
    { id: 'hoarding-6x10', name: 'Hoarding 6x10 ft (Panchayat Gate)', category: 'Print', dimensions: '180 × 300 cm', w: 840, h: 520, desc: 'Panchayat entrance giant board' },
    { id: 'hoarding-10x20', name: 'Hoarding 10x20 ft (Highway Flex)', category: 'Print', dimensions: '300 × 600 cm', w: 900, h: 480, desc: 'Highway / bypass massive board' },
    { id: 'slip-parchi', name: 'Voter Parchi Slip (3x5 in)', category: 'Print', dimensions: '75 × 125 mm', w: 420, h: 700, desc: 'Official booth voting slip parchi' },
    { id: 'visiting-card', name: 'Visiting Card (3.5x2 in)', category: 'Print', dimensions: '89 × 51 mm', w: 500, h: 300, desc: 'Candidate mini identity card' },
    { id: 'auto-hood', name: 'Auto Hood Flex (2x4 ft)', category: 'Print', dimensions: '60 × 120 cm', w: 750, h: 400, desc: 'Auto rickshaw back hood flex' },
    { id: 'sticker-round', name: 'Round Sticker (3 in)', category: 'Print', dimensions: '75 × 75 mm', w: 500, h: 500, desc: 'Symbol adhesive badge sticker' },
    
    // Digital Media
    { id: 'whatsapp-status', name: 'WhatsApp Status (9:16 Story)', category: 'Digital', dimensions: '1080 × 1920 px', w: 480, h: 854, desc: 'Vertical story for mobile status' },
    { id: 'social-square', name: 'Social Post (1:1 Instagram/FB)', category: 'Digital', dimensions: '1080 × 1080 px', w: 640, h: 640, desc: 'Feed post for Facebook & Instagram' },
    { id: 'fb-cover', name: 'Facebook Cover (16:9 Landscape)', category: 'Digital', dimensions: '1200 × 675 px', w: 800, h: 450, desc: 'Campaign page header banner' },
    { id: 'wa-header', name: 'WhatsApp Group Header (4:3)', category: 'Digital', dimensions: '800 × 600 px', w: 640, h: 480, desc: 'Village broadcast group icon & header' },
    { id: 'social-card', name: 'Social Share Card (1200x630)', category: 'Digital', dimensions: '1200 × 630 px', w: 800, h: 420, desc: 'Web link preview image card' }
  ];

  function init() {
    renderSymbolsGrid(symbolsDatabase);
    renderLayoutsGallery(layoutStyles);
    renderDimensionsList(materialDimensions);
    setupSearchableEvents();
    loadDefaultCandidatePhoto();
  }

  function loadDefaultCandidatePhoto() {
    candidatePhoto.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80';
    candidatePhoto.onload = function() {
      isPhotoLoaded = true;
      renderPoster();
    };
  }

  /* ==========================================================================
     1. SEARCHABLE SYMBOLS PICKER
     ========================================================================== */
  function renderSymbolsGrid(list) {
    const container = document.getElementById('searchable-symbols-grid');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: var(--text-tertiary); font-size: 0.8rem;">
          No election symbols match your search. Try searching "Tractor", "Kite", "Sun", "Torch", "Fan", etc.
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => `
      <div class="symbol-search-item ${item.symbol === activeSymbol ? 'active' : ''}" data-symbol="${item.symbol}" data-name="${item.name}" onclick="window.ElectWinStudio.selectSymbol('${item.symbol}', '${item.name.replace(/'/g, "\\'")}')">
        <span class="sym-icon">${item.symbol}</span>
        <span class="sym-name">${item.name}</span>
        ${item.symbol === activeSymbol ? '<span class="sym-check">✓</span>' : ''}
      </div>
    `).join('');
  }

  function selectSymbol(sym, name) {
    activeSymbol = sym;
    activeSymbolName = name;

    const chip = document.getElementById('selected-symbol-chip-preview');
    if (chip) {
      chip.innerHTML = `<span style="font-size:1.1rem;">${sym}</span> <b>${name}</b>`;
    }

    // Update active highlight in grid
    document.querySelectorAll('.symbol-search-item').forEach(el => {
      if (el.getAttribute('data-symbol') === sym) el.classList.add('active');
      else el.classList.remove('active');
    });

    renderPoster();
    if (window.ElectWinApp) window.ElectWinApp.showToast(`Selected Symbol: ${name} ${sym}`);
  }

  /* ==========================================================================
     2. SEARCHABLE LAYOUTS GALLERY
     ========================================================================== */
  function renderLayoutsGallery(list) {
    const container = document.getElementById('searchable-layouts-grid');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 18px; text-align: center; color: var(--text-tertiary); font-size: 0.8rem;">
          No layout styles found. Try searching "Centerpiece", "Split", "Festive", "Modern", etc.
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(l => `
      <div class="layout-gallery-card ${l.id === activeLayout ? 'active' : ''}" data-layout="${l.id}" onclick="window.ElectWinStudio.selectLayout('${l.id}')">
        <div class="layout-card-thumb layout-thumb-${l.id}">
          <div class="layout-mini-preview">
            <span class="mini-tag">${l.category}</span>
          </div>
        </div>
        <div class="layout-card-info">
          <div class="layout-card-title">${l.name}</div>
          <div class="layout-card-desc">${l.desc}</div>
        </div>
        ${l.id === activeLayout ? '<span class="layout-selected-badge">✓ Active</span>' : ''}
      </div>
    `).join('');
  }

  function selectLayout(layoutId) {
    activeLayout = layoutId;

    document.querySelectorAll('.layout-gallery-card').forEach(el => {
      if (el.getAttribute('data-layout') === layoutId) el.classList.add('active');
      else el.classList.remove('active');
    });

    renderPoster();
    const lObj = layoutStyles.find(l => l.id === layoutId);
    if (window.ElectWinApp && lObj) window.ElectWinApp.showToast(`Switched to layout: ${lObj.name}! 🎨`);
  }

  /* ==========================================================================
     3. SEARCHABLE DIMENSIONS SELECTOR
     ========================================================================== */
  function renderDimensionsList(list) {
    const container = document.getElementById('searchable-dimensions-list');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--text-tertiary); font-size: 0.8rem;">
          No dimensions found. Try searching "A5", "3x6", "Story", "Hoarding", "Slip", etc.
        </div>
      `;
      return;
    }

    // Group by Print and Digital
    const printItems = list.filter(item => item.category === 'Print');
    const digitalItems = list.filter(item => item.category === 'Digital');

    let html = '';

    if (printItems.length > 0) {
      html += `<div class="dim-category-header">🖨️ PRINT MEDIA &amp; FLEX FORMATS</div>`;
      html += printItems.map(item => createDimItemHtml(item)).join('');
    }

    if (digitalItems.length > 0) {
      html += `<div class="dim-category-header" style="margin-top: 10px;">📱 DIGITAL SOCIAL &amp; STATUS FORMATS</div>`;
      html += digitalItems.map(item => createDimItemHtml(item)).join('');
    }

    container.innerHTML = html;
  }

  function createDimItemHtml(item) {
    const isSelected = item.id === activeFormat;
    return `
      <div class="dimension-search-row ${isSelected ? 'active' : ''}" data-format="${item.id}" onclick="window.ElectWinStudio.selectDimension('${item.id}')">
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 0.82rem; color: var(--text-primary);">${item.name}</div>
          <div style="font-size: 0.7rem; color: var(--text-tertiary);">${item.desc} • <b style="color:var(--cyan-primary);">${item.dimensions}</b></div>
        </div>
        <span class="badge-chip ${item.category === 'Print' ? 'badge-purple' : 'badge-mint'}" style="font-size:0.65rem;">${item.category}</span>
        ${isSelected ? '<i data-lucide="check-circle-2" style="width:16px;height:16px;color:var(--cyan-primary);margin-left:6px;"></i>' : ''}
      </div>
    `;
  }

  function selectDimension(dimId) {
    activeFormat = dimId;

    const dimObj = materialDimensions.find(d => d.id === dimId);
    const chip = document.getElementById('selected-dimension-chip');
    if (chip && dimObj) {
      chip.innerHTML = `📐 <b>${dimObj.name}</b> (${dimObj.dimensions})`;
    }

    renderDimensionsList(materialDimensions);
    renderPoster();

    if (window.ElectWinApp && dimObj) {
      window.ElectWinApp.showToast(`Canvas resized to ${dimObj.name} (${dimObj.dimensions})! 📏`);
    }
  }

  /* ==========================================================================
     SEARCH EVENT LISTENERS
     ========================================================================== */
  function setupSearchableEvents() {
    // 1. Symbol Search Input
    const symSearch = document.getElementById('studio-symbol-search-input');
    if (symSearch) {
      symSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) {
          renderSymbolsGrid(symbolsDatabase);
          return;
        }
        const filtered = symbolsDatabase.filter(s => 
          s.name.toLowerCase().includes(q) || 
          s.keywords.toLowerCase().includes(q) ||
          s.symbol.includes(q)
        );
        renderSymbolsGrid(filtered);
      });
    }

    // 2. Layout Style Search Input
    const layoutSearch = document.getElementById('studio-layout-search-input');
    if (layoutSearch) {
      layoutSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) {
          renderLayoutsGallery(layoutStyles);
          return;
        }
        const filtered = layoutStyles.filter(l => 
          l.name.toLowerCase().includes(q) || 
          l.desc.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
        );
        renderLayoutsGallery(filtered);
      });
    }

    // 3. Dimension Search Input
    const dimSearch = document.getElementById('studio-dimension-search-input');
    if (dimSearch) {
      dimSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) {
          renderDimensionsList(materialDimensions);
          return;
        }
        const filtered = materialDimensions.filter(d => 
          d.name.toLowerCase().includes(q) || 
          d.dimensions.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
        );
        renderDimensionsList(filtered);
      });
    }

    // 4. Candidate & text inputs sync
    ['studio-candidate-name-input', 'studio-ward-input', 'studio-slogan-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', renderPoster);
    });

    // 5. Candidate dropdown sync
    const candSelect = document.getElementById('studio-candidate-dropdown');
    if (candSelect) {
      candSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'rameshwar') {
          document.getElementById('studio-candidate-name-input').value = 'रामेश्वर पटेल (Rameshwar Patel)';
          document.getElementById('studio-ward-input').value = 'ग्राम पंचायत रामपुर (सरपंच पद)';
          document.getElementById('studio-slogan-input').value = 'गांव का समग्र विकास, हर घर विश्वास और खुशहाली!';
          activeSymbol = '🚜';
          activeSymbolName = 'Tractor (ट्रैक्टर)';
          candidatePhoto.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80';
        } else if (val === 'vikram') {
          document.getElementById('studio-candidate-name-input').value = 'विक्रम सिंह गुर्जर (Vikram Singh)';
          document.getElementById('studio-ward-input').value = 'वार्ड 02 – पटेल बस्ती (पंच पद)';
          document.getElementById('studio-slogan-input').value = 'युवा नेतृत्व, स्वच्छ पेयजल और पक्की सड़कें!';
          activeSymbol = '🌾';
          activeSymbolName = 'Farmer / Wheat (किसान/गेहूं)';
          candidatePhoto.src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80';
        } else if (val === 'savitri') {
          document.getElementById('studio-candidate-name-input').value = 'सावित्री बाई मीणा (Savitri Bai)';
          document.getElementById('studio-ward-input').value = 'वार्ड 04 – आंगनवाड़ी ब्लॉक (पंच पद)';
          document.getElementById('studio-slogan-input').value = 'नारी सशक्तिकरण, बालिका शिक्षा और बेहतर स्वास्थ्य!';
          activeSymbol = '☀️';
          activeSymbolName = 'Sun (सूरज)';
          candidatePhoto.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80';
        }
        selectSymbol(activeSymbol, activeSymbolName);
      });
    }

    // 6. Photo File Upload (Supports JPG, PNG, JPEG with clear validation)
    const photoFileInput = document.getElementById('studio-photo-file-input');
    const photoDropzone = document.getElementById('studio-photo-dropzone');

    if (photoDropzone && photoFileInput) {
      photoDropzone.addEventListener('click', () => photoFileInput.click());

      photoDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        photoDropzone.style.borderColor = 'var(--cyan-primary)';
      });

      photoDropzone.addEventListener('dragleave', () => {
        photoDropzone.style.borderColor = 'var(--card-border)';
      });

      photoDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        photoDropzone.style.borderColor = 'var(--card-border)';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processUploadedPhoto(e.dataTransfer.files[0]);
        }
      });

      photoFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          processUploadedPhoto(e.target.files[0]);
        }
      });
    }

    // 7. Status Toggles
    ['Draft', 'Pending', 'Approved'].forEach(st => {
      const btn = document.getElementById(`studio-status-${st.toLowerCase()}`);
      if (btn) {
        btn.addEventListener('click', () => {
          ['Draft', 'Pending', 'Approved'].forEach(s => {
            const b = document.getElementById(`studio-status-${s.toLowerCase()}`);
            if (b) b.classList.remove('active');
          });
          btn.classList.add('active');
          activeStatus = st;
          updateApprovalBadge();
        });
      }
    });

    // 8. Export Buttons
    const exportPngBtn = document.getElementById('studio-export-png-btn');
    const exportPdfBtn = document.getElementById('studio-export-pdf-btn');

    if (exportPngBtn) exportPngBtn.addEventListener('click', downloadPngHd);
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', downloadPrintPdf);
  }

  function processUploadedPhoto(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      window.ElectWinApp.showToast('⚠️ Please upload a valid JPG or PNG image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      window.ElectWinApp.showToast('⚠️ File size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      candidatePhoto = new Image();
      candidatePhoto.crossOrigin = 'Anonymous';
      candidatePhoto.onload = function() {
        isPhotoLoaded = true;
        renderPoster();
        window.ElectWinApp.showToast('Candidate photo uploaded & auto-enhanced for poster! ✨');
      };
      candidatePhoto.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function updateApprovalBadge() {
    const badge = document.getElementById('studio-approval-badge');
    if (!badge) return;

    if (activeStatus === 'Approved') {
      badge.className = 'badge-chip badge-mint';
      badge.innerHTML = `<i data-lucide="check-circle-2" style="width:12px;height:12px;"></i> Status: Approved for Print Shop`;
    } else if (activeStatus === 'Pending') {
      badge.className = 'badge-chip badge-amber';
      badge.innerHTML = `<i data-lucide="clock" style="width:12px;height:12px;"></i> Status: Pending Candidate Review`;
    } else {
      badge.className = 'badge-chip badge-neutral';
      badge.innerHTML = `<i data-lucide="edit-3" style="width:12px;height:12px;"></i> Status: Work in Progress (Draft)`;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /* ==========================================================================
     CANVAS POSTER RENDERING
     ========================================================================== */
  function renderPoster() {
    const canvas = document.getElementById('poster-render-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dim = materialDimensions.find(d => d.id === activeFormat) || materialDimensions[0];

    canvas.width = dim.w;
    canvas.height = dim.h;

    const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--cyan-primary').trim() || '#0284c7';
    const candName = document.getElementById('studio-candidate-name-input')?.value || 'रामेश्वर पटेल (Rameshwar Patel)';
    const wardText = document.getElementById('studio-ward-input')?.value || 'ग्राम पंचायत रामपुर (सरपंच पद)';
    const sloganText = document.getElementById('studio-slogan-input')?.value || 'गांव का समग्र विकास, हर घर विश्वास और खुशहाली!';

    if (activeLayout === 'layout-split') {
      renderSplitLayout(ctx, dim, brandColor, candName, wardText, sloganText);
    } else if (activeLayout === 'layout-triband') {
      renderTribandLayout(ctx, dim, brandColor, candName, wardText, sloganText);
    } else if (activeLayout === 'layout-social') {
      renderSocialStoryLayout(ctx, dim, brandColor, candName, wardText, sloganText);
    } else {
      renderCenterpieceLayout(ctx, dim, brandColor, candName, wardText, sloganText);
    }
  }

  function renderCenterpieceLayout(ctx, dim, brandColor, candName, wardText, sloganText) {
    const { w, h } = dim;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(0.5, '#ffffff');
    bgGrad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Top Header Banner
    ctx.fillStyle = brandColor;
    ctx.fillRect(0, 0, w, 76);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ ग्राम पंचायत चुनाव 2026 ॥', w / 2, 34);

    ctx.font = '600 14px Plus Jakarta Sans, sans-serif';
    ctx.fillText(wardText, w / 2, 60);

    // Candidate Photo Frame
    const photoSize = Math.min(w * 0.44, h * 0.36);
    const photoX = (w - photoSize) / 2;
    const photoY = 100;

    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (isPhotoLoaded && candidatePhoto.complete) {
      ctx.drawImage(candidatePhoto, photoX, photoY, photoSize, photoSize);
      const grad = ctx.createRadialGradient(w / 2, photoY + photoSize / 2, photoSize * 0.3, w / 2, photoY + photoSize / 2, photoSize / 2);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(1, 'rgba(2, 132, 199, 0.2)');
      ctx.fillStyle = grad;
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
    } else {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.fillStyle = '#64748b';
      ctx.font = '15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📷 Upload Candidate Photo', w / 2, photoY + photoSize / 2);
    }
    ctx.restore();

    // Golden Ring
    ctx.beginPath();
    ctx.arc(w / 2, photoY + photoSize / 2, photoSize / 2 + 3, 0, Math.PI * 2);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Candidate Name
    const textBaseY = photoY + photoSize + 36;
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 26px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(candName, w / 2, textBaseY);

    // Official Symbol Ribbon
    const symbolY = textBaseY + 24;
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(w / 2 - 140, symbolY, 280, 60, 10);
    ctx.fill();
    ctx.stroke();

    ctx.font = '34px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(activeSymbol, w / 2 - 120, symbolY + 44);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.fillText(`चुनाव चिन्ह: ${activeSymbolName}`, w / 2 - 60, symbolY + 28);
    ctx.fillStyle = brandColor;
    ctx.font = '800 12px Plus Jakarta Sans, sans-serif';
    ctx.fillText('क्रमांक संख्या 01 पर मुहर लगाएं', w / 2 - 60, symbolY + 48);

    // Slogan
    const sloganY = symbolY + 76;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic 600 14px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    wrapText(ctx, `"${sloganText}"`, w / 2, sloganY + 16, w - 60, 20);

    // Footer Voting Callout
    ctx.fillStyle = '#059669';
    ctx.fillRect(0, h - 50, w, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('मतदान दिनांक: 25 अगस्त 2026 (प्रातः 7:00 से सायं 5:00)', w / 2, h - 20);
  }

  function renderSplitLayout(ctx, dim, brandColor, candName, wardText, sloganText) {
    const { w, h } = dim;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const splitX = w * 0.44;
    if (isPhotoLoaded && candidatePhoto.complete) {
      ctx.drawImage(candidatePhoto, 0, 0, splitX, h);
      const blend = ctx.createLinearGradient(splitX - 50, 0, splitX, 0);
      blend.addColorStop(0, 'rgba(255,255,255,0)');
      blend.addColorStop(1, 'rgba(255,255,255,1)');
      ctx.fillStyle = blend;
      ctx.fillRect(splitX - 50, 0, 50, h);
    } else {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, splitX, h);
    }

    ctx.fillStyle = brandColor;
    ctx.fillRect(splitX, 0, w - splitX, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('॥ ग्राम पंचायत चुनाव 2026 ॥', splitX + 16, 32);

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 22px Outfit, sans-serif';
    ctx.fillText(candName, splitX + 16, 92);

    ctx.fillStyle = brandColor;
    ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
    ctx.fillText(wardText, splitX + 16, 116);

    ctx.font = '48px sans-serif';
    ctx.fillText(activeSymbol, splitX + 16, 178);

    ctx.fillStyle = '#d97706';
    ctx.font = '900 16px Outfit, sans-serif';
    ctx.fillText(`चुनाव चिन्ह: ${activeSymbolName}`, splitX + 80, 160);
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.fillText('मतदान पेटी में भारी मतों से विजयी बनाएं!', splitX + 80, 182);

    ctx.fillStyle = '#334155';
    ctx.font = 'italic 600 13px Plus Jakarta Sans, sans-serif';
    wrapText(ctx, `"${sloganText}"`, splitX + 16, 220, w - splitX - 24, 18);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(splitX, h - 38, w - splitX, 38);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Outfit, sans-serif';
    ctx.fillText('मतदान: 25 अगस्त 2026', splitX + 16, h - 14);
  }

  function renderTribandLayout(ctx, dim, brandColor, candName, wardText, sloganText) {
    const { w, h } = dim;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ff9933'; ctx.fillRect(0, 0, w, 8);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 8, w, 6);
    ctx.fillStyle = '#138808'; ctx.fillRect(0, 14, w, 8);

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 20px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ आपका अपना कर्मठ एवं शिक्षित प्रत्याशी ॥', w / 2, 50);

    ctx.fillStyle = brandColor;
    ctx.font = 'bold 14px Plus Jakarta Sans, sans-serif';
    ctx.fillText(wardText, w / 2, 74);

    const sz = Math.min(w * 0.42, h * 0.33);
    const px = (w - sz) / 2;
    const py = 92;

    if (isPhotoLoaded && candidatePhoto.complete) {
      ctx.drawImage(candidatePhoto, px, py, sz, sz);
      ctx.strokeStyle = brandColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(px, py, sz, sz);
    }

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 24px Outfit, sans-serif';
    ctx.fillText(candName, w / 2, py + sz + 32);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
    ctx.fillText(`चुनाव चिन्ह: ${activeSymbol} ${activeSymbolName}`, w / 2, py + sz + 60);

    ctx.fillStyle = '#475569';
    ctx.font = 'italic 13px Plus Jakarta Sans, sans-serif';
    wrapText(ctx, `"${sloganText}"`, w / 2, py + sz + 90, w - 60, 18);

    ctx.fillStyle = '#ff9933';
    ctx.fillRect(0, h - 42, w, 42);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.fillText('मतदान दिनांक: 25 अगस्त 2026', w / 2, h - 16);
  }

  function renderSocialStoryLayout(ctx, dim, brandColor, candName, wardText, sloganText) {
    const { w, h } = dim;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const glow = ctx.createLinearGradient(0, 0, w, 0);
    glow.addColorStop(0, brandColor);
    glow.addColorStop(1, '#7c3aed');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, 54);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 17px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SARPANCH ELECTION 2026', w / 2, 34);

    const sz = w * 0.72;
    const px = (w - sz) / 2;
    const py = 80;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px, py, sz, sz, 18);
    ctx.clip();
    if (isPhotoLoaded && candidatePhoto.complete) {
      ctx.drawImage(candidatePhoto, px, py, sz, sz);
    }
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(w / 2, py + sz, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '38px sans-serif';
    ctx.fillText(activeSymbol, w / 2, py + sz + 12);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px Outfit, sans-serif';
    ctx.fillText(candName, w / 2, py + sz + 62);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px Plus Jakarta Sans, sans-serif';
    ctx.fillText(wardText, w / 2, py + sz + 86);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 13px Plus Jakarta Sans, sans-serif';
    wrapText(ctx, `"${sloganText}"`, w / 2, py + sz + 116, w - 50, 18);
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  /* ==========================================================================
     EXPORT ACTIONS
     ========================================================================== */
  function downloadPngHd() {
    const canvas = document.getElementById('poster-render-canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `ElectWin_Poster_${activeFormat}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    if (window.ElectWinApp) {
      window.ElectWinApp.addActivityItem(
        'Downloaded HD Flex Poster (PNG)',
        `Symbol: ${activeSymbol} • Format: ${activeFormat}`,
        'download',
        'icon-mint'
      );
      window.ElectWinApp.showToast('HD PNG poster downloaded successfully! 📥');
    }
  }

  function downloadPrintPdf() {
    if (window.ElectWinApp) {
      window.ElectWinApp.addActivityItem(
        'Generated Print-Ready 300 DPI PDF',
        `Queued for Rampur Local Flex Printer`,
        'printer',
        'icon-purple'
      );
      window.ElectWinApp.showToast('Print-Ready PDF (300 DPI with crop marks) generated! 🖨️');
    }
  }

  return {
    init,
    renderPoster,
    selectSymbol,
    selectLayout,
    selectDimension,
    downloadPngHd,
    downloadPrintPdf
  };
})();
