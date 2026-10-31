/**
 * modulos/pedidos.js
 * ------------------------------------------------------------------
 * PROCESO DE COMPRA. Guarda el "borrador" del pedido mientras el cliente recorre los pasos
 * (entrega -> pago), crea el pedido definitivo al confirmar y mantiene el historial.
 */
(function () {
  'use strict';

  const { leer, guardar, borrar } = AlPaso.modulos.almacenamiento;
  const { obtenerItems, calcularTotal, vaciar, agregar } = AlPaso.modulos.carrito;

  const CLAVE_BORRADOR = 'borradorPedido';
  const CLAVE_PEDIDOS = 'pedidos';
  const CLAVE_ULTIMO = 'ultimoPedido';
  const CLAVE_CONTADOR = 'contadorPedidos';

  // ---- Borrador (datos de los pasos intermedios) ----
  const obtenerBorrador = () => leer(CLAVE_BORRADOR, {});
  const guardarEntrega = (entrega) => guardar(CLAVE_BORRADOR, { ...obtenerBorrador(), entrega });
  const guardarPago = (pago) => guardar(CLAVE_BORRADOR, { ...obtenerBorrador(), pago });

  // ---- Historial ----
  const obtenerPedidos = () => {
    const pedidos = leer(CLAVE_PEDIDOS, []);
    return Array.isArray(pedidos) ? pedidos : [];
  };
  const ultimoPedido = () => leer(CLAVE_ULTIMO, null);
  const pedidosDe = (email) => obtenerPedidos().filter((pedido) => pedido.cliente.email === email.trim().toLowerCase());

  // Genera el siguiente número de pedido correlativo: AP-01001, AP-01002, ...
  const generarNumero = () => {
    const siguiente = Number(leer(CLAVE_CONTADOR, 1000)) + 1;
    guardar(CLAVE_CONTADOR, siguiente);
    return `AP-${String(siguiente).padStart(5, '0')}`;
  };

  // Confirma el pedido: arma el registro definitivo, lo guarda, vacía el carrito y el borrador.
  // Devuelve el pedido creado o null si faltan datos.
  function confirmarPedido() {
    const { entrega, pago } = obtenerBorrador();
    const items = obtenerItems();
    if (!entrega || !pago || items.length === 0) return null;

    const pedido = {
      numero: generarNumero(),
      fecha: new Date().toISOString(),
      cliente: { nombre: entrega.nombre, telefono: entrega.telefono, email: entrega.email.trim().toLowerCase() },
      entrega,
      pago,
      // Se guarda una "foto" de nombre y precio al momento de comprar.
      items: items.map(({ codigo, nombre, precio, cantidad, subtotal }) => ({ codigo, nombre, precio, cantidad, subtotal })),
      total: calcularTotal(),
    };

    guardar(CLAVE_PEDIDOS, [pedido, ...obtenerPedidos()]);
    guardar(CLAVE_ULTIMO, pedido);
    borrar(CLAVE_BORRADOR);
    vaciar();
    return pedido;
  }

  // "Repetir pedido": vuelve a agregar al carrito todas las líneas de un pedido anterior.
  const repetirPedido = (pedido) => pedido.items.forEach((item) => agregar(item.codigo, item.cantidad));

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.modulos.pedidos = { obtenerBorrador, guardarEntrega, guardarPago, obtenerPedidos, ultimoPedido, pedidosDe, confirmarPedido, repetirPedido };
})();
