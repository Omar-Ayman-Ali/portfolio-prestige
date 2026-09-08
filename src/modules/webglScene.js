import * as THREE from 'three';

export function initWebGLScene() {
  const container = document.getElementById('webgl-canvas-container');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08080a, 0.04);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 6.5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
  mainLight.position.set(5, 8, 5);
  scene.add(mainLight);

  const orangePointLight = new THREE.PointLight(0xff4800, 3.5, 15);
  orangePointLight.position.set(-3, -2, 2);
  scene.add(orangePointLight);

  const bluePointLight = new THREE.PointLight(0x3b82f6, 2.0, 15);
  bluePointLight.position.set(3, 4, -2);
  scene.add(bluePointLight);

  // Main 3D Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // 1. Central Prestige Prism (Outer Faceted Glass/Metallic Shell)
  const outerGeo = new THREE.IcosahedronGeometry(1.6, 0);
  const outerMat = new THREE.MeshPhysicalMaterial({
    color: 0x18181f,
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.4,
    ior: 1.5,
    wireframe: false,
    flatShading: true,
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  masterGroup.add(outerMesh);

  // 2. Prestige Inner Wireframe Cage
  const wireGeo = new THREE.IcosahedronGeometry(1.85, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xff5500,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  masterGroup.add(wireMesh);

  // 3. Floating Inner Ember Core
  const coreGeo = new THREE.OctahedronGeometry(0.7, 0);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xff4800,
    emissiveIntensity: 1.8,
    roughness: 0.2,
    metalness: 0.8,
    flatShading: true,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  masterGroup.add(coreMesh);

  // 4. Concentric Orbital Rings
  const ringGeo1 = new THREE.TorusGeometry(2.3, 0.015, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
  });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 3;
  masterGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(2.6, 0.012, 16, 100);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0xff4800,
    transparent: true,
    opacity: 0.25,
  });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.y = Math.PI / 4;
  masterGroup.add(ring2);

  // 5. Ambient Volumetric Particle Cloud
  const particleCount = 750;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleScales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 18;
    particlePositions[i + 1] = (Math.random() - 0.5) * 18;
    particlePositions[i + 2] = (Math.random() - 0.5) * 14;
    particleScales[i / 3] = Math.random() * 0.05 + 0.01;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Mouse tracking with smooth lerping
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  // Scroll reactivity
  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      scrollProgress = window.scrollY / totalHeight;
    }
  }, { passive: true });

  // Resize handler
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener('resize', onResize);

  // Animation Loop
  const clock = new THREE.Clock();
  let isVisible = true;

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp mouse coordinates
    current.x += (target.x - current.x) * 0.04;
    current.y += (target.y - current.y) * 0.04;

    // Master group rotation & mouse parallax
    masterGroup.rotation.y = elapsedTime * 0.25 + current.x * 0.8;
    masterGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2 - current.y * 0.5;

    // Position adjustments according to scroll
    masterGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.15 - scrollProgress * 3.5;
    masterGroup.position.x = current.x * 0.5;

    // Inner element counter-rotations
    outerMesh.rotation.y = elapsedTime * 0.35;
    outerMesh.rotation.z = elapsedTime * 0.15;

    coreMesh.rotation.x = -elapsedTime * 0.6;
    coreMesh.rotation.y = -elapsedTime * 0.5;
    const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
    coreMesh.scale.set(pulse, pulse, pulse);

    wireMesh.rotation.y = -elapsedTime * 0.15;
    wireMesh.rotation.z = Math.sin(elapsedTime * 0.5) * 0.2;

    ring1.rotation.z = elapsedTime * 0.4;
    ring2.rotation.z = -elapsedTime * 0.3;

    // Slowly rotate particle dust
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  return {
    destroy: () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    }
  };
}
