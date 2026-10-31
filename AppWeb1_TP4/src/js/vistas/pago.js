/**
 * vistas/pago.js
 * ------------------------------------------------------------------
 * PASO 3 DE LA COMPRA: elección del medio de pago y confirmación del pedido.
 * El cobro está SIMULADO: no se contacta a ninguna pasarela real (ver informe).
 */
import { obtenerItems, calcularTotal } from '../modulos/carrito.js';
import { obtenerBorrador, guardarPago, confirmarPedido } from '../modulos/pedidos.js';
import { dibujarResumen } from '../componentes/resumen.js';
import { mediosDePago, CUOTAS_MAXIMAS } from '../datos/pagos.js';
import { DIRECCION_LOCAL } from '../datos/entrega.js';
import { html, montar } from '../modulos/plantillas.js';
import { formatearPrecio } from '../modulos/formato.js';
import { mostrarAviso } from '../modulos/avisos.js';
import { seleccionar, redirigir } from '../modulos/dom.js';

export function iniciarPago() {
  const { entrega, pago } = obtenerBorrador();
  // Guardas: el paso de pago exige tener productos y haber completado la entrega.
  if (obtenerItems().length === 0) return redirigir('carrito.html');
  if (!entrega) return redirigir('entrega.html');

  const formulario = seleccionar('#form-pago');
  const listaMedios = seleccionar('#lista-medios');
  const bloqueCuotas = seleccionar('#bloque-cuotas');
  const selectorCuotas = seleccionar('#cuotas');
  const boton = seleccionar('#boton-confirmar');
  const errorGeneral = seleccionar('#pago-error');
  const esEnvio = entrega.modo === 'envio';

  dibujarResumen(seleccionar('#resumen'));

  // Recordatorio de lo elegido en el paso anterior.
  seleccionar('#entrega-elegida').textContent = esEnvio
    ? `Envío a ${entrega.direccion}, ${entrega.barrio} (${entrega.franja}).`
    : `Retiro en el local: ${DIRECCION_LOCAL}.`;

  // Medios de pago: "Efectivo al retirar" se deshabilita si el pedido es con envío.
  const habilitado = (medio) => !(medio.soloRetiro && esEnvio);
  montar(listaMedios, html`${mediosDePago.map((medio) => html`
    <li class="opcion">
      <input type="radio" name="medio" id="medio-${medio.id}" value="${medio.id}" required
        ${habilitado(medio) ? '' : 'disabled'} ${pago?.medio === medio.id && habilitado(medio) ? 'checked' : ''}>
      <label for="medio-${medio.id}">
        <strong>${medio.nombre}</strong>
        <span>${medio.descripcion}${habilitado(medio) ? '' : ' (disponible solo con retiro en el local)'}</span>
      </label>
    </li>`)}`);

  // Cuotas: 1 a CUOTAS_MAXIMAS, con el valor aproximado de cada una.
  const total = calcularTotal();
  montar(selectorCuotas, html`${Array.from({ length: CUOTAS_MAXIMAS }, (_, indice) => indice + 1).map((n) => html`
    <option value="${n}">${n === 1 ? '1 pago' : `${n} cuotas sin interés`} de ${formatearPrecio(Math.ceil(total / n))}</option>`)}`);
  if (pago?.cuotas) selectorCuotas.value = String(pago.cuotas);

  // Las cuotas solo se muestran si el medio elegido es tarjeta.
  const actualizarCuotas = () => {
    bloqueCuotas.hidden = formulario.elements.medio.value !== 'tarjeta';
  };
  formulario.addEventListener('change', actualizarCuotas);
  actualizarCuotas();

  // Confirmar: guarda el medio, simula el procesamiento y crea el pedido.
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(formulario));
    guardarPago({ medio: datos.medio, cuotas: datos.medio === 'tarjeta' ? Number(datos.cuotas) : 1 });

    boton.disabled = true;
    boton.textContent = 'Procesando…';
    // setTimeout simula la espera de una pasarela de pago (callback tras 900 ms).
    setTimeout(() => {
      const pedido = confirmarPedido();
      if (pedido) {
        window.location.href = 'confirmacion.html';
        return;
      }
      boton.disabled = false;
      boton.textContent = 'Confirmar pedido';
      errorGeneral.textContent = 'No pudimos confirmar el pedido. Revisá tu carrito y tus datos de entrega.';
      errorGeneral.hidden = false;
      mostrarAviso('No se pudo confirmar el pedido.', 'error');
    }, 900);
  });
}
