/**
 * nucleo.js
 * ------------------------------------------------------------------
 * Crea el ESPACIO DE NOMBRES global "AlPaso" donde cada archivo publica su API.
 * Debe cargarse PRIMERO en cada página.
 *
 * El sitio usa el "patrón módulo": cada archivo es una función autoejecutable (IIFE) que
 * guarda sus variables en privado y expone solo lo necesario en AlPaso.<carpeta>.<archivo>.
 * Así el código sigue organizado en módulos independientes, pero funciona con scripts
 * clásicos y se puede abrir con doble clic, sin servidor.
 */
window.AlPaso = window.AlPaso || {
  datos: {},        // datos del catálogo, pagos y entrega
  modulos: {},      // lógica de negocio y utilidades
  componentes: {},  // piezas de interfaz reutilizables
  vistas: {},       // una vista por página
};
