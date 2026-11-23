/* Auditoría en el navegador — port de src/auditoria.py.
   Compara la boleta con cuadros oficiales. Sin red, sin servidor. */

const VIGENCIA_DESDE = '2026-07-20';
const VIGENCIA_HASTA = '2027-12-31';

export function mesDe(fecha) {
  if (!fecha) return null;
  const m = /(\d{2})\/(\d{2})\/(\d{2,4})/.exec(fecha);
  if (!m) return null;
  let anio = m[3];
  if (anio.length === 2) anio = (parseInt(anio, 10) > 50 ? '19' : '20') + anio;
  return `${anio}-${m[2]}`;
}

export function fechaEmision(boleta) {
  const m = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/.exec(boleta?.fecha_emision || '');
  if (!m) return null;
  let anio = m[3];
  if (anio.length === 2) anio = (parseInt(anio, 10) > 50 ? '19' : '20') + anio;
  return `${anio}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

export function tablaPara(mes, tablas) {
  if (!mes) return null;
  return tablas.find(t => {
    const v = t.vigencia || {};
    return v.desde && v.hasta && mes >= v.desde.slice(0, 7) && mes <= v.hasta.slice(0, 7);
  }) || null;
}

export function seleccionarTabla(boleta, tablas) {
  const e = boleta?.energia || {};
  if (e.cargo_fijo === undefined && e.precio_red === undefined)
    return { tabla: null, score: 0, confianza: 'sin datos' };
  let mejor = null;
  for (const t of tablas) {
    const cats = t.t1_residencial.categorias;
    const diffs = [];
    for (const [clave, valor] of [['cargo_fijo', e.cargo_fijo], ['uso_red_kwh', e.precio_red]]) {
      if (valor === undefined || valor === null) continue;
      const c = cats.reduce((a, b) =>
        Math.abs(b[clave] - valor) / Math.max(b[clave], 1) <
        Math.abs(a[clave] - valor) / Math.max(a[clave], 1) ? b : a);
      diffs.push(Math.abs(100 * (valor - c[clave]) / c[clave]));
    }
    if (!diffs.length) continue;
    const score = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    if (!mejor || score < mejor.score) mejor = { tabla: t, score };
  }
  if (!mejor) return { tabla: null, score: 0, confianza: 'sin cuadros' };
  const confianza = mejor.score < 0.5 ? 'alta' : (mejor.score < 3 ? 'media' : 'baja');
  return { tabla: mejor.tabla, score: Math.round(mejor.score * 100) / 100, confianza };
}

export function cercana(cats, clave, valor, tolPct = 0.3) {
  if (valor === undefined || valor === null) return undefined;
  return cats.find(c => Math.abs(c[clave] - valor) <= Math.max(Math.abs(c[clave]) * tolPct / 100, 0.01));
}

export function kwhDe(e) {
  if (e?.cargo_consumo && e?.precio_consumo)
    return Math.round(e.cargo_consumo / e.precio_consumo * 1000) / 1000;
  return undefined;
}

export function precioRedPorBloques(cats, kwh) {
  if (!kwh || kwh <= 0) return undefined;
  let total = 0, anterior = 0;
  for (const c of cats) {
    const superior = c.hasta_kwh === null ? kwh : Number(c.hasta_kwh);
    const bloque = Math.max(0, Math.min(kwh, superior) - anterior);
    if (bloque) { total += bloque * c.uso_red_kwh; anterior = superior; }
    if (anterior >= kwh) break;
  }
  return Math.round(total / kwh * 1e6) / 1e6;
}

export function auditar(boleta, tablas) {
  const mes = mesDe(boleta?.fecha_emision);
  const { tabla, score, confianza } = seleccionarTabla(boleta, tablas);
  const tablaFecha = tablaPara(mes, tablas);
  const base = { mes, categoria_boleta: boleta?.categoria, confianza, score_vad_pct: score };
  if (!tabla) return { ...base, estado: 'sin_cuadro_cargado', resolucion: null };

  const cats = tabla.t1_residencial.categorias;
  const e = boleta.energia || {};
  const catFijo = cercana(cats, 'cargo_fijo', e.cargo_fijo);
  const catRed = cercana(cats, 'uso_red_kwh', e.precio_red);
  const catEnergia = cercana(cats, 'energia_plena_kwh', e.precio_consumo);
  const kwh = kwhDe(e);
  const redBloques = precioRedPorBloques(cats, kwh);
  const redPorBloques = !!(redBloques && e.precio_red &&
    Math.abs(e.precio_red - redBloques) <= redBloques * 0.005);

  const cat = catFijo || catRed || catEnergia;
  let diffEnergia = 0;
  if (cat && e.precio_consumo && cat.energia_plena_kwh)
    diffEnergia = Math.round(100 * (e.precio_consumo - cat.energia_plena_kwh) / cat.energia_plena_kwh * 10) / 10;

  const fecha = fechaEmision(boleta);
  const senal = !!boleta.punitorios_detectados;
  const enVigencia = !!(senal && fecha && fecha >= VIGENCIA_DESDE && fecha <= VIGENCIA_HASTA);

  return {
    ...base,
    estado: 'auditada',
    resolucion: tabla.resolucion,
    resolucion_por_fecha: tablaFecha ? tablaFecha.resolucion : null,
    categoria_tabla: cat ? cat.id : null,
    cargo_fijo_ok: !!catFijo,
    uso_red_ok: !!catRed || redPorBloques,
    uso_red_metodo: redPorBloques ? 'bloques' : (catRed ? 'categoria' : 'no'),
    bonif_ts_presente: !!e.bonif_tarifa_social,
    energia_ok: !!catEnergia,
    energia_diff_pct: catEnergia ? 0 : diffEnergia,
    nota: tabla.nota_pass_through || '',
    punitorios_signal: senal,
    punitorios_en_vigencia: enVigencia,
  };
}
