import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Search, ShieldCheck, Wifi, Wind } from 'lucide-react';
import LogementCard from '../../components/properties/LogementCard';
import type { Logement } from '../../components/properties/LogementCard';
import lamorasResidence from '../../assets/lamorasresidence.jpeg';
import lasmoras from '../../assets/lasmoras.jpeg';
import lasmorasResidence from '../../assets/lasmorasresidence.jpeg';
import residenceLasMoras from '../../assets/residencelasmoras.jpeg';
import residenceLasMoras1 from '../../assets/residencelasmoras1.jpeg';
import residenceLasMoras2 from '../../assets/residencelasmoras2.jpeg';
import residenceLasMoras3 from '../../assets/residencelasmoras3.jpeg';
import vueResidence from '../../assets/Vue residence.jpeg';

const heroSlides = [
  vueResidence,
  residenceLasMoras,
  residenceLasMoras1,
  residenceLasMoras2,
  residenceLasMoras3,
  lasmorasResidence,
  lamorasResidence,
  lasmoras,
];

const logementsEnAvant: Logement[] = [
  {
    id: '101',
    nom: 'Suite VIP Bastos',
    type: 'Appartement',
    surface: 150,
    prix_nuit: 100000,
    statut_actuel: 'disponible',
    photos: [residenceLasMoras1],
    equipements: ['Climatisation', 'Wi-Fi Fibre', 'Piscine'],
  },
  {
    id: '102',
    nom: 'Appartement Premium Centre',
    type: 'Appartement',
    surface: 110,
    prix_nuit: 85000,
    statut_actuel: 'disponible',
    photos: [residenceLasMoras2],
    equipements: ['Smart TV', 'Cuisine équipée', 'Parking sécurisé'],
  },
  {
    id: '103',
    nom: 'Résidence Executive Golf',
    type: 'Villa',
    surface: 240,
    prix_nuit: 180000,
    statut_actuel: 'libere_prochainement',
    date_liberation: '2026-06-20',
    photos: [residenceLasMoras3],
    equipements: ['Jardin privé', 'Gardien 24/7', 'Terrasse'],
  },
];

const services = [
  {
    icon: Wifi,
    title: 'Wifi Haut Débit',
    text: 'Connexion fibre stable pour travailler, streamer et rester joignable.',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité 24/7',
    text: 'Accès contrôlé, vidéosurveillance et présence sur site jour et nuit.',
  },
  {
    icon: Car,
    title: 'Parking Sécurisé',
    text: 'Stationnement privé et surveillé pour vos véhicules.',
  },
  {
    icon: Wind,
    title: 'Climatisation',
    text: 'Pièces fraîches et confortables avec équipements modernes.',
  },
];

function BookingFields() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
          Arrivée
        </label>
        <input
          type="date"
          className="h-12 w-full rounded-lg bg-gray-50 px-4 font-medium text-gray-800 outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-brand-red"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
          Départ
        </label>
        <input
          type="date"
          className="h-12 w-full rounded-lg bg-gray-50 px-4 font-medium text-gray-800 outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-brand-red"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">
          Type de logement
        </label>
        <select className="h-12 w-full rounded-lg bg-gray-50 px-4 font-medium text-gray-800 outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-brand-red">
          <option>Tous les logements</option>
          <option>Appartement</option>
          <option>Studio</option>
          <option>Villa</option>
          <option>Chambre</option>
        </select>
      </div>
      <Link
        to="/catalogue"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-red px-8 font-bold text-white transition hover:bg-red-700 hover:shadow-lg active:scale-95"
      >
        <Search className="h-5 w-5" />
        Réserver
      </Link>
    </div>
  );
}

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentImageIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative flex h-[78svh] min-h-[520px] items-center justify-center overflow-hidden md:h-[85vh] md:min-h-[640px] md:overflow-visible">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${slide})` }}
              aria-hidden={index !== currentImageIndex}
            />
          ))}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-white/85 sm:text-sm sm:tracking-[0.28em]">
            Résidence Las Moras
          </p>
          <h1 className="text-3xl font-extrabold leading-tight drop-shadow-2xl sm:text-4xl md:text-6xl">
            Votre séjour d'exception à Yaoundé
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-relaxed text-gray-100 sm:text-lg md:text-2xl">
            Appartements meublés de standing, service attentif et confort premium pour vos séjours d'affaires ou en famille.
          </p>
        </div>

        <div className="absolute bottom-8 z-20 flex items-center justify-center gap-2 px-4 md:bottom-24 md:gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Afficher l'image ${index + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 z-20 hidden w-full translate-y-1/2 px-4 md:block">
          <div className="mx-auto max-w-6xl rounded-lg bg-white p-5 shadow-2xl">
            <BookingFields />
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-white px-4 py-6 md:hidden">
        <div className="mx-auto max-w-md rounded-lg bg-white p-4 shadow-2xl ring-1 ring-gray-100">
          <BookingFields />
        </div>
      </section>

      <section className="bg-white px-4 pb-16 pt-12 text-center md:pb-24 md:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">
            Bienvenue
          </p>
          <h2 className="text-2xl font-extrabold leading-tight text-brand-dark sm:text-3xl md:text-5xl">
            L'Excellence au cœur de la ville
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 md:mt-8 md:text-xl">
            Profitez d'appartements meublés élégants, pensés pour offrir le confort d'un hôtel premium avec l'intimité d'une résidence privée. Chaque logement combine espace, standing et équipements modernes.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">
                Sélection
              </p>
              <h2 className="text-2xl font-extrabold text-brand-dark sm:text-3xl md:text-4xl">
                Nos Coups de Cœur
              </h2>
            </div>
            <Link to="/catalogue" className="font-bold text-brand-red transition hover:text-red-700">
              Voir tout le catalogue
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {logementsEnAvant.map((logement) => (
              <LogementCard key={logement.id} logement={logement} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">
              Services
            </p>
            <h2 className="text-2xl font-extrabold text-brand-dark sm:text-3xl md:text-4xl">
              Nos Services
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-lg bg-white p-6 text-center shadow-sm ring-1 ring-gray-100 sm:p-7">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-red-50 text-brand-red">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-extrabold text-brand-dark">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
