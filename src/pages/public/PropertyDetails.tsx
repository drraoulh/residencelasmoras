import { Car, Coffee, MapPin, Shield, Tv, Wifi, Wind } from 'lucide-react';

const mockProperty = {
  id: '1',
  nom: 'Appartement VIP Bastos',
  type: 'Appartement',
  surface: 120,
  prix_nuit: 75000,
  prix_semaine: 450000,
  prix_mois: 1500000,
  description:
    "Magnifique appartement de haut standing situé au cœur du quartier résidentiel de Bastos. Idéal pour vos séjours d'affaires ou de tourisme. Sécurité 24/7, vue imprenable sur la ville, meubles importés et équipements dernier cri.",
  equipements: [
    { name: 'Climatisation', icon: Wind },
    { name: 'Wi-Fi Fibre', icon: Wifi },
    { name: 'Parking Sécurisé', icon: Car },
    { name: 'Smart TV', icon: Tv },
    { name: 'Machine à café', icon: Coffee },
    { name: 'Gardien 24/7', icon: Shield },
  ],
  photos: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1502672260266-1c1e52f1590c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
  ],
};

export default function PropertyDetails() {
  const property = mockProperty;

  return (
    <div className="min-h-screen bg-brand-gray pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            {property.nom}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-gray-600 sm:text-base">
            <MapPin className="h-5 w-5 text-brand-red" />
            <span>Quartier Bastos, Yaoundé</span>
            <span className="rounded-full bg-white px-3 py-1 text-sm">{property.type}</span>
            <span className="rounded-full bg-white px-3 py-1 text-sm">{property.surface} m²</span>
          </div>
        </div>

        <div className="mb-10 grid h-[320px] grid-cols-1 overflow-hidden rounded-2xl shadow-sm sm:h-[420px] lg:h-[50vh] lg:min-h-[400px] lg:grid-cols-4 lg:gap-4 lg:rounded-3xl">
          <div className="h-full lg:col-span-2">
            <img src={property.photos[0]} alt={property.nom} className="h-full w-full object-cover" />
          </div>
          <div className="hidden h-full grid-cols-2 gap-4 lg:col-span-2 lg:grid">
            {property.photos.slice(1).map((photo, index) => (
              <img key={photo} src={photo} alt={`Vue ${index + 2}`} className="h-full w-full object-cover" />
            ))}
            <div className="relative h-full overflow-hidden">
              <img src={property.photos[0]} alt="Plus de photos" className="h-full w-full object-cover brightness-50" />
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                +12 Photos
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-brand-dark sm:text-2xl">À propos de ce logement</h2>
            <p className="mb-10 text-base leading-relaxed text-gray-600 sm:text-lg">{property.description}</p>

            <h3 className="mb-6 text-xl font-bold text-brand-dark sm:text-2xl">Ce que propose ce logement</h3>
            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {property.equipements.map((eq) => (
                <div key={eq.name} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 text-gray-700 shadow-sm">
                  <eq.icon className="h-6 w-6 flex-shrink-0 text-brand-red" />
                  <span className="text-sm font-semibold">{eq.name}</span>
                </div>
              ))}
            </div>

            <h3 className="mb-6 text-xl font-bold text-brand-dark sm:text-2xl">Tarification détaillée</h3>
            <div className="flex flex-col items-center justify-around gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:gap-8 md:rounded-3xl md:p-8">
              {[
                ['Par Nuit', property.prix_nuit],
                ['Par Semaine', property.prix_semaine],
                ['Par Mois', property.prix_mois],
              ].map(([label, price], index) => (
                <div key={label} className="flex w-full flex-col items-center gap-6 md:flex-row">
                  {index > 0 && <div className="hidden h-16 w-px bg-gray-200 md:block" />}
                  <div className="w-full text-center">
                    <p className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-500">{label}</p>
                    <p className={`text-2xl font-extrabold sm:text-3xl ${index === 0 ? 'text-brand-red' : 'text-brand-dark'}`}>
                      {Number(price).toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:p-8 lg:sticky lg:top-24 lg:rounded-3xl">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <span className="text-2xl font-extrabold text-brand-red sm:text-3xl">
                  {property.prix_nuit.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="font-semibold text-gray-500"> / nuit</span>
              </div>

              <h3 className="mb-6 text-xl font-bold text-brand-dark">Demande de réservation</h3>
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input type="text" placeholder="Prénom" className="h-12 rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                  <input type="text" placeholder="Nom" className="h-12 rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                </div>
                <input type="email" placeholder="Email" className="h-12 rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                <input type="tel" placeholder="Téléphone" className="h-12 rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input type="date" className="h-12 rounded-xl bg-gray-50 px-4 font-medium text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                  <input type="date" className="h-12 rounded-xl bg-gray-50 px-4 font-medium text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                </div>
                <button type="submit" className="mt-2 w-full rounded-xl bg-brand-red py-4 text-lg font-bold text-white transition hover:bg-red-700 hover:shadow-[0_8px_20px_rgba(213,0,0,0.3)] active:scale-95">
                  Demander une réservation
                </button>
                <p className="text-center text-xs font-medium text-gray-500">Aucun montant ne vous sera débité pour le moment.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
