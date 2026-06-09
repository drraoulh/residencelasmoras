import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-brand-gray px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Contactez-<span className="text-brand-red">Nous</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Une question sur un logement ? Un besoin particulier ? Notre équipe est à votre disposition pour préparer votre séjour.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8 lg:gap-10">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-brand-dark sm:mb-8">Nos Coordonnées</h2>

              <div className="flex flex-col gap-6 sm:gap-8">
                {[
                  {
                    icon: MapPin,
                    title: 'Adresse',
                    text: 'Carrefour Bastos, Immeuble Horizon, Yaoundé, Cameroun',
                  },
                  {
                    icon: Phone,
                    title: 'Téléphone',
                    text: '+237 600 00 00 00',
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    text: 'contact@residencelasmoras.com',
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white text-brand-red shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
                      <p className="mt-1 text-base leading-relaxed text-gray-600 sm:mt-2 sm:text-lg">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1ebd5a] hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)] active:scale-95 sm:w-auto sm:self-start sm:px-8 sm:text-lg">
              <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
              Contactez-nous sur WhatsApp
            </button>

            <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gray-200 shadow-md sm:h-64 sm:rounded-3xl">
              <span className="px-4 text-center text-base font-bold text-gray-500 sm:text-lg">
                Carte Google Maps
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-8 lg:rounded-3xl lg:p-12">
            <h2 className="mb-6 text-2xl font-bold text-brand-dark sm:mb-8">Envoyez-nous un message</h2>
            <form className="flex flex-col gap-5 sm:gap-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-700">Nom complet</label>
                  <input type="text" placeholder="John Doe" className="h-12 w-full rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red sm:h-14 sm:px-5" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold uppercase tracking-wide text-gray-700">Adresse Email</label>
                  <input type="email" placeholder="john@example.com" className="h-12 w-full rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red sm:h-14 sm:px-5" required />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-700">Sujet</label>
                <input type="text" placeholder="Comment pouvons-nous vous aider ?" className="h-12 w-full rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red sm:h-14 sm:px-5" required />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-700">Message</label>
                <textarea rows={6} placeholder="Votre message..." className="w-full resize-none rounded-xl bg-gray-50 px-4 py-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red sm:px-5" required />
              </div>

              <button type="submit" className="mt-2 w-full rounded-xl bg-brand-red py-4 text-lg font-bold text-white transition hover:bg-red-700 hover:shadow-xl active:scale-95">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
