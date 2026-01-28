<div align="center">
<h1>Mi Proyecto — Tienda / Punto de Venta (SPA)</h1>
</div>

Descripción breve
------------------

Aplicación web de comercio y punto de venta construida con React + Vite + TypeScript. Incluye panel de administración, interfaz de cajero, catálogo de productos, carrito y proceso de pago, además de herramientas como filtro de productos y un constructor de PC.

Cómo funciona
--------------

- Frontend: Single Page Application hecha con Vite y React/TypeScript.
- Rutas y componentes manejan vistas para cliente, cajero y administrador.
- El flujo típico: el cliente navega el catálogo, usa filtros, añade productos al carrito y realiza el checkout. El cajero puede crear pedidos desde el panel de cajero. El administrador gestiona productos y pedidos desde el dashboard.

Funcionalidades principales
--------------------------

- Catálogo de productos con tarjetas y filtros (precio, categoría, búsqueda).
- Carrito de compras y resumen de pedido.
- Checkout con resumen y confirmación de compra.
- Panel de administrador: ver y gestionar pedidos y productos.
- Panel de cajero: crear pedidos rápidamente en un entorno de punto de venta.
- Componentes útiles: constructor de PC, banners promocionales, notificaciones (toast), sidebar de filtros y modal de autenticación.

Instalación y ejecución (desarrollo)
-----------------------------------

Requisitos:
- Node.js 16+ y npm o pnpm

Pasos:

```bash
# instalar dependencias
npm install

# ejecutar en modo desarrollo (Vite)
npm run dev

# generar versión de producción
npm run build

# previsualizar build (opcional)
npm run preview
```

Notas de configuración
----------------------

- No hay dependencias externas obligatorias en este repositorio por defecto. Si integras APIs externas (por ejemplo, pasarelas de pago o servicios remotos), crea un archivo `.env` o `.env.local` y añade las variables necesarias según la integración.

Contribuir
----------

- Clona el repositorio, crea una rama nueva y abre un Pull Request con la descripción de los cambios.

Archivos relevantes
-------------------

- `src` / `components`: componentes de UI (AdminDashboard, CashierDashboard, ProductCard, etc.).
- `lib/db.ts`: acceso/abstracción de datos local.
- `api/`: rutas y lógica relacionada con pedidos, autenticación y productos.

Contacto
-------

Para dudas o mejoras, abre una issue en el repositorio.


✒️ Autor
Zeinab Muslumani 🌼 - Desarrollo Full Stack & Diseño