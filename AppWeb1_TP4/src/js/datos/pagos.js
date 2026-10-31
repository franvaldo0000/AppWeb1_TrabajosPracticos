/**
 * datos/pagos.js
 * ------------------------------------------------------------------
 * Datos de configuración del pago: medios disponibles y cuotas.
 * Se mantienen fuera de la lógica para poder editarlos fácilmente.
 */

// Medios de pago. "soloRetiro" indica que solo se ofrece cuando el cliente retira en el local.
export const mediosDePago = Object.freeze([
  { id: 'mercadopago',   nombre: 'Mercado Pago',             descripcion: 'QR o link de pago, acreditación inmediata.', soloRetiro: false },
  { id: 'tarjeta',       nombre: 'Tarjeta débito / crédito', descripcion: 'Todas las marcas, hasta 3 cuotas sin interés.', soloRetiro: false },
  { id: 'transferencia', nombre: 'Transferencia bancaria',   descripcion: 'Recibís el CBU/alias al confirmar tu pedido.', soloRetiro: false },
  { id: 'efectivo',      nombre: 'Efectivo al retirar',      descripcion: 'Reservás online y pagás en el mostrador.', soloRetiro: true },
]);

// Cantidad máxima de cuotas sin interés con tarjeta.
export const CUOTAS_MAXIMAS = 3;

// Alias que se muestra al elegir transferencia. ES UN DATO DE EJEMPLO: reemplazar por el real.
export const ALIAS_TRANSFERENCIA = 'alpaso.panaderia';
