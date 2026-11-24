/* Service worker de Boleta Justa.
  regla: SOLO los assets declarados se cachean. Nunca el PDF ni datos del usuario. */
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './version.json',
  './app.js', './parser.js', './auditoria.js', './explicar.js', './payload.js',
  './history.js', './formulario.js', './resumen.js', './reclamo.js',
  './tarifas.js', './tablas.js',
  './vendor/pdfjs/pdf.min.js', './vendor/pdfjs/pdf.worker.min.js',
  './vendor/pdfjs/LICENSE', './vendor/pdfjs/README.md',
  './icons/icon-192.png', './icons/icon-512.png',
];

let CACHE = 'boleta-justa-sin-version';
const destino = ruta => new URL(ruta, self.registration.scope).href;

async function leerVersion() {
  try {
    const r = await fetch(destino('./version.json'), { cache: 'no-store' });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const version = await leerVersion();
    if (version && version.cache) CACHE = version.cache;
    const c = await caches.open(CACHE);
    await c.addAll(ASSETS.map(destino));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(nombres
      .filter(n => n.startsWith('boleta-justa-') && n !== CACHE)
      .map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const esAsset = ASSETS.some(ruta => destino(ruta) === url.href);
  if (!esAsset) return; // fuera de la lista: ni se toca (PDF, blobs, datos)

  event.respondWith((async () => {
    const c = await caches.open(CACHE);
    const guardado = await c.match(req);
    if (guardado) return guardado;
    const respuesta = await fetch(req);
    if (respuesta.ok) c.put(req, respuesta.clone());
    return respuesta;
  })());
});

self.addEventListener('message', event => {
  const tipo = event.data && event.data.type;
  if (tipo === 'CHECK_VERSION') {
    event.waitUntil((async () => {
      const version = await leerVersion();
      if (version && version.cache && version.cache !== CACHE && event.source) {
        event.source.postMessage({ type: 'NEW_VERSION', version });
      }
    })());
  }
  if (tipo === 'SKIP_WAITING') self.skipWaiting();
});
