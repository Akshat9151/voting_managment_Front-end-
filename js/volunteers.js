/**
 * ElectWin – Volunteer Management & Booth-Wise Grouping
 * Handles volunteer field workers roster, metrics, and polling station assignments.
 */

window.ElectWinVolunteers = (function() {
  let volunteers = [
    {
      id: 'vol_1',
      name: 'Kailash Saini',
      role: 'Ward 02 Incharge',
      ward: 'Ward 02 (Booth 02 - Community Hall)',
      phone: '+91 94140 22910',
      votersAdded: 450,
      callsMade: 320,
      slipsDistributed: 540,
      status: 'Active'
    },
    {
      id: 'vol_2',
      name: 'Priya Sharma',
      role: 'Women SHG Coordinator',
      ward: 'Ward 04 (Booth 01 - Govt School)',
      phone: '+91 98288 12455',
      votersAdded: 620,
      callsMade: 480,
      slipsDistributed: 680,
      status: 'Active'
    },
    {
      id: 'vol_3',
      name: 'Mukesh Gurjar',
      role: 'Youth Mobilizer',
      ward: 'Ward 01 (Booth 03 - Panchayat Bhawan)',
      phone: '+91 96021 55901',
      votersAdded: 380,
      callsMade: 290,
      slipsDistributed: 420,
      status: 'Active'
    },
    {
      id: 'vol_4',
      name: 'Mahesh Sharma',
      role: 'Booth 04 Incharge',
      ward: 'Ward 03 (Booth 04 - Anganwadi Center)',
      phone: '+91 94140 77123',
      votersAdded: 310,
      callsMade: 210,
      slipsDistributed: 390,
      status: 'On-Duty'
    }
  ];

  const boothData = [
    { boothNo: 'Booth 01', location: 'Govt Senior Secondary School, Rampur', incharge: 'Rajesh Kumar (+91 98290 14285)', voters: 850, slips: 748, coverage: '88%' },
    { boothNo: 'Booth 02', location: 'Panchayat Community Hall, Patel Basti', incharge: 'Kailash Saini (+91 94140 22910)', voters: 620, slips: 570, coverage: '92%' },
    { boothNo: 'Booth 03', location: 'Gram Panchayat Bhawan, Main Road', incharge: 'Mukesh Gurjar (+91 96021 55901)', voters: 580, slips: 490, coverage: '84%' },
    { boothNo: 'Booth 04', location: 'Anganwadi Center No. 2, Ward 03', incharge: 'Mahesh Sharma (+91 94140 77123)', voters: 510, slips: 420, coverage: '82%' },
    { boothNo: 'Booth 05', location: 'Primary Health Sub-Center, Ward 05', incharge: 'Suraj Bhan Meena (+91 97840 44109)', voters: 480, slips: 410, coverage: '85%' },
    { boothNo: 'Booth 06', location: 'Cooperative Society Hall, Ward 06', incharge: 'Dinesh Yadav (+91 98288 33110)', voters: 460, slips: 390, coverage: '84%' }
  ];

  function init() {
    renderVolunteerCards();
    renderBoothTable();
    setupAddVolunteerModal();
  }

  function renderVolunteerCards() {
    const container = document.getElementById('volunteers-cards-container');
    if (!container) return;

    container.innerHTML = volunteers.map(vol => `
      <div class="volunteer-card glass-panel-interactive">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <div style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">${vol.name}</div>
            <div style="font-size: 0.74rem; font-weight: 700; color: var(--cyan-primary);">${vol.role}</div>
            <div style="font-size: 0.72rem; color: var(--text-tertiary); margin-top: 2px;">
              <i data-lucide="phone" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> ${vol.phone}
            </div>
          </div>
          <span class="badge-chip badge-mint">${vol.status}</span>
        </div>

        <div style="font-size: 0.74rem; color: var(--text-secondary); margin-bottom: 12px; background: var(--bg-surface-subtle); padding: 6px 8px; border-radius: var(--radius-sm);">
          📍 <b>${vol.ward}</b>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; text-align: center; background: var(--bg-surface-subtle); padding: 8px; border-radius: var(--radius-md);">
          <div>
            <div style="font-family: var(--font-heading); font-weight: 800; font-size: 0.95rem; color: var(--text-primary);">${vol.votersAdded}</div>
            <div style="font-size: 0.62rem; color: var(--text-tertiary); text-transform: uppercase; font-weight: 600;">Voters Synced</div>
          </div>
          <div>
            <div style="font-family: var(--font-heading); font-weight: 800; font-size: 0.95rem; color: var(--cyan-primary);">${vol.callsMade}</div>
            <div style="font-size: 0.62rem; color: var(--text-tertiary); text-transform: uppercase; font-weight: 600;">Calls Made</div>
          </div>
          <div>
            <div style="font-family: var(--font-heading); font-weight: 800; font-size: 0.95rem; color: var(--mint-primary);">${vol.slipsDistributed}</div>
            <div style="font-size: 0.62rem; color: var(--text-tertiary); text-transform: uppercase; font-weight: 600;">Slips Handed</div>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderBoothTable() {
    const tbody = document.getElementById('booth-grouping-table-body');
    if (!tbody) return;

    tbody.innerHTML = boothData.map(b => `
      <tr>
        <td data-label="Booth No." style="font-weight: 800; color: var(--cyan-primary);">${b.boothNo}</td>
        <td data-label="Location" style="font-weight: 600;">${b.location}</td>
        <td data-label="Incharge"><span style="font-size: 0.78rem; color: var(--text-secondary);">${b.incharge}</span></td>
        <td data-label="Total Electors" style="font-weight: 700;">${b.voters.toLocaleString()}</td>
        <td data-label="Slips Handed" style="color: var(--mint-primary); font-weight: 700;">${b.slips.toLocaleString()}</td>
        <td data-label="Coverage %">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="sync-progress-track" style="width: 80px; margin: 0;">
              <div class="sync-progress-fill" style="width: ${b.coverage}; background: var(--mint-primary);"></div>
            </div>
            <span style="font-weight: 800; font-size: 0.78rem;">${b.coverage}</span>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function setupAddVolunteerModal() {
    const openBtn = document.getElementById('open-add-volunteer-btn');
    const modal = document.getElementById('modal-add-volunteer');
    const closeBtn = document.getElementById('close-add-volunteer-modal-btn');
    const saveBtn = document.getElementById('btn-save-new-volunteer');

    if (!modal) return;

    if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('open'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const name = document.getElementById('new-volunteer-name').value.trim();
        const phone = document.getElementById('new-volunteer-phone').value.trim();
        const ward = document.getElementById('new-volunteer-ward').value;
        const role = document.getElementById('new-volunteer-role').value;

        if (!name) {
          window.ElectWinApp.showToast('Please enter the volunteer name.');
          return;
        }

        volunteers.push({
          id: 'vol_' + Date.now(),
          name: name,
          role: role,
          ward: ward,
          phone: phone || '+91 98290 00000',
          votersAdded: 0,
          callsMade: 0,
          slipsDistributed: 0,
          status: 'Active'
        });

        renderVolunteerCards();
        modal.classList.remove('open');
        window.ElectWinApp.showToast(`Volunteer "${name}" added to campaign team! 👥`);
      });
    }
  }

  return {
    init,
    openAddVolunteerModal: () => {
      const modal = document.getElementById('modal-add-volunteer');
      if (modal) modal.classList.add('open');
    }
  };
})();
