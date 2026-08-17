/**
 * ElectWin – Campaign Expense Ledger & Statutory Budget Controller
 * Tracks expenditures against the official Gram Panchayat election ceiling (₹1,50,000).
 * Fully functional additions, live budget re-calculations, and dynamic activity logging.
 */

window.ElectWinExpenses = (function() {
  const BUDGET_LIMIT = 150000;

  let expenseItems = [
    { id: 'exp_01', category: 'Pamphlet & Banner Printing', amount: 24500, date: '14 Aug 2026', note: 'Rampur Digital Flex Print (500 Pamphlets, 4 Hoardings)', mode: 'UPI / Online', user: 'Rajesh Kumar (Admin)' },
    { id: 'exp_02', category: 'Sound, DJ & Mic Rental', amount: 12000, date: '12 Aug 2026', note: 'Shree Ram Sound Service (Nukkad Sabha Ward 02 & 04)', mode: 'Cash Voucher', user: 'Rameshwar Patel (Candidate)' },
    { id: 'exp_03', category: 'Tea, Snacks & Volunteer Food', amount: 14250, date: '10 Aug 2026', note: 'Chai & Snacks for 24 Panna Pramukhs across 6 Booths', mode: 'UPI / Online', user: 'Rajesh Kumar (Admin)' },
    { id: 'exp_04', category: 'Vehicle Fuel & Transport', amount: 11500, date: '08 Aug 2026', note: 'Campaign Bolero diesel (Ward 01 to 06 village tour)', mode: 'Cash Voucher', user: 'Kailash Saini (Volunteer)' },
    { id: 'exp_05', category: 'Office & Panna Supplies', amount: 6200, date: '05 Aug 2026', note: 'Voter roll stationery, clipboards, pens & identity cards', mode: 'UPI / Online', user: 'Rajesh Kumar (Admin)' }
  ];

  function init() {
    renderExpenseTable();
    setupExpenseModal();
  }

  function calculateTotals() {
    const totalSpent = expenseItems.reduce((acc, curr) => acc + curr.amount, 0);
    const remaining = BUDGET_LIMIT - totalSpent;
    const utilizedPercent = Math.round((totalSpent / BUDGET_LIMIT) * 100);

    return { totalSpent, remaining, utilizedPercent };
  }

  function renderExpenseTable() {
    const tbody = document.getElementById('expenses-table-body');
    const spentEl = document.getElementById('expense-spent-val');
    const remainingEl = document.getElementById('expense-remaining-val');
    const utilizedEl = document.getElementById('expense-utilized-percent');

    const { totalSpent, remaining, utilizedPercent } = calculateTotals();

    if (spentEl) spentEl.textContent = `₹${totalSpent.toLocaleString()}`;
    if (remainingEl) remainingEl.textContent = `₹${remaining.toLocaleString()}`;
    if (utilizedEl) utilizedEl.textContent = `${utilizedPercent}%`;

    if (!tbody) return;

    tbody.innerHTML = expenseItems.map(item => `
      <tr>
        <td data-label="Category"><span class="badge-chip badge-purple">${item.category}</span></td>
        <td data-label="Amount" style="font-family: var(--font-heading); font-weight: 800; font-size: 0.92rem; color: var(--rose-primary);">
          ₹${item.amount.toLocaleString()}
        </td>
        <td data-label="Date" style="font-size: 0.76rem; color: var(--text-secondary);">${item.date}</td>
        <td data-label="Vendor & Note" style="font-size: 0.78rem; color: var(--text-primary); max-width: 260px;">${item.note}</td>
        <td data-label="Payment Mode"><span class="badge-chip badge-mint">${item.mode}</span></td>
        <td data-label="Logged By" style="font-size: 0.74rem; font-weight: 600; color: var(--text-tertiary);">${item.user}</td>
      </tr>
    `).join('');
  }

  function setupExpenseModal() {
    const openBtn = document.getElementById('open-add-expense-btn');
    const quickBtn = document.getElementById('quick-action-add-expense');
    const modal = document.getElementById('modal-add-expense');
    const closeBtn = document.getElementById('close-add-expense-modal-btn');
    const saveBtn = document.getElementById('btn-save-new-expense');

    if (openBtn && modal) openBtn.addEventListener('click', () => modal.classList.add('open'));
    if (quickBtn && modal) quickBtn.addEventListener('click', () => modal.classList.add('open'));
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

    if (saveBtn && modal) {
      saveBtn.addEventListener('click', () => {
        const cat = document.getElementById('new-expense-category').value;
        const amount = parseInt(document.getElementById('new-expense-amount').value, 10);
        const note = document.getElementById('new-expense-note').value.trim();
        const mode = document.getElementById('new-expense-mode').value;

        if (!amount || isNaN(amount) || amount <= 0) {
          window.ElectWinApp.showToast('Please enter a valid expense amount in ₹.');
          return;
        }

        expenseItems.unshift({
          id: 'exp_' + Date.now(),
          category: cat,
          amount: amount,
          date: 'Today',
          note: note || `${cat} expense log`,
          mode: mode,
          user: 'Rameshwar Patel (Candidate HQ)'
        });

        renderExpenseTable();
        modal.classList.remove('open');

        // Reset inputs
        document.getElementById('new-expense-amount').value = '';
        document.getElementById('new-expense-note').value = '';

        if (window.ElectWinApp) {
          window.ElectWinApp.addActivityItem(
            `Logged ₹${amount.toLocaleString()} for ${cat}`,
            note || 'Payment mode: ' + mode,
            'indian-rupee',
            'icon-amber'
          );
          window.ElectWinApp.showToast(`Logged ₹${amount.toLocaleString()} under ${cat}! 💰`);
        }
      });
    }
  }

  function openAddExpenseModal() {
    const modal = document.getElementById('modal-add-expense');
    if (modal) modal.classList.add('open');
  }

  return {
    init,
    renderExpenseTable,
    openAddExpenseModal
  };
})();
