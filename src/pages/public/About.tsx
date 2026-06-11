import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Car,
  CarFront,
  Compass,
  Droplets,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Tv,
  Wifi,
} from 'lucide-react';
import BrandName from '../../components/ui/BrandName';
import FaqSection from '../../components/ui/FaqSection';
import GoogleReviews from '../../components/ui/GoogleReviews';
import { faqItems } from '../../data/faq';
import residenceLasMoras from '../../assets/residencelasmoras.jpeg';
import residenceLasMoras1 from '../../assets/residencelasmoras1.jpeg';
import residenceLasMoras2 from '../../assets/residencelasmoras2.jpeg';
import vueResidence from '../../assets/Vue residence.jpeg';

const destinations = [
  'Cappadocia', 'Cancun', 'Montserrat', 'Galápagos', 'Ushuaia', 'Bariloche',
];

const commitments = [
  { icon: Wifi, text: 'Wi-Fi haut débit' },
  { icon: Tv, text: 'Canal+' },
  { icon: Droplets, text: 'Eau chaude 24/7' },
  { icon: ShieldCheck, text: 'Sécurité renforcée' },
  { icon: CarFront, text: 'Location de voitures — ville, aéroport' },
  { icon: Car, text: 'Parking sécurisé' },
];

const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6237.579855042787!2d11.46227783168611!3d3.8416910906414037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf3b9065b93b%3A0x625deca93be02be1!2sResidence%20las%20Moras!5e1!3m2!1sen!2sfr!4v1781078204189!5m2!1sen!2sfr';

export default function About() {
  return (
    <main className="bg-brand-white">
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
        <img src={vueResidence} alt="LAS MORAS" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-stone-900/50" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-16 text-center sm:px-6">
          <div className="glass-on-image mx-auto inline-block">
            <p className="section-label !text-white/60">À propos de nous</p>
            <div className="mt-3 flex justify-center">
              <BrandName variant="light" size="lg" />
            </div>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/75">
              Une résidence d'appartements meublés où chaque porte ouvre sur une nouvelle destination.
            </p>
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="section-label">Notre histoire</p>
            <h2 className="section-title mt-3">
              Une invitation au voyage, au confort et à l'évasion
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-muted sm:text-base">
              <p>
                <strong className="text-brand-dark">LAS MORAS — L'Art de Vivre Naturellement</strong> est
                une résidence d'appartements meublés à Yaoundé. Chaque logement possède une identité
                propre, inspirée des plus belles destinations du monde.
              </p>
              <p>
                Le confort d'un hôtel de standing rencontre l'intimité d'une résidence privée. Wi-Fi
                fibre, Canal+, eau chaude permanente et sécurité renforcée pour un séjour serein.
              </p>
            </div>
            <blockquote className="mt-8 border-l-2 border-brand-red pl-5 text-sm font-medium text-brand-dark sm:text-base">
              « Chaque porte ouvre sur une nouvelle destination. »
            </blockquote>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <img src={residenceLasMoras} alt="Résidence" className="h-48 rounded-2xl object-cover sm:h-56" />
            <img src={residenceLasMoras1} alt="Intérieur" className="mt-8 h-48 rounded-2xl object-cover sm:h-56" />
            <img src={residenceLasMoras2} alt="Salon" className="h-40 rounded-2xl object-cover sm:h-48" />
            <Link
              to="/galerie"
              className="mt-8 flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-brand-gray text-center transition hover:border-brand-red sm:h-48"
            >
              <span className="text-sm font-medium text-brand-dark">Voir la galerie</span>
              <ArrowRight className="mt-2 h-4 w-4 text-brand-red" />
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophie */}
      <section className="border-y border-stone-200/60 bg-brand-gray px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="section-label text-center">Notre philosophie</p>
          <h2 className="section-title mt-3 text-center">Trois piliers</h2>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Compass, title: 'Voyage', text: 'Chaque appartement raconte une destination.' },
              { icon: Heart, title: 'Confort', text: 'Meubles premium et équipements modernes.' },
              { icon: Sparkles, title: 'Évasion', text: 'Un havre de paix au cœur de Yaoundé.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass-card p-6 text-center">
                <Icon className="mx-auto h-5 w-5 text-brand-red" strokeWidth={1.5} />
                <h3 className="mt-4 font-medium text-brand-dark">{title}</h3>
                <p className="mt-2 text-sm text-brand-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="section-label">Nos univers</p>
          <h2 className="section-title mt-3">Six destinations thématiques</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {destinations.map((dest) => (
              <span
                key={dest}
                className="rounded-full border border-stone-200/80 px-4 py-2 text-sm text-brand-muted"
              >
                {dest}
              </span>
            ))}
          </div>
          <Link to="/catalogue" className="btn-accent mt-8">
            Voir les logements
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Engagements */}
      <section className="border-t border-stone-200/60 bg-brand-gray px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="section-label text-center">Engagements</p>
          <h2 className="section-title mt-3 text-center">Tout pour un séjour serein</h2>
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
            {commitments.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2 text-sm text-brand-muted"
              >
                <Icon className="h-4 w-4 text-brand-red" strokeWidth={1.5} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Localisation */}
      <section className="px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200/80 px-3 py-1.5 text-xs text-brand-muted">
                <MapPin className="h-3.5 w-3.5 text-brand-red" />
                Nkolzie, Mendong — Yaoundé
              </div>
              <h2 className="section-title">Bien située pour explorer la ville</h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
                Cadre calme et accueillant, accès pratique au centre-ville, à l'aéroport et aux
                points essentiels de Yaoundé.
              </p>
              <div className="mt-6 space-y-2 text-sm text-brand-muted">
                <p>Aéroport Nsimalen — ~22 km · 45–55 min</p>
                <p>Centre-ville — ~8 km · 15–20 min</p>
                <p>Marché Central — ~8 km · 15–20 min</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-200/60">
              <iframe
                src={MAP_EMBED}
                title="Carte LAS MORAS"
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Avis Google */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <GoogleReviews />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-stone-200/60 bg-brand-gray px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <FaqSection
            id="faq"
            items={faqItems}
            description="Tout ce qu'il faut savoir avant de réserver votre séjour à LAS MORAS."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card flex flex-col items-center justify-between gap-6 p-8 sm:flex-row">
            <div>
              <BrandName size="sm" />
              <p className="mt-3 text-sm text-brand-muted">Prêt pour votre prochain séjour ?</p>
            </div>
            <div className="flex gap-3">
              <Link to="/catalogue" className="btn-accent">Réserver</Link>
              <Link to="/contact" className="btn-ghost">Contact</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
