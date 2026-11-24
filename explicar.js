/* Explicación en lenguaje llano — port de src/explicar.js. */
import { MENSAJE_CUADRO_NO_DISPONIBLE } from './auditoria.js';

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto',
               'septiembre','octubre','noviembre','diciembre'];

const AVISOS = {
  valores_provisoriamente_facturados: {
    titulo: 'Valores aplicados antes del cuadro definitivo: a verificar',
    texto: 'Esta boleta corresponde a un período en el que algunos precios pudieron aplicarse antes de publicarse el cuadro definitivo, o ajustarse de forma automática por decisiones nacionales (pass through). Por eso no podemos afirmar, solo con este cuadro, que el importe facturado sea el final. A verificar: pedí a EJESA el desglose por renglón y la resolución que aplicó a tu boleta. Fuentes: Res. 476-SUSEPU/2025 (Boletín Nº 149, 29/12/2025), Res. 105-SUSEPU/2026 y Res. 104-SUSEPU/2026 (Boletín Nº 39, 01/04/2026). No calculamos diferencias, créditos ni saldos: esto es una señal para revisar, no un reclamo.',
    meses: ['2025-12', '2026-02', '2026-03', '2026-04', '2026-08', '2026-09', '2026-10'],
  },
  rectificacion_posterior: {
    titulo: 'Rectificación publicada después: a verificar',
    texto: 'Para este mismo período se publicó después una resolución que cambió o aprobó valores. Lo que comparamos acá puede no coincidir con lo que se facturó en su momento, y eso por sí solo no dice quién tiene razón. A verificar: preguntá en EJESA qué resolución se aplicó a tu boleta y pedí el desglose. Fuentes: Res. 104-SUSEPU/2026 (rectifica la 81 para feb-abr/2026), Res. 476-SUSEPU/2025 (energía dic-25/ene-26) y la mención de la Res. 297-SUSEPU/2026 sobre boletas de may-jul/2026 emitidas con valores de la 105 y luego comparadas con la 227. No calculamos diferencias, créditos ni saldos: esto es una orientación, no un reclamo.',
    meses: ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'],
  },
};

function nombreMes(mes) {
  if (!mes || !mes.includes('-')) return 'esa boleta';
  const [anio, m] = mes.split('-');
  return `${MESES[parseInt(m, 10) - 1] || m} de ${anio}`;
}

export function explicar(aud, boleta = {}) {
  const items = [];
  if (aud.estado === 'cuadro_no_disponible') {
    return {
      titulo: 'Todavía no podemos comparar esta boleta', estado: 'sin_cuadro',
      resumen: aud.mensaje || MENSAJE_CUADRO_NO_DISPONIBLE,
      items: [{ icono: 'ℹ️', titulo: 'Qué significa',
        texto: 'Necesitamos el cuadro tarifario oficial de ese trimestre para saber si los cargos coinciden. Mientras tanto no podemos afirmar que esté bien ni mal.' }],
      acciones: ['Pedile a EJESA el desglose de tu boleta.',
        'Cuando carguemos el cuadro, vas a poder compararla acá.'],
      glosario: [],
    };
  }
  if (aud.estado !== 'auditada') {
    return {
      titulo: 'No pudimos auditar esta boleta', estado: 'sin_datos',
      resumen: 'No encontramos en el PDF los renglones que necesitamos para comparar. Puede ser otro formato o de otra empresa.',
      items: [{ icono: 'ℹ️', titulo: 'Qué pasó', texto: 'Probá con una boleta de EJESA de los últimos años.' }],
      acciones: ['Si el PDF está completo y tampoco funciona, contanos para ajustar el lector.'],
      glosario: [],
    };
  }

  if (aud.cargo_fijo_ok) items.push({ icono: '✅', titulo: 'Cargo fijo: bien',
    texto: 'Lo que se cobra por tener el servicio coincide con lo que estaba aprobado en ese momento.' });
  else items.push({ icono: '⚠️', titulo: 'Cargo fijo: a revisar',
    texto: 'El cargo fijo no coincide con el valor aprobado para ese período.' });

  if (aud.uso_red_ok) {
    let texto = 'Lo que se cobra por usar la red (postes, cables y mantenimiento) está bien calculado. Se suma por bloques de consumo, como manda el cuadro.';
    if (aud.bonif_ts_presente) texto += ' Tu boleta también tiene la bonificación de tarifa social en su renglón propio.';
    items.push({ icono: '✅', titulo: 'Uso de red: bien', texto });
  } else items.push({ icono: '⚠️', titulo: 'Uso de red: a revisar',
    texto: 'No pudimos igualar el cargo de red con el cuadro oficial.' });

  const diff = aud.energia_diff_pct || 0;
  if (aud.energia_ok) items.push({ icono: '✅', titulo: 'Precio de la luz: bien',
    texto: 'El precio por cada kWh coincide con el cuadro oficial de ese trimestre.' });
  else if (diff > 0) items.push({ icono: 'ℹ️', titulo: 'Precio de la luz: cambio durante el trimestre',
    texto: `El precio de la luz en tu boleta es ${Math.abs(diff).toFixed(1)}% más alto que el cuadro base. Eso pasa porque el gobierno actualiza ese precio durante el trimestre. Por sí solo no significa un error.` });
  else items.push({ icono: '⚠️', titulo: 'Precio de la luz: a revisar',
    texto: 'El precio por kWh no coincide con el cuadro aprobado.' });

  if (!aud.bonif_ts_presente && String(aud.categoria_boleta || '').startsWith('T1T'))
    items.push({ icono: 'ℹ️', titulo: 'Tarifa social',
      texto: 'Tu categoría dice tarifa social, pero no encontramos el renglón de la bonificación. Si creés que te corresponde, consultalo con EJESA.' });

  if (!aud.punitorios_signal) items.push({ icono: '✅', titulo: 'Cargos por pago tarde: ninguno',
    texto: 'No encontramos intereses por pago tardío en esta boleta.' });
  else if (aud.punitorios_en_vigencia) items.push({ icono: '⚠️', titulo: 'Cargo por pago tarde: a revisar',
    texto: 'La boleta tiene un cargo de interés por pago tardío. Desde el 20 de julio de 2026 el Decreto 5658 prohíbe cobrar intereses punitorios. Vale la pena pedir el desglose a EJESA.' });
  else items.push({ icono: 'ℹ️', titulo: 'Cargo por pago tarde',
    texto: 'Hay un interés por pago tardío, pero la boleta es anterior al Decreto 5658: esa prohibición no aplica en este caso.' });

  if (boleta.consistencia && boleta.consistencia.coincide_a_pagar === false)
    items.push({ icono: '⚠️', titulo: 'La suma no cierra',
      texto: 'Los renglones sumados no dan el total que figura como "Total a pagar". Pedí el desglose antes de pagar.' });

  for (const [clave, aviso] of Object.entries(AVISOS))
    if (aviso.meses.includes(aud.mes))
      items.push({ icono: 'ℹ️', titulo: aviso.titulo, texto: aviso.texto, clave });

  const revisiones = items.filter(i => i.icono === '⚠️').length;
  const estado = revisiones ? 'a_revisar' : 'en_orden';
  const resumen = revisiones
    ? `Comparamos tu boleta de ${nombreMes(aud.mes)} con las reglas oficiales de ese período. Encontramos ${revisiones} ${revisiones === 1 ? 'punto' : 'puntos'} que vale la pena revisar.`
    : `Comparamos tu boleta de ${nombreMes(aud.mes)} con las reglas oficiales que correspondían en ese momento. No encontramos nada fuera de lugar.`;

  const acciones = [];
  if (revisiones) acciones.push('Pedí en EJESA el desglose por renglón antes de pagar o reclamar.');
  acciones.push(`Si querés preguntar por algo, mencioná la resolución ${aud.resolucion} y el mes de la boleta.`);
  acciones.push('Este análisis es una orientación vecinal, no un dictamen legal ni un reclamo automático.');

  const glosario = [
    { termino: 'kWh', significado: 'Es la unidad con la que se mide la luz que gastaste. Un ventilador consume poco; un aire acondicionado, mucho.' },
    { termino: 'Cargo fijo', significado: 'Un monto que se paga por tener el servicio, aunque casi no gastes luz.' },
    { termino: 'Uso de red', significado: 'El costo de los cables, postes y el mantenimiento para que la luz llegue a tu casa.' },
    { termino: 'Tarifa social', significado: 'Un descuento del Estado para hogares que cumplen requisitos. Aparece como un renglón negativo.' },
    { termino: 'Pass through', significado: 'Cuando el precio de la luz se actualiza durante el trimestre por decisión nacional.' },
    { termino: 'Interés punitorio', significado: 'Un cargo extra por pagar después de la fecha de vencimiento.' },
  ];

  return { titulo: `Tu boleta de ${nombreMes(aud.mes)}`, estado, resumen, items, acciones, glosario };
}
