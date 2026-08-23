import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Minus, Plus, ChevronRight, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api, formatPrice } from '../api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    api.products.get(slug)
      .then(p => {
        setProduct(p);
        if (p.category_slug) {
          api.products.list({ category: p.category_slug, limit: '4' })
            .then(items => setRelated(items.filter(i => i.id !== p.id).slice(0, 4)))
            .catch(console.error);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} ajouté au panier`);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-sista-blush/50" />
          <div className="space-y-4 py-8">
            <div className="h-4 bg-sista-blush/50 w-1/4" />
            <div className="h-8 bg-sista-blush/50 w-3/4" />
            <div className="h-6 bg-sista-blush/50 w-1/3" />
            <div className="h-24 bg-sista-blush/50 w-full mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-sista-dark mb-4">Produit introuvable</h1>
        <Link to="/boutique" className="btn-primary">Retour à la boutique</Link>
      </div>
    );
  }

  const hasDiscount = product.compare_price && product.compare_price > product.price;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sista-blush/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm font-body text-sista-muted">
            <Link to="/" className="hover:text-sista-gold transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link to="/boutique" className="hover:text-sista-gold transition-colors">Boutique</Link>
            {product.category_name && (
              <>
                <ChevronRight size={14} />
                <Link
                  to={`/boutique?category=${product.category_slug}`}
                  className="hover:text-sista-gold transition-colors"
                >
                  {product.category_name}
                </Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-sista-dark">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="aspect-square overflow-hidden bg-sista-blush/20">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.category_name && (
              <Link
                to={`/boutique?category=${product.category_slug}`}
                className="font-body text-sm tracking-[0.2em] uppercase text-sista-gold hover:text-sista-gold-dark transition-colors mb-2"
              >
                {product.category_name}
              </Link>
            )}

            <h1 className="font-display text-3xl lg:text-4xl text-sista-dark mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-2xl text-sista-gold">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="font-body text-lg text-sista-muted line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
              {hasDiscount && (
                <span className="bg-sista-rose text-white text-xs font-body font-semibold px-2 py-0.5">
                  -{Math.round((1 - product.price / product.compare_price) * 100)}%
                </span>
              )}
            </div>

            <p className="font-body text-sista-charcoal leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className="text-sm font-body text-sista-muted">
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-sista-blush">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 text-sista-muted hover:text-sista-dark transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-body">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-3 text-sista-muted hover:text-sista-dark transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                Ajouter au panier
              </button>
              <button className="p-3 border border-sista-blush text-sista-muted hover:text-sista-rose hover:border-sista-rose transition-colors">
                <Heart size={18} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-sista-blush/50 pt-6 space-y-3">
              {[
                { icon: Truck, text: 'Livraison gratuite dès 25 000 FCFA' },
                { icon: RotateCcw, text: 'Retours gratuits sous 14 jours' },
                { icon: Shield, text: 'Paiement 100% sécurisé' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={16} className="text-sista-gold" />
                  <span className="text-sm font-body text-sista-muted">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title mb-10">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
