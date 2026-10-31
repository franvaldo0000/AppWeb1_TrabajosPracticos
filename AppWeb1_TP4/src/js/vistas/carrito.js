/**
 * vistas/carrito.js
 * ------------------------------------------------------------------
 * VISTA DEL CARRITO DINÁMICO. Dibuja la tabla de productos con controles para cambiar
 * cantidades, quitar productos o vaciar el carrito, y los medios de pago disponibles.
 * Se redibuja sola cada vez que el módulo del carrito emite "carrito:cambio".
 */
import { obtenerItems, obtenerCantidad, cambiarCantidad, quitar, vaciar, calcularTotal, contarUnidades, CANTIDAD_MAXIMA } from '../modulos/carrito.js';
import { RUTA_IMAGENES } from '../datos/catalogo.js';
import { mediosDePago } from '../datos/pagos.js';
import { html, montar } from '../modulos/plantillas.js';
import { formatearPrecio, pluralizar } from '../modulos/formato.js';
import { seleccionar } from '../modulos/dom.js';

// ---------- Plantillas ----------

// Carrito sin productos.
const plantillaVacio = () => html`
  <div class="estado-vacio">
    <p>Tu carrito está vacío.</p>
    <p>Elegí tus productos favoritos desde el catálogo.</p>
    <div class="acciones"><a class="boton" href="catalogo.html">Ver catálogo</a></div>
  </div>`;

// Una fila de la tabla con los controles de cantidad.
const plantillaFila = (item) => html`
  <tr data-codigo="${item.codigo}">
    <td data-label="Producto">
      <span class="celda-producto"><img src="${RUTA_IMAGENES}${item.imagen}" alt="" width="70" height="52"> ${item.nombre}</span>
    </td>
    <td data-label="Código">#${item.codigo}</td>
    <td data-label="Cantidad">
      <div class="cantidad-control">
        <button type="button" class="cantidad-boton" data-accion="menos" aria-label="Quitar una unidad de ${item.nombre}" ${item.cantidad <= 1 ? 'disabled' : ''}><span aria-hidden="true">−</span></button>
        <input type="number" data-accion="cantidad" value="${item.cantidad}" min="1" max="${CANTIDAD_MAXIMA}" inputmode="numeric" aria-label="Cantidad de ${item.nombre}">
        <button type="button" class="cantidad-boton" data-accion="mas" aria-label="Agregar una unidad de ${item.nombre}" ${item.cantidad >= CANTIDAD_MAXIMA ? 'disabled' : ''}><span aria-hidden="true">+</span></button>
      </div>
    </td>
    <td data-label="Precio unitario">${formatearPrecio(item.precio)}</td>
    <td data-label="Subtotal">${formatearPrecio(item.subtotal)}</td>
    <td data-label=""><button type="button" class="boton-texto" data-accion="quitar" aria-label="Quitar ${item.nombre} del carrito">Quitar</button></td>
  </tr>`;

// Tabla completa + botones de acción.
const plantillaCarrito = (items) => html`
  <div class="tabla-wrap">
    <table>
      <caption>Productos en tu pedido</caption>
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">Código</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Precio unitario</th>
          <th scope="col">Subtotal</th>
          <th scope="col"><span class="sr-only">Acciones</span></th>
        </tr>
      </thead>
      <tbody>${items.map(plantillaFila)}</tbody>
      <tfoot>
        <tr>
          <th scope="row" colspan="4">Total (${pluralizar(contarUnidades(), 'unidad', 'unidades')})</th>
          <td><data value="${calcularTotal()}">${formatearPrecio(calcularTotal())}</data></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
  <div class="acciones acciones-carrito">
    <a class="boton secundario" href="catalogo.html">Seguir eligiendo productos</a>
    <button type="button" class="boton secundario" data-accion="vaciar">Vaciar carrito</button>
    <a class="boton" href="entrega.html">Continuar con la entrega</a>
  </div>`;

// ---------- Vista ----------
export function iniciarCarrito() {
  const contenedor = seleccionar('#carrito-app');
  const estado = seleccionar('#carrito-estado'); // región aria-live fuera de la zona que se redibuja
  const medios = seleccionar('#medios-pago');
  if (!contenedor) return;

  // Medios de pago: se dibujan desde los datos de datos/pagos.js.
  if (medios) {
    montar(medios, html`${mediosDePago.map((medio) => html`
      <article><h3>${medio.nombre}</h3><p>${medio.descripcion}</p></article>`)}`);
  }

  let foco = null; // recuerda qué control tenía el foco para devolvérselo tras redibujar

  // Redibuja el carrito completo y restaura el foco.
  const dibujar = () => {
    const items = obtenerItems();
    montar(contenedor, items.length ? plantillaCarrito(items) : plantillaVacio());
    if (estado) estado.textContent = items.length ? `Carrito actualizado: ${pluralizar(contarUnidades(), 'unidad', 'unidades')}, total ${formatearPrecio(calcularTotal())}.` : 'El carrito está vacío.';
    if (foco?.contenedor) {
      contenedor.setAttribute('tabindex', '-1');
      contenedor.focus();
      foco = null;
    } else if (foco) {
      const fila = contenedor.querySelector(`tr[data-codigo="${foco.codigo}"]`);
      const control = fila?.querySelector(`[data-accion="${foco.accion}"]:not(:disabled)`) ?? fila?.querySelector('input');
      control?.focus();
      foco = null;
    }
  };

  // Clicks sobre botones (delegación): +, −, Quitar y Vaciar.
  contenedor.addEventListener('click', (evento) => {
    const control = evento.target.closest('button[data-accion]');
    if (!control) return;
    const codigo = control.closest('tr')?.dataset.codigo;
    switch (control.dataset.accion) {
      case 'mas':
        foco = { codigo, accion: 'mas' };
        cambiarCantidad(codigo, obtenerCantidad(codigo) + 1);
        break;
      case 'menos':
        foco = { codigo, accion: 'menos' };
        cambiarCantidad(codigo, obtenerCantidad(codigo) - 1);
        break;
      case 'quitar':
        foco = { contenedor: true }; // la fila desaparece: el foco pasa al contenedor
        quitar(codigo);
        break;
      case 'vaciar':
        if (window.confirm('¿Querés vaciar el carrito?')) vaciar();
        break;
    }
  });

  // Cuando el usuario escribe una cantidad directamente en el campo numérico.
  contenedor.addEventListener('change', (evento) => {
    const campo = evento.target.closest('input[data-accion="cantidad"]');
    if (!campo) return;
    const codigo = campo.closest('tr').dataset.codigo;
    foco = { codigo, accion: 'cantidad' };
    cambiarCantidad(codigo, campo.value);
  });

  // Cada cambio en el carrito (aquí o en otra pestaña) redibuja la vista.
  document.addEventListener('carrito:cambio', dibujar);
  dibujar();
}
