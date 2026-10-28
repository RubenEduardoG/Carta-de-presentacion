import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PROJECT_TYPES } from '../data.js';
import { CHANNEL, fullMessage, submitLead } from '../lead.js';
import FormStatus from './FormStatus.jsx';

const initial = { name: '', company: '', contact: '', type: 'Landing Page', idea: '', current: '', references: '', materials: [], design: '', features: '', deadline: '', budget: '' };
const MATERIALS = ['Logo / branding', 'Textos', 'Imágenes', 'Videos', 'Dominio', 'Hosting / accesos'];
const LABEL = { endpoint: 'ENVIAR CONSULTA ↗', whatsapp: 'ENVIAR POR WHATSAPP ↗', email: 'ENVIAR POR EMAIL ↗' };

export default function ProjectModal({ close, initialType = 'Landing Page' }) {
  const [f, setF] = useState({ ...initial, type: initialType });
  const [step, setStep] = useState(1);
  const [state, setState] = useState({ status: 'idle' });
  const panel = useRef(null);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (v) => setF((x) => ({ ...x, materials: x.materials.includes(v) ? x.materials.filter((a) => a !== v) : [...x.materials, v] }));
  const message = useMemo(() => fullMessage(f), [f]);

  // Accesibilidad: foco inicial, Esc para cerrar, foco atrapado y sin scroll de fondo.
  useEffect(() => {
    const previous = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('input,select,textarea')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [...panel.current.querySelectorAll('button:not([disabled]),input,select,textarea,a[href]')];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [close]);

  const send = async () => {
    setState({ status: 'sending' });
    try {
      const channel = await submitLead({ ...f, materials: f.materials.join(', '), mensaje: message }, message);
      setState({ status: 'done', channel });
    } catch {
      setState({ status: 'error' });
    }
  };

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="close" onClick={close} aria-label="Cerrar formulario">×</button>
        <div className="formtop"><span>PROYECTO / 0{step}</span><b>{step}/3</b></div>
        <div className="progress"><i style={{ width: `${step * 33.333}%` }} /></div>

        {step === 1 && (
          <div className="formpage">
            <small>PRIMERO, LO ESENCIAL</small>
            <h2 id="modal-title">Contame sobre<br /><em>tu proyecto.</em></h2>
            <div className="grid">
              <label>Nombre<input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Tu nombre" autoComplete="name" /></label>
              <label>Empresa / marca<input value={f.company} onChange={(e) => set('company', e.target.value)} placeholder="Opcional" autoComplete="organization" /></label>
            </div>
            <label>WhatsApp o email<input value={f.contact} onChange={(e) => set('contact', e.target.value)} placeholder="¿Dónde te contacto?" /></label>
            <label>¿Qué necesitás?
              <select value={f.type} onChange={(e) => set('type', e.target.value)}>{PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label>Idea y objetivo<textarea value={f.idea} onChange={(e) => set('idea', e.target.value)} placeholder="Qué querés lograr, qué vendés y a quién..." /></label>
          </div>
        )}

        {step === 2 && (
          <div className="formpage">
            <small>REFERENCIAS + MATERIAL</small>
            <h2 id="modal-title">Cuanto más listo,<br /><em>más rápido salimos.</em></h2>
            <label>Web actual<input value={f.current} onChange={(e) => set('current', e.target.value)} placeholder="Link, si ya existe" /></label>
            <label>Referencias que te gustan<textarea value={f.references} onChange={(e) => set('references', e.target.value)} placeholder="Pegá links de webs, Drive, Figma, etc." /></label>
            <div className="labeltitle" id="mat-label">¿Qué material ya tenés?</div>
            <div className="chips" role="group" aria-labelledby="mat-label">
              {MATERIALS.map((x) => <button type="button" aria-pressed={f.materials.includes(x)} className={f.materials.includes(x) ? 'on' : ''} onClick={() => toggle(x)} key={x}>{x}</button>)}
            </div>
            <label>¿Tenés diseño o modelo?<input value={f.design} onChange={(e) => set('design', e.target.value)} placeholder="Figma, PDF, maqueta o link" /></label>
          </div>
        )}

        {step === 3 && (
          <div className="formpage">
            <small>ÚLTIMOS DATOS</small>
            <h2 id="modal-title">Dejemos todo<br /><em>listo para arrancar.</em></h2>
            <label>Funciones necesarias<textarea value={f.features} onChange={(e) => set('features', e.target.value)} placeholder="WhatsApp, agenda, pagos, carrito, formularios..." /></label>
            <div className="grid">
              <label>Fecha objetivo<input value={f.deadline} onChange={(e) => set('deadline', e.target.value)} placeholder="Ej: 15/11" /></label>
              <label>Presupuesto aproximado<input value={f.budget} onChange={(e) => set('budget', e.target.value)} placeholder="Opcional" /></label>
            </div>
            <div className="speed"><b>¿LA QUERÉS EN TIEMPO RÉCORD?</b><p>Tené preparados textos, imágenes, videos, identidad visual, accesos y referencias. Con el material listo podemos reducir muchísimo los tiempos.</p></div>
          </div>
        )}

        <FormStatus state={state} />
        <div className="formactions">
          {step > 1 && <button className="back" onClick={() => setStep(step - 1)}>← ATRÁS</button>}
          <button className="next" onClick={() => (step < 3 ? setStep(step + 1) : send())} disabled={(step === 1 && (!f.name || !f.idea)) || state.status === 'sending'}>
            {step < 3 ? 'CONTINUAR →' : LABEL[CHANNEL]}
          </button>
        </div>
      </div>
    </div>
  );
}
