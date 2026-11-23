/* Cliente 100% local: lee el PDF en el navegador y audita sin red. */
import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/build/pdf.min.mjs';
import { parsear } from './parser.js';
import { auditar } from './auditoria.js';
import { explicar } from './explicar.js';
import { TABLAS } from './tablas.js';
import { construir as construirPayload } from './payload.js';
import * as hist from './history.js';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/build/pdf.worker.min.mjs';

const $ = id => document.getElementById(id);
const input = $('archivo');
const boton = $('analizar');
const estado = $('estado');
const drop = $('drop');
let archivo = null;
let ultimoPayload = null;

function elegir(f) {
  if (!f) return;
  if (!f.name.toLowerCase().endsWith('.pdf')) {
    estado.textContent = 'Elegí un archivo PDF.';
    return;
  }
  archivo = f;
  $('nombre').textContent = f.name + ' · ' + (f.size / 1024).toFixed(0) + ' KB · solo en tu equipo';
  boton.disabled = false;
  estado.textContent = '';
}
input.addEventListener('change', () => elegir(input.files[0]));
['dragenter', 'dragover'].forEach(e => drop.addEventListener(e, ev => {
  ev.preventDefault(); drop.classList.add('arrastrando');
}));
['dragleave', 'drop'].forEach(e => drop.addEventListener(e, ev => {
  ev.preventDefault(); drop.classList.remove('arrastrando');
}));
drop.addEventListener('drop', ev => elegir(ev.dataTransfer.files[0]));

async function lineasDelPdf(file) {
  const buffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
  const salida = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const pagina = await doc.getPage(n);
    const contenido = await pagina.getTextContent();
    let actual = '';
    for (const item of contenido.items) {
      actual += item.str;
      if (item.hasEOL) { salida.push(actual); actual = ''; }
    }
    if (actual) salida.push(actual);
  }
  return salida;
}

function pintar(x) {
  const items = x.items.map(i => `<div class="item"><span>${i.icono}</span>` +
    `<div><b>${i.titulo}</b><p>${i.texto}</p></div></div>`).join('');
  const acciones = x.acciones.map(a => `<li>${a}</li>`).join('');
  const glosario = x.glosario.map(g => `<div><b>${g.termino}:</b> ${g.significado}</div>`).join('');
  $('resultado').innerHTML = `<div class="expl ${x.estado}">
    <h2>${x.titulo}</h2><p class="resumen">${x.resumen}</p>
    ${items}
    <div class="acciones"><b>Qué podés hacer</b><ul>${acciones}</ul></div>
    <details><summary>Ver glosario (palabras raras)</summary>${glosario}</details>
  </div>`;
  $('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

boton.addEventListener('click', async () => {
  if (!archivo) return;
  boton.disabled = true;
  estado.textContent = 'Leyendo el PDF en tu dispositivo…';
  try {
    const lineas = await lineasDelPdf(archivo);
    const boleta = parsear(lineas);
    const auditoria = auditar(boleta, TABLAS);
    const explicacion = explicar(auditoria, boleta);
    ultimoPayload = construirPayload(boleta, auditoria);
    window.__bj = { boleta, auditoria }; // solo en memoria del navegador, para depuración
    pintar(explicacion);
    renderHistorial();
    estado.textContent = 'Listo. Nada se subió ni se guardó.';
  } catch (e) {
    $('resultado').innerHTML = `<div class="expl a_revisar"><h2>No pudimos leer el PDF</h2>
      <p class="resumen error">${String(e && e.message || e)}</p>
      <p>Probá con una boleta de EJESA. Si el error sigue, es posible que el PDF sea una imagen escaneada.</p></div>`;
    estado.textContent = '';
  } finally {
    boton.disabled = false;
  }
});

/* ---------- historial local (sin cuenta, sin servidor) ---------- */
function renderHistorial() {
  const items = hist.listar();
  $('hist-lista').innerHTML = items.length
    ? items.map(i => `<div class="hist-item"><span>${i.mes || 'sin mes'} · ${i.resolucion || '—'}</span>` +
        `<span><button type="button" data-ver="${i.id}">Ver</button> ` +
        `<button type="button" data-del="${i.id}">Borrar</button></span></div>`).join('')
    : 'Todavía no guardaste ningún análisis.';
  document.querySelectorAll('[data-ver]').forEach(b => b.onclick = () => {
    const p = hist.obtener(b.dataset.ver);
    if (p && p.auditoria) {
      ultimoPayload = p;
      const aud = { ...p.auditoria, mes: p.mes };
      pintar(explicar(aud, p));
    }
  });
  document.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    hist.borrar(b.dataset.del);
    renderHistorial();
  });
}

$('guardar-local').onclick = () => {
  if (!ultimoPayload) { estado.textContent = 'Primero analizá una boleta.'; return; }
  try {
    hist.guardar(ultimoPayload);
    renderHistorial();
    estado.textContent = 'Análisis guardado solo en este dispositivo.';
  } catch (e) { estado.textContent = e.message; }
};

$('exportar-json').onclick = () => {
  const blob = new Blob([hist.exportar()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'boleta-justa-analyisis.json';
  a.click();
  URL.revokeObjectURL(url);
};

$('importar-json').addEventListener('change', async ev => {
  const f = ev.target.files[0];
  if (!f) return;
  try {
    const n = hist.importar(await f.text());
    renderHistorial();
    estado.textContent = `${n} análisis importados a este dispositivo.`;
  } catch (e) { estado.textContent = 'No se pudo importar: ' + e.message; }
  ev.target.value = '';
});

$('borrar-todo').onclick = () => {
  hist.borrarTodo();
  renderHistorial();
  estado.textContent = 'Historial borrado de este dispositivo.';
};

renderHistorial();
