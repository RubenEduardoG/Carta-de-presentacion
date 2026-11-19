import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Precarga la escena 3D junto con el código principal: así su descarga no espera
// a que termine de ejecutarse el resto de la página (antes arrancaba ~0,4 s más tarde).
function preloadScene() {
  return {
    name: 'preload-scene-3d',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const chunks = Object.values(ctx.bundle).filter((c) => c.type === 'chunk');
        const scene = chunks.find((c) => c.facadeModuleId && /Scene3D\.jsx$/.test(c.facadeModuleId));
        if (!scene) return html;
        const files = new Set([scene.fileName, ...(scene.imports || [])]);
        return {
          html,
          tags: [...files].map((f) => ({ tag: 'link', attrs: { rel: 'modulepreload', crossorigin: '', href: `/${f}` }, injectTo: 'head' })),
        };
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadScene()],
});
