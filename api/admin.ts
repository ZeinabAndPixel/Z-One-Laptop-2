import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL || process.env.VITE_DATABASE_URL);

  // Verificación básica de seguridad (en producción usaríamos tokens reales)
  const { action, product } = req.body;

  try {
    // 1. AGREGAR PRODUCTO
    if (req.method === 'POST' && action === 'create') {
      const { nombre, marca, categoria, precio, stock, imagen_url, descripcion, detalles } = product;
      
      await sql`
        INSERT INTO productos (nombre, marca, categoria, precio, stock, imagen_url, descripcion, detalles)
        VALUES (${nombre}, ${marca}, ${categoria}, ${precio}, ${stock}, ${imagen_url}, ${descripcion}, ${detalles})
      `;
      return res.status(201).json({ message: 'Producto creado' });
    }

    // 2. ACTUALIZAR PRODUCTO (Editar stock, precio, etc.)
    if (req.method === 'PUT') {
      const { id, nombre, marca, categoria, precio, stock, imagen_url, descripcion, detalles } = product;
      
      await sql`
        UPDATE productos 
        SET nombre=${nombre}, marca=${marca}, categoria=${categoria}, 
            precio=${precio}, stock=${stock}, imagen_url=${imagen_url}, 
            descripcion=${descripcion}, detalles=${detalles}
        WHERE id=${id}
      `;
      return res.status(200).json({ message: 'Producto actualizado' });
    }

    // 3. ELIMINAR PRODUCTO
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM productos WHERE id=${id}`;
      return res.status(200).json({ message: 'Producto eliminado' });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error: any) {
    console.error("Error Admin:", error);
    return res.status(500).json({ error: error.message });
  }
}