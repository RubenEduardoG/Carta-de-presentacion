// Contenido de la landing. Todo el texto comercial vive acá para editarlo sin tocar componentes.

export const PROJECT_TYPES = ['Landing Page', 'Web institucional', 'E-commerce', 'Automatización', 'Web + automatizaciones', 'Otro'];

export const SERVICES = [
  { number: '01', name: 'Landing pages', detail: 'Páginas enfocadas en presentar una oferta y generar consultas o registros.', type: 'Landing Page', glyph: '↗' },
  { number: '02', name: 'Sitios web', detail: 'Webs profesionales, responsive y adaptadas a la identidad de cada negocio.', type: 'Web institucional', glyph: '⌘' },
  { number: '03', name: 'E-commerce', detail: 'Tiendas online con catálogo, carrito y procesos de compra según las necesidades del proyecto.', type: 'E-commerce', glyph: '◇' },
  { number: '04', name: 'Automatizaciones', detail: 'Integraciones, formularios, seguimiento de contactos y procesos automatizados.', type: 'Automatización', glyph: '∞' },
];

export const PROCESS = [
  { n: '01', title: 'Entendemos tu proyecto', text: 'Conversamos sobre el negocio, sus objetivos y lo que necesita la web.' },
  { n: '02', title: 'Diseñamos la solución', text: 'Definimos estructura, contenido, diseño y funcionalidades.' },
  { n: '03', title: 'Desarrollamos', text: 'Construyo la web y comparto avances durante el proceso.' },
  { n: '04', title: 'Revisamos y publicamos', text: 'Probamos la experiencia, realizamos ajustes acordados y preparamos la publicación.' },
];

export const REASONS = [
  { title: 'Desarrollo personalizado', text: 'Cada web se construye a medida del negocio, no desde una plantilla genérica.' },
  { title: 'Comunicación directa', text: 'Hablás conmigo durante todo el proyecto, sin intermediarios.' },
  { title: 'Diseño responsive', text: 'Pensado para verse y funcionar bien en celular, tablet y escritorio.' },
  { title: 'Atención al rendimiento', text: 'Priorizo que la web cargue rápido y se sienta fluida.' },
  { title: 'Herramientas integradas', text: 'Formularios, WhatsApp, agendas y otras funciones conectadas a tu web.' },
  { title: 'Enfoque en tu negocio', text: 'Cada decisión de diseño y desarrollo parte de lo que querés lograr.' },
];

export const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'negocios', label: 'Negocios y servicios' },
  { id: 'landings', label: 'Landing pages y embudos' },
  { id: 'ecommerce', label: 'E-commerce' },
];

/**
 * PROYECTOS — REEMPLAZAR LOS PLACEHOLDERS POR TRABAJOS REALES.
 * Cada proyecto acepta:
 *   category: 'negocios' | 'landings' | 'ecommerce'
 *   name, business (tipo de negocio), problem (qué buscaba resolver), built (qué desarrollé)
 *   tech: ['React', ...]   (opcional)
 *   image: '/projects/nombre.webp'  → imagen o poster del video (archivo en /public/projects/)
 *   video: '/projects/nombre.mp4'   → grabación de pantalla corta (opcional, se carga solo al reproducir)
 *   url:   'https://...'            → web en vivo (opcional)
 *   placeholder: true               → quitar al cargar el proyecto real
 * No agregar métricas, testimonios ni resultados que no estén comprobados.
 */
export const PROJECTS = [
  {
    id: 'ph-negocios', category: 'negocios', placeholder: true,
    name: 'Proyecto de negocio o servicios',
    business: 'Completar: tipo de negocio',
    problem: 'Completar: qué problema buscaba resolver.',
    built: 'Completar: qué desarrollé.',
    tech: [], image: null, video: null, url: null,
  },
  {
    id: 'ph-landings', category: 'landings', placeholder: true,
    name: 'Proyecto de landing o embudo',
    business: 'Completar: tipo de negocio',
    problem: 'Completar: qué problema buscaba resolver.',
    built: 'Completar: qué desarrollé.',
    tech: [], image: null, video: null, url: null,
  },
  {
    id: 'ph-ecommerce', category: 'ecommerce', placeholder: true,
    name: 'Proyecto de tienda online',
    business: 'Completar: tipo de negocio',
    problem: 'Completar: qué problema buscaba resolver.',
    built: 'Completar: qué desarrollé.',
    tech: [], image: null, video: null, url: null,
  },
];
