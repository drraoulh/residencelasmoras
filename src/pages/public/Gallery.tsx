import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from 'lucide-react';
import PageHeroHeading from '../../components/ui/PageHeroHeading';
import { galleryCategories, toGalleryViewModel } from '../../data/galleryImages';
import { useGallery } from '../../hooks/useGallery';
import { usePageMeta } from '../../hooks/usePageMeta';
import { PAGE_SEO } from '../../config/seo';
import type { GalleryCategory } from '../../types';
import { countByCategory, getGalleryBentoClass } from '../../utils/galleryLayout';
import vueResidence from '../../assets/Vue residence.jpeg';

type GalleryViewItem = ReturnType<typeof toGalleryViewModel>[number];
type FilterOption = GalleryCategory | 'Tous';

const FILTER_OPTIONS: FilterOption[] = ['Tous', ...galleryCategories];

function GalleryTile({
  image,
  layoutClass = '',
  onOpen,
}: {
  image: GalleryViewItem;
  layoutClass?: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative overflow-hidden rounded-2xl text-left ring-1 ring-stone-200/60 transition hover:ring-brand-red/30 ${layoutClass}`}
    >
      <img
        src={image.src}
        alt={image.label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-90 transition group-hover:from-stone-950/90" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/25">
          <Expand className="h-5 w-5" />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-red">
          {image.category}
        </span>
        <p className="mt-1 font-heading text-lg font-medium leading-tight text-white sm:text-xl">
          {image.label}
        </p>
      </div>
    </button>
  );
}

export default function Gallery() {
  const { galleryImages, isLoading, error } = useGallery();
  usePageMeta(PAGE_SEO.galerie);
  const items = toGalleryViewModel(galleryImages);
  const [filter, setFilter] = useState<FilterOption>('Tous');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const filtered =
    filter === 'Tous' ? items : items.filter((img) => img.category === filter);

  const categoryCounts = countByCategory(items, galleryCategories);
  const lightbox = lightboxIndex !== null ? filtered[lightboxIndex] : null;
  const isBentoLayout = filter === 'Tous' && filtered.length > 1;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null || filtered.length === 0) return current;
      return (current - 1 + filtered.length) % filtered.length;
    });
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((current) => {
      if (current === null || filtered.length === 0) return current;
      return (current + 1) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, goPrev, goNext]);

  return (
    <main className="bg-brand-white">
      <section className="relative flex min-h-[45vh] items-center justify-center overflow-hidden sm:min-h-[50vh]">
        <img
          src={vueResidence}
          alt="Vue panoramique de la Résidence LAS MORAS"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-900/50 to-stone-950/70" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-14 text-center sm:px-6 sm:pb-16">
          <div className="glass-on-image mx-auto inline-block max-w-xl">
            <PageHeroHeading
              label="Galerie"
              title={
                <>
                  La résidence
                  <span className="block text-brand-red">en images</span>
                </>
              }
              subtitle="Façades, intérieurs design et ambiance — découvrez LAS MORAS avant votre séjour."
              variant="light"
              align="center"
            />
          </div>
        </div>
      </section>

      <div className="sticky top-[4.5rem] z-30 border-b border-stone-200/80 bg-brand-white/90 backdrop-blur-xl sm:top-[5rem]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-brand-muted">
            {isLoading ? (
              'Chargement des photos…'
            ) : (
              <>
                <span className="font-medium text-brand-dark">{filtered.length}</span>
                {' photo'}
                {filtered.length > 1 ? 's' : ''}
                {filter !== 'Tous' && (
                  <span>
                    {' '}
                    · <span className="text-brand-red">{filter}</span>
                  </span>
                )}
              </>
            )}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTER_OPTIONS.map((cat) => {
              const count = categoryCounts[cat] ?? 0;
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  disabled={!isLoading && count === 0}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    active
                      ? 'bg-brand-red text-white shadow-[0_4px_16px_rgba(196,30,30,0.25)]'
                      : 'border border-stone-200/80 bg-white text-brand-muted hover:border-brand-red/30 hover:text-brand-dark'
                  }`}
                >
                  {cat}
                  {!isLoading && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        active ? 'bg-white/20' : 'bg-brand-gray text-brand-muted'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-brand-red">
              Impossible de charger la galerie. Les photos par défaut s&apos;affichent si disponibles.
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`animate-pulse rounded-2xl bg-brand-gray ${getGalleryBentoClass(index)}`}
                />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div
              className={
                isBentoLayout
                  ? 'grid grid-cols-2 gap-3 auto-rows-fr lg:grid-cols-12 lg:gap-4'
                  : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
              }
            >
              {filtered.map((img, index) => (
                <GalleryTile
                  key={img.id}
                  image={img}
                  layoutClass={
                    isBentoLayout
                      ? getGalleryBentoClass(index)
                      : 'aspect-[4/3] min-h-[220px]'
                  }
                  onOpen={() => openLightbox(index)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-200/80 bg-brand-gray px-6 py-20 text-center">
              <p className="font-heading text-2xl font-medium text-brand-dark">
                Aucune photo dans cette catégorie
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm text-brand-muted">
                Essayez un autre filtre ou consultez l&apos;ensemble de la galerie.
              </p>
              {filter !== 'Tous' && (
                <button type="button" onClick={() => setFilter('Tous')} className="btn-ghost mt-8">
                  Voir toutes les photos
                </button>
              )}
            </div>
          )}

          <div className="mt-16 overflow-hidden rounded-2xl border border-stone-200/80 bg-brand-gray">
            <div className="grid lg:grid-cols-2">
              <div className="relative hidden min-h-[200px] lg:block">
                <img
                  src={vueResidence}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-900/30" />
              </div>
              <div className="flex flex-col items-start justify-center gap-6 p-8 sm:p-10">
                <div>
                  <p className="section-label">Visite</p>
                  <h2 className="section-title mt-2">Envie de voir en personne ?</h2>
                  <p className="mt-3 max-w-md text-sm text-brand-muted">
                    Parcourez nos logements meublés ou contactez-nous pour organiser votre séjour à
                    Yaoundé.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/catalogue" className="btn-accent">
                    Voir les logements
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/contact" className="btn-ghost">
                    Nous contacter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {lightbox && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/90 p-3 backdrop-blur-md sm:p-6"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.label}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrev();
                }}
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-stone-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
              <img
                src={lightbox.src}
                alt={lightbox.label}
                className="max-h-[70vh] w-full object-contain"
              />
              {filtered.length > 1 && (
                <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white/90">
                  {lightboxIndex + 1} / {filtered.length}
                </span>
              )}
            </div>
            <div className="border-t border-white/10 px-5 py-4 sm:px-6 sm:py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-red">
                {lightbox.category}
              </p>
              <p className="mt-1 font-heading text-xl font-medium text-white sm:text-2xl">
                {lightbox.label}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
