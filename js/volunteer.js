/**
 * ElectWin – Field Volunteer Controller
 * Minimal, Ward-Limited, High-Speed Mobile Experience.
 * Dedicated to assigned ward only with one-tap status toggles (Called, Visited, Unreachable),
 * ward-locked voter entry, and personal field metrics.
 */

window.ElectWinVolunteerPortal = (function() {
  const ASSIGNED_WARD = 'Ward 02 – Patel Basti';
  const VOLUNTEER_NAME = 'Kailash Saini';

  let myWardVoters = [
    { id: 'V-02-101', name: 'Gopal Lal Gurjar', age: 58, mobile: '+91 97840 55190', house: 'House #14, Patel Chowk', status: 'Visited', slipHanded: true },
    { id: 'V-02-102', name: 'Kamla Devi Gurjar', age: 38, mobile: '+91 96021 44556', house: 'House #19, Basti Lane 2', status: 'Called', slipHanded: true },
    { id: 'V-02-103', name: 'Vikram Singh Jat', age: 31, mobile: '+91 94140 99881', house: 'House #22, Near Water Tank', status: 'Visited', slipHanded: true },
    { id: 'V-02-104', name: 'Mohan Lal Saini', age: 45, mobile: '+91 98290 33412', house: 'House #08, Main Chowk', status: 'Pending', slipHanded: false },
    { id: 'V-02-105', name: 'Shanti Devi', age: 52, mobile: '+91 94140 11920', house: 'House #31, School Road', status: 'Called', slipHanded: true },
    { id: 'V-02-106', name: 'Sunil Kumar Gurjar', age: 24, mobile: '+91 96021 77890', house: 'House #11, Basti Lane 1', status: 'Not Reachable', slipHanded: false }
  ];

  let activityStats = {
    votersAdded: 45,
    callsMade: 128,
    visitsLogged: 84,
    slipsHanded: 185
  };

  function init() {
    renderMyWardVoters();
    updateActivityDisplay();
    setupVolunteerAddVoter();
  }

  function renderMyWardVoters() {
    const container = document.getElementById('volunteer-ward-voters-list');
    if (!container) return;

    container.innerHTML = myWardVoters.map((v, idx) => {
      let statusClass = 'badge-neutral';
      if (v.status === 'Visited') statusClass = 'badge-mint';
      else if (v.status === 'Called') statusClass = 'badge-cyan';
      else if (v.status === 'Not Reachable') statusClass = 'badge-rose';

      return `
        <div class="volunteer-voter-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-heading);">${v.name}</div>
              <div style="font-size: 0.74rem; color: var(--text-tertiary);">${v.age} Yrs • ${v.house}</div>
              <a href="tel:${v.mobile}" style="font-size: 0.8rem; font-weight: 700; color: var(--cyan-primary); text-decoration: none; display: inline-flex; align-items: center; gap: 4px; margin-top: 4px;">
                <i data-lucide="phone" style="width: 14px; height: 14px;"></i> ${v.mobile}
              </a>
            </div>
            <span class="badge-chip ${statusClass}" id="v-status-badge-${idx}">${v.status}</span>
          </div>

          <!-- One-Tap Action Buttons -->
          <div class="volunteer-action-buttons-row">
            <button class="v-btn-action ${v.status === 'Called' ? 'active-called' : ''}" onclick="window.ElectWinVolunteerPortal.markStatus(${idx}, 'Called')">
              📞 Called
            </button>
            <button class="v-btn-action ${v.status === 'Visited' ? 'active-visited' : ''}" onclick="window.ElectWinVolunteerPortal.markStatus(${idx}, 'Visited')">
              🏠 Visited
            </button>
            <button class="v-btn-action ${v.status === 'Not Reachable' ? 'active-unreachable' : ''}" onclick="window.ElectWinVolunteerPortal.markStatus(${idx}, 'Not Reachable')">
              ❌ Unreachable
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function markStatus(index, newStatus) {
    if (myWardVoters[index]) {
      const prev = myWardVoters[index].status;
      myWardVoters[index].status = newStatus;

      if (newStatus === 'Called') activityStats.callsMade++;
      if (newStatus === 'Visited') {
        activityStats.visitsLogged++;
        myWardVoters[index].slipHanded = true;
      }

      renderMyWardVoters();
      updateActivityDisplay();
      window.ElectWinApp.showToast(`Marked ${myWardVoters[index].name} as "${newStatus}"!`);
    }
  }

  function updateActivityDisplay() {
    const elAdded = document.getElementById('v-act-added');
    const elCalls = document.getElementById('v-act-calls');
    const elVisits = document.getElementById('v-act-visits');
    const elSlips = document.getElementById('v-act-slips');

    if (elAdded) elAdded.textContent = activityStats.votersAdded;
    if (elCalls) elCalls.textContent = activityStats.callsMade;
    if (elVisits) elVisits.textContent = activityStats.visitsLogged;
    if (elSlips) elSlips.textContent = activityStats.slipsHanded;
  }

  function setupVolunteerAddVoter() {
    const addBtn = document.getElementById('v-btn-save-voter');
    const quickOcrBtn = document.getElementById('v-btn-quick-ocr');

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const name = document.getElementById('v-input-name').value.trim();
        const mobile = document.getElementById('v-input-mobile').value.trim();
        const age = parseInt(document.getElementById('v-input-age').value.trim(), 10) || 30;
        const house = document.getElementById('v-input-house').value.trim() || 'Ward 02 House';

        if (!name) {
          window.ElectWinApp.showToast('Please enter the voter name.');
          return;
        }

        myWardVoters.unshift({
          id: `V-02-${Math.floor(200 + Math.random() * 800)}`,
          name: name,
          age: age,
          mobile: mobile || '+91 94140 00000',
          house: house,
          status: 'Pending',
          slipHanded: false
        });

        activityStats.votersAdded++;
        updateActivityDisplay();
        renderMyWardVoters();

        // Reset inputs
        document.getElementById('v-input-name').value = '';
        document.getElementById('v-input-mobile').value = '';
        document.getElementById('v-input-age').value = '';
        document.getElementById('v-input-house').value = '';

        window.ElectWinApp.showToast(`Voter "${name}" added to ${ASSIGNED_WARD}! 📥`);
        window.ElectWinApp.navigateTo('volunteer-ward');
      });
    }

    if (quickOcrBtn) {
      quickOcrBtn.addEventListener('click', () => {
        window.ElectWinApp.showToast('📷 Scanning Ward 02 Voter List Page...');
        setTimeout(() => {
          myWardVoters.unshift({
            id: `V-02-${Math.floor(300 + Math.random() * 500)}`,
            name: 'Prakash Chandra Saini',
            age: 44,
            mobile: '+91 98290 77112',
            house: 'House #40, Patel Chowk',
            status: 'Pending',
            slipHanded: false
          });
          activityStats.votersAdded++;
          updateActivityDisplay();
          renderMyWardVoters();
          window.ElectWinApp.showToast('OCR extracted 1 new voter to Ward 02! 📄');
          window.ElectWinApp.navigateTo('volunteer-ward');
        }, 1200);
      });
    }
  }

  return {
    init,
    markStatus
  };
})();
