/**
 * modulos/productos.js
 * ------------------------------------------------------------------
 * Consultas sobre el catálogo: buscar por código y filtrar/ordenar.
 * Trabaja sobre los datos de datos/catalogo.js pero no los modifica.
 */
import { productos } from '../datos/catalogo.js';

// Devuelve el producto con ese código o undefined si no existe.
export const buscarPorCodigo = (codigo) => productos.find((producto) => producto.codigo === codigo);

// Quita tildes y mayúsculas para que "Pan Francés" coincida con "pan frances".
const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Funciones de comparación para ordenar (se pasan como callback a Array.sort).
const comparadores = {
  codigo: (a, b) => a.codigo.localeCompare(b.codigo),
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
};

// Opciones del selector "Ordenar por" (las usa la vista del catálogo).
export const opcionesDeOrden = Object.freeze([
  { valor: 'codigo', etiqueta: 'Código' },
  { valor: 'nombre', etiqueta: 'Nombre (A-Z)' },
  { valor: 'precio-asc', etiqueta: 'Precio: menor a mayor' },
  { valor: 'precio-desc', etiqueta: 'Precio: mayor a menor' },
]);

// Devuelve los productos que cumplen categoría y texto de búsqueda, ya ordenados.
export function filtrarProductos({ categoria = 'todos', texto = '', orden = 'codigo' } = {}) {
  const busqueda = normalizar(texto);
  return productos
    .filter((producto) => categoria === 'todos' || producto.categoria === categoria)
    .filter((producto) => busqueda === '' || normalizar(`${producto.nombre} ${producto.descripcion}`).includes(busqueda))
    .sort(comparadores[orden] ?? comparadores.codigo);
}
