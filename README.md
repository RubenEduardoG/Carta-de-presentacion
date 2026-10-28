# RG · Landing de captación (React + Vite + React Three Fiber)

Landing de una sola página: Hero 3D → Servicios → Proyectos → Cómo trabajo → Por qué conmigo → Contacto.

## Requisitos
Node.js 20 o 22 LTS (64 bits). Chrome/Edge con aceleración gráfica habilitada.

## Ejecutar
`npm install` → `npm run dev` → http://127.0.0.1:5173/
Producción: `npm run build` (genera `dist/`, compatible con Vercel sin configuración extra).

## Qué editar
| Qué | Dónde |
|---|---|
| WhatsApp, email, endpoint del formulario | `src/config.js` o variables `VITE_WHATSAPP_NUMBER` / `VITE_FORM_ENDPOINT` (ver `.env.example`; en Vercel: Settings → Environment Variables) |
| Textos de servicios, proceso y "por qué" | `src/data.js` |
| **Proyectos reales** | `src/data.js` → `PROJECTS` (reemplazar los placeholders; archivos en `public/projects/`) |
| Escena 3D | `src/components/Scene3D.jsx` |

## Pendiente de conectar
- **WhatsApp:** sin número, el botón no se muestra y el envío usa el correo.
- **Formulario:** sin `VITE_FORM_ENDPOINT` no hay envío real; el formulario abre WhatsApp/correo con el mensaje armado y NO muestra "enviado". Con endpoint (Formspree, Web3Forms, etc.) hace un POST JSON y solo confirma si el servidor responde OK.
- **Proyectos:** hay 3 placeholders marcados (uno por categoría). Videos: `preload="none"`, solo se reproduce uno a la vez, y se pausan al salir de pantalla.

## 3D
Esfera cromada negra, anillos con giro independiente, detalles fucsia y reflejos procedurales (`RoomEnvironment`, sin HDRI remoto). Se arrastra (mouse y touch; el scroll vertical sigue funcionando) y reacciona al mouse. El chunk de three/R3F se carga aparte y diferido; el texto no espera. Respeta `prefers-reduced-motion` (pose estática), limita DPR, se pausa fuera de pantalla, libera geometrías/materiales/texturas al desmontar y muestra una alternativa si no hay WebGL o se pierde el contexto. Si va lento: bajar `dpr` o `Sparkles count` en `Scene3D.jsx`.
