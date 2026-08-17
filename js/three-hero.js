/**
 * ElectWin Cinematic 3D Election Command Nexus (Three.js)
 * Inspired directly by the futuristic 3D Election Command Center concept:
 * 1. Central glowing 3D Ballot Box / EVM Core with radiating energy conduit highways.
 * 2. 3D Spinning & Orbiting Candidate Profile Cards ("प्रचार कार्ड") with real human portraits, election symbols & Hindi text.
 * 3. 3D Rotating Voter Analytics Hologram Sphere with ward percentage rings.
 * 4. 3D Holographic Location Map tile with pulsating booth pins.
 * 5. 3D Bulk Messaging Matrix with flowing particle network.
 * 6. Interactive mouse parallax, drag-to-orbit, zoom, and card spotlight focus!
 */

window.ElectWinHero3D = (function() {
  let container, scene, camera, renderer;
  let mainNexusGroup, centralBoxGroup, orbitCardsGroup, analyticsSphereGroup, mapTileGroup, messageMatrixGroup, particleStreamsGroup;
  let candidateCards = [];
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;
  let targetRotationY = 0, targetRotationX = 0;
  let autoRotate = true;
  let orbitSpeed = 1.0;
  let cardSpinSpeed = 1.0;
  let clock = new THREE.Clock();

  const candidatesData = [
    {
      name: 'Rameshwar Patel',
      nameHindi: 'रामेश्वर पटेल',
      postHindi: 'सरपंच उम्मीदवार (वार्ड 04)',
      slogan: 'चुनें, विकास और खुशहाली',
      symbol: '🚜',
      symbolName: 'ट्रैक्टर',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      lead: '74% Support Lead',
      color: '#1e3a8a',
      accentColor: '#e05a10'
    },
    {
      name: 'Sunita Devi Sharma',
      nameHindi: 'सुनीता देवी शर्मा',
      postHindi: 'वार्ड पार्षद प्रत्याशी',
      slogan: 'सशक्त, स्वच्छ एवं सुरक्षित वार्ड',
      symbol: '🪁',
      symbolName: 'पतंग',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      lead: '68% Support Lead',
      color: '#e05a10',
      accentColor: '#1e3a8a'
    },
    {
      name: 'Vikram Singh Gurjar',
      nameHindi: 'विक्रम सिंह गुर्जर',
      postHindi: 'पंच पद उम्मीदवार',
      slogan: 'युवा सोच, नई दिशा',
      symbol: '🌾',
      symbolName: 'किसान',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      lead: '72% Support Lead',
      color: '#15803d',
      accentColor: '#d97706'
    }
  ];

  function init() {
    container = document.getElementById('three-hero-container');
    if (!container || typeof THREE === 'undefined') return;

    setupScene();
    buildCentralBallotNexus();
    buildOrbitingCandidateCards();
    buildVoterAnalyticsSphere();
    buildLocationMapTile();
    buildMessagingMatrix();
    buildHighwayParticleStreams();
    setupInteractionEvents();
    animate();
  }

  function setupScene() {
    scene = new THREE.Scene();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.2, 9.8);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Clear previous canvas if any
    const oldCanvas = container.querySelector('canvas');
    if (oldCanvas) oldCanvas.remove();

    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(8, 12, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf97316, 1.6);
    dirLight2.position.set(-8, -4, -6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x0ea5e9, 3.0, 15);
    pointLight.position.set(0, 1.2, 0);
    scene.add(pointLight);

    mainNexusGroup = new THREE.Group();
    scene.add(mainNexusGroup);
  }

  // 1. CENTRAL GLOWING BALLOT BOX / EVM NEXUS
  function buildCentralBallotNexus() {
    centralBoxGroup = new THREE.Group();
    mainNexusGroup.add(centralBoxGroup);

    // Frosted Glowing EVM Cube
    const boxGeo = new THREE.BoxGeometry(1.6, 1.3, 1.6);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x0f2b48,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.4
    });
    const cube = new THREE.Mesh(boxGeo, boxMat);
    centralBoxGroup.add(cube);

    // Glowing Neon Edge Wireframe
    const edgesGeo = new THREE.EdgesGeometry(boxGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    centralBoxGroup.add(edges);

    // Top Voting Slot with Pulsing Cyan Light
    const slotGeo = new THREE.BoxGeometry(0.9, 0.08, 0.16);
    const slotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const slot = new THREE.Mesh(slotGeo, slotMat);
    slot.position.set(0, 0.68, 0);
    centralBoxGroup.add(slot);

    // Holographic Vote Paper Icon emerging from slot
    const slipGeo = new THREE.PlaneGeometry(0.7, 0.5);
    const slipCanvas = document.createElement('canvas');
    slipCanvas.width = 256;
    slipCanvas.height = 180;
    const sCtx = slipCanvas.getContext('2d');
    sCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    sCtx.fillRect(0, 0, 256, 180);
    sCtx.strokeStyle = '#0f2b48';
    sCtx.lineWidth = 6;
    sCtx.strokeRect(8, 8, 240, 164);
    sCtx.font = 'bold 36px sans-serif';
    sCtx.fillStyle = '#15803d';
    sCtx.textAlign = 'center';
    sCtx.fillText('✔ VOTE CAST', 128, 70);
    sCtx.font = 'bold 24px sans-serif';
    sCtx.fillStyle = '#e05a10';
    sCtx.fillText('RAMPUR 2026', 128, 120);

    const slipTex = new THREE.CanvasTexture(slipCanvas);
    const slipMesh = new THREE.Mesh(slipGeo, new THREE.MeshBasicMaterial({
      map: slipTex,
      transparent: true,
      side: THREE.DoubleSide
    }));
    slipMesh.position.set(0, 1.05, 0);
    slipMesh.rotation.x = -Math.PI / 8;
    centralBoxGroup.add(slipMesh);

    // Concentric Glowing Orbital Energy Rings
    for (let r = 2.4; r <= 5.2; r += 1.4) {
      const ringGeo = new THREE.RingGeometry(r, r + 0.04, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r > 3.5 ? 0x0ea5e9 : 0xf97316,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      mainNexusGroup.add(ring);
    }
  }

  // 2. 3D SPINNING & ORBITING CANDIDATE PROFILE CARDS ("प्रचार कार्ड")
  function buildOrbitingCandidateCards() {
    orbitCardsGroup = new THREE.Group();
    mainNexusGroup.add(orbitCardsGroup);
    candidateCards = [];

    const totalCards = candidatesData.length;

    candidatesData.forEach((candidate, index) => {
      const angle = (index / totalCards) * Math.PI * 2;
      const orbitRadius = 3.6;

      const cardGroup = new THREE.Group();
      cardGroup.position.set(Math.cos(angle) * orbitRadius, 0.4, Math.sin(angle) * orbitRadius);

      // Create high-res dynamic canvas texture for Candidate Card
      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = 512;
      cardCanvas.height = 360;
      const cCtx = cardCanvas.getContext('2d');

      function drawCardFace(img) {
        // Frosted Card Background with Rounded Rect
        cCtx.clearRect(0, 0, 512, 360);
        cCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        cCtx.beginPath();
        cCtx.roundRect(0, 0, 512, 360, 28);
        cCtx.fill();

        // Glowing Blue/Saffron Border
        cCtx.lineWidth = 10;
        cCtx.strokeStyle = candidate.color;
        cCtx.stroke();

        cCtx.lineWidth = 3;
        cCtx.strokeStyle = candidate.accentColor;
        cCtx.strokeRect(16, 16, 480, 328);

        // Header Pill: Post title in Hindi
        cCtx.fillStyle = candidate.color;
        cCtx.beginPath();
        cCtx.roundRect(140, 24, 340, 48, 24);
        cCtx.fill();

        cCtx.fillStyle = '#ffffff';
        cCtx.font = 'bold 22px Outfit, sans-serif';
        cCtx.textAlign = 'center';
        cCtx.fillText(candidate.postHindi, 310, 56);

        // Candidate Photo (Circular clipping)
        cCtx.save();
        cCtx.beginPath();
        cCtx.arc(80, 110, 54, 0, Math.PI * 2);
        cCtx.clip();

        if (img && img.complete && img.naturalWidth > 0) {
          cCtx.drawImage(img, 26, 56, 108, 108);
        } else {
          cCtx.fillStyle = candidate.color;
          cCtx.fillRect(26, 56, 108, 108);
          cCtx.fillStyle = '#ffffff';
          cCtx.font = 'bold 44px sans-serif';
          cCtx.textAlign = 'center';
          cCtx.fillText(candidate.name[0], 80, 125);
        }
        cCtx.restore();

        // Photo border ring
        cCtx.beginPath();
        cCtx.arc(80, 110, 54, 0, Math.PI * 2);
        cCtx.lineWidth = 5;
        cCtx.strokeStyle = candidate.accentColor;
        cCtx.stroke();

        // Election Symbol Box beside name
        cCtx.fillStyle = '#f8fafc';
        cCtx.beginPath();
        cCtx.roundRect(360, 90, 120, 90, 16);
        cCtx.fill();
        cCtx.strokeStyle = '#cbd5e1';
        cCtx.lineWidth = 2;
        cCtx.stroke();

        cCtx.font = '48px sans-serif';
        cCtx.textAlign = 'center';
        cCtx.fillText(candidate.symbol, 420, 155);

        // Candidate Name in Bold
        cCtx.fillStyle = '#0f2b48';
        cCtx.font = '900 30px Outfit, sans-serif';
        cCtx.textAlign = 'left';
        cCtx.fillText(candidate.name, 150, 120);

        cCtx.fillStyle = candidate.accentColor;
        cCtx.font = 'bold 24px Outfit, sans-serif';
        cCtx.fillText(candidate.nameHindi, 150, 155);

        // Campaign Slogan Banner ("चुनें, विकास")
        cCtx.fillStyle = '#0f2b48';
        cCtx.beginPath();
        cCtx.roundRect(24, 195, 464, 60, 14);
        cCtx.fill();

        cCtx.fillStyle = '#ffffff';
        cCtx.font = 'italic bold 22px Outfit, sans-serif';
        cCtx.textAlign = 'center';
        cCtx.fillText(`“${candidate.slogan}”`, 256, 234);

        // Footer Support Lead Indicator
        cCtx.fillStyle = '#15803d';
        cCtx.font = 'bold 20px "JetBrains Mono", monospace';
        cCtx.fillText(`★ ${candidate.lead.toUpperCase()} ★`, 256, 305);
        cCtx.font = 'bold 15px sans-serif';
        cCtx.fillStyle = '#64748b';
        cCtx.fillText(`चुनाव चिन्ह: ${candidate.symbolName}`, 256, 335);

        cardTexture.needsUpdate = true;
      }

      const cardTexture = new THREE.CanvasTexture(cardCanvas);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = candidate.photoUrl;
      img.onload = () => drawCardFace(img);
      drawCardFace(null);

      // 3D Card Mesh with Dual-Sided Glass Depth
      const cardGeo = new THREE.BoxGeometry(2.0, 1.4, 0.08);
      const cardMat = new THREE.MeshStandardMaterial({
        map: cardTexture,
        metalness: 0.2,
        roughness: 0.15,
        transparent: true,
        opacity: 0.96
      });
      const cardMesh = new THREE.Mesh(cardGeo, cardMat);
      cardGroup.add(cardMesh);

      // Glowing Aura behind card
      const glowGeo = new THREE.PlaneGeometry(2.3, 1.7);
      const glowMat = new THREE.MeshBasicMaterial({
        color: index === 0 ? 0x0ea5e9 : 0xf97316,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.position.z = -0.06;
      cardGroup.add(glowMesh);

      orbitCardsGroup.add(cardGroup);

      candidateCards.push({
        group: cardGroup,
        mesh: cardMesh,
        angle: angle,
        orbitRadius: orbitRadius,
        baseY: 0.4 + (index * 0.2),
        spinSpeed: 0.8 + (index * 0.2)
      });
    });
  }

  // 3. 3D VOTER ANALYTICS HOLOGRAPHIC SPHERE
  function buildVoterAnalyticsSphere() {
    analyticsSphereGroup = new THREE.Group();
    analyticsSphereGroup.position.set(4.8, 1.8, -1.2);
    mainNexusGroup.add(analyticsSphereGroup);

    // Wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(1.0, 24, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    analyticsSphereGroup.add(sphere);

    // Glowing Inner Core
    const coreGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    analyticsSphereGroup.add(core);

    // Orbiting Analytics Percentage Rings
    const ring1 = new THREE.Mesh(
      new THREE.RingGeometry(1.25, 1.3, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    ring1.rotation.x = Math.PI / 3;
    analyticsSphereGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.45, 32),
      new THREE.MeshBasicMaterial({ color: 0xf97316, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    ring2.rotation.y = Math.PI / 4;
    analyticsSphereGroup.add(ring2);

    // Floating Telemetry Label ("Voter Analytics Sphere")
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256;
    labelCanvas.height = 100;
    const lCtx = labelCanvas.getContext('2d');
    lCtx.fillStyle = 'rgba(15, 43, 72, 0.9)';
    lCtx.roundRect(0, 0, 256, 100, 16);
    lCtx.fill();
    lCtx.strokeStyle = '#0ea5e9';
    lCtx.lineWidth = 3;
    lCtx.stroke();
    lCtx.fillStyle = '#ffffff';
    lCtx.font = 'bold 20px Outfit, sans-serif';
    lCtx.textAlign = 'center';
    lCtx.fillText('Voter Analytics', 128, 40);
    lCtx.fillStyle = '#10b981';
    lCtx.font = 'bold 16px "JetBrains Mono", monospace';
    lCtx.fillText('Ward 04: 74% Lead', 128, 75);

    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.55), new THREE.MeshBasicMaterial({ map: labelTex, transparent: true }));
    labelMesh.position.set(0, 1.4, 0);
    analyticsSphereGroup.add(labelMesh);
  }

  // 4. 3D LOCATION MAP TILE
  function buildLocationMapTile() {
    mapTileGroup = new THREE.Group();
    mapTileGroup.position.set(3.8, -0.6, 2.6);
    mainNexusGroup.add(mapTileGroup);

    // Tilted Vector Map Surface
    const mapGeo = new THREE.PlaneGeometry(2.0, 1.6);
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = 256;
    mapCanvas.height = 200;
    const mCtx = mapCanvas.getContext('2d');
    mCtx.fillStyle = '#0f2b48';
    mCtx.fillRect(0, 0, 256, 200);

    // Glowing Neon Boundary
    mCtx.strokeStyle = '#10b981';
    mCtx.lineWidth = 4;
    mCtx.strokeRect(10, 10, 236, 180);
    mCtx.fillStyle = '#ffffff';
    mCtx.font = 'bold 18px Outfit, sans-serif';
    mCtx.fillText('📍 Rampur (Jaipur)', 20, 40);
    mCtx.fillStyle = '#0ea5e9';
    mCtx.font = '14px sans-serif';
    mCtx.fillText('6 Polling Booths Active', 20, 70);

    const mapTex = new THREE.CanvasTexture(mapCanvas);
    const mapMesh = new THREE.Mesh(mapGeo, new THREE.MeshBasicMaterial({ map: mapTex, side: THREE.DoubleSide }));
    mapMesh.rotation.x = -Math.PI / 3;
    mapTileGroup.add(mapMesh);

    // Pulsating 3D Booth Pin
    const pinGeo = new THREE.ConeGeometry(0.12, 0.35, 16);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xe05a10, emissive: 0xe05a10, emissiveIntensity: 0.8 });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(0.2, 0.4, 0.1);
    pin.rotation.x = Math.PI;
    mapTileGroup.add(pin);
  }

  // 5. 3D MESSAGING MATRIX
  function buildMessagingMatrix() {
    messageMatrixGroup = new THREE.Group();
    messageMatrixGroup.position.set(-4.2, 0.2, 1.8);
    mainNexusGroup.add(messageMatrixGroup);

    const nodeCount = 18;
    for (let i = 0; i < nodeCount; i++) {
      const nodeGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x25d366 : 0x0ea5e9 });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set((Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.6);
      messageMatrixGroup.add(node);
    }
  }

  // 6. HIGHWAY GLOWING PARTICLE STREAMS
  function buildHighwayParticleStreams() {
    particleStreamsGroup = new THREE.Group();
    mainNexusGroup.add(particleStreamsGroup);

    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyan = new THREE.Color(0x0ea5e9);
    const saffron = new THREE.Color(0xf97316);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.random() * 4.2;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const c = Math.random() > 0.5 ? cyan : saffron;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particleStreamsGroup.add(particles);
  }

  // Mouse Parallax & Interactive Orbit Drag
  function setupInteractionEvents() {
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      if (window.ElectWinAudio) window.ElectWinAudio.playHover();
    });

    window.addEventListener('mouseup', () => isDragging = false);

    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = mouseX * 0.35;
        targetRotationX = -mouseY * 0.25;
      }

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        mainNexusGroup.rotation.y += deltaX * 0.008;
        mainNexusGroup.rotation.x += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    });

    // Resize
    window.addEventListener('resize', () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // 1. Central EVM Box Floating & Energy Pulse
    if (centralBoxGroup) {
      centralBoxGroup.position.y = Math.sin(elapsedTime * 2.0) * 0.08;
      centralBoxGroup.rotation.y = elapsedTime * 0.15;
    }

    // 2. Candidate Cards Orbiting AND Spinning
    if (autoRotate && candidateCards.length > 0) {
      candidateCards.forEach((c, idx) => {
        // Orbit motion along radius
        const currentAngle = c.angle + (elapsedTime * 0.35 * orbitSpeed);
        c.group.position.x = Math.cos(currentAngle) * c.orbitRadius;
        c.group.position.z = Math.sin(currentAngle) * c.orbitRadius;
        c.group.position.y = c.baseY + Math.sin(elapsedTime * 2.0 + idx) * 0.12;

        // Make card SPIN gracefully on its own Y-axis (like 3D spinning profile card!)
        c.group.rotation.y = -(currentAngle) + Math.PI / 2 + Math.sin(elapsedTime * 1.5) * 0.25;
        c.mesh.rotation.y = (elapsedTime * c.spinSpeed * cardSpinSpeed);
      });
    }

    // 3. Analytics Sphere Rotation
    if (analyticsSphereGroup) {
      analyticsSphereGroup.rotation.y = elapsedTime * 0.5;
      analyticsSphereGroup.position.y = 1.8 + Math.sin(elapsedTime * 1.8) * 0.1;
    }

    // 4. Map Tile Float
    if (mapTileGroup) {
      mapTileGroup.position.y = -0.6 + Math.cos(elapsedTime * 1.5) * 0.08;
    }

    // 5. Particle Streams Flow
    if (particleStreamsGroup) {
      particleStreamsGroup.rotation.y = elapsedTime * 0.25;
    }

    // Camera Parallax Smoothing
    if (!isDragging && mainNexusGroup) {
      mainNexusGroup.rotation.y += (targetRotationY - mainNexusGroup.rotation.y) * 0.05;
      mainNexusGroup.rotation.x += (targetRotationX - mainNexusGroup.rotation.x) * 0.05;
    }

    renderer.render(scene, camera);
  }

  function setOrbitSpeed(speed) {
    orbitSpeed = speed;
  }

  function toggleAutoRotate() {
    autoRotate = !autoRotate;
    return autoRotate;
  }

  return {
    init,
    setOrbitSpeed,
    toggleAutoRotate
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (window.ElectWinHero3D) {
    window.ElectWinHero3D.init();
  }
});
