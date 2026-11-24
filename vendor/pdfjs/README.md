# pdf.js empaquetado (sin CDN)

Versión fija: **6.5.438** del paquete npm `pdfjs-dist`
(https://www.npmjs.com/package/pdfjs-dist/v/6.5.438).
Licencia: Apache-2.0 (ver `LICENSE`, idéntica a la del paquete).
Origen de los archivos: https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/

Archivos:

| Archivo | SHA-256 |
|---|---|
| `pdf.min.js` | `3a88402882cfa3e7e72c2c9b5149f52f0f88baf1c5b62aa11a41abdbc2072440` |
| `pdf.worker.min.js` | `1e64c8240e54735ec5913b37acd5134747799cb8c6bb3777c70adbc01232d2aa` |
| `LICENSE` | `0d542e0c8804e39aa7f37eb00da5a762149dc682d7829451287e11b938e94594` |

Para verificar en Windows (desde esta carpeta):

```bash
certutil -hashfile pdf.min.js SHA256
certutil -hashfile pdf.worker.min.js SHA256
certutil -hashfile LICENSE SHA256
```

En Linux/macOS: `sha256sum pdf.min.js pdf.worker.min.js LICENSE`.

Los archivos se renombraron de `.mjs` a `.js` sin cambiar su contenido:
`python -m http.server` sirve `.mjs` como `text/plain` y el navegador se
niega a cargarlo como módulo. Con `.js` funciona tanto en local como en
GitHub Pages. Los hashes son idénticos a los del paquete original.

## Sobre los strings `http://` dentro de los `.js`

El código minificado contiene textos `http://...` que son constantes internas
(namespaces XML/XFA, URLs de licencia, ejemplos como `example.com` y una
plantilla `http://${t}`). **No son descargas**: pdf.js solo lee el ArrayBuffer
del PDF que el usuario eligió y extrae texto. La Content-Security-Policy de
`cliente/index.html` fija `connect-src 'self'`, así que cualquier conexión
saliente queda bloqueada por el navegador.

No actualizar esta versión a ciegas: si se cambia, descargar los tres archivos
de nuevo, recalcular los hashes y actualizar esta tabla.
