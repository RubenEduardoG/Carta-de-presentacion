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
 * PROYECTOS. Cada proyecto acepta:
 *   category: 'negocios' | 'landings' | 'ecommerce'
 *   name, business (tipo de negocio), problem (qué buscaba resolver), built (qué desarrollé)
 *   tech: ['React', ...]
 *   image: '/projects/nombre.webp' → captura o poster del video (archivos en /public/projects/)
 *   imageAlt: texto alternativo (describí lo que realmente muestra la imagen)
 *   fit: 'contain' para logos o imágenes que no deben recortarse (opcional)
 *   video: '/projects/nombre.mp4' → grabación de pantalla corta (opcional; se carga solo al reproducir)
 *   url / repo: enlaces al sitio en vivo y al código (opcionales)
 *   placeholder: true → marca un proyecto de relleno (quitar al cargar uno real)
 * No agregar métricas, testimonios ni resultados que no estén comprobados.
 */
export const PROJECTS = [
  {
    id: 'lo-de-martita', category: 'negocios',
    name: 'Lo de Martita',
    business: 'Rotisería con delivery y take away',
    problem: 'Que los clientes vean los productos por categoría, armen su pedido y se contacten fácil con el comercio.',
    built: 'Aplicación web con productos organizados por categorías, armado de pedidos y contacto directo con el comercio.',
    tech: [],
    image: '/projects/lo-de-martita.webp', imageAlt: 'Captura del sitio de Lo de Martita con el menú por categorías',
    url: 'https://rotiseria-lo-de-martita.vercel.app/',
  },
  {
    id: 'lisi-carpinteria', category: 'negocios',
    name: 'Lisi Carpintería',
    business: 'Carpintería artesanal y restauración de muebles',
    problem: 'Mostrar el trabajo del negocio y facilitar que los clientes pidan cotizaciones.',
    built: 'Landing con galería interactiva de transformación de muebles, imágenes en alta resolución con lightbox y formulario directo para cotizaciones.',
    tech: ['React', 'Vite'],
    image: '/projects/lisi-carpinteria.webp', imageAlt: 'Captura de la landing de Lisi Carpintería',
    url: 'https://lisi-carpinteria.vercel.app/', repo: 'https://github.com/RubenEduardoG/lisi-carpinteria',
  },
  {
    id: 'coconutbliss', category: 'negocios',
    name: 'Coconutbliss',
    business: 'Tienda de productos naturales',
    problem: 'Presentar la marca con una imagen limpia y una navegación clara.',
    built: 'Sitio visual con diseño minimalista y estética orientada a la marca.',
    tech: ['HTML', 'CSS'],
    image: '/projects/coconutbliss.webp', imageAlt: 'Logo de Coconutbliss Natural Soap', fit: 'contain',
    url: 'https://coconutblis.vercel.app/', repo: 'https://github.com/RubenEduardoG/coconup',
  },
  {
    id: 've-english-teacher', category: 'landings',
    name: 'VE English Teacher',
    business: 'Profesora de inglés',
    problem: 'Captar alumnos y facilitar la consulta de modalidades y niveles.',
    built: 'Landing enfocada en captación, con agendamiento de entrevistas sin cargo y formulario de contacto.',
    tech: ['React', 'Tailwind CSS', 'Formspree'],
    image: '/projects/ve-english-teacher.webp', imageAlt: 'Captura de la landing de VE English Teacher',
    url: 'https://victeacherve.vercel.app/', repo: 'https://github.com/RubenEduardoG/proyecto-idiomas-clases',
  },
  {
    id: 'dyd-plegados', category: 'ecommerce',
    name: 'DyD Plegados',
    business: 'Empresa metalúrgica',
    problem: 'Presentar a la empresa y permitir armar pedidos desde un catálogo.',
    built: 'Sitio institucional con simulador interactivo, catálogo, carrito y lógica de compra.',
    tech: ['JavaScript'],
    image: '/projects/dyd-plegados.webp', imageAlt: 'Foto del taller de DyD Plegados',
    url: 'https://dydplegados.netlify.app/', repo: 'https://github.com/RubenEduardoG/80790',
  },
];

// Tecnologías con las que trabajo (íconos en /public/icons).
export const STACK = [
  { name: 'HTML', icon: '/icons/html.svg' },
  { name: 'CSS', icon: '/icons/css.svg' },
  { name: 'JavaScript', icon: '/icons/javascript.svg' },
  { name: 'TypeScript', icon: '/icons/typescript.svg' },
  { name: 'React', icon: '/icons/react.svg' },
  { name: 'Vite', icon: '/icons/vitejs.svg' },
  { name: 'Node.js', icon: '/icons/nodejs.svg' },
  { name: 'Express', icon: '/icons/express.svg' },
  { name: 'Git', icon: '/icons/git.svg' },
  { name: 'GitHub', icon: '/icons/github-light.svg' },
  { name: 'Vercel', icon: '/icons/vercel.svg' },
  { name: 'Postman', icon: '/icons/postman.svg' },
];
