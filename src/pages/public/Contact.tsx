import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useLocalStorageStore } from '../../hooks/useLocalStorageStore';

const initialForm = {
  nom: '',
  email: '',
  sujet: '',
  message: '',
};

const contactCards = [
  {
    icon: Phone,
    title: 'Telephone',
    value: '+237 6 89 88 82 91',
    href: 'tel:+237689888291',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'contactlasmoras@gmail.com',
    href: 'mailto:contactlasmoras@gmail.com',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    value: 'Nkolzie, Mendong, Yaounde',
    href: 'https://share.google/GUJ0aaC0urzsl247t',
  },
];

const socialLinks = [
  { label: 'Google', href: 'https://share.google/GUJ0aaC0urzsl247t' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/v/1ENz4iRMWg/' },
  { label: 'Instagram', href: 'https://www.instagram.com/contactlasmoras?igsh=emMxZW0wdm5xMWcz' },
  { label: 'TikTok', href: 'https://vt.tiktok.com/ZSQS8AC2T/' },
];

export default function Contact() {
  const { addMessage } = useLocalStorageStore();
  const [form, setForm] = useState(initialForm);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addMessage({
      nom: form.nom.trim(),
      email: form.email.trim(),
      sujet: form.sujet.trim(),
      message: form.message.trim(),
    });
    setForm(initialForm);
    setIsSent(true);
  };

  return (
    <main className="bg-brand-gray">
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-brand-red">
                Contact LAS MORAS
              </p>
              <h1 className="text-4xl font-extrabold leading-tight text-brand-dark md:text-6xl">
                Parlons de votre prochain sejour.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
                Une question sur un appartement, une disponibilite ou une reservation ? Notre equipe
                vous repond rapidement et vous accompagne avant votre arrivee.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://wa.me/237689888291"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#25D366] px-6 py-4 text-base font-black text-white transition hover:bg-[#1ebd5a] hover:shadow-[0_8px_20px_rgba(37,211,102,0.28)]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Ecrire sur WhatsApp
                </a>
                <a
                  href="tel:+237689888291"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-4 text-base font-black text-brand-dark transition hover:border-brand-red hover:text-brand-red"
                >
                  Appeler maintenant
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {contactCards.map(({ icon: Icon, title, value, href }) => (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-brand-red">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-gray-400">
                      {title}
                    </p>
                    <p className="mt-1 font-extrabold text-brand-dark">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-xl font-extrabold text-brand-dark">Nous trouver</h2>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  Residence Las Moras, Nkolzie, Mendong, Yaounde.
                </p>
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
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-brand-dark">Suivez LAS MORAS</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Retrouvez nos actualites, videos et apercus des appartements sur nos reseaux.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 transition hover:border-brand-red hover:text-brand-red"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-8 lg:p-10">
            <div className="mb-7">
              <h2 className="text-2xl font-extrabold text-brand-dark">Envoyez-nous un message</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Votre message sera enregistre dans l'espace administrateur pour un suivi rapide.
              </p>
            </div>
            {isSent && (
              <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm font-bold text-green-700 ring-1 ring-green-100">
                Message envoye. Nous revenons vers vous rapidement.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Nom complet
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(event) => setForm({ ...form, nom: event.target.value })}
                    placeholder="Votre nom"
                    className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="votre@email.com"
                    className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Sujet
                <input
                  type="text"
                  value={form.sujet}
                  onChange={(event) => setForm({ ...form, sujet: event.target.value })}
                  placeholder="Reservation, disponibilite, information..."
                  className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Message
                <textarea
                  rows={7}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="Votre message..."
                  className="resize-none rounded-lg bg-gray-50 px-4 py-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red"
                  required
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-brand-red py-4 text-lg font-black text-white transition hover:bg-red-700 hover:shadow-xl active:scale-95"
              >
                <Send className="h-5 w-5" />
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
