import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/boutique?category=${category.slug}`}
      className="group relative block overflow-hidden aspect-[4/5] bg-sista-blush/30"
    >
      {!imgError ? (
        <img
          src={category.image_url}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sista-gold/20 via-sista-blush to-sista-rose-light/40" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-sista-dark/70 via-sista-dark/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-xl text-white mb-1">
          {category.name}
        </h3>
        <p className="text-sm text-white/70 font-body mb-3 line-clamp-2">
          {category.description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sista-gold text-sm font-body tracking-wide uppercase group-hover:gap-3 transition-all">
          Découvrir <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
