import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const PINK = '#ff1684';

// Geometrías y materiales se crean UNA vez y se liberan al desmontar (sin recrearlos por frame/render).
function useAssets(mobile) {
  const assets = useMemo(() => {
    const seg = mobile ? 40 : 72;
    const tube = mobile ? 96 : 180;
    const geo = {
      sphere: new THREE.SphereGeometry(1, seg, seg),
      small: new THREE.SphereGeometry(1, 28, 28),
      ringA: new THREE.TorusGeometry(1.85, 0.05, 28, tube),
      ringB: new THREE.TorusGeometry(2.3, 0.032, 24, tube),
      ringPink: new THREE.TorusGeometry(1.55, 0.016, 16, tube),
      ringHair: new THREE.TorusGeometry(2.75, 0.006, 8, tube),
    };
    const mat = {
      chrome: new THREE.MeshPhysicalMaterial({ color: '#08080b', metalness: 1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6 }),
      ring: new THREE.MeshPhysicalMaterial({ color: '#14141a', metalness: 1, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.7 }),
      silver: new THREE.MeshStandardMaterial({ color: '#eeeef4', metalness: 1, roughness: 0.04, envMapIntensity: 1.5 }),
      pink: new THREE.MeshStandardMaterial({ color: PINK, emissive: PINK, emissiveIntensity: 1.2, metalness: 0.2, roughness: 0.3 }),
      pinkLine: new THREE.MeshBasicMaterial({ color: PINK }),
      hair: new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.14 }),
    };
    return { geo, mat };
  }, [mobile]);

  useEffect(() => () => {
    Object.values(assets.geo).forEach((g) => g.dispose());
    Object.values(assets.mat).forEach((m) => m.dispose());
  }, [assets]);

  return assets;
}

// Halo rosado detrás del objeto (textura generada por código, sin descargas).
function Halo() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,22,132,0.5)');
    gr.addColorStop(0.35, 'rgba(255,22,132,0.13)');
    gr.addColorStop(1, 'rgba(255,22,132,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  const geo = useMemo(() => new THREE.PlaneGeometry(9, 9), []);
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    [tex]
  );
  useEffect(() => () => { tex.dispose(); geo.dispose(); mat.dispose(); }, [tex, geo, mat]);
  return <mesh position={[0, 0, -2.8]} geometry={geo} material={mat} dispose={null} />;
}

// Avisa cuando la escena ya dibujó sus primeros cuadros (reflejos listos): recién ahí se muestra.
function ReadyOnFrame({ onReady, reduced }) {
  const n = useRef(0);
  useFrame(() => {
    n.current += 1;
    if (n.current === (reduced ? 1 : 2)) onReady?.();
  });
  return null;
}

function Core({ mobile, reduced }) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const { geo, mat } = useAssets(mobile);

  const root = useRef();
  const ringA = useRef();
  const ringB = useRef();
  const ringPink = useRef();
  const ringHair = useRef();
  const satPink = useRef();
  const satSilver = useRef();
  const satTiny = useRef();

  const pointer = useRef({ x: 0, y: 0 }); // -1..1, solo mouse
  const smooth = useRef({ x: 0, y: 0 });
  const intro = useRef(0); // 0→1: el objeto cae suavemente desde arriba al aparecer
  const drag = useRef({ on: false, lastX: 0, lastY: 0, yaw: 0.5, pitch: -0.12, vy: 0, vx: 0 });

  // Entorno de reflejos procedural (sin HDRI remoto) → cromo con reflejos reales.
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pm.fromScene(room, 0.04).texture;
    scene.environment = env;
    invalidate();
    return () => {
      scene.environment = null;
      env.dispose();
      room.dispose?.();
      pm.dispose();
    };
  }, [gl, scene, invalidate]);

  // Encuadre responsive: toda la composición (anillos incluidos) entra siempre en el canvas.
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const zW = (mobile ? 5.9 : 6.0) / (2 * t * aspect);
    const zH = (mobile ? 5.8 : 6.0) / (2 * t);
    camera.position.z = Math.max(zW, zH, 6.5);
    camera.updateProjectionMatrix();
    invalidate();
  }, [size.width, size.height, camera, mobile, invalidate]);

  // Mouse (seguimiento) y arrastre (mouse + touch) con listeners limpiados al desmontar.
  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;
    el.style.touchAction = 'pan-y'; // el scroll vertical sigue funcionando en celular

    const onHover = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onMove = (e) => {
      if (!d.on) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.vy = dx * 0.006;
      d.vx = dy * 0.004;
      d.yaw += d.vy;
      d.pitch = THREE.MathUtils.clamp(d.pitch + d.vx, -0.8, 0.8);
    };
    const end = () => {
      if (!d.on) return;
      d.on = false;
      document.body.classList.remove('grabbing');
    };
    const onDown = (e) => {
      if (reduced) return;
      d.on = true;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.vy = d.vx = 0;
      document.body.classList.add('grabbing');
    };

    window.addEventListener('pointermove', onHover, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    window.addEventListener('blur', end);
    el.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('pointermove', onHover);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      window.removeEventListener('blur', end);
      el.removeEventListener('pointerdown', onDown);
      document.body.classList.remove('grabbing');
    };
  }, [gl, reduced]);

  // Pose estática si el usuario prefiere menos movimiento.
  useEffect(() => {
    if (!reduced || !root.current) return;
    root.current.rotation.set(-0.12, 0.5, 0);
    if (ringA.current) ringA.current.rotation.z = 0.6;
    if (ringB.current) ringB.current.rotation.z = 1.4;
    if (satPink.current) satPink.current.position.set(2.0, 0.55, 0.4);
    if (satSilver.current) satSilver.current.position.set(-2.1, -0.4, 0.2);
    invalidate();
  }, [reduced, invalidate]);

  useFrame((state, dtRaw) => {
    if (reduced || !root.current) return;
    const dt = Math.min(dtRaw, 0.05);
    const d = drag.current;
    const s = smooth.current;
    const f = Math.pow(0.001, dt); // amortiguación independiente del framerate

    if (!d.on) {
      d.yaw += d.vy + dt * 0.1; // deriva lenta + inercia
      d.pitch = THREE.MathUtils.clamp(d.pitch + d.vx, -0.8, 0.8);
      d.vy *= Math.pow(0.12, dt);
      d.vx *= Math.pow(0.12, dt);
      d.pitch += (-0.12 - d.pitch) * (1 - Math.pow(0.5, dt)); // vuelve suave a su inclinación base
    }
    s.x += (pointer.current.x - s.x) * (1 - f);
    s.y += (pointer.current.y - s.y) * (1 - f);

    const t = state.clock.elapsedTime;
    root.current.rotation.y = d.yaw + s.x * 0.28;
    root.current.rotation.x = d.pitch - s.y * 0.2;
    if (intro.current < 1) intro.current = Math.min(1, intro.current + dt / 1.4);
    const e = 1 - Math.pow(1 - intro.current, 3); // easeOutCubic
    root.current.position.y = Math.sin(t * 0.6) * 0.07 + (1 - e) * 1.8; // flotación + caída de entrada
    root.current.scale.setScalar((mobile ? 0.92 : 1) * (0.8 + 0.2 * e));

    // Movimientos independientes, lentos y fluidos
    if (ringA.current) ringA.current.rotation.z += dt * 0.11;
    if (ringB.current) ringB.current.rotation.z -= dt * 0.07;
    if (ringPink.current) ringPink.current.rotation.z += dt * 0.16;
    if (ringHair.current) ringHair.current.rotation.z += dt * 0.03;

    const a = t * 0.32;
    satPink.current?.position.set(Math.cos(a) * 2.35, Math.sin(a) * 2.35 * 0.32, Math.sin(a) * 0.6);
    const b = t * 0.21 + Math.PI;
    satSilver.current?.position.set(Math.cos(b) * 2.8, Math.sin(b * 1.3) * 0.7, Math.sin(b) * 0.9);
    const c = t * 0.45 + 1.2;
    satTiny.current?.position.set(Math.cos(c) * 1.7, Math.sin(c) * 1.1, Math.sin(c * 0.8) * 1.2);

    if (!mobile) {
      state.camera.position.x += (s.x * 0.3 - state.camera.position.x) * (1 - f);
      state.camera.position.y += (s.y * 0.18 - state.camera.position.y) * (1 - f);
    }
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={root} scale={mobile ? 0.92 : 1}>
        <mesh geometry={geo.sphere} material={mat.chrome} scale={1.2} dispose={null} />
        {/* Anillos con inclinación propia y giro independiente */}
        <group rotation={[1.25, 0.15, 0.3]}>
          <mesh ref={ringA} geometry={geo.ringA} material={mat.ring} dispose={null} />
        </group>
        <group rotation={[0.55, -0.5, -0.4]}>
          <mesh ref={ringB} geometry={geo.ringB} material={mat.ring} dispose={null} />
        </group>
        <group rotation={[Math.PI / 2.4, 0.2, 0]}>
          <mesh ref={ringPink} geometry={geo.ringPink} material={mat.pinkLine} dispose={null} />
        </group>
        <group rotation={[1.0, 0.7, 0.2]}>
          <mesh ref={ringHair} geometry={geo.ringHair} material={mat.hair} dispose={null} />
        </group>
        <mesh ref={satPink} geometry={geo.small} material={mat.pink} scale={0.15} dispose={null} />
        <mesh ref={satSilver} geometry={geo.small} material={mat.silver} scale={0.1} dispose={null} />
        <mesh ref={satTiny} geometry={geo.small} material={mat.pinkLine} scale={0.05} dispose={null} />
      </group>
    </>
  );
}

export default function Scene3D({ mobile, lowEnd, reduced, paused, onReady, onFail }) {
  return (
    <Canvas
      frameloop={reduced ? 'demand' : paused ? 'never' : 'always'}
      dpr={mobile || lowEnd ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 7.5], fov: 38 }}
      gl={{
        antialias: !mobile,
        alpha: true,
        powerPreference: mobile ? 'default' : 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onFail?.();
        });
      }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3.5, 4]} intensity={60} color={PINK} />
      <pointLight position={[-4, -2, 3]} intensity={26} color="#d6e0ff" />
      <Halo />
      <Core mobile={mobile} reduced={reduced} />
      <ReadyOnFrame onReady={onReady} reduced={reduced} />
      <Sparkles count={mobile ? 18 : 55} scale={[10, 7, 5]} size={2} speed={0.15} opacity={0.45} color="#ff5aa5" />
    </Canvas>
  );
}
