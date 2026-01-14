/// <reference types="vite/client" />
import { Pool } from '@neondatabase/serverless';

// Configuración de la conexión a Neon
const pool = new Pool({ 
  connectionString: import.meta.env.VITE_DATABASE_URL
});

// ... resto de tu código (getProducts, saveOrder, etc.)

// Función original para obtener productos
export const getProducts = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM productos');
    return rows;
  } catch (error) {
    console.error('Error fetching products from Neon:', error);
    throw error;
  }
};

/**
 * NUEVA FUNCIÓN: Registrar Cliente y Compra
 */
export const saveOrder = async (clientData: any, total: number) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Guardar o actualizar datos usando la Cédula como ID ($1)
    const customerQuery = `
      INSERT INTO clientes (id, nombre_completo, correo, telefono, direccion)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET 
        nombre_completo = EXCLUDED.nombre_completo,
        correo = EXCLUDED.correo
      RETURNING id
    `;
    const customerRes = await client.query(customerQuery, [
      clientData.cedula, // <--- Ahora pasamos la cédula aquí
      clientData.name, 
      clientData.email, 
      clientData.phone, 
      clientData.address
    ]);
    const customerId = customerRes.rows[0].id;

    // 2. Registrar la compra vinculada a esa Cédula
    const purchaseQuery = `
      INSERT INTO compras (cliente_id, total_pago, metodo_pago)
      VALUES ($1, $2, $3)
    `;
    await client.query(purchaseQuery, [customerId, total, 'Pago Directo']);

    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error en la DB:", error);
    throw error;
  } finally {
    client.release();
  }
};