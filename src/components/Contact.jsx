import React, { useState } from 'react';
import { EMAIL, WHATSAPP_NUMBER, FORM_ENDPOINT } from '../config.js';
import { PROJECT_TYPES } from '../data.js';
import { CHANNEL, shortMessage, submitLead } from '../lead.js';
import FormStatus from './FormStatus.jsx';

const LABEL = { endpoint: 'ENVIAR CONSULTA ↗', whatsapp: 'ENVIAR POR WHATSAPP ↗', email: 'ENVIAR POR EMAIL ↗' };

export default function Contact({ onStart }) {
  const [f, setF] = useState({ name: '', contact: '', type: 'Landing Page', message: '', _gotcha: '' });
  const [state, setState] = useState({ status: 'idle' });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (f._gotcha) return; // honeypot anti-spam
    setState({ status: 'sending' });
    try {
      const { _gotcha, ...data } = f;
      const channel = await submitLead({ nombre: data.name, contacto: data.contact, tipo: data.type, mensaje: data.message }, shortMessage(data));
      setState({ status: 'done', channel });
    } catch {
      setState({ status: 'error' });
    }
  };

  const wa = WHATSAPP_NUMBER && `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola Rubén, quiero consultar por un proyecto web.')}`;

  return (
    <section className="block contact-section" id="contacto">
      <div className="contact-panel reveal">
        <div className="contact-copy">
          <span className="section-kicker">05 / CONTACTO</span>
          <h2>¿TENÉS UN PROYECTO<br /><em>EN MENTE?</em></h2>
          <p>Contame qué necesitás y veamos cómo podemos llevarlo a la web.</p>
          <div className="actions">
            {wa && <a className="primary" href={wa} target="_blank" rel="noopener noreferrer">WHATSAPP <b>↗</b></a>}
            <a className="secondary" href={`mailto:${EMAIL}`}>{EMAIL.toUpperCase()}</a>
          </div>
          <button className="linkbtn" onClick={() => onStart()}>Prefiero completar un brief detallado →</button>
        </div>

        <form className="contact-form" onSubmit={submit} aria-label="Formulario de consulta">
          <label>Nombre<input required value={f.name} onChange={set('name')} placeholder="Tu nombre" autoComplete="name" /></label>
          <label>WhatsApp o email<input required value={f.contact} onChange={set('contact')} placeholder="¿Dónde te contacto?" /></label>
          <label>Tipo de proyecto
            <select value={f.type} onChange={set('type')}>{PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </label>
          <label>Mensaje<textarea required value={f.message} onChange={set('message')} placeholder="Contame qué querés lograr..." /></label>
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f._gotcha} onChange={set('_gotcha')} />
          <button className="primary" type="submit" disabled={state.status === 'sending'}>{LABEL[CHANNEL]}</button>
          {!FORM_ENDPOINT && state.status === 'idle' && (
            <p className="form-note">{WHATSAPP_NUMBER ? 'Se abrirá WhatsApp con tu mensaje armado.' : 'Se abrirá tu app de correo con tu mensaje armado.'}</p>
          )}
          <FormStatus state={state} />
        </form>
      </div>
    </section>
  );
}
