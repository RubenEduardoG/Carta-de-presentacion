import { EMAIL, WHATSAPP_NUMBER, FORM_ENDPOINT } from './config.js';

// Canal que se usará al enviar: 'endpoint' (envío real), 'whatsapp' o 'email' (se abre la app del usuario).
export const CHANNEL = FORM_ENDPOINT ? 'endpoint' : WHATSAPP_NUMBER ? 'whatsapp' : 'email';

export const shortMessage = (f) =>
  `Hola Rubén, quiero consultar por un proyecto web.\n\n*Nombre:* ${f.name || '-'}\n*Contacto:* ${f.contact || '-'}\n*Proyecto:* ${f.type}\n*Mensaje:* ${f.message || '-'}`;

export const fullMessage = (f) =>
  `Hola Rubén, quiero consultar por un proyecto web.\n\n*Nombre:* ${f.name || '-'}\n*Empresa / marca:* ${f.company || '-'}\n*Contacto:* ${f.contact || '-'}\n*Proyecto:* ${f.type}\n*Idea / objetivo:* ${f.idea || '-'}\n*Web actual:* ${f.current || '-'}\n*Referencias:* ${f.references || '-'}\n*Material listo:* ${f.materials.join(', ') || 'A definir'}\n*Diseño / modelo:* ${f.design || '-'}\n*Funciones necesarias:* ${f.features || '-'}\n*Fecha objetivo:* ${f.deadline || '-'}\n*Presupuesto estimado:* ${f.budget || '-'}\n\nQuiero coordinar para avanzar.`;

/**
 * Envía una consulta.
 * - Con FORM_ENDPOINT: POST real; lanza error si el servidor no responde OK.
 * - Sin endpoint: abre WhatsApp (si hay número) o el cliente de correo. En esos casos
 *   el usuario aún debe enviar el mensaje desde su app; devolvemos el canal usado.
 */
export async function submitLead(payload, text) {
  if (FORM_ENDPOINT) {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, _subject: 'Consulta de proyecto web' }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return 'endpoint';
  }
  if (WHATSAPP_NUMBER) {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    return 'whatsapp';
  }
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Consulta de proyecto web')}&body=${encodeURIComponent(text)}`;
  return 'email';
}

export const STATUS_TEXT = {
  endpoint: 'Consulta enviada. La voy a revisar y te contacto.',
  whatsapp: 'Se abrió WhatsApp con tu mensaje armado. Enviálo desde ahí para completar la consulta.',
  email: `Se abrió tu app de correo con el mensaje armado. Si no ocurrió, escribime a ${EMAIL}.`,
};
