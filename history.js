/* Historial local: solo payloads validados, guardados en este navegador.
   No envía nada: localStorage vive en el dispositivo de la persona. */
import { validar } from './payload.js';

const CLAVE = 'boleta_justa_historial_v1';

function leer() {
  try {
    const raw = localStorage.getItem(CLAVE);
    const datos = raw ? JSON.parse(raw) : [];
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function escribir(items) {
  localStorage.setItem(CLAVE, JSON.stringify(items));
  return items;
}

export function listar() {
  return leer().map(item => ({
    id: item.id, creado: item.creado, mes: item.payload?.mes,
    resolucion: item.payload?.auditoria?.resolucion,
  })).sort((a, b) => b.creado - a.creado);
}

export function guardar(payload, maximo = 20) {
  validar(payload);
  const items = leer();
  const item = {
    id: (globalThis.crypto?.randomUUID?.() || String(Date.now())),
    creado: Date.now(),
    payload,
  };
  const nuevo = [item, ...items].slice(0, maximo);
  escribir(nuevo);
  return item.id;
}

export function obtener(id) {
  return leer().find(i => i.id === id)?.payload || null;
}

export function borrar(id) {
  escribir(leer().filter(i => i.id !== id));
}

export function borrarTodo() {
  localStorage.removeItem(CLAVE);
}

export function importar(texto) {
  const datos = JSON.parse(texto);
  const payloads = Array.isArray(datos) ? datos : [datos];
  let n = 0;
  for (const p of payloads) {
    if (p?.payload) validar(p.payload); else validar(p);
    guardar(p?.payload || p);
    n++;
  }
  return n;
}

export function exportar() {
  return JSON.stringify(leer().map(i => i.payload), null, 2);
}
