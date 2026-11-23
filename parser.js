/* Parser de boletas EJESA — versión navegador (idéntico a src/parser_boletas.py).
   Extrae SOLO campos tarifarios. Ningún dato sale del dispositivo. */

const IMPORTE = /-?\d[\d.]*,\d{1,2}/;
const PRECIO = /\(\s*([\d.,]+)\s*\$\/kWh\s*\)/;
const FECHA = /\d{1,2}\/\d{1,2}\/\d{2,4}/;
const NUMERO = /\d[\d.,]*/g;
const CATEGORIA = /\bT\d+[A-Z]{0,4}\b/;

function aFloat(s) {
  if (s === null || s === undefined) return undefined;
  const t = String(s).trim();
  if (t.includes(',')) return parseFloat(t.replace(/\./g, '').replace(',', '.'));
  const n = parseFloat(t);
  return Number.isNaN(n) ? undefined : n;
}

function importeEn(linea) {
  const m = IMPORTE.exec(linea);
  return m ? aFloat(m[0]) : undefined;
}

function precioKwh(linea) {
  const m = PRECIO.exec(linea);
  return m ? aFloat(m[1]) : undefined;
}

function numeros(linea) {
  return [...linea.matchAll(NUMERO)].map(m => m[0]);
}

export function parsear(lineas) {
  const r = {
    periodo: null, fecha_emision: null, vencimiento: null, categoria: null,
    dias_facturados: null, consumo_diario: null, diferencia_medidor: [],
    energia: {}, impuestos: {}, otros_cargos: {}, agua: {}, totales: {},
    punitorios_detectados: false, notas: [],
  };
  let seccion = 'cabecera';
  let enAgua = false;
  let esperando = null;

  for (let i = 0; i < lineas.length; i++) {
    const linea = (lineas[i] || '').trim();
    if (!linea) continue;
    const up = linea.toUpperCase();

    if (esperando) {
      const m = FECHA.exec(linea);
      if (m) {
        if (esperando === 'fecha_emision') r.fecha_emision = m[0];
        if (esperando === 'vencimiento') r.vencimiento = m[0];
      }
      esperando = null;
    }

    if (up.startsWith('EVOLUCIÓN DEL CONSUMO EN KWH')) seccion = 'consumo';
    else if (up.startsWith('ENERGÍA ELÉCTRICA')) seccion = 'energia';
    else if (up.startsWith('TASAS E IMPUESTOS')) seccion = enAgua ? 'tasas_agua' : 'impuestos';
    else if (up.startsWith('OTROS CARGOS')) seccion = 'otros';
    else if (up.startsWith('TOTAL EJESA')) {
      r.totales.ejesa = importeEn(linea);
      seccion = 'entre_totales';
    } else if (up.includes('SERVICIOS SANITARIOS')) {
      seccion = 'agua';
      enAgua = true;
    } else if (up.startsWith('TOTAL A PAGAR')) {
      for (let j = i + 1; j < Math.min(i + 5, lineas.length); j++) {
        const v = importeEn(lineas[j]);
        if (v !== undefined) { r.totales.a_pagar = v; break; }
      }
    } else if (up.startsWith('PERÍODO') || up.startsWith('PERIODO')) {
      if (i + 1 < lineas.length) {
        const m = FECHA.exec(lineas[i + 1]);
        if (m) r.periodo = m[0];
      }
    }

    if (up.includes('FECHA DE EMISIÓN') || up.includes('FECHA DE EMISION')) {
      esperando = 'fecha_emision';
      const m = FECHA.exec(linea);
      if (m) { r.fecha_emision = m[0]; esperando = null; }
    }
    if (up === 'VENCIMIENTO') {
      esperando = 'vencimiento';
      const m = FECHA.exec(linea);
      if (m) { r.vencimiento = m[0]; esperando = null; }
    }

    if (up.includes('CONSUMO DIARIO')) {
      const n = numeros(linea);
      if (n.length) r.consumo_diario = aFloat(n[0]);
    }
    if (up.includes('DÍAS FACTURADOS') || up.includes('DIAS FACTURADOS')) {
      const n = numeros(linea);
      if (n.length) r.dias_facturados = aFloat(n[0]);
    }

    const cat = CATEGORIA.exec(linea);
    if (cat && (up.includes('ANTERIOR') || up.includes('ACTUAL'))) r.categoria = cat[0];
    if (up.startsWith('DIFERENCIA'))
      r.diferencia_medidor = numeros(linea).map(aFloat).filter(x => x !== undefined);

    const v = importeEn(linea);
    if (v === undefined) continue;

    if (seccion === 'energia') {
      if (up.startsWith('CARGO FIJO')) { if (r.energia.cargo_fijo === undefined) r.energia.cargo_fijo = v; }
      else if (up.startsWith('CARGO POR CONSUMO DE ENERGÍA')) {
        r.energia.cargo_consumo = v; r.energia.precio_consumo = precioKwh(linea);
      } else if (up.startsWith('CARGO POR USO DE RED')) {
        r.energia.cargo_red = v; r.energia.precio_red = precioKwh(linea);
      } else if (up.startsWith('SUBSIDIO ESTADO NACIONAL')) r.energia.subsidio_nacional = v;
      else if (up.startsWith('BONIF. TARIFA SOCIAL')) r.energia.bonif_tarifa_social = v;
      else if (up.startsWith('SUBTOTAL ENERGÍA')) r.energia.subtotal = v;
    } else if (seccion === 'impuestos') {
      if (up.startsWith('TASA FISCALIZACIÓN') && (up.includes('SUPEPU') || up.includes('SUSEPU'))) {
        const todos = [...linea.matchAll(new RegExp(IMPORTE.source, 'g'))].map(m => m[0]);
        r.impuestos.tasa_fiscalizacion = aFloat(todos[todos.length - 1] || v);
        const m = /([\d.,]+)\s*%/.exec(linea);
        r.impuestos.tasa_fiscalizacion_pct = m ? aFloat(m[1]) : undefined;
      } else if (up.startsWith('IVA CONSUMIDOR FINAL')) r.impuestos.iva_consumidor = v;
      else if (up.includes('IVA INTERESES')) r.impuestos.iva_intereses = v;
      else if (up.startsWith('PERCEP.')) r.impuestos.percepcion = v;
      else if (up.startsWith('PERCEP.ALUMBRADO') || up.includes('ALUMBRADO PUBLICO'))
        r.impuestos.percepcion_alumbrado = v;
      else if (up.startsWith('SUBTOTAL TASAS')) r.impuestos.subtotal = v;
    } else if (seccion === 'otros') {
      if (up.startsWith('CARGO FOPEJ')) r.otros_cargos.fopej = v;
      else if (up.startsWith('AJUSTE')) (r.otros_cargos.ajustes ||= []).push(v);
      else if (up.startsWith('SUBTOTAL OTROS')) r.otros_cargos.subtotal = v;
    } else if (seccion === 'agua' || seccion === 'tasas_agua') {
      if (up.startsWith('CARGO VARIABLE AGUA')) r.agua.cargo_variable = v;
      else if (up.startsWith('CARGO FIJO')) { if (r.agua.cargo_fijo === undefined) r.agua.cargo_fijo = v; }
      else if (up.startsWith('IVA INTERÉS PUNITORIO') || up.startsWith('IVA INTERES PUNITORIO')) {
        r.agua.iva_punitorio = v;
        if (v && v > 0) r.punitorios_detectados = true;
      } else if (up.includes('IVA INTERÉS MORATORIO') || up.includes('IVA INTERES MORATORIO'))
        r.agua.iva_moratorio = v;
      else if (up.startsWith('IVA') && linea.includes('%')) { if (r.agua.iva === undefined) r.agua.iva = v; }
      else if (up.startsWith('SUBTOTAL SERVICIOS SANITARIOS')) r.agua.subtotal = v;
      else if (up.startsWith('SUBTOTAL TASAS')) r.agua.subtotal_impuestos = v;
      else if (up.startsWith('TOTAL')) r.agua.total = v;
    }
  }

  let aguaTotal = r.agua.subtotal ?? r.agua.total;
  const subs = [r.energia.subtotal, r.impuestos.subtotal, r.otros_cargos.subtotal, aguaTotal];
  if (subs.every(x => x !== undefined)) {
    const suma = subs.reduce((a, b) => a + b, 0);
    r.consistencia = {
      suma_subtotales: Math.round(suma * 100) / 100,
      total_ejesa: r.totales.ejesa,
      total_a_pagar: r.totales.a_pagar,
      coincide_a_pagar: r.totales.a_pagar !== undefined && Math.abs(suma - r.totales.a_pagar) < 1,
    };
  }
  return r;
}
