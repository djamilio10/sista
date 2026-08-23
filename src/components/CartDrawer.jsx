import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../api';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-sista-dark/30 backdrop-blur-sm z-[60] animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sista-blush">
          <h2 className="font-display text-xl text-sista-dark">
            Votre Panier ({cart.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-sista-muted hover:text-sista-dark transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-sista-blush mb-4" />
              <p className="font-display text-lg text-sista-dark mb-2">
                Votre panier est vide
              </p>
              <p className="text-sm text-sista-muted mb-6">
                Découvrez nos produits et laissez-vous tenter !
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-primary text-xs"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 pb-4 border-b border-sista-blush/50 last:border-0">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-20 h-20 object-cover bg-sista-blush/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm text-sista-dark truncate">
                      {product.name}
                    </h3>
                    <p className="text-sista-gold font-body font-semibold text-sm mt-1">
                      {formatPrice(product.price)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-sista-blush">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="p-1 text-sista-muted hover:text-sista-dark disabled:opacity-30 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-body">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 text-sista-muted hover:text-sista-dark transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-1 text-sista-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-sista-blush p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-body text-sista-muted uppercase text-sm tracking-wide">
                Sous-total
              </span>
              <span className="font-display text-xl text-sista-dark">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <p className="text-xs text-sista-muted">
              Frais de livraison calculés à l'étape suivante
            </p>
            <Link
              to="/panier"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary block text-center w-full"
            >
              Voir le panier
            </Link>
            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="btn-outline block text-center w-full"
            >
              Commander
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
