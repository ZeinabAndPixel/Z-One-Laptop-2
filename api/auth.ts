import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Asegúrate de tener DATABASE_URL en tus variables de entorno de Vercel (y en .env local)
  const sql = neon(process.env.DATABASE_URL);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, email, password, nombre, cedula, telefono, direccion } = req.body;

  try {
    // --- REGISTRO ---
    if (action === 'register') {
      // 1. Verificar si el usuario ya existe
      const existingUser = await sql`SELECT * FROM usuarios WHERE email = ${email}`;
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'El correo ya está registrado.' });
      }

      // 2. Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      // 3. Insertar usuario
      const newUser = await sql`
        INSERT INTO usuarios (nombre_completo, email, password_hash, cedula, telefono, direccion)
        VALUES (${nombre}, ${email}, ${hash}, ${cedula}, ${telefono}, ${direccion})
        RETURNING id, nombre_completo, email, cedula, telefono, direccion
      `;

      return res.status(201).json({ user: newUser[0], message: 'Usuario creado con éxito' });
    }

    // --- LOGIN ---
    if (action === 'login') {
      // 1. Buscar usuario
      const users = await sql`SELECT * FROM usuarios WHERE email = ${email}`;
      if (users.length === 0) {
        return res.status(400).json({ error: 'Credenciales inválidas.' });
      }

      const user = users[0];

      // 2. Comparar contraseñas
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Credenciales inválidas.' });
      }

      // 3. Retornar datos del usuario (SIN el hash)
      const { password_hash, ...userData } = user;
      return res.status(200).json({ user: userData, message: 'Bienvenido' });
    }

    return res.status(400).json({ error: 'Acción no válida' });

  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(500).json({ error: 'Error del servidor', details: error.message });
  }
}