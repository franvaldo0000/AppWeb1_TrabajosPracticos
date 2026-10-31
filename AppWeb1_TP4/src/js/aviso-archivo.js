/**
 * aviso-archivo.js  (script clásico, NO módulo)
 * ------------------------------------------------------------------
 * Los módulos de JavaScript (import/export) no funcionan si el sitio se abre haciendo
 * doble clic en el archivo (protocolo file://). Este script avisa al usuario y
 * explica cómo abrirlo con un servidor local.
 * Se escribe como función anónima autoejecutable (IIFE) para no crear variables globales.
 */
(function () {
  if (window.location.protocol !== 'file:') return; // con servidor no hace falta avisar

  document.addEventListener('DOMContentLoaded', function () {
    var aviso = document.createElement('p');
    aviso.className = 'aviso-archivo';
    aviso.setAttribute('role', 'alert');
    aviso.textContent = 'Para que el catálogo y el carrito funcionen, abrí el sitio con un servidor local ' +
      '(por ejemplo, la extensión Live Server de VS Code) en lugar de abrir el archivo directamente.';
    document.body.prepend(aviso);
  });
})();
