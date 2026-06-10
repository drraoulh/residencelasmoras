import { Globe2, Headphones, Home, MapPin, ShieldCheck, Sparkles, Tv, Wifi, Wrench, Droplets } from 'lucide-react';
import residenceLasMoras from '../../assets/residencelasmoras.jpeg';
import vueResidence from '../../assets/Vue residence.jpeg';

const commitments = [
  { icon: Home, title: 'Appartements et studios entierement meubles' },
  { icon: Wifi, title: 'Connexion Wi-Fi haut debit' },
  { icon: Tv, title: 'Canal+ et divertissement premium' },
  { icon: Droplets, title: 'Eau chaude disponible en permanence' },
  { icon: ShieldCheck, title: 'Securite renforcee et videosurveillance' },
  { icon: Wrench, title: 'Entretien regulier des espaces' },
  { icon: Headphones, title: 'Accueil chaleureux et assistance personnalisee' },
];

const distances = [
  { placeFr: 'Aeroport Nsimalen', placeEn: 'Nsimalen Airport', distance: '~22 km', time: '45-55 min' },
  { placeFr: 'Poste Centrale', placeEn: 'Central Post Office', distance: '~8 km', time: '15-20 min' },
  { placeFr: 'Centre-ville', placeEn: 'City center', distance: '~8 km', time: '15-20 min' },
  { placeFr: 'Marche Central', placeEn: 'Central Market', distance: '~8 km', time: '15-20 min' },
];

export default function About() {
  return (
    <main className="bg-white">
      <section className="relative flex min-h-[460px] items-center justify-center overflow-hidden px-4 py-24 text-center text-white md:min-h-[580px]">
        <img src={vueResidence} alt="Residence Las Moras" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-5xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-white/80">
            A Propos de LAS MORAS
          </p>
          <h1 className="text-4xl font-extrabold leading-tight drop-shadow-2xl md:text-6xl">
            LAS MORAS
          </h1>
          <p className="mt-5 text-2xl font-semibold text-white md:text-4xl">
            L'Art de Vivre Naturellement
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">
              Notre univers
            </p>
            <h2 className="text-3xl font-extrabold leading-tight text-brand-dark md:text-5xl">
              Une invitation au voyage, au confort et a l'evasion.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-600 md:text-lg">
              <p>
                LAS MORAS est une residence d'appartements meubles situee a Yaounde, offrant une
                experience d'hebergement unique inspiree des plus belles destinations du monde.
                Chaque appartement possede une identite propre et une decoration thematique concue
                pour vous faire voyager tout en profitant d'un confort moderne.
              </p>
              <p>
                De la chaleur de Cappadocia a l'energie tropicale de Cancun, en passant par la
                serenite de Montserrat, les paysages sauvages de Galapagos, l'elegance glacee de
                Ushuaia et le charme montagnard de Bariloche, chaque espace vous invite a vivre une
                experience differente.
              </p>
              <p>
                Nos logements sont equipes du Wi-Fi haut debit, de Canal+, d'eau chaude permanente
                et beneficient d'une securite renforcee pour garantir un sejour confortable et
                serein.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg shadow-2xl">
            <img
              src={residenceLasMoras}
              alt="Residence LAS MORAS"
              className="h-[340px] w-full object-cover sm:h-[460px] lg:h-[560px]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
              <p className="text-xl font-black">Chaque porte ouvre sur une nouvelle destination.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">
              Notre Engagement
            </p>
            <h2 className="text-3xl font-extrabold text-brand-dark md:text-4xl">
              Tout pour un sejour agreable et memorable
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map(({ icon: Icon, title }) => (
              <div key={title} className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-brand-red">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold leading-snug text-brand-dark">{title}</h3>
              </div>
            ))}
            <div className="rounded-lg bg-brand-red p-6 text-white shadow-sm">
              <Sparkles className="mb-4 h-8 w-8" />
              <p className="text-lg font-bold">Une experience pensee dans chaque detail.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-brand-red">
              <MapPin className="h-4 w-4" />
              Nkolzie, Mendong, Yaounde
            </div>
            <h2 className="text-3xl font-extrabold leading-tight text-brand-dark md:text-5xl">
              Bien situee pour explorer Yaounde
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Installez-vous dans un cadre calme et accueillant, avec un acces pratique aux points
              essentiels de la ville. Que vous soyez en voyage d'affaires ou en vacances, notre residence est le point de depart ideal pour decouvrir les merveilles de Yaounde, tout en profitant du confort et de la serenite de votre logement.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-bold">Lieu / Place</th>
                    <th className="px-5 py-4 font-bold">Distance</th>
                    <th className="px-5 py-4 font-bold">Temps / Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {distances.map((row) => (
                    <tr key={row.placeFr}>
                      <td className="px-5 py-4">
                        <p className="font-bold text-brand-dark">{row.placeFr}</p>
                        <p className="mt-1 text-sm text-gray-500">{row.placeEn}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-700">{row.distance}</td>
                      <td className="px-5 py-4 font-bold text-brand-red">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 text-sm font-medium leading-relaxed text-gray-600">
                Les temps sont estimes hors heures de pointe. 
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                <Globe2 className="h-5 w-5 text-brand-red" />
                <p className="font-extrabold text-brand-dark">Residence Las Moras</p>
              </div>
              <div className="h-[360px] bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6237.579855042787!2d11.46227783168611!3d3.8416910906414037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf3b9065b93b%3A0x625deca93be02be1!2sResidence%20las%20Moras!5e1!3m2!1sen!2sfr!4v1781078204189!5m2!1sen!2sfr"
                  title="Carte Residence Las Moras"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="px-5 py-4 text-sm font-medium leading-relaxed text-gray-600">
                Nous vous accueillons avec plaisir pour un sejour simple, confortable et inspire.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg border border-gray-100 bg-[#111111] shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[360px] lg:min-h-[520px]">
            <img
              src={residenceLasMoras}
              alt="Residence Las Moras"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/75">
                LAS MORAS
              </p>
              <p className="mt-2 text-3xl font-black">L'Art de Vivre Naturellement</p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 py-10 text-white sm:px-10 md:py-14 lg:px-14">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">
              Notre Vision
            </p>
            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Faire de chaque sejour une destination a part entiere.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Creer un lieu ou chaque sejour devient une experience unique. Nous croyons que le
              confort va au-dela de l'hebergement : il reside dans les emotions, les souvenirs et
              les decouvertes que chaque espace peut offrir.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Voyage', 'Confort', 'Evasion'].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 border-l-4 border-brand-red pl-5 text-xl font-black leading-relaxed text-white">
              A LAS MORAS, chaque porte ouvre sur une nouvelle destination.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
