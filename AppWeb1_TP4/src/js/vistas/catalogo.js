/**
 * vistas/catalogo.js
 * ------------------------------------------------------------------
 * RENDERIZADO COMPLETO DEL CATÁLOGO. El HTML solo trae un contenedor vacío; esta vista dibuja
 * la barra de filtros, el buscador, el selector de orden y la grilla de productos a partir
 * de los datos del módulo datos/catalogo.js.
 *
 * Eventos usados: click (filtros), input (buscador, con retardo), change (orden),
 * submit (agregar al pedido) y hashchange (enlaces como catalogo.html#chipas).
 */
import { categorias, RUTA_IMAGENES } from '../datos/catalogo.js';
import { filtrarProductos, opcionesDeOrden, buscarPorCodigo } from '../modulos/productos.js';
import { agregar, CANTIDAD_MAXIMA } from '../modulos/carrito.js';
import { html, montar } from '../modulos/plantillas.js';
import { formatearPrecio, pluralizar } from '../modulos/formato.js';
import { mostrarAviso } from '../modulos/avisos.js';
import { seleccionar, seleccionarTodos } from '../modulos/dom.js';

// ---------- Plantillas (funciones de flecha que devuelven HTML) ----------

// Botones de filtro por categoría. "aria-pressed" indica cuál está activo.
const plantillaFiltros = () => html`
  <ul>
    <li><button type="button" data-categoria="todos" aria-pressed="true">Todos</button></li>
    ${categorias.map((categoria) => html`
      <li><button type="button" data-categoria="${categoria.id}" aria-pressed="false">${categoria.etiqueta}</button></li>`)}
  </ul>`;

// Una tarjeta de producto con su formulario de cantidad.
const plantillaProducto = (producto) => html`
  <article class="producto" data-codigo="${producto.codigo}">
    <div class="producto-imagen">
      <img src="${RUTA_IMAGENES}${producto.imagen}" alt="${producto.alt}" width="320" height="240" loading="lazy">
      <span class="codigo"><span class="sr-only">Código </span>${producto.codigo}</span>
    </div>
    <div class="producto-cuerpo">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <div class="producto-pie">
        <div class="precio"><data value="${producto.precio}">${formatearPrecio(producto.precio)}</data></div>
        <form class="producto-form" data-codigo="${producto.codigo}">
          <label class="sr-only" for="cant-${producto.codigo}">Cantidad de ${producto.nombre}</label>
          <input type="number" id="cant-${producto.codigo}" name="cantidad" value="1" min="1" max="${CANTIDAD_MAXIMA}" inputmode="numeric">
          <button class="mas" type="submit" aria-label="Agregar ${producto.nombre} al pedido"><span aria-hidden="true">+</span></button>
        </form>
      </div>
    </div>
  </article>`;

// Mensaje cuando ningún producto coincide con la búsqueda.
const plantillaSinResultados = () => html`
  <div class="estado-vacio">
    <p>No encontramos productos con esos criterios.</p>
    <p>Probá con otra palabra o elegí otra categoría.</p>
  </div>`;

// ---------- Vista ----------

// Devuelve la categoría indicada en la URL (#chipas) o "todos" si no hay una válida.
const categoriaDesdeUrl = () => {
  const id = window.location.hash.slice(1);
  return categorias.some((categoria) => categoria.id === id) ? id : 'todos';
};

export function iniciarCatalogo() {
  const contenedor = seleccionar('#catalogo-app');
  if (!contenedor) return;

  // Estado de la vista: lo que el usuario eligió en los controles.
  const estado = { categoria: categoriaDesdeUrl(), texto: '', orden: 'codigo' };

  // 1) Se dibuja la estructura fija: filtros + controles + zona de productos.
  montar(contenedor, html`
    <div class="catalogo-barra">
      <div class="filtros" role="group" aria-label="Filtrar por categoría">${plantillaFiltros()}</div>
      <div class="catalogo-controles">
        <div class="campo-inline">
          <label for="buscar">Buscar</label>
          <input type="search" id="buscar" placeholder="Ej.: chipa" autocomplete="off">
        </div>
        <div class="campo-inline">
          <label for="orden">Ordenar por</label>
          <select id="orden">
            ${opcionesDeOrden.map((opcion) => html`<option value="${opcion.valor}">${opcion.etiqueta}</option>`)}
          </select>
        </div>
      </div>
    </div>
    <p class="catalogo-estado" role="status" data-estado></p>
    <div class="productos" data-productos></div>
  `);

  const zonaProductos = seleccionar('[data-productos]', contenedor);
  const textoEstado = seleccionar('[data-estado]', contenedor);
  const botonesFiltro = seleccionarTodos('[data-categoria]', contenedor);

  // 2) Dibuja SOLO la lista de productos según el estado actual (sin perder el foco del buscador).
  const dibujar = () => {
    const lista = filtrarProductos(estado);
    montar(zonaProductos, lista.length ? html`${lista.map(plantillaProducto)}` : plantillaSinResultados());
    textoEstado.textContent = `Mostrando ${pluralizar(lista.length, 'producto', 'productos')}`;
    botonesFiltro.forEach((boton) => boton.setAttribute('aria-pressed', String(boton.dataset.categoria === estado.categoria)));
  };

  // 3) Eventos.
  // Filtros por categoría (delegación de eventos: un solo "click" para todos los botones).
  contenedor.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-categoria]');
    if (!boton) return;
    estado.categoria = boton.dataset.categoria;
    dibujar();
  });

  // Buscador: espera 250 ms después de la última tecla antes de filtrar (anti-rebote).
  let temporizador;
  seleccionar('#buscar', contenedor).addEventListener('input', (evento) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      estado.texto = evento.target.value;
      dibujar();
    }, 250);
  });

  // Selector de orden.
  seleccionar('#orden', contenedor).addEventListener('change', (evento) => {
    estado.orden = evento.target.value;
    dibujar();
  });

  // Agregar al pedido: el evento "submit" de cada tarjeta se atiende desde la zona de productos.
  zonaProductos.addEventListener('submit', (evento) => {
    evento.preventDefault(); // evita recargar la página
    const formulario = evento.target;
    const producto = buscarPorCodigo(formulario.dataset.codigo);
    const pedida = Number(formulario.elements.cantidad.value);
    const final = agregar(producto.codigo, pedida);
    mostrarAviso(`Agregaste ${pedida === 1 ? 'una unidad' : `${pedida} unidades`} de ${producto.nombre}.`);
    if (final === CANTIDAD_MAXIMA) mostrarAviso(`El máximo por producto es ${CANTIDAD_MAXIMA} unidades.`, 'error');
    formulario.elements.cantidad.value = 1; // se reinicia el campo para la próxima vez
  });

  // Si cambia el "#" de la URL (por ejemplo un enlace a #chipas), se actualiza el filtro.
  window.addEventListener('hashchange', () => {
    estado.categoria = categoriaDesdeUrl();
    dibujar();
  });

  dibujar();
}
