/**
 * principal.js
 * ------------------------------------------------------------------
 * PUNTO DE ENTRADA. Se carga al final de cada página, cuando ya están disponibles todos
 * los módulos necesarios. Inicia lo común (encabezado y avisos) y luego la vista que
 * corresponde a la página, según el atributo data-pagina del <body>.
 */
(function () {
  'use strict';

  // Dependencias tomadas del espacio de nombres.
  const { iniciarEncabezado } = AlPaso.modulos.encabezado;
  const { iniciarAvisos, mostrarAviso } = AlPaso.modulos.avisos;

  // Función asíncrona que arranca la página actual.
  async function iniciar() {
    iniciarAvisos();
    iniciarEncabezado();
    // Cada vista se registró en AlPaso.vistas con el nombre de su página (catalogo, carrito, ...).
    const vista = AlPaso.vistas[document.body.dataset.pagina];
    if (!vista) return; // páginas informativas: solo encabezado
    try {
      await vista.iniciar();
    } catch (error) {
      console.error('Error al iniciar la página:', error);
      mostrarAviso('Ocurrió un error al cargar esta página.', 'error', 6000);
    }
  }

  iniciar();
})();
