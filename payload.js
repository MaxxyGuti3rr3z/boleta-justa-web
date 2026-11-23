/* Payload mínimo para guardar/exportar — port de src/payload_ia.py.
   Solo campos tarifarios; nunca nombres, DNI, direcciones ni números de cuenta. */
const PERMITIDOS = ['mes', 'categoria', 'consumo_kwh', 'dias_facturados',
  'energia', 'impuestos', 'otros_cargos', 'agua', 'totales', 'auditoria'];

const SUB = {
  energia: ['cargo_fijo', 'cargo_consumo', 'precio_consumo', 'cargo_red', 'precio_red',
    'subsidio_nacional', 'bonif_tarifa_social', 'subtotal'],
  impuestos: ['tasa_fiscalizacion', 'iva_consumidor', 'iva_intereses',
    'percepcion_alumbrado', 'subtotal'],
  otros_cargos: ['fopej', 'subtotal'],
  agua: ['cargo_variable', 'cargo_fijo', 'iva_punitorio', 'iva_moratorio', 'subtotal'],
  totales: ['ejesa', 'a_pagar'],
  auditoria: ['resolucion', 'categoria_tabla', 'confianza', 'cargo_fijo_ok', 'uso_red_ok',
    'uso_red_metodo', 'energia_ok', 'energia_diff_pct', 'bonif_ts_presente',
    'punitorios_signal', 'punitorios_en_vigencia', 'estado'],
};

const PROHIBIDOS = [
  /\b(dni|cuit|cuil|titular|domicilio|direccion|correo|email|telefono)\b/i,
  /\b(nombre|apellido|usuario|suministro|nro\s*de\s*cliente)\b/i,
  /[\w.+-]+@[\w.-]+\.\w+/,
  /(?:\d[\s.-]?){7,}/,
];

function soloTexto(obj, salida = []) {
  if (Array.isArray(obj)) {
    obj.forEach(v => soloTexto(v, salida));
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(k => { salida.push(String(k)); soloTexto(obj[k], salida); });
  } else if (typeof obj === 'string') {
    salida.push(obj);
  }
  return salida;
}

export function validar(datos) {
  const extra = Object.keys(datos).filter(k => !PERMITIDOS.includes(k));
  if (extra.length) throw new Error('campos no permitidos: ' + extra.join(', '));
  for (const [clave, valor] of Object.entries(datos)) {
    if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
      const subExtra = Object.keys(valor).filter(k => !(SUB[clave] || []).includes(k));
      if (subExtra.length) throw new Error('campos no permitidos en ' + clave + ': ' + subExtra.join(', '));
    }
  }
  if (JSON.stringify(datos).length > 8000) throw new Error('payload demasiado grande');
  const texto = soloTexto(datos).join('\n');
  for (const patron of PROHIBIDOS) if (patron.test(texto))
    throw new Error('el payload contiene un dato personal posible');
}

export function construir(boleta, auditoria) {
  const e = boleta.energia || {};
  const f = (boleta.fecha_emision || '').split('/');
  const mes = f.length === 3 ? `${f[2]}-${f[1].padStart(2, '0')}` : null;
  const kwh = (e.cargo_consumo && e.precio_consumo)
    ? Math.round(e.cargo_consumo / e.precio_consumo * 10) / 10 : undefined;
  const subset = (origen, clave) => Object.fromEntries(
    (SUB[clave] || []).filter(k => origen?.[k] !== undefined && origen?.[k] !== null)
      .map(k => [k, origen[k]]));
  const datos = {
    mes,
    categoria: boleta.categoria || undefined,
    consumo_kwh: kwh,
    dias_facturados: boleta.dias_facturados || undefined,
    energia: subset(e, 'energia'),
    impuestos: subset(boleta.impuestos, 'impuestos'),
    otros_cargos: subset(boleta.otros_cargos, 'otros_cargos'),
    agua: subset(boleta.agua, 'agua'),
    totales: subset(boleta.totales, 'totales'),
    auditoria: subset(auditoria, 'auditoria'),
  };
  for (const k of Object.keys(datos)) if (datos[k] === undefined) delete datos[k];
  validar(datos);
  return datos;
}
