/* Resumen corto para compartir. Solo usa el payload validado. */
import { validar } from './payload.js';

export function armarResumen(payload) {
  validar(payload);
  const a = payload.auditoria || {};
  const mes = payload.mes || 'ese período';
  const aviso = 'Esto es una orientación, no un veredicto.';

  if (a.estado !== 'auditada') {
    return `Boleta Justa · ${mes}\n` +
      'Todavía no tenemos cargado el cuadro tarifario de este período, así que no podemos compararlo. ' +
      `Podés pedirle a EJESA el desglose.\n${aviso}`;
  }

  const coincide = [];
  const difiere = [];
  if (a.cargo_fijo_ok) coincide.push('el cargo fijo');
  else difiere.push('el cargo fijo no coincide con el cuadro');
  if (a.uso_red_ok) coincide.push('el uso de red');
  else difiere.push('el uso de red no coincide con el cuadro');
  if (a.energia_ok) coincide.push('el precio de la luz');
  else if ((a.energia_diff_pct || 0) > 0) {
    const pct = Math.abs(a.energia_diff_pct).toFixed(1).replace('.', ',');
    difiere.push(`el precio de la luz es ${pct}% mayor al cuadro base ` +
      '(suele ser la actualización del trimestre, no un error por sí solo)');
  } else difiere.push('el precio de la luz no coincide con el cuadro');

  if (a.bonif_ts_presente) coincide.push('la bonificación de tarifa social está en su renglón');
  if (a.punitorios_signal) {
    difiere.push(a.punitorios_en_vigencia
      ? 'la boleta tiene un cargo por pago tardío dentro de la vigencia del Decreto 5658: conviene pedir el desglose'
      : 'la boleta tiene un cargo por pago tardío anterior al Decreto 5658');
  }

  const lineas = [
    `Boleta Justa · ${mes}`,
    `Cuadro aplicable: ${a.resolucion || 'sin resolución cargada'}.`,
  ];
  if (coincide.length) lineas.push('Coincide: ' + coincide.join(', ') + '.');
  if (difiere.length) lineas.push('A revisar: ' + difiere.join('; ') + '.');
  lineas.push(aviso, 'Si querés más detalle, pedile el desglose a EJESA.');

  return lineas.join('\n').slice(0, 899);
}

export async function copiar(texto) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // fallback con textarea
  }
  const area = document.createElement('textarea');
  area.value = texto;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  document.body.removeChild(area);
  return ok;
}

export function enlaceWhatsApp(texto) {
  return 'https://wa.me/?text=' + encodeURIComponent(texto);
}
