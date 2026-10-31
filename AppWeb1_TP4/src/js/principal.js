/**
 * principal.js
 * ------------------------------------------------------------------
 * PUNTO DE ENTRADA ÚNICO. Todas las páginas cargan este módulo con
 *   <script type="module" src="js/principal.js"></script>
 * Aquí se inicia lo común (encabezado y avisos) y se carga, bajo demanda,
 * la vista que corresponde a la página según el atributo data-pagina del <body>.
 */
import { iniciarEncabezado } from './modulos/encabezado.js';
import { iniciarAvisos, mostrarAviso } from './modulos/avisos.js';

// Tabla de rutas: nombre de página -> función que importa su módulo y lo inicia.
// import() dinámico: el código de cada vista se descarga solo cuando hace falta.
const vistas = {
  inicio:       () => import('./vistas/inicio.js').then((modulo) => modulo.iniciarInicio()),
  catalogo:     () => import('./vistas/catalogo.js').then((modulo) => modulo.iniciarCatalogo()),
  carrito:      () => import('./vistas/carrito.js').then((modulo) => modulo.iniciarCarrito()),
  entrega:      () => import('./vistas/entrega.js').then((modulo) => modulo.iniciarEntrega()),
  pago:         () => import('./vistas/pago.js').then((modulo) => modulo.iniciarPago()),
  confirmacion: () => import('./vistas/confirmacion.js').then((modulo) => modulo.iniciarConfirmacion()),
  cuenta:       () => import('./vistas/cuenta.js').then((modulo) => modulo.iniciarCuenta()),
};

// Función asíncrona que arranca la página actual.
async function iniciar() {
  iniciarAvisos();
  iniciarEncabezado();
  const iniciarVista = vistas[document.body.dataset.pagina];
  if (!iniciarVista) return; // páginas informativas: solo encabezado
  try {
    await iniciarVista();
  } catch (error) {
    console.error('Error al iniciar la página:', error);
    mostrarAviso('Ocurrió un error al cargar esta página.', 'error', 6000);
  }
}

iniciar();
