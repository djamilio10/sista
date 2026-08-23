import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api, formatPrice } from '../api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    city: '',
  });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone || !form.address) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setLoading(true);
    try {
      const order = await api.orders.create({
        ...form,
        items: cart.map(({ product, quantity }) => ({
          product_id: product.id,
          quantity,
        })),
      });
      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0 && !orderComplete) {
    navigate('/panier');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <CheckCircle size={64} className="text-green-500 mb-6" />
        <h1 className="font-display text-3xl text-sista-dark mb-3">
          Commande confirmée !
        </h1>
        <p className="text-sista-muted font-body mb-2 max-w-md">
          Merci pour votre commande #{orderId}. Vous recevrez une confirmation par téléphone.
        </p>
        <p className="text-sista-muted font-body mb-8 max-w-md">
          Notre équipe vous contactera pour organiser la livraison.
        </p>
        <Link to="/boutique" className="btn-primary">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  const shipping = cartTotal >= 25000 ? 0 : 2500;
  const total = cartTotal + shipping;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sista-blush/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm font-body text-sista-muted">
            <Link to="/panier" className="hover:text-sista-gold transition-colors">Panier</Link>
            <ChevronRight size={14} />
            <span className="text-sista-dark">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl text-sista-dark mb-8">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-sista-blush/50 p-6">
              <h2 className="font-display text-xl text-sista-dark mb-6">Informations de livraison</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-body text-sista-muted mb-1.5">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Votre nom et prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-sista-muted mb-1.5">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={form.customer_phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="+221 77 000 00 00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-sista-muted mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={form.customer_email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-body text-sista-muted mb-1.5">
                    Adresse de livraison *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Rue, quartier, point de repère..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-body text-sista-muted mb-1.5">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Dakar"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-sista-blush/50 p-6">
              <h2 className="font-display text-xl text-sista-dark mb-4">Mode de paiement</h2>
              <p className="text-sm text-sista-muted font-body">
                Paiement à la livraison (Cash ou Mobile Money). Notre livreur vous contactera pour confirmer.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : `Confirmer — ${formatPrice(total)}`}
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-sista-blush/50 p-6 sticky top-28">
              <h2 className="font-display text-xl text-sista-dark mb-6">Votre commande</h2>

              <div className="space-y-3 mb-4">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-14 h-14 object-cover bg-sista-blush/20 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-sista-dark truncate">{product.name}</p>
                      <p className="text-xs text-sista-muted">x{quantity}</p>
                    </div>
                    <p className="text-sm font-body text-sista-dark whitespace-nowrap">
                      {formatPrice(product.price * quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-sista-blush/50 pt-4 space-y-2">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-sista-muted">Sous-total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-sista-muted">Livraison</span>
                  <span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-sista-blush/50">
                  <span className="font-body font-semibold text-sm uppercase tracking-wide">Total</span>
                  <span className="font-display text-xl text-sista-gold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
