/**
 * componentes/resumen.js
 * ------------------------------------------------------------------
 * Componente reutilizable: dibuja el "Resumen del pedido" (líneas y total).
 * Lo usan los pasos de entrega y de pago.
 */
import { obtenerItems, calcularTotal } from '../modulos/carrito.js';
import { html, montar } from '../modulos/plantillas.js';
import { formatearPrecio } from '../modulos/formato.js';

// Dibuja el resumen dentro del contenedor recibido.
export function dibujarResumen(contenedor) {
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
