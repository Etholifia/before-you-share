import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const popMessages = {
  en: [
    'URGENT: Citywide shutdown tomorrow!',
    'Free transit passes if you click now',
    'Unbelievable: Mayor resigns amidst scandal',
    'Are they hiding the true water levels?',
    'Miracle cure found in common weed',
    'Local schools secretly banning this book',
    "Don't eat the new brand of imported fish!"
  ],
  zh: [
    '紧急通知：明天全市停课！',
    '点击立刻领取免费公交卡',
    '突发：市长因丑闻辞职',
    '水库真实水位被隐瞒了吗？',
    '路边杂草竟是神药，快转发给家人',
    '本地学校正秘密封杀这本书',
    '千万别吃这种新进口的海鲜！'
  ]
};

const canvas = document.querySelector('#webgl-canvas');

if (canvas) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPower =
    reducedMotion ||
    innerWidth < 720 ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  const MAX_BUBBLES = lowPower ? 55 : 95;
  const EXPLOSION_BUBBLES = lowPower ? 40 : 70;
  const BACKGROUND_BUBBLES = lowPower ? 16 : 28;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0c10, 0.002);
  scene.background = new THREE.Color(0x0a0c10);

  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 150);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, lowPower ? 1.15 : 1.5));

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(
    new THREE.Vector2(innerWidth, innerHeight),
    lowPower ? 0.65 : 0.85,
    0.45,
    0.88
  ));

  scene.add(new THREE.AmbientLight(0xffffff, 0.42));

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 1.35, 100);
  camera.add(pointLight);
  scene.add(camera);

  // 32x32 stays visually smooth while doing much less work than 64x64.
  const geometry = new THREE.SphereGeometry(1, lowPower ? 24 : 32, lowPower ? 24 : 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x4d79d8,
    transmission: 0.85,
    opacity: 1,
    metalness: 0.08,
    roughness: 0,
    ior: 1.15,
    thickness: 0.1,
    specularIntensity: 1.8,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transparent: true,
    side: THREE.DoubleSide
  });

  const dropletGeo = new THREE.SphereGeometry(0.2, 12, 12);
  const bubbleGroup = new THREE.Group();
  const bubbles = [];
  const particles = [];
  scene.add(bubbleGroup);

  let introState = 0; // 0=wait, 1=first bubbles, 2=multiplying, 3=explosion, 4=main
  let popCount = 0;

  const introOverlay = document.getElementById('intro-overlay');
  const introHole = document.querySelector('.intro-hole');
  const introHitbox = document.getElementById('intro-hitbox');
  const hint1 = document.querySelector('.hint-step1');
  const hint2 = document.querySelector('.hint-step2');
  const popupsContainer = document.getElementById('bubble-popups');

  function removeBubbleAt(index) {
    const bubble = bubbles[index];
    if (!bubble) return;
    bubbleGroup.remove(bubble);
    bubble.material.dispose();
    bubbles.splice(index, 1);
  }

  function spawnBubble(baseY = -150, constrained = false) {
    if (bubbles.length >= MAX_BUBBLES) return null;

    const mesh = new THREE.Mesh(geometry, material.clone());

    if (constrained) {
      mesh.position.set(
        (Math.random() - 0.5) * 56,
        baseY,
        (Math.random() - 0.5) * 12
      );
    } else {
      mesh.position.set(
        (Math.random() - 0.5) * 220,
        baseY - Math.random() * 42,
        (Math.random() - 0.5) * 70
      );
    }

    // A clear minimum size keeps the composition from filling with pinprick bubbles.
    const size = constrained
      ? 4.0 + Math.random() * 2.4
      : 3.6 + Math.random() * 3.0;

    mesh.scale.setScalar(size);
    mesh.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.08,
        Math.random() * 0.16 + 0.08,
        0
      ),
      originalScale: size,
      popping: false,
      popTime: 0,
      phase: Math.random() * Math.PI * 2
    };

    bubbleGroup.add(mesh);
    bubbles.push(mesh);
    return mesh;
  }

  function spawnDroplets(position) {
    const count = lowPower ? 4 : 6;

    for (let i = 0; i < count; i++) {
      const drop = new THREE.Mesh(dropletGeo, material);
      drop.position.copy(position);
      drop.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 1.7,
          Math.random() * 1.7 + 0.8,
          (Math.random() - 0.5) * 1.7
        ),
        life: 1
      };
      bubbleGroup.add(drop);
      particles.push(drop);
    }
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  addEventListener('click', event => {
    if (introState === 0) return;

    pointer.x = (event.clientX / innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const hit = raycaster
      .intersectObjects(bubbles)
      .find(item => !item.object.userData.popping);

    if (!hit) return;

    popBubble(hit.object);

    if (introState === 1 || introState === 2) {
      introState = 2;
      popCount++;

      const newCount = Math.min(2 + popCount, lowPower ? 5 : 7);
      for (let i = 0; i < newCount; i++) {
        spawnBubble(-20 - Math.random() * 12, true);
      }

      if (popCount >= 5) {
        introState = 3;
        triggerExplosion();
      }
    }
  });

  if (introHitbox) {
    introHitbox.addEventListener('click', event => {
      if (introState !== 0) return;
      event.stopPropagation();

      introState = 1;
      if (hint1) hint1.hidden = true;
      if (hint2) hint2.hidden = false;

      spawnBubble(-18, true);
      spawnBubble(-29, true);
      spawnBubble(-24, true);
    });
  }

  function triggerExplosion() {
    if (introHole) introHole.classList.add('explode');
    if (hint2) hint2.hidden = true;
    if (introHitbox) introHitbox.style.pointerEvents = 'none';

    for (let i = 0; i < EXPLOSION_BUBBLES; i++) {
      spawnBubble((Math.random() - 0.5) * 170);
    }

    setTimeout(() => {
      if (introOverlay) introOverlay.classList.add('hidden');
      document.body.classList.remove('intro-locked');
      introState = 4;

      for (let i = 0; i < BACKGROUND_BUBBLES; i++) {
        spawnBubble((Math.random() - 0.5) * 260);
      }

      if (introOverlay) {
        setTimeout(() => introOverlay.remove(), 1000);
      }
    }, 900);
  }

  function popBubble(mesh) {
    mesh.userData.popping = true;
    spawnDroplets(mesh.position);

    const vector = mesh.position.clone().project(camera);

    if (popupsContainer) {
      const popup = document.createElement('div');
      popup.className = 'bubble-popup';
      popup.style.left = `${(vector.x * 0.5 + 0.5) * innerWidth}px`;
      popup.style.top = `${(vector.y * -0.5 + 0.5) * innerHeight}px`;

      const activeLang = localStorage.getItem('bys-lang') || 'en';
      const list = popMessages[activeLang] || popMessages.en;
      popup.textContent = list[Math.floor(Math.random() * list.length)];

      popupsContainer.appendChild(popup);
      setTimeout(() => popup.remove(), 2200);
    }
  }

  let scrollY = window.scrollY;
  let mouseX = 0;
  let mouseY = 0;

  addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  addEventListener('mousemove', event => {
    mouseX = (event.clientX / innerWidth) * 2 - 1;
    mouseY = -(event.clientY / innerHeight) * 2 + 1;
  }, { passive: true });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    if (introState === 4) {
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
      const targetCamY = -scrollProgress * 200;

      camera.position.x += ((mouseX * 8) - camera.position.x) * 0.045;
      camera.position.y += ((targetCamY + mouseY * 7) - camera.position.y) * 0.045;

      const spawnChance = lowPower
        ? 0.0015
        : 0.0025 + scrollProgress * 0.0045;

      if (bubbles.length < MAX_BUBBLES && Math.random() < spawnChance) {
        spawnBubble(camera.position.y - 105);
      }
    }

    for (let i = bubbles.length - 1; i >= 0; i--) {
      const bubble = bubbles[i];

      if (bubble.userData.popping) {
        bubble.userData.popTime += 0.08;
        const progress = bubble.userData.popTime;
        bubble.scale.setScalar(bubble.userData.originalScale + progress * 18);
        bubble.material.opacity = Math.max(0, 1 - progress * 2);

        if (progress > 0.5) removeBubbleAt(i);
        continue;
      }

      bubble.position.add(bubble.userData.velocity);
      bubble.userData.phase += delta * 1.8;

      // Uniform scale = a real sphere at every frame. No X/Y squashing.
      const pulse = 1 + Math.sin(bubble.userData.phase) * 0.035;
      bubble.scale.setScalar(bubble.userData.originalScale * pulse);

      bubble.position.x += Math.sin(time * 1.7 + i) * 0.02;

      if (introState < 3) {
        if (bubble.position.y > 31) bubble.position.y = -31;
        if (Math.abs(bubble.position.x) > 39) {
          bubble.userData.velocity.x *= -1;
        }
      } else if (bubble.position.y > camera.position.y + 145) {
        removeBubbleAt(i);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];

      particle.position.add(particle.userData.velocity);
      particle.userData.velocity.y -= 0.08;
      particle.userData.life -= delta * 1.5;
      particle.scale.setScalar(Math.max(0, particle.userData.life));

      if (particle.userData.life <= 0) {
        bubbleGroup.remove(particle);
        particles.splice(i, 1);
      }
    }

    if (!document.hidden) composer.render();
  }

  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('hidden');

  // The inline fallback in index.html listens for this.
  dispatchEvent(new CustomEvent('bys-webgl-ready'));

  if (reducedMotion) {
    if (typeof window.__BYS_UNLOCK_FALLBACK__ === 'function') {
      window.__BYS_UNLOCK_FALLBACK__();
    }
    introState = 4;
    for (let i = 0; i < 10; i++) {
      spawnBubble((Math.random() - 0.5) * 220);
    }
  }

  animate();
}
