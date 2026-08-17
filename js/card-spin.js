/**
 * ElectWin Interactive 3D Spinning Candidate Profile Card Controller
 * Controls dynamic 3D card gyroscopic rotations, continuous 360° spinning, and 180° flip effects.
 */

window.ElectWinCardSpin = (function() {
  let cardElement;
  let isFlipped = false;
  let isAutoSpinning = true;
  let spinAngle = 0;
  let animationFrameId;

  function init() {
    cardElement = document.getElementById('spinning-profile-card');
    if (!cardElement) return;

    setupCardControls();
    startAutoSpin();
  }

  function setupCardControls() {
    const flipBtn = document.getElementById('card-flip-btn');
    const spinToggleBtn = document.getElementById('card-spin-toggle-btn');
    const cardWrapper = document.querySelector('.spinning-card-wrapper');

    if (cardWrapper) {
      cardWrapper.addEventListener('click', () => {
        toggleFlip();
      });

      // Gyroscopic 3D mouse tilt when not spinning fast
      cardWrapper.addEventListener('mousemove', (e) => {
        if (isAutoSpinning) return;
        const rect = cardWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -16;
        const rotateY = ((x - centerX) / centerX) * 16;

        cardElement.style.transform = `rotateY(${rotateY + (isFlipped ? 180 : 0)}deg) rotateX(${rotateX}deg)`;
      });

      cardWrapper.addEventListener('mouseleave', () => {
        if (!isAutoSpinning) {
          cardElement.style.transform = `rotateY(${isFlipped ? 180 : 0}deg) rotateX(0deg)`;
        }
      });
    }

    if (flipBtn) {
      flipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFlip();
      });
    }

    if (spinToggleBtn) {
      spinToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isAutoSpinning = !isAutoSpinning;
        spinToggleBtn.innerHTML = isAutoSpinning ? 
          '<i data-lucide="pause"></i> Pause 3D Spin' : 
          '<i data-lucide="play"></i> Auto-Spin 3D';
        
        if (typeof lucide !== 'undefined') lucide.createIcons();

        if (isAutoSpinning) {
          startAutoSpin();
        } else {
          cancelAnimationFrame(animationFrameId);
          cardElement.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
        }

        if (window.ElectWinAudio) window.ElectWinAudio.playClick();
      });
    }
  }

  function toggleFlip() {
    isFlipped = !isFlipped;
    if (window.ElectWinAudio) window.ElectWinAudio.playWhoosh();
    
    if (!isAutoSpinning) {
      cardElement.style.transform = `rotateY(${isFlipped ? 180 : 0}deg)`;
    }

    if (window.ElectWinApp && window.ElectWinApp.showToast) {
      window.ElectWinApp.showToast(isFlipped ? 'Flipped to Ground Manifesto & Booth Intel' : 'Flipped to Candidate Front Profile');
    }
  }

  function startAutoSpin() {
    function spinLoop() {
      if (!isAutoSpinning || !cardElement) return;
      spinAngle = (spinAngle + 0.8) % 360;
      cardElement.style.transform = `rotateY(${spinAngle}deg)`;
      animationFrameId = requestAnimationFrame(spinLoop);
    }
    animationFrameId = requestAnimationFrame(spinLoop);
  }

  return {
    init,
    toggleFlip
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (window.ElectWinCardSpin) {
    window.ElectWinCardSpin.init();
  }
});
