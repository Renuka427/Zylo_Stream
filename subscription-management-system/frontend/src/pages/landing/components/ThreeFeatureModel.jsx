import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import {
  Users,
  RefreshCw,
  Package,
  Receipt,
  CreditCard,
  BarChart3,
  ArrowRight,
  Sparkles,
  Maximize2,
  Compass,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ThreeFeatureModel = () => {
  const mountRef = useRef(null);
  const navigate = useNavigate();

  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  const features = [
    {
      id: 'subscriptions',
      title: 'Subscription Ledger',
      icon: RefreshCw,
      badge: 'Core Engine',
      stat: '$27,550 MRR',
      desc: 'Real-time contract lifecycle tracking, automated dunning grace periods, and renewal momentum.',
      route: '/subscriptions'
    },
    {
      id: 'customers',
      title: 'Customer Directory',
      icon: Users,
      badge: 'Accounts',
      stat: '78 Active Accounts',
      desc: 'Centralized customer profiles, contact persons, lifetime value contributions, and active plans.',
      route: '/customers'
    },
    {
      id: 'plans',
      title: 'Plans & Catalog',
      icon: Package,
      badge: 'Pricing Tiers',
      stat: '4 Flexible Intervals',
      desc: 'Configurable billing cycles, Starter to Enterprise Bespoke tiers, and granular feature sets.',
      route: '/plans'
    },
    {
      id: 'invoices',
      title: 'Invoices & Quotations',
      icon: Receipt,
      badge: 'Billing Documents',
      stat: '100% Tax Compliant',
      desc: 'Draft quotations, auto-convert accepted estimates into confirmed contracts, and issue printable invoices.',
      route: '/invoices'
    },
    {
      id: 'payments',
      title: 'Payment Reconciliations',
      icon: CreditCard,
      badge: 'Treasury Logs',
      stat: '98.2% Auto-Settled',
      desc: 'Audit-ready transaction logs, ACH direct debit, bank wires, and intelligent invoice matching.',
      route: '/payments'
    },
    {
      id: 'reports',
      title: 'Financial Intelligence',
      icon: BarChart3,
      badge: 'Analytics',
      stat: '118.2% Net Retention',
      desc: 'MRR growth curves, expansion vs churn bar cohorts, and 1-click CSV financial dossier exports.',
      route: '/reports'
    }
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.2);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.2);
    scene.add(ambientLight);

    // Cherry red point light
    const cherryLight = new THREE.PointLight(0xc41e3a, 4.5, 50);
    cherryLight.position.set(3, 4, 3);
    scene.add(cherryLight);

    // Champagne gold point light
    const goldLight = new THREE.PointLight(0xd6b779, 4.0, 50);
    goldLight.position.set(-3, -3, 2);
    scene.add(goldLight);

    // Subtle front fill light
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(0, 2, 4);
    scene.add(frontLight);

    // 5. Main 3D Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // A. Central Multifaceted Core (Gold Polyhedron)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd6b779,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    modelGroup.add(coreMesh);

    // B. Inner Wireframe Glow Cage
    const wireGeo = new THREE.IcosahedronGeometry(0.92, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc41e3a,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    modelGroup.add(wireMesh);

    // C. Orbiting Stream Torus Ribbon (Cherry Red & Burgundy)
    const torusGeo = new THREE.TorusGeometry(1.65, 0.045, 16, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xc41e3a,
      roughness: 0.3,
      metalness: 0.8
    });
    const torusMesh1 = new THREE.Mesh(torusGeo, torusMat);
    torusMesh1.rotation.x = Math.PI / 3;
    torusMesh1.rotation.y = Math.PI / 6;
    modelGroup.add(torusMesh1);

    // D. Second Intersecting Orbiting Torus (Champagne Gold)
    const torusGeo2 = new THREE.TorusGeometry(1.85, 0.035, 16, 100);
    const torusMat2 = new THREE.MeshStandardMaterial({
      color: 0xd6b779,
      roughness: 0.2,
      metalness: 0.9
    });
    const torusMesh2 = new THREE.Mesh(torusGeo2, torusMat2);
    torusMesh2.rotation.x = -Math.PI / 4;
    torusMesh2.rotation.y = Math.PI / 3;
    modelGroup.add(torusMesh2);

    // E. Flowing Stream Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xc41e3a); // Cherry
    const c2 = new THREE.Color(0xd6b779); // Gold
    const c3 = new THREE.Color(0x791d32); // Dark Cherry

    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const radius = 1.6 + Math.sin(i * 3) * 0.45;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta * 2) * 0.4 + (Math.random() - 0.5) * 0.3;
      const z = Math.sin(theta) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixedColor = Math.random() > 0.5 ? c1 : Math.random() > 0.5 ? c2 : c3;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    modelGroup.add(particleSystem);

    // F. 6 Orbiting Feature Satellites / Nodes
    const satelliteNodes = [];
    const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const satHaloGeo = new THREE.RingGeometry(0.15, 0.18, 24);

    features.forEach((feat, index) => {
      const angle = (index / features.length) * Math.PI * 2;
      const distance = 2.3;

      const satGroup = new THREE.Group();
      satGroup.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle * 1.5) * 0.45,
        Math.sin(angle) * distance
      );

      const satMat = new THREE.MeshStandardMaterial({
        color: index === 0 ? 0xc41e3a : 0xd6b779,
        roughness: 0.3,
        metalness: 0.7
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satGroup.add(satMesh);

      // Ring around node
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xc41e3a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const haloMesh = new THREE.Mesh(satHaloGeo, haloMat);
      haloMesh.lookAt(camera.position);
      satGroup.add(haloMesh);

      modelGroup.add(satGroup);
      satelliteNodes.push({ group: satGroup, mesh: satMesh, halo: haloMesh, initialAngle: angle });
    });

    // 6. Interactive Mouse Drag & Parallax Handling
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0.15, y: 0 };
    let currentRotation = { x: 0.15, y: 0 };

    const onPointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging) {
        // Parallax effect on hover
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / width - 0.5) * 0.5;
        const normY = ((e.clientY - rect.top) / height - 0.5) * 0.5;
        targetRotation.x = 0.15 - normY;
        targetRotation.y = normX;
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.008;
      targetRotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 7. Resize handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle idle rotation
      if (!isDragging) {
        targetRotation.y += 0.004;
      }

      // Smooth interpolation (damping)
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.06;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.06;

      modelGroup.rotation.x = currentRotation.x;
      modelGroup.rotation.y = currentRotation.y;

      // Pulse inner core
      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
      coreMesh.scale.set(pulse, pulse, pulse);
      wireMesh.scale.set(pulse * 1.05, pulse * 1.05, pulse * 1.05);
      coreMesh.rotation.y = elapsedTime * 0.3;
      wireMesh.rotation.x = -elapsedTime * 0.2;

      // Animate toruses in opposite spins
      torusMesh1.rotation.z = elapsedTime * 0.6;
      torusMesh2.rotation.z = -elapsedTime * 0.45;

      // Animate particles along path
      particleSystem.rotation.y = elapsedTime * 0.25;
      particleSystem.rotation.z = Math.sin(elapsedTime * 0.5) * 0.15;

      // Keep satellite halos facing the camera
      satelliteNodes.forEach((node) => {
        node.halo.lookAt(camera.position);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      // Dispose Three.js objects
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      satGeo.dispose();
      satHaloGeo.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const activeFeature = features[activeFeatureIndex];
  const Icon = activeFeature.icon;

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-ivory to-champagne/40 border border-stone-warm shadow-luxury overflow-hidden">
      {/* Top Banner with 3D Status */}
      <div className="px-5 py-3 bg-champagne/70 border-b border-stone-warm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cherry animate-pulse" />
          <span className="font-mono text-xs font-bold text-espresso uppercase tracking-wider">
            3D Autopilot Feature Core
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-espresso-muted">
          <Compass className="w-3.5 h-3.5 text-champagne-gold" />
          <span className="hidden sm:inline">Drag to rotate • Click nodes to inspect</span>
        </div>
      </div>

      {/* Main Dual Area: 3D Canvas + Interactive Feature HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* 3D WebGL Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 h-[360px] sm:h-[440px] md:h-[500px] w-full relative cursor-grab active:cursor-grabbing">
          <div ref={mountRef} className="w-full h-full" />

          {/* Interactive Hint Overlay */}
          <div className="absolute bottom-4 left-4 pointer-events-none bg-ivory/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-warm text-[10px] text-espresso-muted font-medium flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Interactive WebGL 3D Model</span>
          </div>
        </div>

        {/* Feature Inspection HUD Card (5 cols on lg) */}
        <div className="lg:col-span-5 p-5 sm:p-7 space-y-5 border-t lg:border-t-0 lg:border-l border-stone-warm bg-ivory/60 backdrop-blur-sm">
          {/* Feature Selector Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {features.map((feat, idx) => (
              <button
                key={feat.id}
                onClick={() => setActiveFeatureIndex(idx)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  activeFeatureIndex === idx
                    ? 'bg-cherry text-ivory shadow-sm'
                    : 'bg-champagne-light text-espresso-muted hover:text-espresso hover:bg-champagne'
                }`}
              >
                {feat.title}
              </button>
            ))}
          </div>

          {/* Active Feature Detail Card */}
          <div className="p-5 rounded-2xl bg-ivory border border-stone-warm shadow-luxury space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-champagne-light border border-stone-warm flex items-center justify-center text-cherry shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-champagne text-cherry-dark border border-stone-warm">
                {activeFeature.badge}
              </span>
            </div>

            <div>
              <h4 className="font-display text-xl font-bold text-espresso">
                {activeFeature.title}
              </h4>
              <p className="font-mono text-sm font-bold text-emerald-800 mt-0.5">
                {activeFeature.stat}
              </p>
            </div>

            <p className="text-xs text-espresso-muted leading-relaxed">
              {activeFeature.desc}
            </p>

            <div className="pt-2 border-t border-stone-warm/50 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Autonomous Sync Enabled</span>
              <span className="font-bold text-cherry">Autopilot Active</span>
            </div>
          </div>

          {/* Transition Direct to Executive Overview */}
          <div className="p-4 rounded-2xl bg-champagne-light border border-stone-warm space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-champagne-gold tracking-widest block">
                Next Destination
              </span>
              <h5 className="font-display text-base font-bold text-espresso">
                Ready to take the driver&apos;s seat?
              </h5>
              <p className="text-xs text-espresso-muted">
                Step inside the full Zylo Stream platform and explore the live financial command center.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              className="w-full shadow-luxury text-xs py-2.5"
              onClick={() => navigate('/admin/dashboard')}
            >
              Enter Executive Overview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
