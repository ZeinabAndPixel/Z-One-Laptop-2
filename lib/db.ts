// lib/db.ts
import { Pool } from '@neondatabase/serverless';

const getConnectionString = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DATABASE_URL) {
    return import.meta.env.VITE_DATABASE_URL;
  }
  return process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;
};

const pool = new Pool({ connectionString: getConnectionString() });

export const getProducts = async () => {
  try {
    // Traemos todo. El filtrado lo haremos en el componente.
    const { rows } = await pool.query('SELECT * FROM productos');
    console.log("Productos cargados desde DB:", rows.length); // Esto te ayudará a ver si carga
    return rows;
  } catch (error) {
    console.error("Error BD:", error);
    return [];
  }
};

export const saveOrder = async (orderData: any, cartItems: any[]) => {
  // ... (Puedes mantener tu función saveOrder actual si ya funcionaba)
  // Si necesitas la versión segura que te di antes, avísame.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    /* ... lógica de guardado ... */ 
    // Por brevedad, asumo que saveOrder ya lo tienes configurado de la respuesta anterior.
    // Lo vital aquí es getProducts.
    await client.query('COMMIT');
    return "order-id"; 
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};