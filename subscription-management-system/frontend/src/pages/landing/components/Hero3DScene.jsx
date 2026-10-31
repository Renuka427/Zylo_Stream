import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Compass, Play, Pause, RefreshCw, Layers } from 'lucide-react';

export const Hero3DScene = () => {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const sceneRotation = useRef({ x: 0.2, y: 0.4 });
  const isRotatingRef = useRef(true);

  // Sync ref with state
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 440;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.6, 5.8);

    // 3. Renderer with antialias and alpha
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xfffaf2, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd6b779, 1.5);
    dirLight2.position.set(-5, -3, -4);
    scene.add(dirLight2);

    const coreLight = new THREE.PointLight(0xc41e3a, 3.5, 8);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const goldPoint = new THREE.PointLight(0xd6b779, 2.5, 6);
    goldPoint.position.set(0, 1.5, 0);
    scene.add(goldPoint);

    // 5. Gyroscope Master Group
    const gyroGroup = new THREE.Group();
    gyroGroup.rotation.x = sceneRotation.current.x;
    gyroGroup.rotation.y = sceneRotation.current.y;
    scene.add(gyroGroup);

    // 6. Central Autopilot Nucleus (Pulsing multifaceted sphere)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xc41e3a,
      emissive: 0x791d32,
      emissiveIntensity: 0.6,
      roughness: 0.25,
      metalness: 0.85,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    gyroGroup.add(coreMesh);

    // Core Wireframe cage overlay for high-tech autonomous look
    const wireGeo = new THREE.IcosahedronGeometry(0.92, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd6b779,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    gyroGroup.add(wireMesh);

    // 7. Concentric Gimbal Rings
    // Ring 1: Cherry Primary
    const ring1Geo = new THREE.TorusGeometry(1.4, 0.038, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xc41e3a,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x791d32,
      emissiveIntensity: 0.2
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    gyroGroup.add(ring1);

    // Ring 2: Champagne Gold
    const ring2Geo = new THREE.TorusGeometry(1.85, 0.035, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xd6b779,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x6e5830,
      emissiveIntensity: 0.15
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2.8;
    gyroGroup.add(ring2);

    // Ring 3: Ivory / Outer Gyro
    const ring3Geo = new THREE.TorusGeometry(2.3, 0.032, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xfffaf2,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0xd6b779,
      emissiveIntensity: 0.1
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 2.4;
    gyroGroup.add(ring3);

    // 8. Orbiting Satellite Nodes (Subscriptions, Invoices, Customers, Treasury)
    const satellites = [
      { color: 0xc41e3a, radius: 2.65, speed: 0.8, phase: 0, label: 'Subscriptions' },
      { color: 0xd6b779, radius: 2.75, speed: 0.65, phase: Math.PI * 0.5, label: 'Invoices' },
      { color: 0x292321, radius: 2.6, speed: -0.75, phase: Math.PI, label: 'Customers' },
      { color: 0x059669, radius: 2.8, speed: 0.9, phase: Math.PI * 1.5, label: 'Treasury' }
    ];

    const satelliteMeshes = satellites.map((sat) => {
      const satGroup = new THREE.Group();
      
      const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: sat.color,
        emissive: sat.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      satGroup.add(mesh);

      // Mini orbit halo
      const haloGeo = new THREE.RingGeometry(0.18, 0.22, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: sat.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      satGroup.add(halo);

      gyroGroup.add(satGroup);
      return { group: satGroup, sat, mesh };
    });

    // 9. Particle Dust Field (Stardust Stars)
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd6b779,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 10. Mouse Drag and Parallax Interaction
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      previousMousePosition.current = {
        x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
        y: e.clientY || (e.touches && e.touches[0].clientY) || 0
      };
    };

    const handlePointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      if (isDraggingRef.current) {
        const deltaX = clientX - previousMousePosition.current.x;
        const deltaY = clientY - previousMousePosition.current.y;

        sceneRotation.current.y += deltaX * 0.008;
        sceneRotation.current.x += deltaY * 0.008;

        gyroGroup.rotation.y = sceneRotation.current.y;
        gyroGroup.rotation.x = sceneRotation.current.x;

        previousMousePosition.current = { x: clientX, y: clientY };
      } else {
        // Gentle parallax tilt
        const rect = container.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width - 0.5) * 0.3;
        const normY = ((clientY - rect.top) / rect.height - 0.5) * 0.3;
        camera.position.x += (normX - camera.position.x) * 0.05;
        camera.position.y += (-normY + 0.6 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 11. Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 12. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous auto-rotation when not dragging
      if (isRotatingRef.current && !isDraggingRef.current) {
        sceneRotation.current.y += 0.0035;
        gyroGroup.rotation.y = sceneRotation.current.y;
      }

      // Individual gimbal ring rotations
      ring1.rotation.x += 0.008;
      ring1.rotation.y += 0.005;
      ring2.rotation.y += 0.007;
      ring2.rotation.z += 0.006;
      ring3.rotation.z += 0.005;
      ring3.rotation.x += 0.004;

      // Pulsing core scale
      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
      coreMesh.scale.set(pulse, pulse, pulse);
      wireMesh.scale.set(pulse, pulse, pulse);
      wireMesh.rotation.y -= 0.006;
      wireMesh.rotation.x += 0.004;

      // Orbiting satellites in 3D paths
      satelliteMeshes.forEach(({ group, sat }) => {
        const angle = elapsedTime * sat.speed + sat.phase;
        group.position.x = Math.cos(angle) * sat.radius;
        group.position.z = Math.sin(angle) * sat.radius;
        group.position.y = Math.sin(angle * 1.5) * 0.7;
        group.rotation.y += 0.02;
      });

      // Subtle particle float
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // 13. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleResetAngle = () => {
    sceneRotation.current = { x: 0.2, y: 0.4 };
  };

  return (
    <div className="relative w-full h-[440px] sm:h-[480px] rounded-2xl bg-gradient-to-b from-champagne-light via-ivory to-champagne/40 border border-stone-warm shadow-luxury overflow-hidden flex flex-col justify-between">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        title="Click and drag to rotate the 3D gyroscope in real-time"
      />

      {/* Floating Interactive Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory/90 backdrop-blur-md border border-stone-warm shadow-sm text-[10px] font-bold text-espresso uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Interactive 3D WebGL</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-lg bg-ivory/90 hover:bg-ivory border border-stone-warm text-espresso hover:text-cherry transition-colors shadow-sm"
            title={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleResetAngle}
            className="p-1.5 rounded-lg bg-ivory/90 hover:bg-ivory border border-stone-warm text-espresso hover:text-cherry transition-colors shadow-sm"
            title="Reset 3D camera angle"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Holographic Telemetry Cards */}
      <div className="absolute bottom-12 left-4 pointer-events-none z-10 hidden sm:block">
        <div className="p-2.5 rounded-xl bg-ivory/90 backdrop-blur-md border border-stone-warm/80 shadow-sm text-left space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-espresso-muted tracking-wider block">
            Core Autopilot Engine
          </span>
          <span className="font-display text-xs font-black text-cherry">
            $27,550 MRR Active
          </span>
        </div>
      </div>

      <div className="absolute bottom-12 right-4 pointer-events-none z-10 hidden sm:block">
        <div className="p-2.5 rounded-xl bg-ivory/90 backdrop-blur-md border border-stone-warm/80 shadow-sm text-right space-y-0.5">
          <span className="text-[9px] uppercase font-bold text-espresso-muted tracking-wider block">
            Treasury Reconciliation
          </span>
          <span className="font-display text-xs font-black text-emerald-800">
            98.2% Auto-Settled
          </span>
        </div>
      </div>

      {/* Bottom User Guidance Bar */}
      <div className="px-4 py-2 bg-champagne-light/90 backdrop-blur-md border-t border-stone-warm flex items-center justify-between text-[11px] text-espresso-muted z-10">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Compass className="w-3.5 h-3.5 text-champagne-gold animate-spin" style={{ animationDuration: '8s' }} />
          <span>Click &amp; drag to orbit 3D model in real time</span>
        </span>
        <span className="font-mono text-[10px] text-cherry font-semibold">
          Cherry × Champagne
        </span>
      </div>
    </div>
  );
};
