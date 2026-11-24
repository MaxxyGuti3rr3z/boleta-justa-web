/* Texto de SOLICITUD DE DESGLOSE Y ACLARACIÓN. Solo usa el payload validado
   y los datos que la persona escribe en el formulario (nunca se guardan). */
import { validar } from './payload.js';

export function tieneSenales(payload) {
  validar(payload);
  const a = payload.auditoria || {};
  if (a.estado !== 'auditada') return false;
  if (a.punitorios_signal) return true;
  if (!a.cargo_fijo_ok || !a.uso_red_ok) return true;
  if (!a.energia_ok && !((a.energia_diff_pct || 0) > 0)) return true;
  if (!a.bonif_ts_presente && String(payload.categoria || '').startsWith('T1T')) return true;
  return false;
}

export function armarReclamo(payload, datos = {}) {
  validar(payload);
  if (!tieneSenales(payload)) return '';
  const a = payload.auditoria || {};
  const nombre = String(datos.nombre || '').trim() || '[COMPLETAR nombre del titular]';
  const suministro = String(datos.suministro || '').trim() || '[COMPLETAR número de suministro]';
  const resolucion = a.resolucion || '[COMPLETAR resolución aplicable]';

  const puntos = [];
  if (!a.cargo_fijo_ok) puntos.push('- El cargo fijo facturado respecto del cuadro aplicable.');
  if (!a.uso_red_ok) puntos.push('- El cargo por uso de red, teniendo en cuenta el cálculo por bloques de consumo.');
  if (!a.energia_ok && !((a.energia_diff_pct || 0) > 0))
    puntos.push('- El precio unitario de la energía aplicado en el período.');
  if (a.punitorios_signal)
    puntos.push('- El renglón de interés por pago tardío y su fecha de devengamiento.');
  if (!a.bonif_ts_presente && String(payload.categoria || '').startsWith('T1T'))
    puntos.push('- La bonificación de tarifa social que figura en mi categoría.');
  if (!puntos.length) puntos.push('- El detalle de todos los renglones de la factura.');

  const decreto = a.punitorios_signal
    ? '\nSi correspondiere, se ruega considerar lo previsto en el Decreto Acuerdo 5658-JG/2026 ' +
      '(Art. 3.C) respecto de los intereses punitorios durante la emergencia.\n'
    : '';

  return [
    'SOLICITUD DE DESGLOSE Y ACLARACIÓN',
    '',
    `Señores de EJESA: ${nombre}, titular del suministro N° ${suministro}, ` +
      `con relación a la factura del período ${payload.mes || '[COMPLETAR período]'}, solicito ` +
      'se me informe por escrito el detalle de los cargos aplicados.',
    '',
    'Cuadro tarifario de referencia: ' + resolucion + '.',
    '',
    'En particular agradeceré aclarar:',
    ...puntos,
    '',
    decreto.trim(),
    'Esta solicitud tiene fines informativos y no implica afirmar la existencia de errores ' +
      'ni irregularidades; solo procuro comprender el desglose de lo facturado.',
    '',
    'Firma: [COMPLETAR nombre y firma]',
    'Fecha: [COMPLETAR fecha]',
  ].filter(linea => linea !== '').join('\n');
}

export function descargarTxt(texto, nombre = 'solicitud-desglose.txt') {
  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}
