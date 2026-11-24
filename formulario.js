/* Carga manual: produce EXACTAMENTE el objeto interno de parser.js.
   Solo datos tarifarios; nunca nombre, dirección, DNI ni suministro. */
import { aFloat } from './parser.js';

export const CAMPOS = [
  { clave: 'cargoFijo', etiqueta: 'Cargo fijo ($ por mes)',
    ayuda: 'Lo encontrás en Energía eléctrica → "Cargo Fijo".',
    inputmode: 'decimal', placeholder: 'Ej: 4772,00' },
  { clave: 'precioRed', etiqueta: 'Uso de red ($ por kWh)',
    ayuda: 'Lo encontrás en "Cargo por Uso de Red", el número entre paréntesis.',
    inputmode: 'decimal', placeholder: 'Ej: 88,8382' },
  { clave: 'kwh', etiqueta: 'Consumo (kWh)',
    ayuda: 'Lo encontrás en "Evolución del consumo en kWh".',
    inputmode: 'decimal', placeholder: 'Ej: 189,5' },
  { clave: 'precioEnergia', etiqueta: 'Precio de la energía ($ por kWh)',
    ayuda: 'Lo encontrás en "Cargo por Consumo de Energía", entre paréntesis.',
    inputmode: 'decimal', placeholder: 'Ej: 141,7971' },
  { clave: 'bonifTS', etiqueta: 'Bonificación de tarifa social ($) — opcional',
    ayuda: 'Si aparece "Bonif. Tarifa Social", copiá el número con signo negativo. Si no aparece, dejalo vacío.',
    inputmode: 'decimal', placeholder: 'Ej: -7417,13', opcional: true },
  { clave: 'periodo', etiqueta: 'Período (MM/AAAA)',
    ayuda: 'Lo encontrás en el encabezado de la boleta.',
    inputmode: 'numeric', placeholder: 'Ej: 08/2026' },
  { clave: 'fechaEmision', etiqueta: 'Fecha de emisión (DD/MM/AAAA) — opcional',
    ayuda: 'Está en el encabezado. Si no la tenés, dejalo vacío y usamos el período.',
    inputmode: 'numeric', placeholder: 'Ej: 20/08/2026', opcional: true },
  { clave: 'punitorios', etiqueta: '¿Tiene línea de interés por pago tardío?',
    ayuda: 'Buscá "IVA Interés Punitorio" en Tasas e impuestos o Servicios sanitarios.',
    tipo: 'checkbox' },
];

const RANGOS = {
  cargoFijo: [100, 1000000, 'el cargo fijo'],
  precioRed: [1, 1000, 'el precio de uso de red'],
  kwh: [1, 10000, 'el consumo en kWh'],
  precioEnergia: [1, 2000, 'el precio de la energía'],
  bonifTS: [-1000000, 0, 'la bonificación de tarifa social'],
};

function periodoValido(texto) {
  const a = /^(\d{1,2})\/(\d{4})$/.exec((texto || '').trim());
  if (a) return { mes: Number(a[1]), anio: Number(a[2]) };
  const b = /^(\d{4})-(\d{1,2})$/.exec((texto || '').trim());
  if (b) return { mes: Number(b[2]), anio: Number(b[1]) };
  return null;
}

export function validar(datos = {}) {
  const errores = [];
  const valores = {};
  for (const clave of Object.keys(RANGOS)) {
    const opcional = CAMPOS.find(c => c.clave === clave)?.opcional;
    const texto = String(datos[clave] ?? '').trim();
    if (!texto && opcional) continue;
    if (!texto) { errores.push(`Falta completar ${RANGOS[clave][2]}.`); continue; }
    const numero = aFloat(texto);
    if (!Number.isFinite(numero)) {
      errores.push(`${RANGOS[clave][2]} no parece un número. Usá coma para los decimales (ej: 88,8382).`);
      continue;
    }
    const [min, max, nombre] = RANGOS[clave];
    if (numero < min || numero > max) {
      errores.push(`${nombre} parece muy alto o muy bajo. Revisá el número (entre ${min} y ${max}).`);
      continue;
    }
    valores[clave] = numero;
  }

  const per = periodoValido(datos.periodo);
  if (!per || per.mes < 1 || per.mes > 12 || per.anio < 2000 || per.anio > 2100) {
    errores.push('El período debe estar en formato MM/AAAA, por ejemplo 08/2026.');
  } else {
    valores.periodo = `${String(per.mes).padStart(2, '0')}/${per.anio}`;
    valores.mesISO = `${per.anio}-${String(per.mes).padStart(2, '0')}`;
  }

  const fecha = String(datos.fechaEmision || '').trim();
  if (fecha) {
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(fecha);
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 31 || Number(m[2]) < 1 || Number(m[2]) > 12) {
      errores.push('La fecha de emisión debe estar en formato DD/MM/AAAA, por ejemplo 20/08/2026.');
    } else if (per && (Number(m[2]) !== per.mes || Number(m[3]) !== per.anio)) {
      errores.push('La fecha de emisión no coincide con el período. Revisá uno de los dos.');
    } else {
      valores.fechaEmision = fecha;
    }
  }

  return { errores, valores, periodo: per };
}

/** Devuelve el mismo dict que produce parser.js: auditar/explicar no cambian. */
export function armarBoleta(datos = {}) {
  const { errores, valores, periodo } = validar(datos);
  if (errores.length) {
    const e = new Error(errores.join(' '));
    e.errores = errores;
    throw e;
  }
  const notas = [];
  const fecha = valores.fechaEmision ||
    `01/${String(periodo.mes).padStart(2, '0')}/${periodo.anio}`;
  if (!valores.fechaEmision) notas.push('Fecha de emisión estimada desde el período.');

  const energia = {
    cargo_fijo: valores.cargoFijo,
    precio_red: valores.precioRed,
    cargo_consumo: Math.round(valores.kwh * valores.precioEnergia * 100) / 100,
    precio_consumo: valores.precioEnergia,
  };
  if (valores.bonifTS !== undefined) energia.bonif_tarifa_social = valores.bonifTS;

  return {
    periodo: valores.periodo,
    fecha_emision: fecha,
    vencimiento: null,
    categoria: null,
    dias_facturados: null,
    consumo_diario: null,
    diferencia_medidor: [],
    energia,
    impuestos: {},
    otros_cargos: {},
    agua: {},
    totales: {},
    punitorios_detectados: !!datos.punitorios,
    notas,
  };
}
