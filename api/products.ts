import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // 1. Conexión segura a Neon
  const sql = neon(process.env.DATABASE_URL);

  // 2. Obtener la categoría que pide el Frontend
  // En Vercel Functions, los parámetros vienen en req.query
  const { categoria } = req.query;

  try {
    let result;

    // 3. Lógica especial: Si el paso es "Fuentes de Poder", traemos también "Gabinetes"
    // para que el usuario vea opciones (ya que tu UI agrupa estos pasos)
    if (categoria === 'Fuentes de Poder') {
      result = await sql`
        SELECT * FROM productos 
        WHERE categoria = 'Fuentes de Poder' OR categoria = 'Gabinetes'
      `;
    } else {
      // Consulta normal
      result = await sql`
        SELECT * FROM productos 
        WHERE categoria = ${categoria}
      `;
    }

    // 4. Responder al Frontend con JSON
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error en base de datos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
