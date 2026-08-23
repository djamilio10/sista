import { Link } from 'react-router-dom';
import { Instagram, Facebook, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-sista-dark text-sista-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-display text-xl text-sista-gold leading-none">&amp;</span>
            <h2 className="font-display text-2xl tracking-[0.3em] text-white -mt-1 mb-2">SISTA</h2>
            <p className="text-xs tracking-[0.3em] uppercase text-sista-gold mb-4">
              L'élégance au quotidien
            </p>
            <p className="text-sm leading-relaxed text-sista-cream/60">
              Votre destination shopping pour découvrir des produits soigneusement sélectionnés, alliant qualité et élégance.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-lg text-white mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/boutique', label: 'Boutique' },
                { to: '/categories', label: 'Catégories' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-sista-cream/60 hover:text-sista-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-display text-lg text-white mb-4">Informations</h3>
            <ul className="space-y-2.5 text-sm text-sista-cream/60">
              <li>Livraison gratuite dès 25 000 FCFA</li>
              <li>Retours sous 14 jours</li>
              <li>Paiement sécurisé</li>
              <li>Service client 7j/7</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg text-white mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm text-sista-cream/60">
              <li>contact@sista-boutique.com</li>
              <li>+221 77 000 00 00</li>
              <li>Dakar, Sénégal</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-sista-cream/60 hover:text-sista-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-sista-cream/60 hover:text-sista-gold transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-sista-cream/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sista-cream/40">
            &copy; {new Date().getFullYear()} SISTA. Tous droits réservés.
          </p>
          <p className="text-xs text-sista-cream/40 flex items-center gap-1">
            Fait avec <Heart size={12} className="text-sista-rose" /> au Sénégal
          </p>
        </div>
      </div>
    </footer>
  );
}
