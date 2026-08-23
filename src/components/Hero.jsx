import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&h=900&q=80',
    subtitle: 'Nouvelle Collection',
    title: 'L\'Art de\nl\'Élégance',
    description: 'Découvrez des pièces uniques sélectionnées avec soin pour sublimer votre style au quotidien.',
    cta: 'Découvrir',
    link: '/boutique',
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&h=900&q=80',
    subtitle: 'Sélection Premium',
    title: 'Beauté &\nBien-Être',
    description: 'Des produits de qualité pour une femme qui sait ce qu\'elle veut.',
    cta: 'Explorer',
    link: '/categories',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&h=900&q=80',
    subtitle: 'Tendances',
    title: 'Style &\nConfiance',
    description: 'Exprimez votre personnalité avec des pièces qui vous ressemblent.',
    cta: 'Voir la boutique',
    link: '/boutique',
  },
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&h=900&q=80',
    subtitle: 'Offres Spéciales',
    title: 'Jusqu\'à\n-30%',
    description: 'Profitez de nos offres exclusives sur une sélection de produits coup de cœur.',
    cta: 'En profiter',
    link: '/boutique',
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  function goToSlide(index) {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  }

  const slide = slides[current];

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sista-dark/70 via-sista-dark/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div
          className={`max-w-xl transition-all duration-500 ${
            isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <span className="inline-block font-body text-sista-gold text-sm tracking-[0.3em] uppercase mb-4">
            {slide.subtitle}
          </span>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] mb-6 whitespace-pre-line">
            {slide.title}
          </h2>
          <p className="font-body text-white/80 text-lg mb-8 max-w-md leading-relaxed">
            {slide.description}
          </p>
          <Link to={slide.link} className="btn-primary inline-flex items-center gap-2 group">
            {slide.cta}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => goToSlide((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors hidden sm:block"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={() => goToSlide((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors hidden sm:block"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-sista-gold' : 'w-4 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
