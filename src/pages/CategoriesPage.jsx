import { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import { api } from '../api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories.list()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-sista-blush/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <span className="font-body text-sista-gold text-sm tracking-[0.3em] uppercase">
            Explorer
          </span>
          <h1 className="font-display text-4xl text-sista-dark mt-2">
            Nos Catégories
          </h1>
          <p className="section-subtitle mt-3">
            Parcourez notre univers et trouvez ce qui vous inspire
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse aspect-[4/5] bg-sista-blush/50" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-xl text-sista-dark">Aucune catégorie pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
