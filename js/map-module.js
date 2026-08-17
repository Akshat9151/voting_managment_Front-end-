/**
 * ElectWin Auto-Location & Interactive 3D Vector Map Module
 * Provides pan/zoom, auto-boundary detection neon glows, pulsating booth markers,
 * interactive tooltips, and 360° booth panorama inspection.
 */

window.ElectWinMap = (function() {
  let canvas, ctx;
  let width, height;
  let zoom = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startX, startY;
  let hoveredBooth = null;
  let selectedWard = 'rampur';

  const locationsData = {
    'rampur': {
      name: 'Gram Panchayat Rampur',
      district: 'Jaipur Rural, Rajasthan',
      totalWards: 11,
      totalBooths: 6,
      registeredVoters: '4,850',
      turnoutTarget: '85%',
      sensitiveBooths: '1 of 6',
      centerOffset: { x: 0, y: 0 },
      booths: [
        { id: 1, name: 'Booth 01 – Panchayat Bhawan', voters: 820, turnout: '82%', sensitive: 'Normal', incharge: 'Kailash Saini', x: 260, y: 220 },
        { id: 2, name: 'Booth 02 – Govt Senior Sec. School', voters: 1140, turnout: '78%', sensitive: 'Sensitive', incharge: 'Mahesh Sharma', x: 420, y: 190 },
        { id: 3, name: 'Booth 03 – Community Health Centre', voters: 950, turnout: '88%', sensitive: 'Normal', incharge: 'Anita Verma', x: 340, y: 350 },
        { id: 4, name: 'Booth 04 – Kisan Sewa Kendra', voters: 780, turnout: '91%', sensitive: 'Normal', incharge: 'Suresh Patel', x: 520, y: 320 },
        { id: 5, name: 'Booth 05 – Anganwadi Centre 02', voters: 610, turnout: '80%', sensitive: 'Normal', incharge: 'Rekha Devi', x: 200, y: 380 },
        { id: 6, name: 'Booth 06 – Govt Primary School West', voters: 550, turnout: '75%', sensitive: 'Normal', incharge: 'Pappu Lal', x: 180, y: 150 }
      ]
    },
    'shivaji': {
      name: 'Ward 12 – Shivaji Nagar',
      district: 'Urban Ward, Zone 4',
      totalWards: 1,
      totalBooths: 4,
      registeredVoters: '3,200',
      turnoutTarget: '75%',
      sensitiveBooths: '0 of 4',
      centerOffset: { x: 30, y: -20 },
      booths: [
        { id: 1, name: 'Booth 01 – Shivaji High School', voters: 980, turnout: '74%', sensitive: 'Normal', incharge: 'Vivek Joshi', x: 280, y: 240 },
        { id: 2, name: 'Booth 02 – Municipal Hall Block B', voters: 890, turnout: '79%', sensitive: 'Normal', incharge: 'Pooja Jain', x: 400, y: 210 },
        { id: 3, name: 'Booth 03 – Community Center Park', voters: 710, turnout: '81%', sensitive: 'Normal', incharge: 'Sunil Rao', x: 360, y: 340 }
      ]
    },
    'anandpur': {
      name: 'Anandpur Block B',
      district: 'Alwar District',
      totalWards: 8,
      totalBooths: 5,
      registeredVoters: '5,120',
      turnoutTarget: '88%',
      sensitiveBooths: '2 of 5',
      centerOffset: { x: -40, y: 30 },
      booths: [
        { id: 1, name: 'Booth 01 – Anandpur Tehsil Office', voters: 1200, turnout: '89%', sensitive: 'Sensitive', incharge: 'Dharmendra Yadav', x: 300, y: 200 },
        { id: 2, name: 'Booth 02 – Govt Middle School', voters: 1050, turnout: '85%', sensitive: 'Normal', incharge: 'Neeraj Meena', x: 450, y: 260 },
        { id: 3, name: 'Booth 03 – Cooperative Bank Hall', voters: 870, turnout: '90%', sensitive: 'Sensitive', incharge: 'Kavita Singh', x: 240, y: 320 }
      ]
    }
  };

  function init() {
    canvas = document.getElementById('election-map-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', resize);

    setupMapInteractions();
    setupSearchPresets();
    setup360Viewer();
    drawMap();
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = canvas.parentElement.clientWidth || 700;
    height = canvas.height = canvas.parentElement.clientHeight || 560;
    drawMap();
  }

  function setupMapInteractions() {
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      if (canvas) canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (isDragging) {
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        drawMap();
        return;
      }

      // Check hover over booths
      const loc = locationsData[selectedWard] || locationsData['rampur'];
      let foundHover = null;

      loc.booths.forEach(booth => {
        const bx = booth.x * zoom + panX;
        const by = booth.y * zoom + panY;
        const dist = Math.sqrt((mouseX - bx) ** 2 + (mouseY - by) ** 2);
        if (dist < 18) {
          foundHover = booth;
        }
      });

      if (foundHover !== hoveredBooth) {
        hoveredBooth = foundHover;
        if (hoveredBooth && window.ElectWinAudio) window.ElectWinAudio.playHover();
        drawMap();
      }
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      zoom = Math.max(0.6, Math.min(2.5, zoom * zoomFactor));
      drawMap();
    });

    // Zoom buttons
    const zoomInBtn = document.getElementById('map-zoom-in');
    const zoomOutBtn = document.getElementById('map-zoom-out');
    const resetBtn = document.getElementById('map-reset-view');

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => { zoom = Math.min(2.5, zoom * 1.2); drawMap(); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { zoom = Math.max(0.6, zoom / 1.2); drawMap(); });
    if (resetBtn) resetBtn.addEventListener('click', () => { zoom = 1.0; panX = 0; panY = 0; drawMap(); });
  }

  function setupSearchPresets() {
    const searchInput = document.getElementById('map-search-input');
    const presets = document.querySelectorAll('.map-preset-pill');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        if (val.includes('shivaji')) selectLocation('shivaji');
        else if (val.includes('anandpur')) selectLocation('anandpur');
        else if (val.includes('rampur')) selectLocation('rampur');
      });
    }

    presets.forEach(p => {
      p.addEventListener('click', () => {
        presets.forEach(btn => btn.classList.remove('active'));
        p.classList.add('active');
        selectLocation(p.dataset.loc);
      });
    });
  }

  function selectLocation(locKey) {
    selectedWard = locKey;
    zoom = 1.2;
    panX = 0;
    panY = 0;

    if (window.ElectWinAudio) window.ElectWinAudio.playWhoosh();
    updateInfoCard();
    drawMap();

    if (window.ElectWinApp && window.ElectWinApp.showToast) {
      window.ElectWinApp.showToast(`Boundary locked on: ${locationsData[locKey].name} 🎯`);
    }
  }

  function updateInfoCard() {
    const loc = locationsData[selectedWard] || locationsData['rampur'];
    const titleEl = document.getElementById('map-card-location-title');
    const subEl = document.getElementById('map-card-district');
    const wardsEl = document.getElementById('map-card-wards');
    const boothsEl = document.getElementById('map-card-booths');
    const votersEl = document.getElementById('map-card-voters');
    const targetEl = document.getElementById('map-card-target');

    if (titleEl) titleEl.textContent = loc.name;
    if (subEl) subEl.textContent = loc.district;
    if (wardsEl) wardsEl.textContent = loc.totalWards;
    if (boothsEl) boothsEl.textContent = loc.totalBooths;
    if (votersEl) votersEl.textContent = loc.registeredVoters;
    if (targetEl) targetEl.textContent = loc.turnoutTarget;
  }

  function drawMap() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Vector Sci-Fi Grid Background
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)';
    ctx.lineWidth = 1;
    const gridSize = 40 * zoom;

    const startGridX = panX % gridSize;
    const startGridY = panY % gridSize;

    for (let x = startGridX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = startGridY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // 2. Ward Boundary Vector Polygon (Stylized Sci-Fi Region)
    ctx.beginPath();
    ctx.moveTo(120, 100);
    ctx.lineTo(380, 80);
    ctx.lineTo(580, 180);
    ctx.lineTo(620, 420);
    ctx.lineTo(460, 490);
    ctx.lineTo(160, 460);
    ctx.lineTo(100, 260);
    ctx.closePath();

    // Fill with soft cyber tint
    ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
    ctx.fill();

    // Glowing Neon Boundary Outline
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 3 / zoom;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(14, 165, 233, 0.8)';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Sub-ward partition lines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
    ctx.lineWidth = 1.5 / zoom;
    ctx.setLineDash([6, 6]);

    ctx.beginPath();
    ctx.moveTo(380, 80);
    ctx.lineTo(340, 480);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 260);
    ctx.lineTo(620, 300);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw Polling Booth Pins
    const loc = locationsData[selectedWard] || locationsData['rampur'];
    loc.booths.forEach(booth => {
      const isHovered = hoveredBooth && hoveredBooth.id === booth.id;

      // Pulsating outer aura
      ctx.beginPath();
      ctx.arc(booth.x, booth.y, isHovered ? 22 : 14, 0, Math.PI * 2);
      ctx.fillStyle = booth.sensitive === 'Sensitive' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(14, 165, 233, 0.25)';
      ctx.fill();

      // Pin center core
      ctx.beginPath();
      ctx.arc(booth.x, booth.y, isHovered ? 10 : 7, 0, Math.PI * 2);
      ctx.fillStyle = booth.sensitive === 'Sensitive' ? '#f43f5e' : (isHovered ? '#10b981' : '#0ea5e9');
      ctx.shadowBlur = isHovered ? 20 : 10;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
      ctx.shadowBlur = 0;

      // White inner ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / zoom;
      ctx.stroke();

      // Booth number label
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`B-${booth.id}`, booth.x, booth.y + (isHovered ? 34 : 26));
    });

    ctx.restore();

    // 4. Hover Tooltip (drawn on screen coordinates)
    if (hoveredBooth) {
      const bx = hoveredBooth.x * zoom + panX;
      const by = hoveredBooth.y * zoom + panY;

      const tooltipWidth = 230;
      const tooltipHeight = 115;
      const tx = Math.min(width - tooltipWidth - 15, Math.max(15, bx - tooltipWidth / 2));
      const ty = Math.max(15, by - tooltipHeight - 25);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(15, 23, 42, 0.15)';
      ctx.beginPath();
      ctx.roundRect(tx, ty, tooltipWidth, tooltipHeight, 12);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = hoveredBooth.sensitive === 'Sensitive' ? '#f43f5e' : '#0ea5e9';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(hoveredBooth.name, tx + 12, ty + 24);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Registered Voters: ${hoveredBooth.voters}`, tx + 12, ty + 46);
      ctx.fillText(`Turnout Trend: ${hoveredBooth.turnout}`, tx + 12, ty + 66);
      ctx.fillText(`Incharge: ${hoveredBooth.incharge}`, tx + 12, ty + 86);

      ctx.fillStyle = hoveredBooth.sensitive === 'Sensitive' ? '#be123c' : '#059669';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`[ ${hoveredBooth.sensitive.toUpperCase()} ]`, tx + 12, ty + 104);
    }
  }

  // 360° Panorama Viewer Modal Logic
  function setup360Viewer() {
    const openBtn = document.getElementById('open-360-modal-btn');
    const modal = document.getElementById('booth-360-modal');
    const closeBtn = document.getElementById('close-360-modal-btn');
    const panoCanvas = document.getElementById('panorama-canvas');

    if (!modal || !panoCanvas) return;

    let pCtx = panoCanvas.getContext('2d');
    let panoOffset = 0;
    let isPanoDragging = false;
    let panoStartX = 0;

    function renderPanorama() {
      const pWidth = panoCanvas.width = panoCanvas.parentElement.clientWidth || 800;
      const pHeight = panoCanvas.height = panoCanvas.parentElement.clientHeight || 500;

      // Realistic procedural simulated 360 panorama room
      const panoGrad = pCtx.createLinearGradient(0, 0, pWidth, pHeight);
      panoGrad.addColorStop(0, '#1e293b');
      panoGrad.addColorStop(0.5, '#334155');
      panoGrad.addColorStop(1, '#0f172a');
      pCtx.fillStyle = panoGrad;
      pCtx.fillRect(0, 0, pWidth, pHeight);

      // Floor perspective grid
      pCtx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
      pCtx.lineWidth = 1;
      for (let i = 0; i < pWidth; i += 80) {
        const xPos = ((i + panoOffset) % pWidth);
        pCtx.beginPath();
        pCtx.moveTo(xPos, pHeight * 0.55);
        pCtx.lineTo(xPos * 1.4 - pWidth * 0.2, pHeight);
        pCtx.stroke();
      }

      // Hotspots inside 360 viewer
      const hotspots = [
        { label: 'EVM Voting Table (Compartment 01)', x: 180 + (panoOffset % pWidth), y: pHeight * 0.5 },
        { label: 'Polling Agent Desk', x: 460 + (panoOffset % pWidth), y: pHeight * 0.48 },
        { label: 'Voter Verification & Queue Line', x: 740 + (panoOffset % pWidth), y: pHeight * 0.52 }
      ];

      hotspots.forEach(h => {
        let hx = h.x;
        if (hx < 0) hx += pWidth;
        if (hx > pWidth) hx -= pWidth;

        pCtx.beginPath();
        pCtx.arc(hx, h.y, 14, 0, Math.PI * 2);
        pCtx.fillStyle = 'rgba(14, 165, 233, 0.3)';
        pCtx.fill();

        pCtx.beginPath();
        pCtx.arc(hx, h.y, 6, 0, Math.PI * 2);
        pCtx.fillStyle = '#0ea5e9';
        pCtx.fill();

        pCtx.fillStyle = '#ffffff';
        pCtx.font = 'bold 12px Outfit, sans-serif';
        pCtx.textAlign = 'center';
        pCtx.fillText(h.label, hx, h.y - 18);
      });
    }

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('open');
        if (window.ElectWinAudio) window.ElectWinAudio.playClick();
        setTimeout(renderPanorama, 100);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        if (window.ElectWinAudio) window.ElectWinAudio.playClick();
      });
    }

    panoCanvas.addEventListener('mousedown', (e) => {
      isPanoDragging = true;
      panoStartX = e.clientX - panoOffset;
    });

    window.addEventListener('mouseup', () => isPanoDragging = false);

    panoCanvas.addEventListener('mousemove', (e) => {
      if (!isPanoDragging) return;
      panoOffset = e.clientX - panoStartX;
      renderPanorama();
    });
  }

  return {
    init,
    selectLocation
  };
})();
