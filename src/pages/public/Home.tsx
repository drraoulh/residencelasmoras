import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, CarFront, ShieldCheck, Tv, Wifi, Wind } from 'lucide-react';
import PageHeroHeading from '../../components/ui/PageHeroHeading';
import FaqSection from '../../components/ui/FaqSection';
import GoogleReviews from '../../components/ui/GoogleReviews';
import { faqItems } from '../../data/faq';
import LogementCard from '../../components/properties/LogementCard';
import { useLogementsList } from '../../hooks/useLogementsList';
import { usePageMeta } from '../../hooks/usePageMeta';
import { PAGE_SEO } from '../../config/seo';
import { buildLodgingBusinessJsonLd } from '../../components/seo/SeoJsonLd';
import { pickFeaturedLogementsByType } from '../../utils/logements';
import { WHATSAPP_LINK } from '../../utils/whatsapp';
import galleryPreview1 from '../../assets/residencelasmoras1.jpeg';
import galleryPreview2 from '../../assets/residencelasmoras2.jpeg';
import vueResidence from '../../assets/Vue residence.jpeg';

const HeroSearchBar = lazy(() => import('../../components/search/HeroSearchBar'));

const HERO_IMAGE = '/images/hero-lcp.jpeg';

const welcomeGalleryPreview = [
  { id: 'preview-1', src: galleryPreview1, label: 'Salon lumineux', category: 'Intérieurs' },
  { id: 'preview-2', src: galleryPreview2, label: 'Espace de vie', category: 'Intérieurs' },
];

const services = [
  { icon: Wifi, title: 'Wi-Fi fibre', description: 'Connexion stable pour travailler et streamer.' },
  { icon: Tv, title: 'IPTV', description: 'Chaînes TV et divertissement sur grand écran.' },
  { icon: ShieldCheck, title: 'Sécurité 24/7', description: 'Accès contrôlé et présence sur site.' },
  { icon: Wind, title: 'Climatisation', description: 'Confort thermique dans chaque logement.' },
  {
    icon: CarFront,
    title: 'Location de voitures',
    description: 'Ville, aéroport et déplacements sur Yaoundé.',
  },
  { icon: Car, title: 'Parking sécurisé', description: 'Stationnement privé et surveillé.' },
];

export default function Home() {
  const { logements, isLoading, error } = useLogementsList();
  usePageMeta({
    ...PAGE_SEO.home,
    jsonLd: buildLodgingBusinessJsonLd(),
  });
  const display = pickFeaturedLogementsByType(logements, 3);

  return (
    <main className="overflow-x-hidden bg-brand-white">
      {/* ── Hero plein écran — texte en bas, recherche en carte flottante ── */}
      <section className="relative min-h-[72dvh] min-[480px]:min-h-[80dvh] lg:min-h-svh">
        <img
          src={HERO_IMAGE}
          alt="LAS MORAS — L'Art de Vivre Naturellement"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[center_30%] sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-900/50 to-stone-900/15 sm:from-stone-950/90 sm:via-stone-900/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-stone-950/20 to-transparent sm:from-stone-950/50" />

        <div className="relative z-10 mx-auto flex min-h-[72dvh] max-w-6xl flex-col justify-end px-4 pb-8 pt-24 min-[480px]:min-h-[80dvh] min-[480px]:pb-10 sm:px-6 sm:pt-28 lg:min-h-svh lg:pb-40 lg:pt-32">
          <div className="w-full max-w-xl border-l-2 border-brand-red pl-4 sm:max-w-2xl sm:pl-6">
            <PageHeroHeading
              label="Résidence meublée · Yaoundé"
              brand
              variant="light"
              subtitle="Appartements meublés de standing, chaque espace une destination."
            />
            <div className="mt-5 flex flex-col gap-2.5 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center sm:mt-7 sm:gap-3">
              <Link to="/catalogue" className="btn-accent w-full min-[400px]:w-auto">
                Nos logements
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/a-propos" className="btn-glass w-full min-[400px]:w-auto">
                En savoir plus
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 px-3 pb-6 pt-4 sm:px-6 sm:pb-8 md:-mt-20 md:pt-0 lg:-mt-28">
        <div className="mx-auto w-full max-w-4xl rounded-xl border border-stone-200/80 bg-white p-1 shadow-[0_16px_48px_rgba(0,0,0,0.1)] sm:rounded-2xl sm:p-1.5 sm:shadow-[0_24px_64px_rgba(0,0,0,0.12)]">
          <Suspense
            fallback={
              <div className="rounded-xl bg-brand-gray/50 p-8 text-center text-sm text-brand-muted">
                Chargement de la recherche…
              </div>
            }
          >
            <HeroSearchBar />
          </Suspense>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="section-label">Bienvenue</p>
            <h2 className="section-title mt-3">
              Confort d'hôtel,
              <br />
              intimité d'une résidence
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-brand-muted sm:text-base">
              LAS MORAS — L'Art de Vivre Naturellement — propose des appartements entièrement meublés à Yaoundé, décorés selon
              des thèmes inspirés des plus belles destinations — Cappadocia, Cancun, Galápagos
              et plus encore.
            </p>
            <Link to="/a-propos" className="btn-ghost mt-8 text-xs">
              Notre histoire
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {welcomeGalleryPreview[0] && (
              <Link
                to="/galerie"
                className="group relative col-span-2 row-span-2 min-h-[200px] overflow-hidden rounded-2xl ring-1 ring-stone-200/60 sm:min-h-[280px] lg:col-span-1 lg:row-span-2 lg:min-h-[320px]"
              >
                <img
                  src={welcomeGalleryPreview[0].src}
                  alt={welcomeGalleryPreview[0].label}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-red">
                    {welcomeGalleryPreview[0].category}
                  </span>
                  <p className="mt-1 font-heading text-lg font-medium text-white">
                    {welcomeGalleryPreview[0].label}
                  </p>
                </div>
              </Link>
            )}
            {welcomeGalleryPreview[1] && (
              <Link
                to="/galerie"
                className="group relative min-h-[140px] overflow-hidden rounded-2xl ring-1 ring-stone-200/60 sm:min-h-[160px] lg:min-h-[152px]"
              >
                <img
                  src={welcomeGalleryPreview[1].src}
                  alt={welcomeGalleryPreview[1].label}
                  width={600}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-red">
                    {welcomeGalleryPreview[1].category}
                  </span>
                  <p className="mt-0.5 text-sm font-medium text-white">{welcomeGalleryPreview[1].label}</p>
                </div>
              </Link>
            )}
            <Link
              to="/galerie"
              className="group flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300/90 bg-brand-gray/80 text-center transition hover:border-brand-red/40 hover:bg-brand-red/5 sm:min-h-[140px] lg:min-h-[152px]"
            >
              <span className="font-heading text-base font-medium text-brand-dark">Voir la galerie</span>
              <span className="mt-1 text-xs text-brand-muted">Toutes les photos</span>
              <ArrowRight className="mt-2 h-4 w-4 text-brand-red transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Logements ── */}
      <section className="border-y border-stone-200/60 bg-brand-gray px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="section-label">Catalogue</p>
              <h2 className="section-title mt-2 sm:mt-3">Logements disponibles</h2>
            </div>
            <Link
              to="/catalogue"
              className="hidden shrink-0 text-sm text-brand-muted transition hover:text-brand-dark sm:block"
            >
              Tout voir →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-stone-200/60"
                />
              ))
            ) : error ? (
              <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center text-sm text-brand-red">
                Impossible de charger les logements pour le moment.
              </div>
            ) : (
              display.map((l) => <LogementCard key={l.id} logement={l} />)
            )}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link to="/catalogue" className="btn-ghost text-xs">
              Voir tout le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="section-label text-center">Services</p>
          <h2 className="section-title mt-2 text-center sm:mt-3">Tout pour un séjour sans contrainte</h2>
          <p className="mx-auto mt-3 max-w-lg px-2 text-center text-sm text-brand-muted sm:px-0">
            Hébergement, confort et mobilité — location de véhicules pour la ville, l'aéroport et vos
            courses.
          </p>

          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:mt-12 sm:gap-4 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="glass-card flex flex-col items-center gap-3 p-5 text-center sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-brand-red">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className="text-sm font-medium text-brand-dark">{title}</span>
                <span className="text-xs leading-relaxed text-brand-muted">{description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Avis Google ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <GoogleReviews />
        </div>
      </section>

      {/* ── Citation + image ── */}
      <section className="relative overflow-hidden">
        <img
          src={vueResidence}
          alt="Vue panoramique — Résidence LAS MORAS"
          width={1920}
          height={800}
          loading="lazy"
          decoding="async"
          className="h-56 w-full object-cover object-center min-[400px]:h-72 sm:h-80 md:h-96"
        />
        <div className="absolute inset-0 bg-stone-900/50" />
        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
          <div className="glass-on-image w-full max-w-lg px-4 py-4 text-center sm:px-6 sm:py-5">
            <p className="text-sm font-medium leading-relaxed min-[400px]:text-base sm:text-lg">
              « Chaque porte ouvre sur une nouvelle destination. »
            </p>
            <p className="mt-3 text-xs tracking-widest text-brand-red uppercase">
              LAS MORAS — L'Art de Vivre Naturellement
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ (aperçu) ── */}
      <section className="border-t border-stone-200/60 bg-brand-gray px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <FaqSection
            items={faqItems}
            limit={4}
            showAllLink
            description="Les réponses aux questions les plus posées avant de réserver."
          />
        </div>
      </section>

      {/* ── CTA minimal ── */}
      <section className="px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-14">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card flex flex-col items-center justify-between gap-6 p-6 text-center sm:gap-8 sm:p-8 sm:text-left md:flex-row md:p-10">
            <div className="min-w-0">
              <p className="section-label">Réserver</p>
              <h2 className="section-title mt-2">Prêt pour votre séjour ?</h2>
              <p className="mt-2 text-sm text-brand-muted">
                Contactez-nous ou parcourez le catalogue en ligne.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
              <Link to="/catalogue" className="btn-accent w-full sm:w-auto">Voir les logements</Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost w-full sm:w-auto"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
