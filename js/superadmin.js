/**
 * ElectWin – Super Admin Platform Controller
 * Platform Overview, Multi-Tenant Candidate Accounts Management,
 * API Integrations (WhatsApp, OCR, AI), and Platform Audit Logs.
 */

window.ElectWinSuperAdmin = (function() {
  // Master Platform Candidate Accounts Roster
  let candidateAccounts = [
    {
      id: 'acc_101',
      name: 'Rameshwar Patel',
      constituency: 'Gram Panchayat Rampur (Ward 04)',
      electionType: 'Sarpanch (Gram Panchayat)',
      phone: '+91 98290 14285',
      plan: 'Panchayat Pro (₹4,999/mo)',
      onboardDate: '01 Aug 2026',
      status: 'Active',
      votersCount: 3500,
      messagesSent: 12480,
      volunteersCount: 24,
      lastActive: '10 mins ago'
    },
    {
      id: 'acc_102',
      name: 'Vikram Singh Gurjar',
      constituency: 'Ward 02 – Patel Basti',
      electionType: 'Panch (Ward)',
      phone: '+91 94140 22910',
      plan: 'Ward Starter (₹1,999/mo)',
      onboardDate: '05 Aug 2026',
      status: 'Active',
      votersCount: 1120,
      messagesSent: 3450,
      volunteersCount: 8,
      lastActive: '1 hour ago'
    },
    {
      id: 'acc_103',
      name: 'Savitri Bai Meena',
      constituency: 'Ward 04 – Anganwadi Block',
      electionType: 'Panch (Ward)',
      phone: '+91 98288 12455',
      plan: 'Ward Starter (₹1,999/mo)',
      onboardDate: '08 Aug 2026',
      status: 'Active',
      votersCount: 1340,
      messagesSent: 4120,
      volunteersCount: 6,
      lastActive: '3 hours ago'
    },
    {
      id: 'acc_104',
      name: 'Gopal Lal Sharma',
      constituency: 'Gram Panchayat Dhand',
      electionType: 'Sarpanch (Gram Panchayat)',
      phone: '+91 97840 55190',
      plan: 'Panchayat Pro (₹4,999/mo)',
      onboardDate: '12 Jul 2026',
      status: 'Suspended',
      votersCount: 4200,
      messagesSent: 18900,
      volunteersCount: 18,
      lastActive: '5 days ago'
    }
  ];

  let auditLogs = [
    { timestamp: '17 Aug 2026, 16:40', action: 'API Key Rotated', detail: 'Meta WhatsApp Cloud API access token refreshed by Super Admin', user: 'SuperAdmin (HQ)', ip: '103.21.54.12' },
    { timestamp: '17 Aug 2026, 14:15', action: 'Candidate Onboarded', detail: 'Account created for Savitri Bai Meena (Ward 04 Panch)', user: 'SuperAdmin (HQ)', ip: '103.21.54.12' },
    { timestamp: '16 Aug 2026, 18:30', action: 'Account Suspended', detail: 'Account paused for Gopal Lal Sharma due to plan expiry', user: 'System Billing', ip: 'System Cron' },
    { timestamp: '16 Aug 2026, 11:20', action: 'OCR Vision Threshold', detail: 'Google Cloud Vision OCR confidence floor set to 85%', user: 'SuperAdmin (HQ)', ip: '103.21.54.12' },
    { timestamp: '15 Aug 2026, 09:00', action: 'Daily Backup Completed', detail: 'Electoral database snapshot stored to secure multi-region cold vault', user: 'Automated Daemon', ip: 'Vault-01' }
  ];

  function init() {
    renderCandidateAccounts();
    renderAuditLogs();
    setupSuperAdminModals();
    setupApiConfigForm();
  }

  function renderCandidateAccounts() {
    const tbody = document.getElementById('superadmin-candidates-table-body');
    if (!tbody) return;

    tbody.innerHTML = candidateAccounts.map(acc => {
      const statusBadge = acc.status === 'Active' 
        ? '<span class="badge-chip badge-mint">Active</span>' 
        : '<span class="badge-chip badge-rose">Suspended</span>';

      const toggleAction = acc.status === 'Active'
        ? `<button class="btn btn-secondary btn-sm" onclick="window.ElectWinSuperAdmin.toggleStatus('${acc.id}')" title="Suspend account"><i data-lucide="pause-circle" style="width:13px;height:13px;color:var(--rose-primary);"></i> Suspend</button>`
        : `<button class="btn btn-secondary btn-sm" onclick="window.ElectWinSuperAdmin.toggleStatus('${acc.id}')" title="Activate account"><i data-lucide="play-circle" style="width:13px;height:13px;color:var(--mint-primary);"></i> Activate</button>`;

      return `
        <tr>
          <td data-label="Candidate Account">
            <div style="font-weight: 800; color: var(--text-primary); font-size: 0.9rem;">${acc.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-tertiary);">${acc.phone}</div>
          </td>
          <td data-label="Constituency & Type">
            <div style="font-weight: 600;">${acc.constituency}</div>
            <div style="font-size: 0.72rem; color: var(--cyan-primary); font-weight: 700;">${acc.electionType}</div>
          </td>
          <td data-label="Onboarded Plan">
            <span class="badge-chip badge-purple" style="font-size:0.7rem;">${acc.plan}</span>
            <div style="font-size: 0.68rem; color: var(--text-tertiary); margin-top:2px;">Since ${acc.onboardDate}</div>
          </td>
          <td data-label="Status">${statusBadge}</td>
          <td data-label="Usage Metrics">
            <div style="font-size: 0.78rem;"><b>${acc.votersCount.toLocaleString()}</b> Voters • <b>${acc.messagesSent.toLocaleString()}</b> Msgs</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Last Active: ${acc.lastActive}</div>
          </td>
          <td data-label="Actions">
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="btn btn-primary btn-sm" onclick="window.ElectWinSuperAdmin.viewSummary('${acc.id}')">
                <i data-lucide="eye" style="width:13px;height:13px;"></i> View Summary
              </button>
              ${toggleAction}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderAuditLogs() {
    const tbody = document.getElementById('superadmin-audit-table-body');
    if (!tbody) return;

    tbody.innerHTML = auditLogs.map(log => `
      <tr>
        <td data-label="Timestamp" style="font-family: monospace; font-size: 0.74rem; color: var(--text-secondary);">${log.timestamp}</td>
        <td data-label="Action Type"><span class="badge-chip badge-cyan" style="font-weight:700;">${log.action}</span></td>
        <td data-label="Details" style="font-size: 0.78rem; color: var(--text-primary); max-width: 280px;">${log.detail}</td>
        <td data-label="Actor" style="font-size: 0.74rem; font-weight: 600;">${log.user}</td>
        <td data-label="IP / Node" style="font-family: monospace; font-size: 0.7rem; color: var(--text-muted);">${log.ip}</td>
      </tr>
    `).join('');
  }

  function toggleStatus(accId) {
    const acc = candidateAccounts.find(a => a.id === accId);
    if (!acc) return;

    acc.status = acc.status === 'Active' ? 'Suspended' : 'Active';
    auditLogs.unshift({
      timestamp: 'Just Now',
      action: acc.status === 'Active' ? 'Candidate Activated' : 'Candidate Suspended',
      detail: `Account for ${acc.name} (${acc.constituency}) changed to ${acc.status}`,
      user: 'SuperAdmin (HQ)',
      ip: '103.21.54.12'
    });

    renderCandidateAccounts();
    renderAuditLogs();
    window.ElectWinApp.showToast(`Account "${acc.name}" is now ${acc.status}!`);
  }

  function viewSummary(accId) {
    const acc = candidateAccounts.find(a => a.id === accId);
    if (!acc) return;

    const modal = document.getElementById('modal-superadmin-candidate-summary');
    if (!modal) return;

    document.getElementById('summary-cand-name').textContent = acc.name;
    document.getElementById('summary-cand-post').textContent = `${acc.electionType} • ${acc.constituency}`;
    document.getElementById('summary-cand-voters').textContent = acc.votersCount.toLocaleString();
    document.getElementById('summary-cand-messages').textContent = acc.messagesSent.toLocaleString();
    document.getElementById('summary-cand-volunteers').textContent = acc.volunteersCount;
    document.getElementById('summary-cand-plan').textContent = acc.plan;
    document.getElementById('summary-cand-status').textContent = acc.status;
    document.getElementById('summary-cand-lastactive').textContent = acc.lastActive;

    modal.classList.add('open');
  }

  function setupSuperAdminModals() {
    // Add Candidate Account Modal
    const openBtn = document.getElementById('open-add-candidate-account-btn');
    const modal = document.getElementById('modal-add-candidate-account');
    const closeBtn = document.getElementById('close-add-candidate-account-modal-btn');
    const saveBtn = document.getElementById('btn-save-new-candidate-account');

    if (openBtn && modal) openBtn.addEventListener('click', () => modal.classList.add('open'));
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

    if (saveBtn && modal) {
      saveBtn.addEventListener('click', () => {
        const name = document.getElementById('new-acc-name').value.trim();
        const constituency = document.getElementById('new-acc-constituency').value.trim();
        const electionType = document.getElementById('new-acc-type').value;
        const phone = document.getElementById('new-acc-phone').value.trim();
        const plan = document.getElementById('new-acc-plan').value;

        if (!name || !constituency) {
          window.ElectWinApp.showToast('Please enter Candidate Name and Constituency.');
          return;
        }

        candidateAccounts.unshift({
          id: 'acc_' + Date.now(),
          name: name,
          constituency: constituency,
          electionType: electionType,
          phone: phone || '+91 98000 00000',
          plan: plan,
          onboardDate: 'Today',
          status: 'Active',
          votersCount: 0,
          messagesSent: 0,
          volunteersCount: 1,
          lastActive: 'Just Now'
        });

        auditLogs.unshift({
          timestamp: 'Just Now',
          action: 'Candidate Account Created',
          detail: `New client onboarded: ${name} (${electionType} - ${constituency})`,
          user: 'SuperAdmin (HQ)',
          ip: '103.21.54.12'
        });

        renderCandidateAccounts();
        renderAuditLogs();
        modal.classList.remove('open');
        window.ElectWinApp.showToast(`Candidate account for ${name} onboarded successfully! 🎉`);
      });
    }

    // Read-only summary modal close
    const closeSummaryBtn = document.getElementById('close-superadmin-summary-modal-btn');
    const summaryModal = document.getElementById('modal-superadmin-candidate-summary');
    if (closeSummaryBtn && summaryModal) {
      closeSummaryBtn.addEventListener('click', () => summaryModal.classList.remove('open'));
    }
  }

  function setupApiConfigForm() {
    const saveApiBtn = document.getElementById('btn-save-api-configs');
    if (saveApiBtn) {
      saveApiBtn.addEventListener('click', () => {
        auditLogs.unshift({
          timestamp: 'Just Now',
          action: 'API Configuration Updated',
          detail: 'WhatsApp Cloud Gateway & OCR Vision endpoints verified and saved.',
          user: 'SuperAdmin (HQ)',
          ip: '103.21.54.12'
        });
        renderAuditLogs();
        window.ElectWinApp.showToast('API Gateway & Integrations updated successfully! ⚡');
      });
    }
  }

  return {
    init,
    toggleStatus,
    viewSummary
  };
})();
