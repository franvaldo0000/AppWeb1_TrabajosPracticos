/**
 * vistas/inicio.js
 * ------------------------------------------------------------------
 * Vista de la página de inicio. Completa el ticket del "producto de la semana"
 * con los datos reales del catálogo, para no repetir precios en el HTML.
 */
(function () {
  'use strict';

  const { buscarPorCodigo } = AlPaso.modulos.productos;
  const { formatearPrecio } = AlPaso.modulos.formato;
  const { seleccionar } = AlPaso.modulos.dom;

  function iniciarInicio() {
    const ticket = seleccionar('[data-destacado]');
    const producto = ticket && buscarPorCodigo(ticket.dataset.destacado);
    if (!producto) return;
    seleccionar('.ticket-codigo', ticket).textContent = `#${producto.codigo}`;
    seleccionar('.ticket-precio', ticket).textContent = formatearPrecio(producto.precio);
  }

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.vistas.inicio = { iniciar: iniciarInicio };
})();
