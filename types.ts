// types.ts
export interface Product {
  id: string | number;
  name: string;
  category: string;
  brand: string;
  price: number;        // <--- OBLIGATORIO: number
  rating: number;
  image: string;
  specs: string[];
  description?: string; // Para la descripción larga
  detalles?: string;    // Alias para la descripción larga
  stock?: number;       // Opcional
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string | number;
  nombre: string;
  email: string;
  rol: 'cliente' | 'admin' | 'cajero';
}