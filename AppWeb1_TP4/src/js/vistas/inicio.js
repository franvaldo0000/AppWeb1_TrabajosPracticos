/**
 * vistas/inicio.js
 * ------------------------------------------------------------------
 * Vista de la página de inicio. Completa el ticket del "producto de la semana"
 * con los datos reales del catálogo, para no repetir precios en el HTML.
 */
import { buscarPorCodigo } from '../modulos/productos.js';
import { formatearPrecio } from '../modulos/formato.js';
import { seleccionar } from '../modulos/dom.js';

export function iniciarInicio() {
  const ticket = seleccionar('[data-destacado]');
  const producto = ticket && buscarPorCodigo(ticket.dataset.destacado);
  if (!producto) return;
  seleccionar('.ticket-codigo', ticket).textContent = `#${producto.codigo}`;
  seleccionar('.ticket-precio', ticket).textContent = formatearPrecio(producto.precio);
}
