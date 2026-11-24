/* Port de src/tarifas.py. Misma lógica, mismos datos públicos. */
import { TABLAS } from './tablas.js';

const POR_DEFECTO = TABLAS.find(t => t.resolucion.startsWith('297'));

const r2 = x => {
  // Mismo criterio que src/tarifas.py: tolerancia al error binario y cero positivo.
  const redondeado = Math.round((x + 1e-9) * 100) / 100;
  return redondeado === 0 ? 0 : redondeado;
};

export function categoriaPorConsumo(kwh, t) {
  if (kwh < 0) throw new Error('el consumo no puede ser negativo');
  for (const cat of t.t1_residencial.categorias)
    if (cat.hasta_kwh === null || kwh <= cat.hasta_kwh) return cat;
  throw new Error('consumo fuera de categorías');
}

export function subperiodoPara(t, mes) {
  return (t.subperiodos || []).find(s => s.desde.slice(0, 7) <= mes && mes <= s.hasta.slice(0, 7)) || null;
}

function bloques(kwh, lista, tope) {
  let total = 0;
  let anterior = 0;
  let restante = tope === undefined ? kwh : Math.min(kwh, tope);
  for (const b of lista) {
    const tramo = Math.min(restante, b.hasta_kwh - anterior);
    if (tramo <= 0) break;
    total += tramo * b.descuento_kwh;
    restante -= tramo;
    anterior = b.hasta_kwh;
    if (restante <= 0) break;
  }
  return total;
}

export function calcular(kwh, mes = '2026-08', opts = {}, tabla = POR_DEFECTO) {
  const t = tabla;
  const cat0 = categoriaPorConsumo(kwh, t);
  const notas = [];
  let cat = cat0;
  const sub = subperiodoPara(t, mes);
  if (sub?.alcance === 't1_residencial.categorias[].energia_plena_kwh') {
    const precio = sub.valores?.[cat0.id];
    if (precio !== undefined) cat = { ...cat0, energia_plena_kwh: Number(precio) };
    notas.push(`energía según ${sub.resolucion} (${sub.desde} a ${sub.hasta})`);
  }
  const vig = t.vigencia;
  if (!(vig.desde.slice(0, 7) <= mes && mes <= vig.hasta.slice(0, 7)))
    notas.push(`fuera de la vigencia cargada (${vig.desde} a ${vig.hasta}): ` +
      'verificar la resolución del trimestre correspondiente');

  let fijo, red, energia;
  if (opts.electrodependiente) {
    const re = t.t1_residencial.especiales.RE;
    cat = { id: 'RE' };
    fijo = Number(re.cargo_fijo);
    red = kwh * re.uso_red_kwh;
    energia = kwh * re.energia_plena_kwh;
  } else {
    fijo = Number(cat.cargo_fijo);
    red = kwh * cat.uso_red_kwh;
    energia = kwh * cat.energia_plena_kwh;
  }

  let dTsFijo = 0, dTsRed = 0, dSef = 0;
  const bonif = t.bonificaciones?.[mes];
  if (opts.electrodependiente) {
    if (!bonif) throw new Error(`sin bonificaciones cargadas para ${mes}`);
    const re = bonif.electrodependientes;
    dTsFijo = Math.min(fijo, re.cargo_fijo_descuento);
    dTsRed = kwh * re.uso_red_descuento_kwh;
    dSef = kwh * re.energia_descuento_kwh;
    notas.push('electrodependiente: bonificación total de componentes tarifarios');
  } else {
    if ((opts.tarifa_social || opts.sef) && !bonif)
      throw new Error(`sin bonificaciones cargadas para ${mes}; cargar el anexo de ese mes antes de calcular`);
    if (opts.tarifa_social && bonif?.tarifa_social) {
      const ts = bonif.tarifa_social;
      if (ts.solo_categorias.includes(cat.id)) dTsFijo = fijo * ts.cargo_fijo_pct / 100;
      else notas.push('consumo >300 kWh: el anexo publicado solo define ' +
        'bonificación de cargo fijo para TS1/TS2 (≤300 kWh); ' +
        'verificar aplicación con boleta real');
      dTsRed = bloques(kwh, ts.uso_red_bloques);
    } else if (opts.tarifa_social && bonif)
      notas.push('bonificación documentada con otro origen en este anexo; ' +
        'su aplicación depende del segmento del usuario y de la boleta, ' +
        'por lo que no se calcula automáticamente');
    if (opts.sef && bonif?.sef) {
      const base = bonif.sef.bloque_base_kwh;
      dSef = bloques(kwh, bonif.sef.energia_bloques, base);
      if (kwh > base)
        notas.push(`consumo por encima del bloque base SEF (${base} kWh): el excedente va a precio pleno`);
    } else if (opts.sef && bonif)
      notas.push('bonificación SEF documentada con otro origen en este anexo; ' +
        'su aplicación depende del segmento del usuario y de la boleta, ' +
        'por lo que no se calcula automáticamente');
  }

  const subtotal = fijo + red + energia - dTsFijo - dTsRed - dSef;
  return {
    mes,
    kwh,
    categoria: cat.id,
    resolucion: t.resolucion,
    cargo_fijo: r2(fijo),
    uso_red_bruto: r2(red),
    energia_bruta: r2(energia),
    descuento_tarifa_social_fijo: r2(dTsFijo),
    descuento_tarifa_social_red: r2(dTsRed),
    descuento_sef_energia: r2(dSef),
    subtotal_tarifario: r2(subtotal),
    notas: [...notas, 'subtotal SIN impuestos (IVA, tasas municipales, etc.): esa capa se suma en la boleta real'],
  };
}
