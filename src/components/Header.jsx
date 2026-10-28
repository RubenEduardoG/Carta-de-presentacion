import React, { useState } from 'react';

const LINKS = [['#servicios', 'SERVICIOS'], ['#proyectos', 'PROYECTOS'], ['#proceso', 'PROCESO'], ['#contacto', 'CONTACTO']];

export default function Header({ onStart }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav anim-in" style={{ '--d': '0ms' }}>
      <a className="brand" href="#inicio" aria-label="Inicio RG">RG<span>.</span></a>
      <nav className="navright" aria-label="Principal">
        <div className={`navlinks${open ? ' open' : ''}`} id="navlinks">
          {LINKS.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        </div>
        <button className="cta-small" onClick={onStart}>HABLEMOS ↗</button>
        <button className="burger" aria-label="Menú" aria-expanded={open} aria-controls="navlinks" onClick={() => setOpen((o) => !o)}>
          <span /><span />
        </button>
      </nav>
    </header>
  );
}
