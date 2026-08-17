/**
 * ElectWin – Surveys & Citizen Grievance Tracker Controller
 * Village issue analytics and citizen complaints with live status updates.
 */

window.ElectWinComplaints = (function() {
  let complaintsList = [
    { id: 'GR-101', name: 'Suraj Mal Sharma', ward: 'Ward 04', category: 'Water Supply', desc: 'Handpump non-functional near community well; water pipeline pressure low', date: '15 Aug 2026', status: 'In Progress' },
    { id: 'GR-102', name: 'Kavita Meena', ward: 'Ward 04', category: 'Health / School', desc: 'Primary health sub-center ANM nurse not available on Tuesdays', date: '14 Aug 2026', status: 'Open' },
    { id: 'GR-103', name: 'Gopal Lal Gurjar', ward: 'Ward 02', category: 'Road Drainage', desc: 'Rainwater stagnation in front of primary school; drainage culvert choked', date: '12 Aug 2026', status: 'Resolved' },
    { id: 'GR-104', name: 'Sunil Kumar', ward: 'Ward 02', category: 'Electricity', desc: 'Low voltage during evening 6 to 9 PM; tube well pump trip issue', date: '10 Aug 2026', status: 'In Progress' },
    { id: 'GR-105', name: 'Babulal Prajapat', ward: 'Ward 01', category: 'Road Drainage', desc: 'Kaccha road needs gravel paving before polling day', date: '08 Aug 2026', status: 'Open' }
  ];

  function init() {
    renderComplaintsTable();
    setupComplaintModal();
  }

  function renderComplaintsTable() {
    const tbody = document.getElementById('complaints-table-body');
    if (!tbody) return;

    tbody.innerHTML = complaintsList.map((c, idx) => {
      return `
        <tr>
          <td data-label="Citizen Name" style="font-weight: 700; color: var(--text-primary); font-size: 0.84rem;">${c.name}</td>
          <td data-label="Ward No."><span class="badge-chip badge-purple" style="font-size:0.68rem;">${c.ward}</span></td>
          <td data-label="Category"><span class="badge-chip badge-cyan">${c.category}</span></td>
          <td data-label="Description" style="font-size: 0.78rem; color: var(--text-secondary); max-width: 260px;">${c.desc}</td>
          <td data-label="Logged Date" style="font-size: 0.72rem; color: var(--text-tertiary);">${c.date}</td>
          <td data-label="Action Status">
            <select class="studio-select" onchange="window.ElectWinComplaints.updateStatus(${idx}, this.value)" style="min-height: 28px; padding: 2px 6px; font-size: 0.72rem; font-weight: 700; width: auto;">
              <option value="Open" ${c.status === 'Open' ? 'selected' : ''}>🔴 Open</option>
              <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>🟡 In Progress</option>
              <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>🟢 Resolved</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateStatus(idx, newStatus) {
    if (complaintsList[idx]) {
      complaintsList[idx].status = newStatus;
      if (window.ElectWinApp) {
        window.ElectWinApp.addActivityItem(
          `Grievance updated for ${complaintsList[idx].name}`,
          `Status changed to ${newStatus}`,
          'clipboard-check',
          'icon-mint'
        );
        window.ElectWinApp.showToast(`Complaint for ${complaintsList[idx].name} marked as "${newStatus}"!`);
      }
    }
  }

  function setupComplaintModal() {
    const openBtn = document.getElementById('open-log-complaint-btn');
    const modal = document.getElementById('modal-log-complaint');
    const closeBtn = document.getElementById('close-log-complaint-modal-btn');
    const saveBtn = document.getElementById('btn-save-new-complaint');

    if (openBtn && modal) openBtn.addEventListener('click', () => modal.classList.add('open'));
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

    if (saveBtn && modal) {
      saveBtn.addEventListener('click', () => {
        const name = document.getElementById('new-complaint-voter').value.trim();
        const ward = document.getElementById('new-complaint-ward').value;
        const cat = document.getElementById('new-complaint-category').value;
        const desc = document.getElementById('new-complaint-desc').value.trim();

        if (!name || !desc) {
          window.ElectWinApp.showToast('Please enter citizen name and description.');
          return;
        }

        complaintsList.unshift({
          id: 'GR-' + Math.floor(100 + Math.random() * 900),
          name: name,
          ward: ward,
          category: cat,
          desc: desc,
          date: 'Today',
          status: 'Open'
        });

        renderComplaintsTable();
        modal.classList.remove('open');

        // Reset inputs
        document.getElementById('new-complaint-voter').value = '';
        document.getElementById('new-complaint-desc').value = '';

        if (window.ElectWinApp) {
          window.ElectWinApp.addActivityItem(
            `Logged grievance from ${name} (${ward})`,
            `Category: ${cat}`,
            'alert-circle',
            'icon-amber'
          );
          window.ElectWinApp.showToast(`Logged new citizen grievance from ${name}! 📋`);
        }
      });
    }
  }

  return {
    init,
    updateStatus,
    renderComplaintsTable
  };
})();
