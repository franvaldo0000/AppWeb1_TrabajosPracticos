/**
 * vistas/entrega.js
 * ------------------------------------------------------------------
 * PASO 2 DE LA COMPRA: datos de contacto y modo de entrega (retiro en el local o envío).
 * Guarda los datos en el borrador del pedido y continúa al paso de pago.
 */
import { obtenerItems } from '../modulos/carrito.js';
import { obtenerBorrador, guardarEntrega } from '../modulos/pedidos.js';
import { usuarioActual } from '../modulos/sesion.js';
import { dibujarResumen } from '../componentes/resumen.js';
import { franjasEnvio, LOCALIDAD_POR_DEFECTO } from '../datos/entrega.js';
import { html, montar } from '../modulos/plantillas.js';
import { seleccionar, redirigir } from '../modulos/dom.js';

export function iniciarEntrega() {
  // Sin productos no hay nada que entregar: se vuelve al carrito.
  if (obtenerItems().length === 0) return redirigir('carrito.html');

  const formulario = seleccionar('#form-entrega');
  const bloqueEnvio = seleccionar('#datos-envio');
  const infoRetiro = seleccionar('#info-retiro');
  dibujarResumen(seleccionar('#resumen'));

  // Las franjas horarias del envío salen del módulo de datos.
  montar(seleccionar('#franja'), html`
    ${franjasEnvio.map((franja) => html`<option value="${franja}">${franja}</option>`)}`);

  // Valores iniciales: lo ya cargado en el borrador, o los datos del usuario con sesión iniciada.
  const usuario = usuarioActual();
  const valores = {
    nombre: usuario?.nombre,
    telefono: usuario?.telefono,
    email: usuario?.email,
    barrio: LOCALIDAD_POR_DEFECTO,
    ...obtenerBorrador().entrega,
  };
  Object.entries(valores).forEach(([nombre, valor]) => {
    if (formulario.elements[nombre] && valor) formulario.elements[nombre].value = valor;
  });

  // Muestra u oculta los campos de envío. Un fieldset deshabilitado no se valida ni se envía.
  const actualizarModo = () => {
    const esEnvio = formulario.elements.modo.value === 'envio';
    bloqueEnvio.hidden = !esEnvio;
    bloqueEnvio.disabled = !esEnvio;
    infoRetiro.hidden = esEnvio;
  };
  formulario.addEventListener('change', (evento) => {
    if (evento.target.name === 'modo') actualizarModo();
  });
  actualizarModo();

  // Al enviar: se guardan los datos y se pasa al pago.
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    guardarEntrega(Object.fromEntries(new FormData(formulario)));
    window.location.href = 'pago.html';
  });
}
