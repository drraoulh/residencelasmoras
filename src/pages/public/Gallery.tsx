import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import BrandName from '../../components/ui/BrandName';
import {
  galleryCategories,
  galleryImages,
  type GalleryCategory,
  type GalleryImage,
} from '../../data/galleryImages';
import vueResidence from '../../assets/Vue residence.jpeg';

export default function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | 'Tous'>('Tous');
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered =
    filter === 'Tous'
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  return (
    <main className="bg-brand-white">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <img
          src={vueResidence}
          alt="Galerie LAS MORAS"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/50" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-16 text-center sm:px-6">
          <div className="glass-on-image mx-auto inline-block">
            <p className="section-label !text-white/60">Galerie</p>
            <div className="mt-3 flex justify-center">
              <BrandName variant="light" size="lg" />
            </div>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/75">
              Découvrez la résidence en images — espaces, intérieurs et ambiance.
            </p>
          </div>
        </div>
      </section>

      {/* Filtres + grille */}
      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-brand-muted">
              {filtered.length} photo{filtered.length > 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-2">
              {(['Tous', ...galleryCategories] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    filter === cat
                      ? 'bg-brand-red text-white'
                      : 'border border-stone-200/80 bg-white text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((img) => (
              <button
                key={img.label}
                type="button"
                onClick={() => setLightbox(img)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl text-left"
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-brand-red">
                    {img.category}
                  </span>
                  <p className="mt-0.5 text-sm font-medium text-white">{img.label}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-16 glass-card flex flex-col items-center justify-between gap-6 p-8 sm:flex-row">
            <div>
              <p className="section-label">Réserver</p>
              <p className="section-title mt-2">Envie de voir en personne ?</p>
            </div>
            <div className="flex gap-3">
              <Link to="/catalogue" className="btn-accent">
                Nos logements
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-ghost">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal
          aria-label={lightbox.label}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.label}
              className="max-h-[75vh] w-full object-contain"
            />
            <div className="glass-on-image !rounded-none !rounded-b-2xl border-t-0">
              <p className="text-[10px] uppercase tracking-widest text-brand-red">
                {lightbox.category}
              </p>
              <p className="mt-1 font-medium">{lightbox.label}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
