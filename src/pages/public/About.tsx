import { Headphones, Home, ShieldCheck, Sparkles, Tv, Wifi, Wrench, Droplets } from 'lucide-react';
import lasmorasResidence from '../../assets/lasmorasresidence.jpeg';
import residenceLasMoras from '../../assets/residencelasmoras.jpeg';
import vueResidence from '../../assets/Vue residence.jpeg';

const commitments = [
  {
    icon: Home,
    title: 'Appartements et studios entièrement meublés',
  },
  {
    icon: Wifi,
    title: 'Connexion Wi-Fi haut débit',
  },
  {
    icon: Tv,
    title: 'Canal+ et divertissement premium',
  },
  {
    icon: Droplets,
    title: 'Eau chaude disponible en permanence',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité renforcée et vidéosurveillance',
  },
  {
    icon: Wrench,
    title: 'Entretien régulier des espaces',
  },
  {
    icon: Headphones,
    title: 'Accueil chaleureux et assistance personnalisée',
  },
];

export default function About() {
  return (
    <main className="bg-white">
      <section className="relative flex min-h-[440px] items-center justify-center overflow-hidden px-4 py-24 text-center text-white md:min-h-[560px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${vueResidence})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-5xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-white/80">
            À Propos
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
              Notre Concept
            </p>
            <h2 className="text-3xl font-extrabold leading-tight text-brand-dark md:text-5xl">
              Voyage & Confort
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
              LAS MORAS est une résidence d'appartements meublés située à Yaoundé, offrant une expérience d'hébergement unique inspirée des plus belles destinations du monde. Chaque appartement possède une identité propre et une décoration thématique conçue pour vous faire voyager tout en profitant d'un confort moderne. De la chaleur de Cappadocia à l'énergie tropicale de Cancun, en passant par la sérénité de Montserrat, les paysages sauvages de Galapagos, l'élégance glacée de Ushuaia et le charme montagnard de Bariloche, chaque espace vous invite à vivre une expérience différente.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-2xl md:rounded-3xl">
            <img
              src={lasmorasResidence}
              alt="Résidence LAS MORAS"
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
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
              Tout le nécessaire pour un séjour serein
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map(({ icon: Icon, title }) => (
              <div key={title} className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-brand-red">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold leading-snug text-brand-dark">{title}</h3>
              </div>
            ))}
            <div className="hidden rounded-xl bg-brand-red p-6 text-white shadow-sm lg:block">
              <Sparkles className="mb-4 h-8 w-8" />
              <p className="text-lg font-bold">Une expérience pensée dans chaque détail.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-16 text-center md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${residenceLasMoras})` }}
        />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">
            Notre Vision
          </p>
          <blockquote className="text-2xl font-semibold leading-relaxed text-brand-dark md:text-4xl">
            “Créer un lieu où chaque séjour devient une expérience unique. Nous croyons que le confort va au-delà de l'hébergement : il réside dans les émotions, les souvenirs et les découvertes que chaque espace peut offrir. À LAS MORAS, chaque porte ouvre sur une nouvelle destination.”
          </blockquote>
        </div>
      </section>
    </main>
  );
}
