/**
 * modulos/dom.js
 * ------------------------------------------------------------------
 * Utilidades mínimas para trabajar con el DOM y la navegación.
 */
(function () {
  'use strict';

  // Atajo de querySelector: devuelve el primer elemento que coincide con el selector.
  const seleccionar = (selector, raiz = document) => raiz.querySelector(selector);

  // Atajo de querySelectorAll que devuelve un Array (y no una NodeList).
  const seleccionarTodos = (selector, raiz = document) => Array.from(raiz.querySelectorAll(selector));

  // Lleva al usuario a otra página SIN dejar la actual en el historial (el botón "Atrás" no vuelve).
  const redirigir = (pagina) => window.location.replace(pagina);

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.modulos.dom = { seleccionar, seleccionarTodos, redirigir };
})();
