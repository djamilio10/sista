import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    api.categories.list().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (searchTerm) params.search = searchTerm;

    api.products.list(params)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, searchTerm]);

  function setCategory(slug) {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  }

  const activeCategoryName = categories.find(c => c.slug === activeCategory)?.name;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-sista-blush/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <span className="font-body text-sista-gold text-sm tracking-[0.3em] uppercase">
            {activeCategoryName || 'Tous les produits'}
          </span>
          <h1 className="font-display text-4xl text-sista-dark mt-2">
            Notre Boutique
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-body text-sista-charcoal hover:text-sista-gold transition-colors lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filtres
            </button>
            <p className="text-sm text-sista-muted font-body">
              {products.length} produit{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sista-muted" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-sm"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-56 flex-shrink-0`}>
            <div className="sticky top-28">
              <h3 className="font-display text-lg text-sista-dark mb-4">Catégories</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setCategory('')}
                    className={`w-full text-left py-2 px-3 text-sm font-body transition-colors ${
                      !activeCategory
                        ? 'text-sista-gold bg-sista-gold/5 font-medium'
                        : 'text-sista-charcoal hover:text-sista-gold'
                    }`}
                  >
                    Tout voir
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setCategory(cat.slug)}
                      className={`w-full text-left py-2 px-3 text-sm font-body transition-colors flex justify-between ${
                        activeCategory === cat.slug
                          ? 'text-sista-gold bg-sista-gold/5 font-medium'
                          : 'text-sista-charcoal hover:text-sista-gold'
                      }`}
                    >
                      {cat.name}
                      <span className="text-sista-muted text-xs">({cat.product_count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {/* Active filter tags */}
            {(activeCategory || searchTerm) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCategoryName && (
                  <span className="inline-flex items-center gap-1.5 bg-sista-gold/10 text-sista-gold text-sm font-body px-3 py-1">
                    {activeCategoryName}
                    <button onClick={() => setCategory('')}><X size={14} /></button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 bg-sista-gold/10 text-sista-gold text-sm font-body px-3 py-1">
                    "{searchTerm}"
                    <button onClick={() => setSearchTerm('')}><X size={14} /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-sista-blush/50" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-sista-blush/50 w-1/3" />
                      <div className="h-4 bg-sista-blush/50 w-2/3" />
                      <div className="h-4 bg-sista-blush/50 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-xl text-sista-dark mb-2">
                  Aucun produit trouvé
                </p>
                <p className="text-sista-muted font-body">
                  Essayez avec d'autres critères de recherche
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
