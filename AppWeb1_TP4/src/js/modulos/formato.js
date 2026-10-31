/**
 * modulos/formato.js
 * ------------------------------------------------------------------
 * Funciones de formato para mostrar datos al usuario (precios, fechas, plurales).
 */

// Da formato de peso argentino: 4200 -> "$4.200" (separador de miles con punto).
export const formatearPrecio = (valor) =>
  `$${Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

// Muestra una fecha ISO en formato local corto: "24/10/26, 18:30".
export const formatearFecha = (iso) =>
  new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });

// Devuelve "1 producto" o "3 productos" según la cantidad.
export const pluralizar = (cantidad, singular, plural) =>
  `${cantidad} ${cantidad === 1 ? singular : plural}`;
