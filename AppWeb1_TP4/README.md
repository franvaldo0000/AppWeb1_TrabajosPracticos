# Panadería Al Paso

Sitio web de una panadería de barrio: catálogo online, carrito dinámico, pedido en pasos (entrega, pago, confirmación) y cuenta de cliente.

## Cómo abrirlo

Hacé doble clic sobre `index.html`. Se recomienda **Chrome o Edge**.

El código JavaScript usa el *patrón módulo* (scripts clásicos con un espacio de nombres `AlPaso`), por lo que **no necesita servidor**. Si usás **Firefox** y el carrito no se conserva al pasar de una página a otra, abrí el sitio con un servidor local:

- **VS Code:** extensión *Live Server* → clic derecho sobre `index.html` → *Open with Live Server*.
- **Python:** `python -m http.server 8000` dentro de esta carpeta y abrir `http://localhost:8000`.
- **Node:** `npx serve .`

## Estructura

```
index.html, catalogo.html, carrito.html, entrega.html, pago.html,
confirmacion.html, cuenta.html, comoFunciona.html, ubicacion.html
css/styles.css
js/
├── nucleo.js           crea el espacio de nombres AlPaso (se carga primero)
├── principal.js        punto de entrada (inicia la vista de cada página; se carga último)
├── datos/              catalogo.js, pagos.js, entrega.js (solo datos)
├── modulos/            lógica: carrito, sesión, pedidos, productos, plantillas, avisos…
├── componentes/        resumen.js (pieza reutilizable)
└── vistas/             una por página: catálogo, carrito, entrega, pago, confirmación, cuenta, inicio
recursos/imagenes/
```

Cada página carga sus scripts con `<script defer>` en orden de dependencias: primero `nucleo.js`, después los módulos que necesita y al final `principal.js`. Si agregás un módulo nuevo, incluilo en el HTML antes del archivo que lo usa.

## Importante

Es una **demostración sin servidor**: el pago está simulado, y las cuentas y pedidos se guardan en `localStorage` del navegador (la contraseña se guarda como hash SHA-256, solo con fines didácticos). Datos de ejemplo a reemplazar: teléfono, redes sociales y alias de transferencia (`js/datos/pagos.js`).
