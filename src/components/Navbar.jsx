import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/boutique', label: 'Boutique' },
    { to: '/categories', label: 'Catégories' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-sista-cream/95 backdrop-blur-md border-b border-sista-blush/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-sista-dark hover:text-sista-gold transition-colors"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Nav links - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm tracking-wider uppercase transition-colors duration-300 ${
                  isActive(link.to)
                    ? 'text-sista-gold'
                    : 'text-sista-charcoal hover:text-sista-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 group">
            <div className="text-center relative">
              <span className="block font-display text-sista-gold text-2xl leading-none logo-ampersand select-none" aria-hidden="true">
                &amp;
              </span>
              <h1 className="font-display text-3xl tracking-[0.3em] text-sista-dark -mt-1">
                SISTA
              </h1>
              <p className="text-[9px] tracking-[0.35em] uppercase text-sista-muted font-body mt-0.5">
                L'élégance au quotidien
              </p>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/boutique"
              className="hidden sm:block p-2 text-sista-charcoal hover:text-sista-gold transition-colors"
            >
              <Search size={20} />
            </Link>
            <Link
              to="/admin"
              className="hidden sm:block p-2 text-sista-charcoal hover:text-sista-gold transition-colors"
              title="Administration"
            >
              <User size={20} />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-sista-charcoal hover:text-sista-gold transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-sista-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="lg:hidden border-t border-sista-blush bg-sista-cream animate-fade-in">
          <nav className="flex flex-col py-4 px-6 gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileOpen(false)}
                className={`py-3 font-body text-sm tracking-wider uppercase transition-colors ${
                  isActive(link.to) ? 'text-sista-gold' : 'text-sista-charcoal'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setIsMobileOpen(false)}
              className="py-3 font-body text-sm tracking-wider uppercase text-sista-charcoal"
            >
              Administration
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
