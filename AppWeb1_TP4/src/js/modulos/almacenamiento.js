/**
 * modulos/almacenamiento.js
 * ------------------------------------------------------------------
 * Capa fina sobre localStorage. Centraliza dos cosas:
 *  1) un prefijo común para todas las claves del sitio, y
 *  2) el manejo de errores (modo privado, almacenamiento lleno, JSON dañado).
 * El resto de los módulos nunca llama a localStorage directamente.
 */
const PREFIJO = 'alpaso.';

// Devuelve el nombre real de la clave con el prefijo del sitio.
export const claveCompleta = (nombre) => `${PREFIJO}${nombre}`;

// Lee un valor guardado. Si no existe o está dañado, devuelve "valorPorDefecto".
export function leer(nombre, valorPorDefecto = null) {
  try {
    const texto = localStorage.getItem(claveCompleta(nombre));
    return texto === null ? valorPorDefecto : JSON.parse(texto);
  } catch (error) {
    console.warn(`No se pudo leer "${nombre}":`, error);
    return valorPorDefecto;
  }
}

// Guarda un valor (convertido a JSON). Devuelve true si se pudo guardar.
export function guardar(nombre, valor) {
  try {
    localStorage.setItem(claveCompleta(nombre), JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn(`No se pudo guardar "${nombre}":`, error);
    return false;
  }
}

// Elimina un valor guardado.
export const borrar = (nombre) => {
  try {
    localStorage.removeItem(claveCompleta(nombre));
  } catch (error) {
    console.warn(`No se pudo borrar "${nombre}":`, error);
  }
};
