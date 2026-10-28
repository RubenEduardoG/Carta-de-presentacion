import React, { useEffect, useRef, useState } from 'react';
import { CATEGORIES, PROJECTS } from '../data.js';
import { PORTFOLIO_URL } from '../config.js';

function Media({ p, playing, onToggle }) {
  const video = useRef(null);
  const box = useRef(null);
  const [imgFailed, setImgFailed] = useState(false);

  // Solo un video a la vez (lo controla el padre) y se pausa al salir de pantalla.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => onToggle(false));
    else v.pause();
  }, [playing, onToggle]);
  useEffect(() => {
    const el = box.current;
    if (!el || !p.video || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) onToggle(false); }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [p.video, onToggle]);

  const poster = p.image && !imgFailed ? p.image : undefined;

  if (p.video) {
    return (
      <div className="pmedia" ref={box}>
        <video ref={video} src={p.video} poster={poster} muted loop playsInline preload="none" aria-label={`Grabación de pantalla: ${p.name}`} />
        <button className="playbtn" onClick={() => onToggle(!playing)} aria-label={playing ? 'Pausar video' : 'Reproducir video'}>{playing ? 'Ⅱ' : '▶'}</button>
      </div>
    );
  }
  if (poster) {
    return (
      <div className="pmedia" ref={box}>
        <img src={poster} alt={`Captura de ${p.name}`} loading="lazy" decoding="async" onError={() => setImgFailed(true)} />
      </div>
    );
  }
  return (
    <div className="pmedia ph" ref={box}>
      <span>IMAGEN / VIDEO PENDIENTE</span>
      <small>Reemplazar en src/data.js · archivos en public/projects/</small>
    </div>
  );
}

function Card({ p, playing, setPlaying }) {
  const toggle = React.useCallback((on) => setPlaying(on ? p.id : (cur) => (cur === p.id ? null : cur)), [p.id, setPlaying]);
  const cat = CATEGORIES.find((c) => c.id === p.category)?.label;
  return (
    <article className="pcard">
      <Media p={p} playing={playing === p.id} onToggle={toggle} />
      <div className="pbody">
        <div className="ptop"><span className="pcat">{cat}</span>{p.placeholder && <span className="pbadge">PLACEHOLDER</span>}</div>
        <h3>{p.name}</h3>
        <p className="pbiz">{p.business}</p>
        <dl>
          <dt>Problema a resolver</dt><dd>{p.problem}</dd>
          <dt>Qué desarrollé</dt><dd>{p.built}</dd>
        </dl>
        {p.tech?.length > 0 && <ul className="ptech" aria-label="Tecnologías">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>}
        {p.url && <a className="plink" href={p.url} target="_blank" rel="noopener noreferrer">VER SITIO ↗</a>}
      </div>
    </article>
  );
}

export default function Projects() {
  const [cat, setCat] = useState('all');
  const [playing, setPlaying] = useState(null);
  const list = PROJECTS.filter((p) => cat === 'all' || p.category === cat);
  return (
    <section className="block projects-section" id="proyectos">
      <div className="section-heading reveal"><span className="section-kicker">02 / PROYECTOS Y CASOS</span><h2>TRABAJO<br /><em>EN ACCIÓN.</em></h2></div>
      <div className="tabs reveal" role="group" aria-label="Filtrar proyectos por categoría">
        {CATEGORIES.map((c) => (
          <button key={c.id} className={cat === c.id ? 'on' : ''} aria-pressed={cat === c.id} onClick={() => { setCat(c.id); setPlaying(null); }}>{c.label}</button>
        ))}
      </div>
      <div className="projects-grid">{list.map((p) => <Card key={p.id} p={p} playing={playing} setPlaying={setPlaying} />)}</div>
      <p className="portfolio-more reveal">¿Querés ver más? <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">Portfolio completo ↗</a></p>
    </section>
  );
}
