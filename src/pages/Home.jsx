import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { api } from '../api';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    api.categories.list().then(setCategories).catch(console.error);
    api.products.list({ featured: '1', limit: '4' }).then(setFeatured).catch(console.error);
    api.products.list({ limit: '8' }).then(setNewArrivals).catch(console.error);
  }, []);

  const features = [
    { icon: Truck, title: 'Livraison Rapide', desc: 'Partout au Sénégal' },
    { icon: Shield, title: 'Paiement Sécurisé', desc: '100% sécurisé' },
    { icon: RotateCcw, title: 'Retours Gratuits', desc: 'Sous 14 jours' },
    { icon: Headphones, title: 'Support 7j/7', desc: 'À votre écoute' },
  ];

  return (
    <div>
      <Hero />

      {/* Features bar */}
      <section className="bg-white border-y border-sista-blush/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 justify-center">
                <Icon size={24} className="text-sista-gold flex-shrink-0" />
                <div>
                  <p className="font-body font-semibold text-sm text-sista-dark">{title}</p>
                  <p className="font-body text-xs text-sista-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="font-body text-sista-gold text-sm tracking-[0.3em] uppercase">
                Explorer
              </span>
              <h2 className="section-title mt-2">Nos Catégories</h2>
              <p className="section-subtitle">
                Parcourez notre sélection soigneusement organisée
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categories.slice(0, 6).map(cat => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="font-body text-sista-gold text-sm tracking-[0.3em] uppercase">
                Sélection
              </span>
              <h2 className="section-title mt-2">Coups de Cœur</h2>
              <p className="section-subtitle">
                Nos produits favoris, choisis avec amour pour vous
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/boutique" className="btn-outline inline-flex items-center gap-2 group">
                Voir tout
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Promo banner */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&h=600&q=80)' }}
        >
          <div className="absolute inset-0 bg-sista-dark/60" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <span className="font-body text-sista-gold text-sm tracking-[0.3em] uppercase">
            Offre exclusive
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white mt-3 mb-4">
            -20% sur votre première commande
          </h2>
          <p className="text-white/80 font-body mb-8 max-w-md mx-auto">
            Utilisez le code BIENVENUE20 lors de votre première commande et profitez d'une réduction exclusive.
          </p>
          <Link to="/boutique" className="btn-primary inline-flex items-center gap-2">
            En profiter maintenant
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="font-body text-sista-gold text-sm tracking-[0.3em] uppercase">
                Fraîchement arrivés
              </span>
              <h2 className="section-title mt-2">Nouveautés</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 bg-sista-blush/30">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl text-sista-dark mb-3">
            Restez Inspirée
          </h2>
          <p className="text-sista-muted font-body mb-8">
            Inscrivez-vous pour recevoir nos nouveautés et offres exclusives en avant-première.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-0">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
