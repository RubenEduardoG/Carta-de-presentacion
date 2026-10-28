import React, { useRef } from 'react';
import SceneLoader from './SceneLoader.jsx';

export default function Hero({ onStart }) {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--mx', `${(e.clientX / window.innerWidth - 0.5) * 25}px`);
    el.style.setProperty('--my', `${(e.clientY / window.innerHeight - 0.5) * 18}px`);
  };
  return (
    <section className="hero" id="inicio" ref={ref} onMouseMove={onMouseMove}>
      <SceneLoader />
      <div className="hero-copy">
        <div className="eyebrow anim-in" style={{ '--d': '120ms' }}><i /> RUBÉN GUTIÉRREZ · DESARROLLADOR WEB FREELANCE</div>
        <h1 className="anim-in" style={{ '--d': '240ms' }}>DESARROLLO<br />WEBS QUE<br /><em>IMPULSAN<br />TU NEGOCIO.</em></h1>
        <div className="pitch anim-in" style={{ '--d': '380ms' }}>
          <p>Diseño y desarrollo landing pages, sitios web y tiendas online pensados para presentar mejor tu negocio, captar oportunidades y convertir visitas en consultas.</p>
          <div className="actions anim-in" style={{ '--d': '520ms' }}>
            <button className="primary" onClick={() => onStart()}>SOLICITAR PRESUPUESTO <b>→</b></button>
            <a className="secondary" href="#proyectos">VER MIS PROYECTOS ↗</a>
          </div>
          <div className="hint">ARRASTRÁ EL OBJETO 3D · DESLIZÁ PARA DESCUBRIR</div>
        </div>
      </div>
    </section>
  );
}
