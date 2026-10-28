import React from 'react';
import { REASONS, STACK } from '../data.js';

export default function Why() {
  return (
    <section className="block why-section" id="por-que">
      <div className="section-heading reveal"><span className="section-kicker">04 / POR QUÉ TRABAJAR CONMIGO</span><h2>CERCA, CLARO<br /><em>Y A MEDIDA.</em></h2></div>
      <ul className="why-grid">
        {REASONS.map((r, i) => (
          <li className="why-item reveal" style={{ '--d': `${(i % 3) * 80}ms` }} key={r.title}>
            <i aria-hidden="true">0{i + 1}</i><h3>{r.title}</h3><p>{r.text}</p>
          </li>
        ))}
      </ul>
      <div className="stack reveal">
        <span className="stack-title">TECNOLOGÍAS CON LAS QUE TRABAJO</span>
        <ul className="stack-list">
          {STACK.map((t) => (
            <li key={t.name}><img src={t.icon} alt="" width="28" height="28" loading="lazy" decoding="async" /><span>{t.name}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
