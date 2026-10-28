import React from 'react';
import { STATUS_TEXT } from '../lead.js';

export default function FormStatus({ state }) {
  if (state.status === 'idle') return null;
  const error = state.status === 'error';
  const text = state.status === 'sending' ? 'Enviando…' : error ? 'No se pudo enviar. Probá de nuevo o escribime por correo.' : STATUS_TEXT[state.channel];
  return (
    <p className={`form-status${error ? ' err' : ''}`} role={error ? 'alert' : 'status'}>
      {text}
    </p>
  );
}
