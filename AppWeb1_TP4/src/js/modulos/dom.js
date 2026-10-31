/**
 * modulos/dom.js
 * ------------------------------------------------------------------
 * Utilidades mínimas para trabajar con el DOM y la navegación.
 */

// Atajo de querySelector: devuelve el primer elemento que coincide con el selector.
export const seleccionar = (selector, raiz = document) => raiz.querySelector(selector);

// Atajo de querySelectorAll que devuelve un Array (y no una NodeList).
export const seleccionarTodos = (selector, raiz = document) => Array.from(raiz.querySelectorAll(selector));

// Lleva al usuario a otra página SIN dejar la actual en el historial (el botón "Atrás" no vuelve).
export const redirigir = (pagina) => window.location.replace(pagina);
