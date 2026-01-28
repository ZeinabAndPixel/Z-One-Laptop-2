# Documentación del proyecto — Tienda / Punto de Venta (SPA)

Resumen
-------

Aplicación Single Page (React + Vite + TypeScript) para gestionar un catálogo de productos, realizar ventas (checkout), y operar como punto de venta (cajero) y panel de administración.

Cómo funciona (visión general)
--------------------------------
- El frontend (React) presenta vistas para cliente, cajero y administrador.
- Las operaciones de datos usan la capa `lib/db.ts` (conexión a Neon/Postgres) que exporta funciones como `getProducts`, `getAllProducts`, `saveOrder`, `getOrders`, `updateOrderStatus`.
- Las rutas en `api/` actúan como endpoints que el frontend puede consumir (p. ej. para crear/editar productos o guardar pedidos).

Estructura de carpetas y archivos importantes
--------------------------------------------
- **`App.tsx`**: Punto de entrada de la aplicación; monta rutas y contexto global.
- **`index.tsx` / `index.html`**: Arranque del bundle Vite y punto de montaje React.
- **`components/`**: Componentes de UI principales. Punto rápido de referencia:
  - `AdminDashboard.tsx`: Panel para gestionar productos y ver inventario/ordenes.
  - `CashierDashboard.tsx`: Interfaz rápida para crear pedidos en mostrador.
  - `Checkout.tsx`: Flujo de pago y formulario de compra.
  - `CustomerOrders.tsx`: Vista para que clientes revisen sus pedidos.
  - `FilterSidebar.tsx`: Sidebar con filtros para el catálogo.
  - `Hero.tsx`, `Navbar.tsx`, `ProductCard.tsx`, `PromoBanners.tsx`, `Toast.tsx`: componentes UI reutilizables.
  - `PCBuilder.tsx`: Constructor de PC que ayuda a seleccionar componentes y añadirlos al carrito.
  - `AuthModal.tsx`: Modal de autenticación / login.
  - `CartDrawer.tsx`: Drawer lateral para revisar el carrito.

- **`api/`**: Lógica de endpoints del servidor (puede ser usada por fetch desde el frontend):
  - `admin.ts`: Endpoints para crear/editar/eliminar productos.
  - `auth.ts`: Autenticación (login/logout, sesiones).
  - `orders.ts`: Endpoints para crear y consultar pedidos.
  - `products.ts`: Endpoints para listar productos.

- **`lib/db.ts`**: Capa de acceso a la base de datos. Funciones clave:
  - `getProducts()`: retorna productos con stock > 0 (uso para catálogo público).
  - `getAllProducts()`: retorna todos los productos (uso en admin).
  - `saveOrder(orderData, cartItems)`: guarda un pedido, crea/actualiza cliente, resta stock, y retorna el ID de la orden.
  - `getOrders()`, `updateOrderStatus(id, status)`: leer y actualizar pedidos.

- **`types.ts`**: Definiciones TypeScript (por ej. `Product`, `Order`).
- **`constants.ts`**: Constantes compartidas de la app.
- **`vite.config.ts`, `tsconfig.json`, `package.json`**: configuración de build y dependencias.

Variables de entorno importantes
-------------------------------
- `VITE_DATABASE_URL` o `DATABASE_URL`: cadena de conexión a la base de datos (Neon/Postgres). Debe definirse en el entorno o en un `.env` / `.env.local` cuando sea necesario.
- Otras variables de integración (p. ej. claves para pasarelas de pago) no están incluidas por defecto; agrégalas en `.env` si integras servicios externos.

Scripts útiles (desde `package.json`)
-----------------------------------
- `npm install`: instala dependencias.
- `npm run dev`: inicia el servidor de desarrollo (Vite).
- `npm run build`: genera la versión de producción.
- `npm run preview`: previsualiza el build.

Puntos de integración y flujo de datos
-------------------------------------
- El catálogo público usa `getProducts()` para mostrar solo productos con stock.
- El `AdminDashboard` usa `getAllProducts()` para listar todos los productos (incluso sin stock) y permite crear/editar/eliminar vía `api/admin`.
- El `Checkout` llama a un endpoint (`api/orders` o similar) que a su vez puede usar `saveOrder` en `lib/db.ts` para persistir y restar stock.

Consejos para desarrolladores
-----------------------------
- Para agregar un nuevo componente, colócalo en `components/` y exporta un prop-driven API (props controlables). Sigue el estilo de los componentes existentes.
- Mantén la lógica de acceso a DB dentro de `lib/db.ts` y usa funciones exportadas en `api/` o componentes de servidor.
- Evita import dinámico a menos que realmente necesites code-splitting; preferir importaciones estáticas evita advertencias de Vite y hace el análisis más predecible.

Cómo leer el código rápidamente
------------------------------
- Si buscas la lógica de pedidos: empieza en `components/Checkout.tsx`, luego sigue a `api/orders.ts` y por último `lib/db.ts` (`saveOrder`).
- Para ver el flujo de productos: `components/ProductCard.tsx` → `components/FilterSidebar.tsx` → `api/products.ts` → `lib/db.ts` (`getProducts`).
- Para tareas administrativas: `components/AdminDashboard.tsx` y `api/admin.ts`.

Contribuciones y buenas prácticas
--------------------------------
- Crea ramas temáticas (`feat/`, `fix/`, `chore/`) y abre Pull Requests claros con la descripción del cambio.
- Agrega pruebas y pruebas manuales para flujos críticos (checkout y restado de stock).

Archivos de referencia rápida
---------------------------
- [README.md](README.md): guía general y comando de instalación.
- [lib/db.ts](lib/db.ts): funciones de acceso a datos.
- [components/PCBuilder.tsx](components/PCBuilder.tsx): ejemplo de componente complejo con selección multi-paso.

Si quieres, puedo:
- Añadir diagramas simples del flujo de datos (ERD o secuencia de checkout).
- Generar una versión en HTML/MD precisa para publicar en la wiki del repositorio.