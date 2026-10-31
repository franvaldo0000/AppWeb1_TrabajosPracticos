/**
 * modulos/carrito.js
 * ------------------------------------------------------------------
 * ESTADO DEL CARRITO. Guarda solo { codigo, cantidad } por línea; los precios y
 * nombres se toman SIEMPRE del catálogo, así un valor alterado en el navegador
 * no puede cambiar el precio.
 *
 * Cada cambio persiste en localStorage y emite el evento personalizado
 * "carrito:cambio" para que las vistas se redibujen (patrón publicador/suscriptor).
 */
import { leer, guardar, claveCompleta } from './almacenamiento.js';
import { buscarPorCodigo } from './productos.js';

const CLAVE = 'carrito';
export const CANTIDAD_MAXIMA = 20; // máximo de unidades por producto

// Fuerza una cantidad a un entero entre 1 y CANTIDAD_MAXIMA.
const limitar = (cantidad) => Math.min(CANTIDAD_MAXIMA, Math.max(1, Math.trunc(Number(cantidad)) || 1));

// Carga el carrito guardado descartando líneas inválidas (datos manipulados o productos retirados).
const cargar = () => {
  const guardado = leer(CLAVE, []);
  if (!Array.isArray(guardado)) return [];
  return guardado
    .filter((linea) => linea && buscarPorCodigo(linea.codigo))
    .map((linea) => ({ codigo: linea.codigo, cantidad: limitar(linea.cantidad) }));
};

let lineas = cargar(); // estado en memoria

// Devuelve un resumen numérico del carrito.
export const obtenerResumen = () => ({ unidades: contarUnidades(), total: calcularTotal(), lineas: lineas.length });

// Guarda el estado y avisa a todas las vistas que el carrito cambió.
const notificar = () => {
  guardar(CLAVE, lineas);
  document.dispatchEvent(new CustomEvent('carrito:cambio', { detail: obtenerResumen() }));
};

// Agrega "cantidad" unidades de un producto. Devuelve la cantidad final de esa línea (0 si el código no existe).
export function agregar(codigo, cantidad = 1) {
  if (!buscarPorCodigo(codigo)) return 0;
  const existente = lineas.find((linea) => linea.codigo === codigo);
  if (existente) {
    existente.cantidad = limitar(existente.cantidad + limitar(cantidad));
  } else {
    lineas.push({ codigo, cantidad: limitar(cantidad) });
  }
  notificar();
  return obtenerCantidad(codigo);
}

// Fija la cantidad exacta de una línea ya existente.
export function cambiarCantidad(codigo, cantidad) {
  const linea = lineas.find((item) => item.codigo === codigo);
  if (!linea) return;
  linea.cantidad = limitar(cantidad);
  notificar();
}

// Elimina una línea del carrito.
export function quitar(codigo) {
  lineas = lineas.filter((linea) => linea.codigo !== codigo);
  notificar();
}

// Vacía el carrito completo.
export function vaciar() {
  lineas = [];
  notificar();
}

// Cantidad actual de un producto (0 si no está en el carrito).
export const obtenerCantidad = (codigo) => lineas.find((linea) => linea.codigo === codigo)?.cantidad ?? 0;

// Devuelve las líneas "enriquecidas" con los datos del catálogo y el subtotal.
export const obtenerItems = () =>
  lineas.map(({ codigo, cantidad }) => {
    const producto = buscarPorCodigo(codigo);
    return { ...producto, cantidad, subtotal: producto.precio * cantidad };
  });

// Total de unidades (suma de cantidades) y total en pesos (suma de subtotales).
export const contarUnidades = () => lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
export const calcularTotal = () => obtenerItems().reduce((suma, item) => suma + item.subtotal, 0);

// Si el carrito cambia en OTRA pestaña, se recarga el estado y se avisa a las vistas.
window.addEventListener('storage', (evento) => {
  if (evento.key !== claveCompleta(CLAVE)) return;
  lineas = cargar();
  document.dispatchEvent(new CustomEvent('carrito:cambio', { detail: obtenerResumen() }));
});
