import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ImageOff } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  }

  const [imgError, setImgError] = useState(false);
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0;

  return (
    <Link to={`/produit/${product.slug}`} className="group block">
      <div className="card-hover bg-white">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-sista-blush/30">
          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sista-blush to-sista-rose-light/30">
              <ImageOff size={32} className="text-sista-muted/40 mb-2" />
              <span className="text-xs text-sista-muted/60 font-body">{product.name}</span>
            </div>
          ) : (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-sista-rose text-white text-xs font-body font-semibold px-2.5 py-1">
              -{discountPercent}%
            </span>
          )}

          {/* Overlay actions */}
          <div className="absolute inset-0 bg-sista-dark/0 group-hover:bg-sista-dark/10 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="bg-sista-dark/90 text-white p-3 hover:bg-sista-gold transition-colors"
              title="Ajouter au panier"
            >
              <ShoppingBag size={18} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="bg-sista-dark/90 text-white p-3 hover:bg-sista-rose transition-colors"
              title="Ajouter aux favoris"
            >
              <Heart size={18} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category_name && (
            <p className="text-[11px] tracking-[0.2em] uppercase text-sista-muted font-body mb-1">
              {product.category_name}
            </p>
          )}
          <h3 className="font-display text-base text-sista-dark group-hover:text-sista-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-body font-semibold text-sista-gold">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="font-body text-sm text-sista-muted line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
