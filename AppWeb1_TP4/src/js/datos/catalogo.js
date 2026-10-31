/**
 * datos/catalogo.js
 * ------------------------------------------------------------------
 * MÓDULO DE DATOS DEL CATÁLOGO.
 * Aquí vive la única fuente de verdad de los productos y sus categorías.
 * No contiene lógica ni toca el DOM: solo exporta estructuras de datos,
 * de modo que el catálogo pueda editarse (o reemplazarse por una API)
 * sin tocar el resto del código.
 */
(function () {
  'use strict';

  // Carpeta donde están las imágenes de los productos (relativa a las páginas HTML).
  const RUTA_IMAGENES = 'recursos/imagenes/';

  // Categorías del catálogo. "id" se usa en los filtros y en el campo "categoria" de cada producto.
  const categorias = Object.freeze([
    { id: 'facturas', nombre: 'Facturas y medialunas', etiqueta: 'Facturas' },
    { id: 'chipas',   nombre: 'Chipas y pan de queso', etiqueta: 'Chipas' },
    { id: 'panes',    nombre: 'Panes del día',         etiqueta: 'Panes' },
    { id: 'dulces',   nombre: 'Tortas y postres',      etiqueta: 'Dulces' },
  ]);

  // Lista "en bruto" de productos. El precio está en pesos argentinos (número entero).
  const listaDeProductos = [
    { codigo: '001', nombre: 'Medialunas de manteca (x6)', categoria: 'facturas', precio: 3200,
      descripcion: 'Clásicas, dulces y bien hojaldradas.', imagen: 'medialunas.png', alt: 'Medialunas de manteca' },
    { codigo: '002', nombre: 'Facturas surtidas (x12)', categoria: 'facturas', precio: 5400,
      descripcion: 'Vigilantes, cañoncitos y sacramentos.', imagen: 'facturas-surtidas.png', alt: 'Facturas surtidas' },
    { codigo: '014', nombre: 'Chipas (x12)', categoria: 'chipas', precio: 4200,
      descripcion: 'Recién horneadas, con queso de verdad.', imagen: 'chipa.png', alt: 'Chipas recién horneadas' },
    { codigo: '015', nombre: 'Pan de queso (x6)', categoria: 'chipas', precio: 2900,
      descripcion: 'Tiernos por dentro, dorados por fuera.', imagen: 'pan-de-queso.png', alt: 'Pan de queso' },
    { codigo: '021', nombre: 'Pan francés (unidad)', categoria: 'panes', precio: 900,
      descripcion: 'Corteza crocante, miga liviana.', imagen: 'pan-frances.png', alt: 'Pan francés' },
    { codigo: '022', nombre: 'Pan casero (x1kg)', categoria: 'panes', precio: 2600,
      descripcion: 'El de toda la vida, horneado en molde.', imagen: 'pan-casero.png', alt: 'Pan casero' },
    { codigo: '023', nombre: 'Pan integral de salvado', categoria: 'panes', precio: 2400,
      descripcion: 'Con semillas, ideal para el desayuno.', imagen: 'pan-integral.png', alt: 'Pan integral de salvado' },
    { codigo: '031', nombre: 'Torta de vainilla (porción)', categoria: 'dulces', precio: 1800,
      descripcion: 'Bizcochuelo húmedo con crema.', imagen: 'torta-vainilla.png', alt: 'Torta de vainilla' },
  ];

  // Se congela cada producto (y la lista) para que ningún módulo pueda modificarlos por accidente.
  const productos = Object.freeze(listaDeProductos.map((producto) => Object.freeze(producto)));

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.datos.catalogo = { RUTA_IMAGENES, categorias, productos };
})();
