/**
 * modulos/avisos.js
 * ------------------------------------------------------------------
 * Avisos breves ("toasts") que confirman acciones, por ejemplo "Agregaste X al pedido".
 * Usan una región "aria-live" para que los lectores de pantalla también los anuncien.
 */
(function () {
  'use strict';

  let region = null; // contenedor de los avisos (se crea una sola vez)

  // Crea la región de avisos al iniciar la página (debe existir ANTES del primer aviso).
  function iniciarAvisos() {
    if (region) return region;
    region = document.createElement('div');
    region.id = 'avisos';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
    return region;
  }

  // Muestra un aviso y lo quita solo pasados "duracion" milisegundos.
  // tipo: 'exito' (por defecto) o 'error'.
  function mostrarAviso(texto, tipo = 'exito', duracion = 3500) {
    const aviso = document.createElement('p');
    aviso.className = `aviso aviso-${tipo}`;
    aviso.textContent = texto; // textContent evita interpretar HTML
    iniciarAvisos().append(aviso);
    setTimeout(() => aviso.remove(), duracion); // callback diferido con temporizador
  }

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.modulos.avisos = { iniciarAvisos, mostrarAviso };
})();
