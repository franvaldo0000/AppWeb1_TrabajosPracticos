/**
 * modulos/plantillas.js
 * ------------------------------------------------------------------
 * Pequeño motor de plantillas para dibujar HTML de forma SEGURA.
 * Se usa como "template literal etiquetado":
 *
 *     montar(contenedor, html`<p>Hola, ${nombre}</p>`);
 *
 * Todo valor interpolado se escapa automáticamente (evita inyección de HTML),
 * excepto los fragmentos que provienen de otra plantilla html``.
 */
(function () {
  'use strict';

  // Tabla de caracteres peligrosos y su versión escapada.
  const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  // Reemplaza los caracteres peligrosos de un texto (función de flecha con callback en replace).
  const escaparHtml = (valor) => String(valor).replace(/[&<>"']/g, (caracter) => ENTIDADES[caracter]);

  // Envoltorio que marca un texto como "ya seguro" (resultado de una plantilla html``).
  class HtmlSeguro {
    constructor(texto) { this.texto = texto; }
    toString() { return this.texto; }
  }

  // Convierte un valor interpolado en texto: escapa, aplana listas y omite null/undefined/false.
  const convertir = (valor) => {
    if (valor instanceof HtmlSeguro) return valor.texto;
    if (Array.isArray(valor)) return valor.map(convertir).join('');
    if (valor === null || valor === undefined || valor === false) return '';
    return escaparHtml(valor);
  };

  // Función etiqueta: recibe los trozos fijos de la plantilla y los valores interpolados.
  function html(cadenas, ...valores) {
    let resultado = cadenas[0];
    valores.forEach((valor, indice) => {
      resultado += convertir(valor) + cadenas[indice + 1];
    });
    return new HtmlSeguro(resultado);
  }

  // Inserta una plantilla dentro de un contenedor del DOM, reemplazando su contenido.
  function montar(contenedor, plantilla) {
    contenedor.innerHTML = plantilla.toString();
    return contenedor;
  }

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.modulos.plantillas = { escaparHtml, html, montar };
})();
