import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../api';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={64} className="text-sista-blush mb-6" />
        <h1 className="font-display text-3xl text-sista-dark mb-3">Votre panier est vide</h1>
        <p className="text-sista-muted font-body mb-8 max-w-md">
          Parcourez notre boutique et découvrez nos produits soigneusement sélectionnés pour vous.
        </p>
        <Link to="/boutique" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} />
          Continuer mes achats
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl text-sista-dark mb-8">Votre Panier</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 border border-sista-blush/50">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover bg-sista-blush/20 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <Link
                      to={`/produit/${product.slug}`}
                      className="font-display text-base sm:text-lg text-sista-dark hover:text-sista-gold transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    {product.category_name && (
                      <p className="text-xs text-sista-muted mt-0.5">{product.category_name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1 text-sista-muted hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-center border border-sista-blush">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 text-sista-muted hover:text-sista-dark disabled:opacity-30 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm font-body">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-2 text-sista-muted hover:text-sista-dark transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-display text-lg text-sista-gold">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="text-sm text-sista-muted hover:text-red-500 transition-colors font-body"
          >
            Vider le panier
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-sista-blush/50 p-6 sticky top-28">
            <h2 className="font-display text-xl text-sista-dark mb-6">Récapitulatif</h2>

            <div className="space-y-3 border-b border-sista-blush/50 pb-4 mb-4">
              <div className="flex justify-between font-body text-sm">
                <span className="text-sista-muted">Sous-total</span>
                <span className="text-sista-dark">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-sista-muted">Livraison</span>
                <span className="text-sista-dark">
                  {cartTotal >= 25000 ? 'Gratuite' : formatPrice(2500)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="font-body font-semibold text-sista-dark uppercase tracking-wide text-sm">
                Total
              </span>
              <span className="font-display text-2xl text-sista-gold">
                {formatPrice(cartTotal + (cartTotal >= 25000 ? 0 : 2500))}
              </span>
            </div>

            {cartTotal < 25000 && (
              <p className="text-xs text-sista-muted mb-4 font-body">
                Plus que {formatPrice(25000 - cartTotal)} pour la livraison gratuite !
              </p>
            )}

            <Link to="/checkout" className="btn-primary block text-center w-full mb-3">
              Passer la commande
            </Link>
            <Link
              to="/boutique"
              className="block text-center text-sm text-sista-muted hover:text-sista-gold transition-colors font-body"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
