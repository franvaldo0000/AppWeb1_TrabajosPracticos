/**
 * componentes/resumen.js
 * ------------------------------------------------------------------
 * Componente reutilizable: dibuja el "Resumen del pedido" (líneas y total).
 * Lo usan los pasos de entrega y de pago.
 */
(function () {
  'use strict';

  const { obtenerItems, calcularTotal } = AlPaso.modulos.carrito;
  const { html, montar } = AlPaso.modulos.plantillas;
  const { formatearPrecio } = AlPaso.modulos.formato;

  // Dibuja el resumen dentro del contenedor recibido.
  function dibujarResumen(contenedor) {
    const total = calcularTotal();
    montar(contenedor, html`
      <h2 id="resumen-titulo">Resumen del pedido</h2>
      <ul class="resumen-lista">
        ${obtenerItems().map((item) => html`
          <li>
            <span>${item.cantidad} × ${item.nombre}</span>
            <data value="${item.subtotal}">${formatearPrecio(item.subtotal)}</data>
          </li>`)}
      </ul>
      <p class="resumen-total"><span>Total</span> <data value="${total}">${formatearPrecio(total)}</data></p>
      <a href="carrito.html">Modificar carrito</a>
    `);
  }

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.componentes.resumen = { dibujarResumen };
})();
