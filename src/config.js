// ─── CONFIGURACIÓN DE CONTACTO ────────────────────────────────────────────────
// Podés editar estos valores acá o definirlos como variables de entorno
// (en Vercel: Settings → Environment Variables). Ver .env.example.

export const PORTFOLIO_URL = 'https://ruben-portfolio-steel.vercel.app/';
export const EMAIL = 'rubengutierrezdv@gmail.com';
export const GITHUB_URL = 'https://github.com/RubenEduardoG';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/r%C3%BAben-eduardo-gutierrez';
export const CV_URL = '/cv-ruben-full-stack.pdf';

// Número con código de país, solo dígitos. Ej: 54911XXXXXXXX
// PENDIENTE: mientras esté vacío no se muestra el botón de WhatsApp.
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');

// URL de un servicio de formularios (Formspree, Web3Forms, un endpoint propio, etc.)
// que acepte POST con JSON. PENDIENTE: mientras esté vacío, el formulario abre
// WhatsApp o el correo con el mensaje armado; NO se marca como "enviado".
export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';
