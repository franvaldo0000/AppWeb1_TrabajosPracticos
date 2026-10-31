/**
 * vistas/cuenta.js
 * ------------------------------------------------------------------
 * VISTA DE LA CUENTA. Sin sesión: formularios de registro e inicio de sesión (simulados).
 * Con sesión: panel con los datos del cliente, historial de pedidos, "repetir pedido"
 * y cierre de sesión.
 */
import { registrar, iniciarSesion, cerrarSesion, usuarioActual } from '../modulos/sesion.js';
import { pedidosDe, repetirPedido } from '../modulos/pedidos.js';
import { html, montar } from '../modulos/plantillas.js';
import { formatearPrecio, formatearFecha, pluralizar } from '../modulos/formato.js';
import { mostrarAviso } from '../modulos/avisos.js';
import { seleccionar, seleccionarTodos } from '../modulos/dom.js';

// Panel del cliente con sesión iniciada.
const plantillaPanel = (usuario, pedidos) => html`
  <h2>Mis datos</h2>
  <p>${usuario.nombre} · ${usuario.email}${usuario.telefono ? ` · ${usuario.telefono}` : ''}</p>
  <div class="acciones"><button type="button" class="boton secundario" data-accion="cerrar">Cerrar sesión</button></div>
  <h2>Mis pedidos</h2>
  ${pedidos.length === 0
    ? html`<div class="estado-vacio"><p>Todavía no hiciste pedidos.</p><div class="acciones"><a class="boton" href="catalogo.html">Ver catálogo</a></div></div>`
    : html`<ul class="pedidos">${pedidos.map((pedido) => html`
        <li class="pedido">
          <div class="pedido-cabecera">
            <strong class="pedido-numero">${pedido.numero}</strong>
            <span>${formatearFecha(pedido.fecha)} · ${pluralizar(pedido.items.length, 'producto', 'productos')}</span>
            <data value="${pedido.total}">${formatearPrecio(pedido.total)}</data>
            <button type="button" class="boton secundario" data-repetir="${pedido.numero}">Repetir pedido</button>
          </div>
          <ul class="pedido-detalle">${pedido.items.map((item) => html`<li>${item.cantidad} × ${item.nombre}</li>`)}</ul>
        </li>`)}</ul>`}`;

export function iniciarCuenta() {
  const invitado = seleccionar('#cuenta-invitado');
  const panel = seleccionar('#cuenta-panel');
  const titulo = seleccionar('#cuenta-titulo');
  const texto = seleccionar('#cuenta-texto');
  const original = { titulo: titulo.textContent, texto: texto.textContent }; // textos de la versión sin sesión

  // Elige qué mostrar según haya o no una sesión iniciada.
  const dibujar = () => {
    const usuario = usuarioActual();
    invitado.hidden = Boolean(usuario);
    panel.hidden = !usuario;
    titulo.textContent = usuario ? `Hola, ${usuario.nombre.split(' ')[0]}` : original.titulo;
    texto.textContent = usuario ? 'Desde acá podés ver tus pedidos y repetirlos con un clic.' : original.texto;
    if (usuario) montar(panel, plantillaPanel(usuario, pedidosDe(usuario.email)));
  };

  // Muestra (o limpia) el mensaje de error de un formulario.
  const mostrarError = (formulario, mensaje = '') => {
    const zona = seleccionar('[data-error]', formulario);
    zona.textContent = mensaje;
    zona.hidden = mensaje === '';
  };

  // Maneja el envío de ambos formularios con la misma lógica (función de orden superior).
  const manejarEnvio = (accion, alExito) => async (evento) => {
    evento.preventDefault();
    const formulario = evento.target;
    mostrarError(formulario);
    const datos = Object.fromEntries(new FormData(formulario));
    try {
      const resultado = await accion(datos);
      if (!resultado.ok) return mostrarError(formulario, resultado.error);
      formulario.reset();
      alExito(datos);
    } catch (error) {
      mostrarError(formulario, error.message);
    }
  };

  seleccionar('#form-registro').addEventListener('submit',
    manejarEnvio((datos) => registrar(datos), (datos) => mostrarAviso(`¡Cuenta creada! Bienvenido/a, ${datos.nombre.split(' ')[0]}.`)));
  seleccionar('#form-login').addEventListener('submit',
    manejarEnvio((datos) => iniciarSesion(datos.email, datos.password), () => mostrarAviso('Sesión iniciada.')));

  // En esta demostración no hay servidor para enviar correos de recuperación.
  seleccionar('[data-olvido]').addEventListener('click', (evento) => {
    evento.preventDefault();
    mostrarAviso('La recuperación de contraseña requiere un servidor (no incluido en esta demostración).', 'error', 5000);
  });

  // Acciones del panel (delegación): cerrar sesión y repetir un pedido.
  panel.addEventListener('click', (evento) => {
    if (evento.target.closest('[data-accion="cerrar"]')) {
      cerrarSesion();
      mostrarAviso('Cerraste la sesión.');
      return;
    }
    const botonRepetir = evento.target.closest('[data-repetir]');
    if (botonRepetir) {
      const pedido = pedidosDe(usuarioActual().email).find((item) => item.numero === botonRepetir.dataset.repetir);
      if (pedido) {
        repetirPedido(pedido);
        window.location.href = 'carrito.html';
      }
    }
  });

  document.addEventListener('sesion:cambio', dibujar);
  dibujar();
}
