import React from 'react';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 flex flex-col h-full">
      {/* Badge */}
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white z-10 border border-slate-700">
        {product.brand}
      </div>

      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-slate-900 p-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay Action */}
        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-cyan-500 text-slate-900 font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
          >
            Agregar al Carrito
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span>{product.rating}</span>
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow min-h-[60px]">
  {product.description || product.category}
</p>

        {/* Specs Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.specs.slice(0, 2).map((spec, idx) => (
            <span key={idx} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded border border-slate-600">
              {spec}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-slate-500">Precio</p>
            <p className="text-2xl font-bold text-white">${product.price}</p>
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="md:hidden bg-slate-700 p-2 rounded-lg text-white active:bg-cyan-500 active:text-slate-900 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
