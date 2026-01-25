/// <reference types="vite/client" />
import { Pool } from '@neondatabase/serverless';

// Configuración de la conexión
// Asegúrate de tener VITE_DATABASE_URL en tu archivo .env
const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL,
});

// --- 1. OBTENER PRODUCTOS (Catálogo) ---
// Solo trae productos que tengan stock disponible
export const getProducts = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM productos WHERE stock > 0');
    return rows;
  } catch (error) {
    console.error('Error fetching products from Neon:', error);
    throw error;
  }
};

// --- 2. GUARDAR ORDEN Y RESTAR INVENTARIO (Checkout) ---
// Usa una transacción para asegurar que se reste el stock al comprar
export const saveOrder = async (orderData: any, cartItems: any[]) => {
  const client = await pool.connect(); // Conectamos cliente para transacción

  try {
    await client.query('BEGIN'); // Iniciamos transacción

    // A. Guardar la compra en la tabla 'compras'
    // Guardamos los items como un string JSON para referencia
    const insertOrderQuery = `
      INSERT INTO compras (
        cliente_nombre, 
        cliente_cedula, 
        cliente_telefono, 
        total_pago, 
        metodo_pago, 
        estado, 
        items,
        fecha
      ) 
      VALUES ($1, $2, $3, $4, $5, 'pendiente', $6, NOW())
      RETURNING id
    `;
    
    const values = [
      orderData.fullName,
      orderData.cedula,
      orderData.phone,
      orderData.total,
      orderData.paymentMethod,
      JSON.stringify(cartItems)
    ];

    const res = await client.query(insertOrderQuery, values);
    const orderId = res.rows[0].id;

    // B. Restar stock de cada producto comprado
    for (const item of cartItems) {
      const updateStockQuery = `
        UPDATE productos 
        SET stock = stock - $1 
        WHERE id = $2
      `;
      await client.query(updateStockQuery, [item.quantity, item.id]);
    }

    await client.query('COMMIT'); // Confirmamos todos los cambios
    return orderId;

  } catch (error) {
    await client.query('ROLLBACK'); // Si algo falla, deshacemos todo
    console.error('Error al procesar orden:', error);
    throw error;
  } finally {
    client.release(); // Liberamos el cliente
  }
};

// --- 3. OBTENER ORDENES (Para el Cajero) ---
export const getOrders = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM compras ORDER BY fecha DESC');
    return rows;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// --- 4. ACTUALIZAR ESTADO DE ORDEN (Para el Cajero) ---
export const updateOrderStatus = async (id: number, status: string) => {
  try {
    await pool.query('UPDATE compras SET estado = $1 WHERE id = $2', [status, id]);
    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};