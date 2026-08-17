/**
 * ElectWin – Master Campaign Platform Controller
 * Manages Single-Account Role Hierarchy (Super Admin > Admin > Volunteer),
 * Split-Screen Login & Signup Multi-Step Engine, Language Switching,
 * Live Activity Feed, and Single Page Navigation.
 */

window.ElectWinApp = (function() {
  let currentRole = 'superadmin'; // 'superadmin' | 'admin' | 'volunteer'
  let currentScreen = 'dashboard';
  let isLoggedIn = false;

  let activityLogs = [
    { title: '1,200 voters added via photo scan', sub: 'Kailash Saini scanned Ward 02 official roll', icon: 'camera', iconClass: 'icon-cyan', time: '5m ago' },
    { title: 'Banner approved for Rameshwar Patel', sub: '3x6 ft Hoarding sent to Rampur local printer', icon: 'check', iconClass: 'icon-mint', time: '22m ago' },
    { title: 'SMS fallback dispatched to 240 non-WhatsApp voters', sub: 'Morning voting reminder delivered successfully', icon: 'send', iconClass: 'icon-purple', time: '1h ago' },
    { title: 'Campaign bolero fuel expense logged (₹1,500)', sub: 'Ward 01 to 06 village tour', icon: 'indian-rupee', iconClass: 'icon-amber', time: '3h ago' }
  ];

  function init() {
    // Load authentication state from localStorage
    const savedAuthState = localStorage.getItem('electwin_isLoggedIn');
    isLoggedIn = savedAuthState === 'true';

    setupRouting();
    setupMobileDrawer();
    setupRoleSwitcher();
    setupAuthPages();
    setupLogout();
    renderActivityFeed();

    // Initialize all modules
    if (window.ElectWinI18n) window.ElectWinI18n.init();
    if (window.ElectWinTeam) window.ElectWinTeam.init();
    if (window.ElectWinCandidates) window.ElectWinCandidates.init();
    if (window.ElectWinVoters) window.ElectWinVoters.init();
    if (window.ElectWinStudio) window.ElectWinStudio.init();
    if (window.ElectWinBroadcast) window.ElectWinBroadcast.init();
    if (window.ElectWinVolunteers) window.ElectWinVolunteers.init();
    if (window.ElectWinComplaints) window.ElectWinComplaints.init();
    if (window.ElectWinExpenses) window.ElectWinExpenses.init();
    if (window.ElectWinAnalytics) window.ElectWinAnalytics.init();
    if (window.ElectWinBranding) window.ElectWinBranding.init();
    if (window.ElectWinVolunteerPortal) window.ElectWinVolunteerPortal.init();

    // Pre-setup role state without navigating (auth page is shown first)
    setRoleState('superadmin');

    // Check authentication state on load
    if (isLoggedIn) {
      // User is logged in, navigate to dashboard
      navigateTo('dashboard');
    } else {
      // User is not logged in, show login screen
      showAuthScreen('login');
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function getRole() {
    return currentRole;
  }

  /* ==========================================================================
     SINGLE PAGE ROUTING
     ========================================================================== */
  function setupRouting() {
    document.addEventListener('click', (e) => {
      const navEl = e.target.closest('[data-nav]');
      if (navEl) {
        e.preventDefault();
        const targetScreen = navEl.getAttribute('data-nav');
        navigateTo(targetScreen);
      }
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'auth-login' || hash === 'auth-signup') {
        showAuthScreen(hash.replace('auth-', ''));
      } else if (hash && document.getElementById(`screen-${hash}`)) {
        navigateTo(hash);
      }
    });
  }

  function navigateTo(screenId) {
    // Check if user is logged in - if not, show auth screen instead
    if (!isLoggedIn && screenId !== 'auth-login' && screenId !== 'auth-signup') {
      showAuthScreen('login');
      return;
    }
    
    // Show main app shell, hide auth screen
    const authWrapper = document.getElementById('auth-fullscreen-section');
    const mainShell = document.getElementById('app-container');
    if (authWrapper) authWrapper.style.display = 'none';
    if (mainShell) mainShell.style.display = 'flex'; // flex because sidebar+main use flex layout
    
    // Update auth UI
    updateAuthUI();

    currentScreen = screenId;
    window.location.hash = screenId;

    // 1. Hide all screens & show active
    document.querySelectorAll('.view-screen').forEach(screen => {
      screen.classList.remove('active');
    });

    const targetEl = document.getElementById(`screen-${screenId}`);
    if (targetEl) {
      targetEl.classList.add('active');
    }

    // 2. Update mobile quick nav active state
    document.querySelectorAll('.mobile-quick-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-nav') === screenId) {
        item.classList.add('active');
      }
    });

    // 3. Update sidebar nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-nav') === screenId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 3. Update Mobile Quick Bar Active Item
    document.querySelectorAll('.quick-bar-btn').forEach(btn => {
      if (btn.getAttribute('data-nav') === screenId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    closeMobileDrawer();

    // 4. Special Screen Actions
    if (screenId === 'analytics' && window.ElectWinAnalytics) {
      window.ElectWinAnalytics.refreshCharts();
    }
    if (screenId === 'studio' && window.ElectWinStudio) {
      window.ElectWinStudio.renderPoster();
    }
    if (screenId === 'broadcast' && window.ElectWinBroadcast) {
      window.ElectWinBroadcast.updateAudienceSplitDisplay();
    }

    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) mainWrapper.scrollTop = 0;
  }

  /* ==========================================================================
     MOBILE SLIDE-IN DRAWER
     ========================================================================== */
  function setupMobileDrawer() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const closeBtn = document.getElementById('close-sidebar-drawer-btn');
    const drawerSelect = document.getElementById('drawer-role-select');

    if (toggleBtn && sidebar && backdrop) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('open');
      });

      backdrop.addEventListener('click', closeMobileDrawer);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMobileDrawer);
    }

    if (drawerSelect) {
      drawerSelect.addEventListener('change', (e) => {
        setRole(e.target.value, true);
        closeMobileDrawer();
      });
    }
  }

  function closeMobileDrawer() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  /* ==========================================================================
     ROLE HIERARCHY SWITCHING
     ========================================================================== */
  function setupRoleSwitcher() {
    ['superadmin', 'admin', 'volunteer'].forEach(role => {
      const btn = document.getElementById(`role-btn-${role}`);
      if (btn) {
        btn.addEventListener('click', () => setRole(role, true));
      }
    });
  }

  function setRole(role, notify = true) {
    currentRole = role;

    ['superadmin', 'admin', 'volunteer'].forEach(r => {
      const b = document.getElementById(`role-btn-${r}`);
      if (b) {
        if (r === role) b.classList.add('active');
        else b.classList.remove('active');
      }
    });

    const drawerSelect = document.getElementById('drawer-role-select');
    if (drawerSelect) drawerSelect.value = role;

    const teamNavItem = document.getElementById('nav-team');
    const adminNavGroup = document.getElementById('nav-group-admin');
    const volunteerNavGroup = document.getElementById('nav-group-volunteer');

    const roleBadge = document.getElementById('current-role-badge');
    const sidebarUser = document.getElementById('sidebar-user-name');
    const sidebarRoleNote = document.getElementById('sidebar-role-note');

    if (role === 'volunteer') {
      if (adminNavGroup) adminNavGroup.style.display = 'none';
      if (volunteerNavGroup) volunteerNavGroup.style.display = 'flex';

      if (roleBadge) {
        roleBadge.className = 'badge-chip badge-mint';
        roleBadge.innerHTML = '<i data-lucide="user-check" style="width:11px;height:11px;"></i> Volunteer (Ward 02)';
      }
      if (sidebarUser) sidebarUser.innerHTML = 'Worker: <b>Kailash Saini</b>';
      if (sidebarRoleNote) sidebarRoleNote.textContent = 'Booth 02 Field Worker';

      renderMobileQuickBar('volunteer');
      navigateTo('volunteer-ward');
      if (notify) showToast('Switched to VOLUNTEER View (Ward 02 Field Ops)! 📱');

    } else if (role === 'admin') {
      if (adminNavGroup) adminNavGroup.style.display = 'flex';
      if (volunteerNavGroup) volunteerNavGroup.style.display = 'none';
      if (teamNavItem) teamNavItem.style.display = 'flex';

      if (roleBadge) {
        roleBadge.className = 'badge-chip badge-cyan';
        roleBadge.innerHTML = '<i data-lucide="shield" style="width:11px;height:11px;"></i> Admin (Manager)';
      }
      if (sidebarUser) sidebarUser.innerHTML = 'Manager: <b>Rajesh Kumar</b>';
      if (sidebarRoleNote) sidebarRoleNote.textContent = 'Campaign Operations Sub-Admin';

      renderMobileQuickBar('admin');
      if (window.ElectWinTeam) window.ElectWinTeam.renderTeamTable();
      navigateTo('dashboard');
      if (notify) showToast('Switched to ADMIN View (Campaign Manager Level)! 👔');

    } else { // superadmin
      if (adminNavGroup) adminNavGroup.style.display = 'flex';
      if (volunteerNavGroup) volunteerNavGroup.style.display = 'none';
      if (teamNavItem) teamNavItem.style.display = 'flex';

      if (roleBadge) {
        roleBadge.className = 'badge-chip badge-amber';
        roleBadge.innerHTML = '<i data-lucide="award" style="width:11px;height:11px;"></i> Super Admin (Candidate)';
      }
      if (sidebarUser) sidebarUser.innerHTML = 'Candidate: <b>Rameshwar Patel</b>';
      if (sidebarRoleNote) sidebarRoleNote.textContent = 'Sarpanch Candidate & Owner';

      renderMobileQuickBar('superadmin');
      if (window.ElectWinTeam) window.ElectWinTeam.renderTeamTable();
      navigateTo('dashboard');
      if (notify) showToast('Switched to SUPER ADMIN View (Candidate Owner Full Control)! 👑');
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderMobileQuickBar(role) {
    const bar = document.getElementById('app-mobile-quick-bar');
    if (!bar) return;

    if (role === 'volunteer') {
      bar.innerHTML = `
        <button class="quick-bar-btn active" data-nav="volunteer-ward">
          <i data-lucide="home"></i>
          <span>My Ward</span>
        </button>
        <button class="quick-bar-btn" data-nav="volunteer-add">
          <i data-lucide="user-plus"></i>
          <span>+ Voter</span>
        </button>
        <button class="quick-bar-btn quick-bar-btn-center" onclick="window.ElectWinVolunteerPortal && document.getElementById('v-btn-quick-ocr').click()" title="Quick OCR">
          <i data-lucide="camera"></i>
        </button>
        <button class="quick-bar-btn" data-nav="volunteer-activity">
          <i data-lucide="activity"></i>
          <span>My Stats</span>
        </button>
      `;
    } else {
      bar.innerHTML = `
        <button class="quick-bar-btn active" data-nav="dashboard">
          <i data-lucide="layout-dashboard"></i>
          <span>Home</span>
        </button>
        <button class="quick-bar-btn" data-nav="voters">
          <i data-lucide="user-plus"></i>
          <span>+ Voter</span>
        </button>
        <button class="quick-bar-btn quick-bar-btn-center" onclick="window.ElectWinVoters && window.ElectWinVoters.openOcrScanner()" title="Scan Voter OCR">
          <i data-lucide="camera"></i>
        </button>
        <button class="quick-bar-btn" data-nav="broadcast">
          <i data-lucide="send"></i>
          <span>Broadcast</span>
        </button>
        <button class="quick-bar-btn" onclick="window.ElectWinExpenses && window.ElectWinExpenses.openAddExpenseModal()">
          <i data-lucide="indian-rupee"></i>
          <span>Expense</span>
        </button>
      `;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* ==========================================================================
     PREMIUM LOGIN & SIGNUP ENGINE
     ========================================================================== */
  function setupAuthPages() {
    const openLoginBtn = document.getElementById('open-login-btn');
    const authWrapper = document.getElementById('auth-fullscreen-section');
    const mainShell = document.getElementById('app-container');

    if (openLoginBtn) {
      openLoginBtn.addEventListener('click', () => showAuthScreen('login'));
    }

    // Switch between Login and Signup panels
    const toSignupBtn = document.getElementById('auth-link-to-signup');
    const toLoginBtn = document.getElementById('auth-link-to-login');

    if (toSignupBtn) toSignupBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthScreen('signup'); });
    if (toLoginBtn) toLoginBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthScreen('login'); });

    // Submit Login Flow
    const submitLoginBtn = document.getElementById('btn-auth-submit-login');
    if (submitLoginBtn) {
      submitLoginBtn.addEventListener('click', () => {
        submitLoginBtn.innerHTML = `<span class="pulse-dot" style="background:white;"></span> Verifying OTP...`;
        setTimeout(() => {
          submitLoginBtn.innerHTML = `<i data-lucide="check"></i> Enter Campaign Dashboard`;
          // Set logged in state
          isLoggedIn = true;
          localStorage.setItem('electwin_isLoggedIn', 'true');
          navigateTo('dashboard');
          showToast('Welcome back, Rameshwar Patel! Campaign HQ is live. 🚀');
        }, 600);
      });
    }

    // Multi-Step Signup Wizard
    let signupStep = 1;
    const nextStepBtn = document.getElementById('btn-signup-next');
    const prevStepBtn = document.getElementById('btn-signup-prev');
    const completeSignupBtn = document.getElementById('btn-signup-complete');

    function updateSignupSteps(step) {
      signupStep = step;
      document.getElementById('signup-step-content-1').style.display = step === 1 ? 'block' : 'none';
      document.getElementById('signup-step-content-2').style.display = step === 2 ? 'block' : 'none';
      document.getElementById('signup-step-content-3').style.display = step === 3 ? 'block' : 'none';

      document.getElementById('signup-pill-1').className = step === 1 ? 'auth-step-pill active' : (step > 1 ? 'auth-step-pill completed' : 'auth-step-pill');
      document.getElementById('signup-pill-2').className = step === 2 ? 'auth-step-pill active' : (step > 2 ? 'auth-step-pill completed' : 'auth-step-pill');
      document.getElementById('signup-pill-3').className = step === 3 ? 'auth-step-pill active' : 'auth-step-pill';

      if (prevStepBtn) prevStepBtn.style.display = step > 1 ? 'inline-flex' : 'none';
      if (nextStepBtn) nextStepBtn.style.display = step < 3 ? 'inline-flex' : 'none';
      if (completeSignupBtn) completeSignupBtn.style.display = step === 3 ? 'inline-flex' : 'none';
    }

    if (nextStepBtn) {
      nextStepBtn.addEventListener('click', () => {
        if (signupStep < 3) updateSignupSteps(signupStep + 1);
      });
    }

    if (prevStepBtn) {
      prevStepBtn.addEventListener('click', () => {
        if (signupStep > 1) updateSignupSteps(signupStep - 1);
      });
    }

    if (completeSignupBtn) {
      completeSignupBtn.addEventListener('click', () => {
        const candName = document.getElementById('signup-input-name')?.value || 'New Candidate';
        const panchayat = document.getElementById('signup-input-panchayat')?.value || 'Gram Panchayat';
        
        // Set logged in state after signup
        isLoggedIn = true;
        localStorage.setItem('electwin_isLoggedIn', 'true');
        navigateTo('dashboard');
        showToast(`🎉 Congratulations ${candName}! Your Super Admin campaign portal is ready.`);
      });
    }
  }

  function showAuthScreen(type = 'login') {
    const authWrapper = document.getElementById('auth-fullscreen-section');
    const mainShell = document.getElementById('app-container');
    const loginCard = document.getElementById('auth-card-login');
    const signupCard = document.getElementById('auth-card-signup');

    if (authWrapper) authWrapper.style.display = 'flex';
    if (mainShell) mainShell.style.display = 'none';

    if (type === 'signup') {
      if (loginCard) loginCard.style.display = 'none';
      if (signupCard) { signupCard.style.display = 'grid'; }
      window.location.hash = 'auth-signup';
    } else {
      if (loginCard) loginCard.style.display = 'grid';
      if (signupCard) signupCard.style.display = 'none';
      window.location.hash = 'auth-login';
    }
  }

  /* ==========================================================================
     LOGOUT FUNCTIONALITY
     ========================================================================== */
  function setupLogout() {
    // Add logout button to navbar or settings
    const navbarRight = document.querySelector('.navbar-right');
    if (navbarRight) {
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn-secondary btn-sm';
      logoutBtn.id = 'logout-btn';
      logoutBtn.style.display = 'none'; // Hidden by default, shown after login
      logoutBtn.innerHTML = '<i data-lucide="log-out" style="width: 13px; height: 13px;"></i> Logout';
      
      // Insert before the language switcher
      const langDropdown = document.getElementById('lang-dropdown-container');
      if (langDropdown) {
        navbarRight.insertBefore(logoutBtn, langDropdown);
      }
      
      logoutBtn.addEventListener('click', handleLogout);
    }
  }

  function handleLogout() {
    isLoggedIn = false;
    localStorage.setItem('electwin_isLoggedIn', 'false');
    
    // Hide logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    // Show login button
    const loginBtn = document.getElementById('open-login-btn');
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    
    // Navigate to login screen
    showAuthScreen('login');
    showToast('Logged out successfully. See you soon! 👋');
  }

  function updateAuthUI() {
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('open-login-btn');
    
    if (isLoggedIn) {
      if (logoutBtn) logoutBtn.style.display = 'inline-flex';
      if (loginBtn) loginBtn.style.display = 'none';
    } else {
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (loginBtn) loginBtn.style.display = 'inline-flex';
    }
  }

  /* ==========================================================================
     ACTIVITY FEED
     ========================================================================== */
  function renderActivityFeed() {
    const list = document.getElementById('dashboard-activity-list');
    if (!list) return;

    list.innerHTML = activityLogs.map(act => `
      <div class="activity-item">
        <div class="activity-main">
          <div class="stat-icon-box ${act.iconClass}" style="width: 28px; height: 28px;">
            <i data-lucide="${act.icon}" style="width: 14px; height: 14px;"></i>
          </div>
          <div>
            <div class="activity-title">${act.title}</div>
            <div class="activity-sub">${act.sub}</div>
          </div>
        </div>
        <div class="activity-time">${act.time}</div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  function addActivityItem(title, sub, icon = 'activity', iconClass = 'icon-cyan') {
    activityLogs.unshift({
      title: title,
      sub: sub,
      icon: icon,
      iconClass: iconClass,
      time: 'Just Now'
    });
    if (activityLogs.length > 8) activityLogs.pop();
    renderActivityFeed();
  }

  /* ==========================================================================
     TOASTS
     ========================================================================== */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.22s ease';
      setTimeout(() => toast.remove(), 220);
    }, 3000);
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    init,
    navigateTo,
    getRole,
    setRole,
    addActivityItem,
    showToast,
    showAuthScreen,
    handleLogout,
    isLoggedIn: () => isLoggedIn
  };
})();
