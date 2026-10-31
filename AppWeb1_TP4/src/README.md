# Panadería Al Paso

Sitio web de una panadería de barrio: catálogo online, carrito dinámico, pedido en pasos (entrega, pago, confirmación) y cuenta de cliente.

## Cómo abrirlo

El código JavaScript usa **módulos ES** (`import` / `export`), que los navegadores **no ejecutan si abrís el HTML con doble clic** (`file://`). Hay que servir la carpeta con un servidor local, por ejemplo:

- **VS Code:** extensión *Live Server* → clic derecho sobre `index.html` → *Open with Live Server*.
- **Python:** `python -m http.server 8000` dentro de esta carpeta y abrir `http://localhost:8000`.
- **Node:** `npx serve .`

## Estructura

```
index.html, catalogo.html, carrito.html, entrega.html, pago.html,
confirmacion.html, cuenta.html, comoFunciona.html, ubicacion.html
css/styles.css
js/
├── principal.js        punto de entrada (carga la vista de cada página)
├── aviso-archivo.js    aviso cuando se abre con file://
├── datos/              catalogo.js, pagos.js, entrega.js (solo datos)
├── modulos/            lógica: carrito, sesión, pedidos, productos, plantillas, avisos…
├── componentes/        resumen.js (pieza reutilizable)
└── vistas/             una por página: catálogo, carrito, entrega, pago, confirmación, cuenta, inicio
recursos/imagenes/
```

## Importante

Es una **demostración sin servidor**: el pago está simulado, y las cuentas y pedidos se guardan en `localStorage` del navegador (la contraseña se guarda como hash SHA-256, solo con fines didácticos). Datos de ejemplo a reemplazar: teléfono, redes sociales y alias de transferencia (`js/datos/pagos.js`).
