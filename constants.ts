import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Z-Blade Raider X9",
    category: "Laptops",
    brand: "Asus",
    price: 2499,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
    specs: ["RTX 4090", "32GB RAM", "i9-13900K"]
  },
  {
    id: 2,
    name: "Neon Scepter 15",
    category: "Laptops",
    brand: "Razer",
    price: 1899,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800",
    specs: ["RTX 4070", "16GB RAM", "Ryzen 9"]
  },
  {
    id: 3,
    name: "Hyperion Core GPU",
    category: "Componentes",
    brand: "Nvidia",
    price: 1599,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    specs: ["24GB VRAM", "DLSS 3.0", "OC Edition"]
  },
  {
    id: 4,
    name: "Quantum Curved 34",
    category: "Monitores",
    brand: "Samsung",
    price: 899,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
    specs: ["165Hz", "1ms", "QD-OLED"]
  },
  {
    id: 5,
    name: "MechStrike Pro",
    category: "Periféricos",
    brand: "Logitech",
    price: 149,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800",
    specs: ["Wireless", "RGB", "Tactile"]
  },
  {
    id: 6,
    name: "Stealth Ultrabook",
    category: "Laptops",
    brand: "MSI",
    price: 1299,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800",
    specs: ["RTX 4060", "Thin & Light", "1TB SSD"]
  },
  {
    id: 7,
    name: "Ryzen 9 7950X3D",
    category: "Componentes",
    brand: "AMD",
    price: 699,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1555618254-71a83705a1a4?auto=format&fit=crop&q=80&w=800",
    specs: ["16 Cores", "144MB Cache", "AM5"]
  },
  {
    id: 8,
    name: "G Pro X Superlight",
    category: "Periféricos",
    brand: "Logitech",
    price: 159,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800",
    specs: ["< 63g", "Hero 25K", "Wireless"]
  }
];

// Extract unique categories and brands for filtering
export const CATEGORIES = ["Todos", ...new Set(PRODUCTS.map(p => p.category))];
export const BRANDS = ["Todas", ...new Set(PRODUCTS.map(p => p.brand))];
