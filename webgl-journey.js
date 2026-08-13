import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Random Headlines generator
const headlines = {
  en: [
    "URGENT: Citywide shutdown tomorrow!", 
    "Free transit passes if you click now", 
    "Unbelievable: Mayor resigns amidst scandal", 
    "Are they hiding the true water levels?", 
    "Miracle cure found in common weed", 
    "Local schools secretly banning this book", 
    "Don't eat the new brand of imported fish!"
  ],
  zh: [
    "紧急通知：明天全市停课！", 
    "点击立刻领取免费公交卡", 
    "突发：市长因丑闻辞职", 
    "水库真实水位被隐瞒了吗？", 
    "路边杂草竟是神药，快转发给家人", 
    "本地学校正秘密封杀这本书", 
    "千万别吃这种新进口的海鲜！"
  ]
};

const canvas = document.querySelector('#webgl-canvas');
if (canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0c10, 0.002);
  scene.background = new THREE.Color(0x0a0c10);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 150);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Post-processing for glowing bubbles
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.5, 0.85);
  composer.addPass(bloomPass);

  // Lights for realistic reflections
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);
  
  // Point light attached to camera for crisp specular highlights on bubbles
  const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
  camera.add(pointLight);
  scene.add(camera);

  // Geometry & Realistic Bubble Material
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x4d79d8, // Deep blue
    transmission: 0.85, // Lowered slightly so the blue base color shows strongly
    opacity: 1,
    metalness: 0.1,
    roughness: 0, // Perfectly smooth
    ior: 1.15, // Air to water/soap transition
    thickness: 0.1, // Thin membrane
    specularIntensity: 2.0,
    clearcoat: 1.0, // High gloss reflection
    clearcoatRoughness: 0.1,
    transparent: true,
    side: THREE.DoubleSide // Crucial for seeing the back wall of the bubble!
  });

  const bubbles = [];
  const particles = [];
  const bubbleGroup = new THREE.Group();
  scene.add(bubbleGroup);
  
  // Particle geometry for popping droplets
  const dropletGeo = new THREE.SphereGeometry(0.2, 16, 16);

  let introState = 0; // 0=Wait, 1=1 bubble, 2=Multiplying, 3=Explosion, 4=Main
  let popCount = 0;

  function spawnBubble(baseY = -150, constrained = false) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    
    if (constrained) {
      // Spawn strictly within the monitor bounds (-30 to 30 X)
      mesh.position.set((Math.random() - 0.5) * 60, baseY, (Math.random() - 0.5) * 20);
    } else {
      mesh.position.set((Math.random() - 0.5) * 250, baseY - Math.random() * 50, (Math.random() - 0.5) * 100);
    }
    
    const size = constrained ? (Math.random() * 2 + 1) : (Math.random() * 3 + 1.5);
    mesh.scale.set(size, size, size);
    
    mesh.userData = {
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, Math.random() * 0.2 + 0.1, 0),
      originalScale: size,
      popping: false,
      popTime: 0,
      phase: Math.random() * Math.PI * 2 // For wobble
    };
    bubbleGroup.add(mesh);
    bubbles.push(mesh);
  }

  function spawnDroplets(position, scale) {
    for(let i=0; i<6; i++) {
      const drop = new THREE.Mesh(dropletGeo, material);
      drop.position.copy(position);
      // Random outward velocity
      drop.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          Math.random() * 2 + 1,
          (Math.random() - 0.5) * 2
        ),
        life: 1.0
      };
      bubbleGroup.add(drop);
      particles.push(drop);
    }
  }

  // Pre-spawn some bubbles ONLY IF not in intro
  // Wait, intro requires no bubbles initially.
  
  // HTML Intro Elements
  const introOverlay = document.getElementById('intro-overlay');
  const introHole = document.querySelector('.intro-hole');
  const introHitbox = document.getElementById('intro-hitbox');
  const hint1 = document.querySelector('.hint-step1');
  const hint2 = document.querySelector('.hint-step2');

  // Raycasting for Pop Interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  window.addEventListener('click', (event) => {
    if (introState === 0) return; // Prevent raycasting until awakened

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(bubbleGroup.children);
    
    if (intersects.length > 0) {
      const hit = intersects.find(i => !i.object.userData.popping);
      if (hit) {
        popBubble(hit.object);
        
        if (introState === 1 || introState === 2) {
          introState = 2;
          popCount++;
          // Spawn more bubbles based on how many popped!
          for(let i = 0; i < popCount * 2; i++) {
            spawnBubble(-20, true);
          }
          
          // Explode on 5th pop
          if (popCount >= 5 && introState !== 3) {
            introState = 3;
            triggerExplosion();
          }
        }
      }
    }
  });

  if (introHitbox) {
    introHitbox.addEventListener('click', () => {
      if (introState === 0) {
        introState = 1;
        hint1.hidden = true;
        hint2.hidden = false;
        spawnBubble(-20, true);
        spawnBubble(-30, true);
      }
    });
  }

  function triggerExplosion() {
    introHole.classList.add('explode');
    hint2.hidden = true;
    introHitbox.style.pointerEvents = 'none';
    
    // Spawn massive amount of bubbles
    for(let i=0; i<150; i++) {
      spawnBubble((Math.random() - 0.5) * 200);
    }
    
    setTimeout(() => {
      introOverlay.classList.add('hidden');
      document.body.classList.remove('intro-locked');
      introState = 4;
      // Spawn background bubbles for main page
      for(let i = 0; i < 50; i++) spawnBubble((Math.random() - 0.5) * 300);
      
      // Cleanup DOM
      setTimeout(() => introOverlay.remove(), 1000);
    }, 1000);
  }

  const popupsContainer = document.getElementById('bubble-popups');

  function popBubble(mesh) {
    mesh.userData.popping = true;
    spawnDroplets(mesh.position, mesh.scale.x);
    
    // Project 3D coordinate to 2D screen coordinate
    const vector = mesh.position.clone();
    vector.project(camera);
    const x = (vector.x * .5 + .5) * window.innerWidth;
    const y = (vector.y * -.5 + .5) * window.innerHeight;
    
    // Create HTML popup
    const popup = document.createElement('div');
    popup.className = 'bubble-popup';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    
    // Random headline based on language
    const lang = localStorage.getItem('bys-lang') || 'en';
    const list = headlines[lang] || headlines['en'];
    popup.textContent = list[Math.floor(Math.random() * list.length)];
    
    popupsContainer.appendChild(popup);
    
    // Clean up DOM after animation
    setTimeout(() => {
      if (popupsContainer.contains(popup)) popupsContainer.removeChild(popup);
    }, 2400);
  }

  // Scroll & Mouse Tracking
  let scrollY = window.scrollY;
  let mouseX = 0, mouseY = 0;
  
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Camera movement based on scroll (Only if in main state)
    if (introState === 4) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
      
      const targetCamY = -scrollProgress * 200;
      camera.position.x += ((mouseX * 10) - camera.position.x) * 0.05;
      camera.position.y += ((targetCamY + mouseY * 10) - camera.position.y) * 0.05;

      // Scroll density logic
      if (Math.random() < 0.01 + (scrollProgress * 0.05)) {
        spawnBubble(camera.position.y - 100); 
      }
    }

    // Animate Bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      if (b.userData.popping) {
        b.userData.popTime += 0.08; // pop faster
        const p = b.userData.popTime;
        b.scale.setScalar(b.userData.originalScale + p * 20);
        b.material.opacity = Math.max(0, 1 - p * 2);
        
        if (p > 0.5) {
          bubbleGroup.remove(b);
          bubbles.splice(i, 1);
        }
      } else {
        b.position.add(b.userData.velocity);
        
        // Organic wobble!
        b.userData.phase += delta * 2;
        const scale = b.userData.originalScale;
        const wobbleX = Math.sin(b.userData.phase) * 0.08 * scale;
        const wobbleY = Math.cos(b.userData.phase * 1.3) * 0.08 * scale;
        b.scale.set(scale + wobbleX, scale + wobbleY, scale + wobbleX);
        
        // Horizontal drift
        b.position.x += Math.sin(time * 2 + i) * 0.03;
        
        // Remove if too far above camera, OR wrap if in intro state
        if (introState < 3) {
          if (b.position.y > 30) b.position.y = -30; // loop inside monitor
          if (Math.abs(b.position.x) > 40) b.userData.velocity.x *= -1; // bounce walls
        } else {
          if (b.position.y > camera.position.y + 150) {
            bubbleGroup.remove(b);
            bubbles.splice(i, 1);
          }
        }
      }
    }

    // Animate Droplets
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.position.add(p.userData.velocity);
      p.userData.velocity.y -= 0.1; // gravity
      p.userData.life -= delta * 1.5;
      p.scale.setScalar(p.userData.life);
      
      if (p.userData.life <= 0) {
        bubbleGroup.remove(p);
        particles.splice(i, 1);
      }
    }

    composer.render();
  }

  // Initial setup: remove loader
  document.getElementById('loader').classList.add('hidden');
  animate();
}
