/* Cliente 100% local: lee el PDF en el navegador y audita sin red. */
import * as pdfjsLib from './vendor/pdfjs/pdf.min.js';
import { parsear, esTextoUtil } from './parser.js';
import { CAMPOS, armarBoleta } from './formulario.js';
import { auditar } from './auditoria.js';
import { explicar } from './explicar.js';
import { TABLAS } from './tablas.js';
import { construir as construirPayload } from './payload.js';
import * as hist from './history.js';
import { armarResumen, copiar, enlaceWhatsApp } from './resumen.js';
import { tieneSenales, armarReclamo, descargarTxt } from './reclamo.js';

// Ruta relativa al módulo: funciona aunque el sitio esté en /boleta-justa-web/
pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL('./vendor/pdfjs/pdf.worker.min.js', import.meta.url).href;

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
  let haySenales = false;
  try { haySenales = !!(ultimoPayload && tieneSenales(ultimoPayload)); } catch { haySenales = false; }
  const botones = (ultimoPayload && ultimoPayload.auditoria) ? `<div class="fila">
    <button type="button" id="btn-resumen" aria-label="Copiar resumen para WhatsApp">Copiar resumen</button>
    <button type="button" id="btn-wa" aria-label="Abrir WhatsApp con el resumen">WhatsApp</button>
    ${haySenales ? '<button type="button" id="btn-reclamo" aria-label="Preparar solicitud de desglose a EJESA">Preparar solicitud</button>' : ''}
  </div>` : '';
  $('resultado').innerHTML = `<div class="expl ${x.estado}">
    <h2>${x.titulo}</h2><p class="resumen">${x.resumen}</p>
    ${items}
    <div class="acciones"><b>Qué podés hacer</b><ul>${acciones}</ul></div>
    <details><summary>Ver glosario (palabras raras)</summary>${glosario}</details>
    ${botones}
  </div>`;
  $('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  conectarAcciones();
}

function conectarAcciones() {
  if (!ultimoPayload || !ultimoPayload.auditoria) return;
  let texto = '';
  try { texto = armarResumen(ultimoPayload); } catch { return; }
  const bResumen = $('btn-resumen');
  if (bResumen) bResumen.onclick = async () => {
    const ok = await copiar(texto);
    $('accion-estado').textContent = ok
      ? 'Resumen copiado. Podés pegarlo donde quieras.'
      : 'No se pudo copiar automáticamente. Seleccioná y copiá el texto.';
  };
  const bWa = $('btn-wa');
  if (bWa) bWa.onclick = () => {
    window.open(enlaceWhatsApp(texto), '_blank', 'noopener');
  };
  const bReclamo = $('btn-reclamo');
  if (bReclamo) bReclamo.onclick = () => {
    $('reclamo-card').hidden = false;
    $('reclamo-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
}

function analizarBoleta(boleta) {
  const auditoria = auditar(boleta, TABLAS);
  const explicacion = explicar(auditoria, boleta);
  ultimoPayload = construirPayload(boleta, auditoria);
  window.__bj = { boleta, auditoria }; // solo en memoria del navegador, para depuración
  pintar(explicacion);
  renderHistorial();
}

boton.addEventListener('click', async () => {
  if (!archivo) return;
  boton.disabled = true;
  estado.textContent = 'Leyendo el PDF en tu dispositivo…';
  try {
    const lineas = await lineasDelPdf(archivo);
    if (!esTextoUtil(lineas)) {
      $('manual-card').hidden = false;
      $('resultado').innerHTML = '';
      estado.textContent = 'Este PDF parece una imagen. Podés cargar los datos a mano.';
      $('manual-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    analizarBoleta(parsear(lineas));
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

/* ---------- carga manual (sin OCR, produce el objeto de parser.js) ---------- */
$('manual-campos').innerHTML = CAMPOS.map(c => {
  const id = `m-${c.clave}`;
  if (c.tipo === 'checkbox') {
    return `<label class="campo checkbox"><input type="checkbox" id="${id}" ` +
      `aria-describedby="ayuda-${c.clave}"><span>${c.etiqueta}</span>` +
      `<small id="ayuda-${c.clave}">${c.ayuda}</small></label>`;
  }
  return `<label class="campo"><span>${c.etiqueta}</span>` +
    `<input type="text" id="${id}" inputmode="${c.inputmode || 'decimal'}" ` +
    `placeholder="${c.placeholder || ''}" autocomplete="off" ` +
    `aria-describedby="ayuda-${c.clave}">` +
    `<small id="ayuda-${c.clave}">${c.ayuda}</small></label>`;
}).join('');

$('manual-form').addEventListener('submit', ev => {
  ev.preventDefault();
  const datos = {};
  for (const c of CAMPOS) {
    const el = $(`m-${c.clave}`);
    datos[c.clave] = c.tipo === 'checkbox' ? el.checked : el.value;
  }
  try {
    analizarBoleta(armarBoleta(datos));
    $('manual-card').hidden = true;
    $('accion-estado').textContent = 'Datos cargados a mano. Nada se subió ni se guardó.';
  } catch (e) {
    $('accion-estado').textContent = (e.errores || [e.message]).join(' ');
  }
});

/* ---------- solicitud de desglose (datos escritos a mano, nunca guardados) ---------- */
$('btn-rec-generar').onclick = () => {
  if (!ultimoPayload) { $('accion-estado').textContent = 'Primero analizá una boleta.'; return; }
  try {
    const texto = armarReclamo(ultimoPayload, {
      nombre: $('rec-nombre').value,
      suministro: $('rec-suministro').value,
    });
    $('rec-texto').value = texto;
    $('btn-rec-copiar').disabled = false;
    $('btn-rec-descargar').disabled = false;
    $('accion-estado').textContent = 'Texto generado. Revisalo y completá los campos [COMPLETAR].';
  } catch (e) { $('accion-estado').textContent = 'No se pudo generar: ' + e.message; }
};
$('btn-rec-copiar').onclick = async () => {
  const ok = await copiar($('rec-texto').value);
  $('accion-estado').textContent = ok ? 'Solicitud copiada.' : 'No se pudo copiar automáticamente.';
};
$('btn-rec-descargar').onclick = () => {
  descargarTxt($('rec-texto').value);
  $('accion-estado').textContent = 'Solicitud descargada como .txt.';
};

renderHistorial();

/* ---------- PWA: versión de cuadros, service worker y aviso de nueva versión ---------- */
async function mostrarVersion() {
  const el = $('version-cuadros');
  try {
    const respuesta = await fetch('./version.json', { cache: 'no-store' });
    if (!respuesta.ok) return;
    const v = await respuesta.json();
    el.textContent = `Cuadros: ${v.resoluciones.length} resoluciones · v${v.cuadros_hash} · ` +
      `actualizado ${v.actualizado}`;
  } catch {
    el.textContent = 'Cuadros: versión no disponible sin conexión.';
  }
}
mostrarVersion();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    const comprobar = () => reg.active && reg.active.postMessage({ type: 'CHECK_VERSION' });
    comprobar();
    window.addEventListener('focus', comprobar);
    navigator.serviceWorker.addEventListener('message', ev => {
      if (ev.data && ev.data.type === 'NEW_VERSION') $('update-banner').hidden = false;
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
  }).catch(() => {});
}

$('btn-actualizar').onclick = () => {
  const mensaje = { type: 'SKIP_WAITING' };
  if (navigator.serviceWorker && navigator.serviceWorker.controller)
    navigator.serviceWorker.controller.postMessage(mensaje);
  navigator.serviceWorker.getRegistration().then(reg => {
    if (reg && reg.waiting) reg.waiting.postMessage(mensaje);
  }).catch(() => {});
  $('update-banner').hidden = true;
  $('accion-estado').textContent = 'Actualizando…';
};
