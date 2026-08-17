/**
 * ElectWin – Manage Team Controller
 * Hierarchy: Super Admin (Candidate Owner) > Admin (Campaign Manager) > Volunteer (Field Worker)
 * Fully interactive state management for team members, ward assignments, and permissions.
 */

window.ElectWinTeam = (function() {
  let teamMembers = [
    {
      id: 'team_01',
      name: 'Rameshwar Patel',
      role: 'Super Admin',
      roleTitle: 'Contesting Candidate (Owner)',
      ward: 'All Wards (Gram Panchayat Rampur)',
      phone: '+91 98290 14285',
      status: 'Active',
      votersHandled: 3500,
      addedDate: '01 Aug 2026'
    },
    {
      id: 'team_02',
      name: 'Rajesh Kumar Sharma',
      role: 'Admin',
      roleTitle: 'Campaign Operations Manager',
      ward: 'All Wards (Campaign HQ)',
      phone: '+91 94140 33812',
      status: 'Active',
      votersHandled: 1850,
      addedDate: '03 Aug 2026'
    },
    {
      id: 'team_03',
      name: 'Priya Sharma',
      role: 'Admin',
      roleTitle: 'Social Media & Broadcast Coordinator',
      ward: 'All Wards (Digital Cell)',
      phone: '+91 98288 99120',
      status: 'Active',
      votersHandled: 2850,
      addedDate: '06 Aug 2026'
    },
    {
      id: 'team_04',
      name: 'Kailash Saini',
      role: 'Volunteer',
      roleTitle: 'Booth 02 Incharge (Panna Pramukh)',
      ward: 'Ward 02 – Patel Basti',
      phone: '+91 97840 55190',
      status: 'Active',
      votersHandled: 45,
      addedDate: '08 Aug 2026'
    },
    {
      id: 'team_05',
      name: 'Mukesh Gurjar',
      role: 'Volunteer',
      roleTitle: 'Booth 01 Incharge (Youth Mobilizer)',
      ward: 'Ward 04 – Rampur HQ',
      phone: '+91 94140 88219',
      status: 'Active',
      votersHandled: 38,
      addedDate: '10 Aug 2026'
    },
    {
      id: 'team_06',
      name: 'Anita Kumari',
      role: 'Volunteer',
      roleTitle: 'Women SHG Field Lead',
      ward: 'Ward 01 – Old Village',
      phone: '+91 96021 66723',
      status: 'Active',
      votersHandled: 29,
      addedDate: '12 Aug 2026'
    }
  ];

  function init() {
    renderTeamTable();
    setupTeamModals();
  }

  function getTeamMembers() {
    return teamMembers;
  }

  function renderTeamTable() {
    const tbody = document.getElementById('team-table-body');
    const activeCountEl = document.getElementById('team-active-count-badge');
    const statActiveEl = document.getElementById('dash-stat-team-count');

    const activeCount = teamMembers.filter(m => m.status === 'Active').length;
    if (activeCountEl) activeCountEl.textContent = `${teamMembers.length} Members`;
    if (statActiveEl) statActiveEl.textContent = activeCount;

    if (!tbody) return;

    const currentRole = window.ElectWinApp ? window.ElectWinApp.getRole() : 'superadmin';

    tbody.innerHTML = teamMembers.map(m => {
      let roleBadge = 'badge-purple';
      if (m.role === 'Super Admin') roleBadge = 'badge-amber';
      else if (m.role === 'Admin') roleBadge = 'badge-cyan';
      else if (m.role === 'Volunteer') roleBadge = 'badge-mint';

      const isSuperAdminUser = m.role === 'Super Admin';

      // Permission controls:
      // Super Admin can edit/remove anyone except cannot delete own owner account
      // Admin can only edit/remove Volunteers (cannot remove Super Admin or other Admins)
      let actionButtons = '';

      if (currentRole === 'superadmin') {
        if (isSuperAdminUser) {
          actionButtons = `<span style="font-size:0.72rem; color:var(--text-tertiary); font-weight:700;">👑 Account Owner</span>`;
        } else {
          actionButtons = `
            <div style="display:flex; gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="window.ElectWinTeam.toggleMemberStatus('${m.id}')" title="Toggle Status">
                ${m.status === 'Active' ? '<i data-lucide="pause" style="width:12px;height:12px;"></i> Pause' : '<i data-lucide="play" style="width:12px;height:12px;"></i> Active'}
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.ElectWinTeam.removeMember('${m.id}')" style="color:var(--rose-primary);" title="Remove">
                <i data-lucide="trash-2" style="width:12px;height:12px;"></i>
              </button>
            </div>
          `;
        }
      } else if (currentRole === 'admin') {
        if (m.role === 'Volunteer') {
          actionButtons = `
            <button class="btn btn-secondary btn-sm" onclick="window.ElectWinTeam.removeMember('${m.id}')" style="color:var(--rose-primary);" title="Remove Volunteer">
              <i data-lucide="trash-2" style="width:12px;height:12px;"></i> Remove
            </button>
          `;
        } else {
          actionButtons = `<span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">Admin Level (Locked)</span>`;
        }
      } else {
        actionButtons = `<span style="font-size:0.72rem; color:var(--text-muted);">View Only</span>`;
      }

      return `
        <tr>
          <td data-label="Member Name">
            <div style="font-weight: 800; color: var(--text-primary); font-size: 0.88rem;">${m.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-tertiary);">${m.phone}</div>
          </td>
          <td data-label="Role & Assignment">
            <span class="badge-chip ${roleBadge}">${m.role}</span>
            <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">${m.roleTitle}</div>
          </td>
          <td data-label="Assigned Ward">
            <div style="font-size: 0.78rem; font-weight: 600;">${m.ward}</div>
          </td>
          <td data-label="Status">
            <span class="badge-chip ${m.status === 'Active' ? 'badge-mint' : 'badge-neutral'}">${m.status}</span>
          </td>
          <td data-label="Activity Level">
            <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-primary);">${m.votersHandled.toLocaleString()} Electors</div>
            <div style="font-size: 0.68rem; color: var(--text-tertiary);">Added ${m.addedDate}</div>
          </td>
          <td data-label="Actions">
            ${actionButtons}
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function setupTeamModals() {
    const openBtn = document.getElementById('open-add-team-member-btn');
    const modal = document.getElementById('modal-add-team-member');
    const closeBtn = document.getElementById('close-add-team-modal-btn');
    const saveBtn = document.getElementById('btn-save-new-team-member');
    const roleSelect = document.getElementById('new-team-role-select');
    const wardContainer = document.getElementById('new-team-ward-group');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        // Adjust available role options based on who is logged in
        const currentRole = window.ElectWinApp ? window.ElectWinApp.getRole() : 'superadmin';
        if (roleSelect) {
          if (currentRole === 'admin') {
            roleSelect.innerHTML = `<option value="Volunteer">Volunteer (Panna Pramukh / Field Worker)</option>`;
          } else {
            roleSelect.innerHTML = `
              <option value="Admin">Admin (Campaign Manager / Co-Director)</option>
              <option value="Volunteer">Volunteer (Panna Pramukh / Field Worker)</option>
            `;
          }
        }
        modal.classList.add('open');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    if (roleSelect && wardContainer) {
      roleSelect.addEventListener('change', (e) => {
        if (e.target.value === 'Volunteer') {
          wardContainer.style.display = 'block';
        } else {
          wardContainer.style.display = 'none';
        }
      });
    }

    if (saveBtn && modal) {
      saveBtn.addEventListener('click', () => {
        const name = document.getElementById('new-team-name').value.trim();
        const phone = document.getElementById('new-team-phone').value.trim();
        const role = document.getElementById('new-team-role-select').value;
        const roleTitle = document.getElementById('new-team-title').value.trim() || (role === 'Admin' ? 'Campaign Operations' : 'Booth Volunteer');
        const ward = role === 'Volunteer' ? document.getElementById('new-team-ward-select').value : 'All Wards (Campaign HQ)';

        if (!name) {
          window.ElectWinApp.showToast('Please enter the team member name.');
          return;
        }

        const newId = 'team_' + Date.now();
        teamMembers.push({
          id: newId,
          name: name,
          role: role,
          roleTitle: roleTitle,
          ward: ward,
          phone: phone || '+91 94140 00000',
          status: 'Active',
          votersHandled: 0,
          addedDate: 'Today'
        });

        renderTeamTable();
        modal.classList.remove('open');

        // Push real activity item
        if (window.ElectWinApp) {
          window.ElectWinApp.addActivityItem(
            `Added ${role} ${name}`,
            `Assigned to ${ward}`,
            'user-check',
            'icon-mint'
          );
          window.ElectWinApp.showToast(`Team member "${name}" (${role}) registered successfully! 🎉`);
        }

        // Reset inputs
        document.getElementById('new-team-name').value = '';
        document.getElementById('new-team-phone').value = '';
      });
    }
  }

  function toggleMemberStatus(memberId) {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    member.status = member.status === 'Active' ? 'Paused' : 'Active';
    renderTeamTable();
    if (window.ElectWinApp) {
      window.ElectWinApp.showToast(`Status for ${member.name} updated to ${member.status}.`);
    }
  }

  function removeMember(memberId) {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    if (confirm(`Are you sure you want to remove ${member.name} from the campaign team?`)) {
      teamMembers = teamMembers.filter(m => m.id !== memberId);
      renderTeamTable();
      if (window.ElectWinApp) {
        window.ElectWinApp.addActivityItem(
          `Removed team member ${member.name}`,
          `Role: ${member.role}`,
          'trash-2',
          'icon-amber'
        );
        window.ElectWinApp.showToast(`${member.name} removed from campaign team.`);
      }
    }
  }

  return {
    init,
    getTeamMembers,
    renderTeamTable,
    toggleMemberStatus,
    removeMember
  };
})();
