/**
 * datos/entrega.js
 * ------------------------------------------------------------------
 * Datos de la entrega: dirección del local, tiempo de retiro y franjas de envío.
 * Los valores salen de las páginas "Ubicación" y "Cómo funciona" de la propuesta.
 */
(function () {
  'use strict';

  const DIRECCION_LOCAL = 'Av. San Martín 842, La Calera, Córdoba';
  const TIEMPO_RETIRO = 'aproximadamente 15 minutos';

  // El envío se realiza de 9:00 a 19:00; se divide en tres franjas para elegir.
  const franjasEnvio = Object.freeze(['9:00 a 12:00', '12:00 a 15:00', '15:00 a 19:00']);

  // Barrio/localidad que se propone por defecto en el formulario de envío.
  const LOCALIDAD_POR_DEFECTO = 'La Calera';

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.datos.entrega = { DIRECCION_LOCAL, TIEMPO_RETIRO, franjasEnvio, LOCALIDAD_POR_DEFECTO };
})();
