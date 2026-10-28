import React from 'react';
import { SERVICES } from '../data.js';

// Microinteracción: inclinación 3D sutil según el mouse (solo con mouse y sin "reduce motion").
const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function tilt(e) {
  if (e.pointerType !== 'mouse' || reduced()) return;
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  e.currentTarget.style.setProperty('--ry', `${x * 7}deg`);
  e.currentTarget.style.setProperty('--rx', `${-y * 7}deg`);
}
const untilt = (e) => { e.currentTarget.style.setProperty('--ry', '0deg'); e.currentTarget.style.setProperty('--rx', '0deg'); };

export default function Services({ onStart }) {
  return (
    <section className="block services-section" id="servicios">
      <div className="section-heading reveal"><span className="section-kicker">01 / SERVICIOS</span><h2>QUÉ PODEMOS<br /><em>CREAR JUNTOS.</em></h2></div>
      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <article className="service-card reveal" style={{ '--d': `${i * 90}ms` }} key={s.number} onPointerMove={tilt} onPointerLeave={untilt}>
            <span className="card-number">{s.number} / SERVICIO</span>
            <span className="card-glyph" aria-hidden="true">{s.glyph}</span>
            <h3>{s.name}</h3>
            <p>{s.detail}</p>
            <button className="card-link" onClick={() => onStart(s.type)}>CONTAR MI IDEA ↗</button>
          </article>
        ))}
      </div>
    </section>
  );
}
