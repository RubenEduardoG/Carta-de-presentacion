import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';

// La escena 3D (three + R3F) es un chunk aparte: el texto y los botones no esperan por ella.
// La descarga arranca apenas se evalúa este módulo (en paralelo con el primer pintado del texto),
// sin esperar a que el navegador esté "libre".
const loadScene = () => import('./Scene3D.jsx');
const scenePromise = typeof window !== 'undefined' ? loadScene() : null;
const Scene3D = lazy(() => scenePromise || loadScene());

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext(); // libera el contexto de prueba
    return true;
  } catch {
    return false;
  }
}

// Si el 3D falla, la página sigue funcionando con el fondo alternativo.
class SceneBoundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('3D desactivado:', err);
    this.props.onFail?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const media = (q) => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(q).matches;

export default function SceneLoader() {
  const wrap = useRef(null);
  const [webgl] = useState(() => hasWebGL());
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobile] = useState(() => media('(max-width: 767px)'));
  const [reduced] = useState(() => media('(prefers-reduced-motion: reduce)'));
  const [lowEnd] = useState(() => (navigator.hardwareConcurrency || 8) <= 4);

  // Se monta justo después del primer pintado (el texto ya es visible), sin timeouts de espera.
  useEffect(() => {
    if (!webgl) return;
    let r2;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setMounted(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [webgl]);

  // Se pausa cuando el hero sale de pantalla.
  useEffect(() => {
    const el = wrap.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const live = mounted && webgl && !failed;

  return (
    <div className="scene" ref={wrap} aria-hidden="true">
      {/* Alternativa elegante: mientras carga, sin WebGL o si el contexto se pierde */}
      <div className={`orb-fallback${live && ready ? ' off' : ''}`}>
        <i /><i /><i />
      </div>
      {live && (
        <div className={`scene-canvas${ready ? ' on' : ''}`}>
          <SceneBoundary onFail={() => setFailed(true)}>
            <Suspense fallback={null}>
              <Scene3D mobile={mobile} lowEnd={lowEnd} reduced={reduced} paused={!visible} onReady={() => setReady(true)} onFail={() => setFailed(true)} />
            </Suspense>
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
