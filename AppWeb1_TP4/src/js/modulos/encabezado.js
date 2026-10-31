/**
 * modulos/encabezado.js
 * ------------------------------------------------------------------
 * Mantiene al día el encabezado de TODAS las páginas:
 *  - la insignia del carrito con la cantidad de unidades, y
 *  - el enlace de cuenta ("Iniciar sesión" o "Hola, Nombre").
 */
import { contarUnidades } from './carrito.js';
import { usuarioActual } from './sesion.js';
import { seleccionar } from './dom.js';
import { pluralizar } from './formato.js';

export function iniciarEncabezado() {
  const enlaceCarrito = seleccionar('.carrito');
  const insignia = seleccionar('.insignia');
  const enlaceCuenta = seleccionar('.enlace-cuenta');

  // Escribe la cantidad en la insignia y actualiza el texto para lectores de pantalla.
  const actualizarCarrito = () => {
    const unidades = contarUnidades();
    if (insignia) insignia.textContent = unidades > 99 ? '99+' : String(unidades);
    if (enlaceCarrito) enlaceCarrito.setAttribute('aria-label', `Carrito de compras, ${pluralizar(unidades, 'producto', 'productos')}`);
  };

  // Cambia el enlace de cuenta según haya o no una sesión iniciada.
  const actualizarCuenta = () => {
    if (!enlaceCuenta) return;
    const usuario = usuarioActual();
    enlaceCuenta.textContent = usuario ? `Hola, ${usuario.nombre.split(' ')[0]}` : 'Iniciar sesión';
    enlaceCuenta.setAttribute('href', usuario ? 'cuenta.html' : 'cuenta.html#login');
  };

  // Se actualiza al cargar y cada vez que cambian el carrito o la sesión.
  actualizarCarrito();
  actualizarCuenta();
  document.addEventListener('carrito:cambio', actualizarCarrito);
  document.addEventListener('sesion:cambio', actualizarCuenta);
}
