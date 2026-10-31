/**
 * modulos/sesion.js
 * ------------------------------------------------------------------
 * CUENTAS DE CLIENTE SIMULADAS (sin servidor).
 *
 * IMPORTANTE: esto es una DEMOSTRACIÓN. Los datos viven en el navegador (localStorage),
 * por lo que NO ofrecen seguridad real. La contraseña nunca se guarda en texto plano:
 * se guarda un hash SHA-256 con el correo como "sal". En un sistema real la
 * autenticación debe resolverse en el servidor (bcrypt/argon2, sesiones o JWT).
 */
(function () {
  'use strict';

  const { leer, guardar, borrar, claveCompleta } = AlPaso.modulos.almacenamiento;

  const CLAVE_USUARIOS = 'usuarios';
  const CLAVE_SESION = 'sesion';

  // Los correos se comparan sin espacios y en minúsculas.
  const normalizarEmail = (email) => email.trim().toLowerCase();

  // Avisa a las vistas que la sesión cambió (inicio, cierre o registro).
  const notificar = () => document.dispatchEvent(new CustomEvent('sesion:cambio'));

  // Calcula el hash SHA-256 de un texto (función asíncrona: devuelve una promesa).
  async function hashear(texto) {
    if (!globalThis.crypto?.subtle) {
      throw new Error('Tu navegador no permite proteger la contraseña en este contexto (se necesita https o localhost).');
    }
    const bytes = new TextEncoder().encode(texto);
    const resumen = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(resumen), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  // Devuelve la lista de usuarios guardados (siempre un Array).
  const obtenerUsuarios = () => {
    const usuarios = leer(CLAVE_USUARIOS, []);
    return Array.isArray(usuarios) ? usuarios : [];
  };

  // Registra un usuario nuevo e inicia su sesión. Devuelve { ok, error }.
  async function registrar({ nombre, email, telefono = '', password }) {
    const correo = normalizarEmail(email);
    const usuarios = obtenerUsuarios();
    if (usuarios.some((usuario) => usuario.email === correo)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo electrónico.' };
    }
    const hash = await hashear(`${correo}:${password}`);
    guardar(CLAVE_USUARIOS, [...usuarios, { nombre: nombre.trim(), email: correo, telefono: telefono.trim(), hash }]);
    guardar(CLAVE_SESION, { email: correo });
    notificar();
    return { ok: true };
  }

  // Inicia sesión si el correo y la contraseña coinciden. Devuelve { ok, error }.
  async function iniciarSesion(email, password) {
    const correo = normalizarEmail(email);
    const usuario = obtenerUsuarios().find((item) => item.email === correo);
    const hash = await hashear(`${correo}:${password}`);
    if (!usuario || usuario.hash !== hash) {
      // Mensaje único para no revelar si el correo existe.
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }
    guardar(CLAVE_SESION, { email: correo });
    notificar();
    return { ok: true };
  }

  // Cierra la sesión actual.
  function cerrarSesion() {
    borrar(CLAVE_SESION);
    notificar();
  }

  // Devuelve los datos públicos del usuario con sesión iniciada (sin el hash) o null.
  function usuarioActual() {
    const sesion = leer(CLAVE_SESION, null);
    const usuario = sesion && obtenerUsuarios().find((item) => item.email === sesion.email);
    return usuario ? { nombre: usuario.nombre, email: usuario.email, telefono: usuario.telefono } : null;
  }

  // Si la sesión cambia en otra pestaña, se avisa a las vistas de esta.
  window.addEventListener('storage', (evento) => {
    if (evento.key === claveCompleta(CLAVE_SESION)) notificar();
  });

  // Se publica la API del módulo en el espacio de nombres global AlPaso.
  AlPaso.modulos.sesion = { registrar, iniciarSesion, cerrarSesion, usuarioActual };
})();
