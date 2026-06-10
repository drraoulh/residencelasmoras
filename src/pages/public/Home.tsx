import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Car, Search, ShieldCheck, Wifi, Wind } from 'lucide-react';
import BrandName from '../../components/ui/BrandName';
import LogementCard from '../../components/properties/LogementCard';
import { useLocalStorageStore } from '../../hooks/useLocalStorageStore';
import residenceLasMoras from '../../assets/residencelasmoras.jpeg';
import residenceLasMoras1 from '../../assets/residencelasmoras1.jpeg';
import residenceLasMoras2 from '../../assets/residencelasmoras2.jpeg';
import vueResidence from '../../assets/Vue residence.jpeg';

const slides = [vueResidence, residenceLasMoras, residenceLasMoras1, residenceLasMoras2];

const services = [
  { icon: Wifi, title: 'Wi-Fi fibre' },
  { icon: ShieldCheck, title: 'Sécurité 24/7' },
  { icon: Car, title: 'Parking' },
  { icon: Wind, title: 'Climatisation' },
];

function SearchBar() {
  const navigate = useNavigate();
  const { logements } = useLocalStorageStore();
  const [arrivee, setArrivee] = useState('');
  const [depart, setDepart] = useState('');
  const [type, setType] = useState('Tous');
  const types = Array.from(new Set(logements.map((l) => l.type)));

  const search = () => {
    const p = new URLSearchParams();
    if (type !== 'Tous') p.set('type', type);
    if (arrivee) p.set('arrivee', arrivee);
    if (depart) p.set('depart', depart);
    navigate(`/catalogue${p.toString() ? `?${p}` : ''}`);
  };

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center">
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">
            Arrivée
          </label>
          <input type="date" value={arrivee} onChange={(e) => setArrivee(e.target.value)} className="form-input" />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">
            Départ
          </label>
          <input type="date" value={depart} min={arrivee} onChange={(e) => setDepart(e.target.value)} className="form-input" />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">
            Type
          </label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="form-input">
            <option value="Tous">Tous</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button type="button" onClick={search} className="btn-primary h-11 w-full lg:w-auto">
          <Search className="h-4 w-4" />
          Chercher
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const { logements } = useLocalStorageStore();
  const featured = logements.filter((l) => l.statut === 'disponible').slice(0, 3);
  const display = featured.length > 0 ? featured : logements.slice(0, 3);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="bg-brand-white">
      {/* ── Hero ── */}
      <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
        {slides.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1.4s] ${
              i === slide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden={i !== slide}
          />
        ))}
        {/* Overlay uniforme pour lisibilité */}
        <div className="absolute inset-0 bg-stone-900/45" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-24 pb-32 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            {/* Texte dans panneau verre — lisible sur toute image */}
            <div className="glass-on-image mx-auto inline-block text-left sm:text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-white/70">
                Résidence meublée · Yaoundé
              </p>
              <div className="mt-3 flex justify-center">
                <BrandName variant="light" size="lg" />
              </div>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                Appartements meublés de standing, chaque espace une destination.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/catalogue" className="btn-accent w-full sm:w-auto">
                  Nos logements
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/a-propos" className="text-sm text-white/60 transition hover:text-white">
                  En savoir plus →
                </Link>
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mx-auto mt-12 max-w-3xl">
            <SearchBar />
          </div>

          {/* Indicateurs */}
          <div className="mt-8 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlide(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === slide ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
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

          <div className="grid grid-cols-2 gap-3">
            <img
              src={residenceLasMoras1}
              alt="Intérieur"
              className="h-52 w-full rounded-2xl object-cover sm:h-64"
            />
            <img
              src={residenceLasMoras2}
              alt="Salon"
              className="mt-8 h-52 w-full rounded-2xl object-cover sm:h-64"
            />
          </div>
        </div>
      </section>

      {/* ── Logements ── */}
      <section className="border-y border-stone-200/60 bg-brand-gray px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="section-label">Catalogue</p>
              <h2 className="section-title mt-3">Logements disponibles</h2>
            </div>
            <Link
              to="/catalogue"
              className="hidden text-sm text-brand-muted transition hover:text-brand-dark sm:block"
            >
              Tout voir →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {display.map((l) => (
              <LogementCard key={l.id} logement={l} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link to="/catalogue" className="btn-ghost text-xs">
              Voir tout le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="section-label text-center">Services</p>
          <h2 className="section-title mt-3 text-center">L'essentiel, rien de plus</h2>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200/60 bg-stone-200/60 sm:grid-cols-4">
            {services.map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-3 bg-white/80 px-4 py-8 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 text-brand-muted" strokeWidth={1.5} />
                <span className="text-xs text-brand-muted">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Citation + image ── */}
      <section className="relative overflow-hidden">
        <img
          src={residenceLasMoras}
          alt="Résidence LAS MORAS"
          className="h-80 w-full object-cover sm:h-96"
        />
        <div className="absolute inset-0 bg-stone-900/50" />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="glass-on-image max-w-lg text-center">
            <p className="text-base font-medium leading-relaxed sm:text-lg">
              « Chaque porte ouvre sur une nouvelle destination. »
            </p>
            <p className="mt-3 text-xs tracking-widest text-brand-red uppercase">
              LAS MORAS — L'Art de Vivre Naturellement
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA minimal ── */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card flex flex-col items-center justify-between gap-8 p-10 text-center sm:flex-row sm:text-left">
            <div>
              <p className="section-label">Réserver</p>
              <h2 className="section-title mt-2">Prêt pour votre séjour ?</h2>
              <p className="mt-2 text-sm text-brand-muted">
                Contactez-nous ou parcourez le catalogue en ligne.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/catalogue" className="btn-accent">Voir les logements</Link>
              <a
                href="https://wa.me/237689888291"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
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
