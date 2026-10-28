import React from 'react';
import { PROCESS } from '../data.js';

export default function Process() {
  return (
    <section className="block process-section" id="proceso">
      <div className="section-heading reveal"><span className="section-kicker">03 / CÓMO TRABAJO</span><h2>UNA IDEA. UN PLAN.<br /><em>UN RESULTADO.</em></h2></div>
      <ol className="steps">
        {PROCESS.map((s, i) => (
          <li className="step reveal" style={{ '--d': `${i * 90}ms` }} key={s.n}>
            <span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p>
          </li>
        ))}
      </ol>
      <p className="process-note reveal">Trabajás directo conmigo: conversamos durante todo el desarrollo y vas viendo cómo avanza tu web.</p>
    </section>
  );
}
