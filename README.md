# RG · Carta de presentación 3D (versión 3)

## Requisitos
Node.js 20 LTS o 22 LTS de 64 bits. Google Chrome/Edge con aceleración gráfica habilitada.

## Ejecutar
1. Extraer el ZIP en una carpeta local, preferentemente fuera de OneDrive.
2. Abrir esa carpeta en VS Code.
3. Ejecutar `npm install` y luego `npm run dev`.
4. Abrir http://127.0.0.1:5173/.

## Producción
`npm run build` genera la carpeta `dist`.

## Contacto
En `src/main.jsx` cambiar `WHATSAPP_NUMBER` por tu número internacional sin + ni espacios. Mientras esté vacío, el formulario enviará por email a rubengutierrezdv@gmail.com.

## Cambios en esta versión
Fondo 3D mejorado: entorno de reflejos procedural (RoomEnvironment, sin HDRI remoto), halo rosado detrás del objeto, anillos orbitales de fondo, materiales con clearcoat y emisivo, tone mapping ACES y sparkles en dos capas. Se mantienen las interacciones (arrastrar, seguir el mouse, cámara reactiva).

## Si falla
Revisar `node -v` y `node -p "process.arch"` (debe indicar `x64`). Revisar `chrome://gpu` si el 3D no aparece. Si el equipo va lento, bajar `Sparkles count` o `dpr` a `[1,1]` en `Scene`.
