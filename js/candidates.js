/**
 * ElectWin – Candidate Management & Profile Controller
 * Restricted strictly to Sarpanch & Panch candidates.
 * Live profile synchronization with Design Studio and campaign assets.
 */

window.ElectWinCandidates = (function() {
  let candidates = [
    {
      id: 'rameshwar',
      name: 'Rameshwar Patel',
      hindiName: 'रामेश्वर पटेल',
      post: 'Sarpanch (Gram Panchayat)',
      postType: 'sarpanch',
      constituency: 'Gram Panchayat Rampur (Ward 04)',
      symbol: '🚜',
      symbolName: 'Tractor (ट्रैक्टर)',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      slogan: 'गांव का समग्र विकास, हर घर विश्वास और खुशहाली!',
      votersCount: 3500,
      volunteersCount: 24,
      manifesto: '1. Clean 24x7 drinking water pipeline\n2. Concrete roads & covered drainage\n3. Tube well power subsidy for farmers'
    },
    {
      id: 'vikram',
      name: 'Vikram Singh Gurjar',
      hindiName: 'विक्रम सिंह गुर्जर',
      post: 'Panch (Ward)',
      postType: 'panch',
      constituency: 'Ward 02 – Patel Basti',
      symbol: '🌾',
      symbolName: 'Farmer (किसान)',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      slogan: 'युवा नेतृत्व, स्वच्छ पेयजल और पक्की सड़कें!',
      votersCount: 620,
      volunteersCount: 8,
      manifesto: '1. Paved concrete lane in Patel Basti\n2. Streetlights on school road\n3. Handpump maintenance'
    },
    {
      id: 'savitri',
      name: 'Savitri Bai Meena',
      hindiName: 'सावित्री बाई मीणा',
      post: 'Panch (Ward)',
      postType: 'panch',
      constituency: 'Ward 04 – Anganwadi Block',
      symbol: '☀️',
      symbolName: 'Sun (सूरज)',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      slogan: 'नारी सशक्तिकरण, बालिका शिक्षा और बेहतर स्वास्थ्य!',
      votersCount: 850,
      volunteersCount: 6,
      manifesto: '1. Anganwadi center upgrade\n2. Women SHG sewing training center\n3. Primary health clinic checkup'
    }
  ];

  let currentFilter = 'all';

  function init() {
    renderCandidates();
    setupFilters();
    setupAddCandidateModal();
  }

  function getCandidates() {
    return candidates;
  }

  function renderCandidates() {
    const container = document.getElementById('candidate-cards-container');
    if (!container) return;

    const filtered = candidates.filter(c => {
      if (currentFilter === 'sarpanch') return c.postType === 'sarpanch';
      if (currentFilter === 'panch') return c.postType === 'panch';
      return true;
    });

    container.innerHTML = filtered.map(c => `
      <div class="candidate-card glass-panel-interactive">
        <div>
          <div class="candidate-card-header">
            <div style="display: flex; gap: 10px; align-items: center;">
              <img src="${c.photo}" alt="${c.name}" class="candidate-avatar">
              <div>
                <div class="candidate-name">${c.name}</div>
                <div class="candidate-post-tag">${c.post}</div>
                <div style="font-size: 0.72rem; color: var(--text-tertiary);">${c.constituency}</div>
              </div>
            </div>
            <div class="candidate-symbol-badge" title="${c.symbolName}">
              ${c.symbol}
            </div>
          </div>

          <div class="candidate-slogan">
            "${c.slogan}"
          </div>

          <div class="candidate-stats-mini" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: var(--bg-surface-subtle); padding: 8px; border-radius: var(--radius-sm); margin-bottom: 12px;">
            <div style="text-align: center;">
              <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary);">${c.votersCount.toLocaleString()}</div>
              <div style="font-size: 0.65rem; color: var(--text-tertiary); font-weight: 600; text-transform: uppercase;">Ward Voters</div>
            </div>
            <div style="text-align: center;">
              <div style="font-weight: 800; font-size: 0.95rem; color: var(--cyan-primary);">${c.volunteersCount}</div>
              <div style="font-size: 0.65rem; color: var(--text-tertiary); font-weight: 600; text-transform: uppercase;">Volunteers</div>
            </div>
          </div>
        </div>

        <div class="candidate-actions" style="display: flex; gap: 6px;">
          <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.ElectWinCandidates.openStudioForCandidate('${c.id}')">
            <i data-lucide="palette" style="width: 13px; height: 13px;"></i> Design Posters
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.ElectWinCandidates.editCandidate('${c.id}')">
            <i data-lucide="edit" style="width: 13px; height: 13px;"></i> Edit
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  function setupFilters() {
    const filterPills = document.querySelectorAll('#candidate-filter-bar .filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter');
        renderCandidates();
      });
    });
  }

  function openStudioForCandidate(candidateId) {
    const dropdown = document.getElementById('studio-candidate-dropdown');
    if (dropdown) {
      dropdown.value = candidateId;
      dropdown.dispatchEvent(new Event('change'));
    }
    if (window.ElectWinApp) {
      window.ElectWinApp.navigateTo('studio');
    }
  }

  function setupAddCandidateModal() {
    const openBtn = document.getElementById('open-add-candidate-btn');
    const modal = document.getElementById('modal-add-candidate');
    const closeBtn = document.getElementById('close-add-candidate-modal-btn');
    const nextBtn = document.getElementById('cand-step-next-btn');
    const prevBtn = document.getElementById('cand-step-prev-btn');
    const submitBtn = document.getElementById('cand-step-submit-btn');

    let currentStep = 1;

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        currentStep = 1;
        updateModalSteps(currentStep);
        modal.classList.add('open');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep < 3) {
          currentStep++;
          updateModalSteps(currentStep);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateModalSteps(currentStep);
        }
      });
    }

    if (submitBtn && modal) {
      submitBtn.addEventListener('click', () => {
        const name = document.getElementById('new-cand-name').value.trim();
        const post = document.getElementById('new-cand-post').value;
        const constituency = document.getElementById('new-cand-constituency').value.trim();
        const symbol = document.getElementById('new-cand-symbol').value;
        const slogan = document.getElementById('new-cand-slogan').value.trim();
        const photo = document.getElementById('new-cand-photo').value.trim();

        if (!name || !constituency) {
          window.ElectWinApp.showToast('Please complete candidate name & constituency.');
          return;
        }

        const newId = 'cand_' + Date.now();
        candidates.push({
          id: newId,
          name: name,
          hindiName: name,
          post: post === 'sarpanch' ? 'Sarpanch (Gram Panchayat)' : 'Panch (Ward)',
          postType: post,
          constituency: constituency,
          symbol: symbol,
          symbolName: symbol,
          photo: photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          slogan: slogan || 'गांव का विकास, सबका साथ!',
          votersCount: 500,
          volunteersCount: 4,
          manifesto: 'Key village development points'
        });

        renderCandidates();
        modal.classList.remove('open');

        if (window.ElectWinApp) {
          window.ElectWinApp.addActivityItem(
            `Registered Candidate Profile for ${name}`,
            `${post === 'sarpanch' ? 'Sarpanch' : 'Panch'} (${constituency})`,
            'user-check',
            'icon-mint'
          );
          window.ElectWinApp.showToast(`Candidate "${name}" registered successfully! 🎉`);
        }
      });
    }
  }

  function updateModalSteps(step) {
    document.getElementById('cand-form-step-1').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('cand-form-step-2').style.display = step === 2 ? 'block' : 'none';
    document.getElementById('cand-form-step-3').style.display = step === 3 ? 'block' : 'none';

    document.getElementById('cand-step-indicator-1').className = step === 1 ? 'step-pill active' : (step > 1 ? 'step-pill completed' : 'step-pill');
    document.getElementById('cand-step-indicator-2').className = step === 2 ? 'step-pill active' : (step > 2 ? 'step-pill completed' : 'step-pill');
    document.getElementById('cand-step-indicator-3').className = step === 3 ? 'step-pill active' : 'step-pill';

    document.getElementById('cand-step-prev-btn').style.display = step > 1 ? 'inline-flex' : 'none';
    document.getElementById('cand-step-next-btn').style.display = step < 3 ? 'inline-flex' : 'none';
    document.getElementById('cand-step-submit-btn').style.display = step === 3 ? 'inline-flex' : 'none';
  }

  function editCandidate(id) {
    const c = candidates.find(item => item.id === id);
    if (!c) return;

    const newSlogan = prompt(`Update Slogan for ${c.name}:`, c.slogan);
    if (newSlogan) {
      c.slogan = newSlogan;
      renderCandidates();
      if (window.ElectWinApp) {
        window.ElectWinApp.showToast(`Updated slogan for ${c.name}!`);
      }
    }
  }

  return {
    init,
    getCandidates,
    openStudioForCandidate,
    editCandidate
  };
})();
