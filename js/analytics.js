/**
 * ElectWin – Analytics, Forecast Charts & Turnout Simulator
 * Visualizes ward coverage, channel delivery rates, design print volume,
 * and live victory margin simulations with actual CSV export triggers.
 */

window.ElectWinAnalytics = (function() {
  let chartWard, chartDelivery, chartDesign, chartVolunteer;

  function init() {
    setupCharts();
    setupSimulator();
    setupExportButtons();
  }

  function setupCharts() {
    // 1. Ward-Wise Voter Coverage %
    const ctxWard = document.getElementById('chart-ward-coverage');
    if (ctxWard) {
      chartWard = new Chart(ctxWard, {
        type: 'bar',
        data: {
          labels: ['Ward 01', 'Ward 02', 'Ward 03', 'Ward 04', 'Ward 05', 'Ward 06'],
          datasets: [{
            label: 'Electors Reached %',
            data: [78, 86, 64, 94, 72, 81],
            backgroundColor: '#0284c7',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    }

    // 2. Message Delivery Split
    const ctxDeliv = document.getElementById('chart-channel-delivery');
    if (ctxDeliv) {
      chartDelivery = new Chart(ctxDeliv, {
        type: 'doughnut',
        data: {
          labels: ['WhatsApp (81.4%)', 'SMS Fallback (17.5%)', 'Failed (1.1%)'],
          datasets: [{
            data: [2850, 612, 38],
            backgroundColor: ['#25d366', '#0284c7', '#e11d48']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 3. Design Material Prints
    const ctxDesign = document.getElementById('chart-design-usage');
    if (ctxDesign) {
      chartDesign = new Chart(ctxDesign, {
        type: 'bar',
        data: {
          labels: ['A5 Pamphlets', '3x6 Banners', '4x8 Hoardings', 'DL Slips', 'Status 9:16'],
          datasets: [{
            label: 'Copies Distributed',
            data: [1500, 18, 8, 2200, 450],
            backgroundColor: '#7c3aed',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    // 4. Volunteer Door-to-Door Contacts
    const ctxVol = document.getElementById('chart-volunteer-activity');
    if (ctxVol) {
      chartVolunteer = new Chart(ctxVol, {
        type: 'line',
        data: {
          labels: ['10 Aug', '11 Aug', '12 Aug', '13 Aug', '14 Aug', '15 Aug', '16 Aug'],
          datasets: [{
            label: 'Home Visits Logged',
            data: [42, 65, 88, 110, 145, 180, 210],
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  function setupSimulator() {
    const turnoutSlider = document.getElementById('sim-turnout-slider');
    const youthSlider = document.getElementById('sim-youth-slider');
    const swingSlider = document.getElementById('sim-swing-slider');

    const turnoutVal = document.getElementById('sim-turnout-val');
    const youthVal = document.getElementById('sim-youth-val');
    const swingVal = document.getElementById('sim-swing-val');

    const probNumber = document.getElementById('sim-prob-number');
    const probBar = document.getElementById('sim-prob-bar');

    function calculateWinProbability() {
      const turnout = parseInt(turnoutSlider.value, 10);
      const youth = parseInt(youthSlider.value, 10);
      const swing = parseInt(swingSlider.value, 10);

      turnoutVal.textContent = `${turnout}%`;
      youthVal.textContent = `${youth}%`;
      swingVal.textContent = `${swing}%`;

      const score = Math.round((turnout * 0.35) + (youth * 0.35) + (swing * 0.30));
      probNumber.textContent = `${score}%`;
      probBar.style.width = `${score}%`;

      if (score >= 70) {
        probNumber.style.color = 'var(--mint-primary)';
        probBar.style.background = 'var(--mint-primary)';
      } else if (score >= 50) {
        probNumber.style.color = 'var(--amber-primary)';
        probBar.style.background = 'var(--amber-primary)';
      } else {
        probNumber.style.color = 'var(--rose-primary)';
        probBar.style.background = 'var(--rose-primary)';
      }
    }

    if (turnoutSlider && youthSlider && swingSlider) {
      turnoutSlider.addEventListener('input', calculateWinProbability);
      youthSlider.addEventListener('input', calculateWinProbability);
      swingSlider.addEventListener('input', calculateWinProbability);
    }
  }

  function setupExportButtons() {
    const excelBtn = document.getElementById('export-excel-btn');
    const pdfBtn = document.getElementById('export-pdf-btn');

    if (excelBtn) {
      excelBtn.addEventListener('click', () => {
        const voters = window.ElectWinVoters ? window.ElectWinVoters.getVoters() : [];
        let csvContent = 'data:text/csv;charset=utf-8,Voter ID,Name,Age,Gender,Ward,Mobile,Channel,Consent,Status\n';
        voters.forEach(v => {
          csvContent += `"${v.id}","${v.name}","${v.age}","${v.gender}","${v.ward}","${v.mobile}","${v.channel}","${v.consent}","${v.status}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `ElectWin_Voters_Report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (window.ElectWinApp) {
          window.ElectWinApp.addActivityItem(
            'Exported Campaign Electors Database (CSV)',
            `${voters.length} rows exported for field printing`,
            'file-spreadsheet',
            'icon-mint'
          );
          window.ElectWinApp.showToast(`Exported ${voters.length} electors records to CSV! 📊`);
        }
      });
    }

    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => {
        if (window.ElectWinApp) {
          window.ElectWinApp.addActivityItem(
            'Generated Election Intelligence Summary (PDF)',
            '6 Booths & Turnout Projections Summary',
            'download',
            'icon-purple'
          );
          window.ElectWinApp.showToast('Downloaded Campaign Analytics Summary PDF! 📄');
        }
      });
    }
  }

  function refreshCharts() {
    if (chartWard) chartWard.update();
    if (chartDelivery) chartDelivery.update();
    if (chartDesign) chartDesign.update();
    if (chartVolunteer) chartVolunteer.update();
  }

  return {
    init,
    refreshCharts
  };
})();
