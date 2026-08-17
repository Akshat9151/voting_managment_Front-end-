/**
 * ElectWin – Branding & Accent Color Customizer
 * Instant live preview across sidebar, header, and generated flex banners.
 */

window.ElectWinBranding = (function() {
  function init() {
    setupColorPicker();
    setupLogoUpload();
    setupBrandingForm();
  }

  function setupColorPicker() {
    const swatches = document.querySelectorAll('.color-swatch-btn');
    swatches.forEach(btn => {
      btn.addEventListener('click', () => {
        swatches.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const color = btn.getAttribute('data-color');
        document.documentElement.style.setProperty('--cyan-primary', color);
        document.documentElement.style.setProperty('--brand-primary', color);

        // Update preview banner
        const bannerStrip = document.getElementById('preview-banner-header-strip');
        if (bannerStrip) bannerStrip.style.backgroundColor = color;

        // Re-render poster with new brand accent
        if (window.ElectWinStudio) window.ElectWinStudio.renderPoster();
      });
    });
  }

  function setupLogoUpload() {
    const dropzone = document.getElementById('branding-logo-dropzone');
    const fileInput = document.getElementById('branding-logo-file-input');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processLogoFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processLogoFile(e.target.files[0]);
      }
    });
  }

  function processLogoFile(file) {
    if (!file.type.startsWith('image/')) {
      window.ElectWinApp.showToast('Please upload an image file (PNG/JPG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;

      // Update header logo badge
      const headerLogo = document.getElementById('navbar-brand-logo-badge');
      if (headerLogo) {
        headerLogo.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
      }

      // Update preview badge
      const prevLogo = document.getElementById('preview-nav-logo-badge');
      if (prevLogo) {
        prevLogo.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
      }

      window.ElectWinApp.showToast('Campaign logo updated live across the platform! 🎨');
    };
    reader.readAsDataURL(file);
  }

  function setupBrandingForm() {
    const titleInput = document.getElementById('branding-panel-title-input');
    const subtitleInput = document.getElementById('branding-panel-subtitle-input');
    const saveBtn = document.getElementById('btn-save-branding');

    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        const val = e.target.value;
        const navTitle = document.getElementById('navbar-panel-title');
        const prevTitle = document.getElementById('preview-nav-title');
        if (navTitle) navTitle.innerHTML = val || 'Elect<span>Win</span>';
        if (prevTitle) prevTitle.textContent = val || 'ElectWin';
      });
    }

    if (subtitleInput) {
      subtitleInput.addEventListener('input', (e) => {
        const val = e.target.value;
        const navSub = document.getElementById('navbar-panel-subtitle');
        const prevSub = document.getElementById('preview-nav-subtitle');
        if (navSub) navSub.textContent = val;
        if (prevSub) prevSub.textContent = val;
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (window.ElectWinApp) {
          window.ElectWinApp.addActivityItem(
            'Updated Campaign Branding & Theme Settings',
            'Colors and customized campaign title saved',
            'palette',
            'icon-cyan'
          );
          window.ElectWinApp.showToast('Campaign branding and theme saved successfully! ✅');
        }
      });
    }
  }

  return {
    init
  };
})();
