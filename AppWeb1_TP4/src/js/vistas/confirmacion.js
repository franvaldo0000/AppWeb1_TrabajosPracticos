/**
 * vistas/confirmacion.js
 * ------------------------------------------------------------------
 * PASO 4 DE LA COMPRA: comprobante del pedido con su número de ticket,
 * las instrucciones según el medio de pago y el modo de entrega.
 */
(function () {
  'use strict';

  const { ultimoPedido } = AlPaso.modulos.pedidos;
  const { mediosDePago, ALIAS_TRANSFERENCIA } = AlPaso.datos.pagos;
  const { DIRECCION_LOCAL, TIEMPO_RETIRO } = AlPaso.datos.entrega;
  const { html, montar } = AlPaso.modulos.plantillas;
  const { formatearPrecio, formatearFecha } = AlPaso.modulos.formato;
  const { seleccionar } = AlPaso.modulos.dom;

  // Texto de instrucciones según cómo se paga.
  const instruccionDePago = (pedido) => ({
    efectivo: 'Pagás en el mostrador al retirar. Mostrá el número de ticket.',
    transferencia: `Realizá la transferencia por el total al alias ${ALIAS_TRANSFERENCIA} (dato de ejemplo).`,
    mercadopago: 'Pago registrado con Mercado Pago (simulación: no se realizó ningún cobro real).',
    tarjeta: `Pago registrado con tarjeta en ${pedido.pago.cuotas} ${pedido.pago.cuotas === 1 ? 'pago' : 'cuotas sin interés'} (simulación: no se realizó ningún cobro real).`,
  }[pedido.pago.medio]);

  // Texto de instrucciones según cómo se recibe.
  const instruccionDeEntrega = (pedido) => pedido.entrega.modo === 'envio'
    ? `Te lo llevamos a ${pedido.entrega.direccion}, ${pedido.entrega.barrio}, en la franja de ${pedido.entrega.franja}.`
    : `Tu pedido estará listo en ${TIEMPO_RETIRO} en ${DIRECCION_LOCAL}. Mostrá el número de ticket al retirar.`;

  // Comprobante completo.
  const plantillaPedido = (pedido) => html`
    <article class="ticket-pedido" aria-labelledby="pedido-titulo">
      <span class="sello-pedido">Pedido recibido</span>
      <h2 id="pedido-titulo">Ticket <span class="pedido-numero">${pedido.numero}</span></h2>
      <dl class="datos-pedido">
        <div><dt>Cliente</dt><dd>${pedido.cliente.nombre}</dd></div>
        <div><dt>Fecha</dt><dd>${formatearFecha(pedido.fecha)}</dd></div>
        <div><dt>Entrega</dt><dd>${pedido.entrega.modo === 'envio' ? 'Envío a domicilio' : 'Retiro en el local'}</dd></div>
        <div><dt>Medio de pago</dt><dd>${mediosDePago.find((medio) => medio.id === pedido.pago.medio)?.nombre}</dd></div>
      </dl>
      <ul class="resumen-lista">
        ${pedido.items.map((item) => html`
          <li><span>${item.cantidad} × ${item.nombre}</span><data value="${item.subtotal}">${formatearPrecio(item.subtotal)}</data></li>`)}
      </ul>
      <p class="resumen-total"><span>Total</span> <data value="${pedido.total}">${formatearPrecio(pedido.total)}</data></p>
      <p class="nota">${instruccionDeEntrega(pedido)}</p>
      <p class="nota">${instruccionDePago(pedido)}</p>
      <div class="acciones">
        <button type="button" class="boton secundario" data-accion="imprimir">Imprimir comprobante</button>
        <a class="boton" href="catalogo.html">Seguir comprando</a>
      </div>
    </article>`;

  // Mensaje si se entra a esta página sin haber hecho un pedido.
  const plantillaSinPedido = () => html`
    <div class="estado-vacio">
      <p>No hay ningún pedido reciente para mostrar.</p>
      <div class="acciones"><a class="boton" href="catalogo.html">Ver catálogo</a></div>
    </div>`;

  function iniciarConfirmacion() {
    const contenedor = seleccionar('#confirmacion-app');
    const pedido = ultimoPedido();
    montar(contenedor, pedido ? plantillaPedido(pedido) : plantillaSinPedido());
    // Botón para imprimir el comprobante con el diálogo del navegador.
    contenedor.addEventListener('click', (evento) => {
      if (evento.target.closest('[data-accion="imprimir"]')) window.print();
    });
  }

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.vistas.confirmacion = { iniciar: iniciarConfirmacion };
})();
