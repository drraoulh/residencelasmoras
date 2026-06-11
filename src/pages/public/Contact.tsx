import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import BrandName from '../../components/ui/BrandName';
import { useMessages } from '../../hooks/useMessages';
import residenceLasMoras from '../../assets/residencelasmoras.jpeg';

const initialForm = { nom: '', email: '', sujet: '', message: '' };

const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6237.579855042787!2d11.46227783168611!3d3.8416910906414037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf3b9065b93b%3A0x625deca93be02be1!2sResidence%20las%20Moras!5e1!3m2!1sen!2sfr!4v1781078204189!5m2!1sen!2sfr';

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/contactlasmoras?igsh=emMxZW0wdm5xMWcz' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/v/1ENz4iRMWg/' },
  { label: 'TikTok', href: 'https://vt.tiktok.com/ZSQS8AC2T/' },
];

export default function Contact() {
  const { addMessage } = useMessages();
  const [form, setForm] = useState(initialForm);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addMessage.mutate({
      nom: form.nom.trim(),
      email: form.email.trim(),
      sujet: form.sujet.trim(),
      message: form.message.trim(),
    });
    setForm(initialForm);
    setIsSent(true);
  };

  return (
    <main className="bg-brand-white">
      {/* Hero */}
      <section className="relative flex min-h-[45vh] items-center justify-center overflow-hidden">
        <img src={residenceLasMoras} alt="Contact LAS MORAS" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-stone-900/50" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-14 text-center sm:px-6">
          <div className="glass-on-image mx-auto inline-block">
            <p className="section-label !text-white/60">Contact</p>
            <div className="mt-3 flex justify-center">
              <BrandName variant="light" size="lg" />
            </div>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/75">
              Une question, une réservation ? Nous vous répondons rapidement.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          {/* Coordonnées rapides */}
          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Phone, label: 'Téléphone', value: '+237 6 89 88 82 91', href: 'tel:+237689888291' },
              { icon: Mail, label: 'Email', value: 'contactlasmoras@gmail.com', href: 'mailto:contactlasmoras@gmail.com' },
              { icon: MapPin, label: 'Adresse', value: 'Nkolzie, Mendong, Yaoundé', href: 'https://share.google/GUJ0aaC0urzsl247t' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="glass-card flex items-start gap-4 p-5 transition hover:shadow-md"
              >
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-red" strokeWidth={1.5} />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-brand-muted">{label}</p>
                  <p className="mt-1 text-sm font-medium text-brand-dark">{value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Carte + réseaux */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-stone-200/60">
                <iframe
                  src={MAP_EMBED}
                  title="Carte LAS MORAS"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="glass-card p-5">
                <p className="text-sm font-medium text-brand-dark">Suivez-nous</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-brand-muted transition hover:text-brand-red"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
                <a
                  href="https://wa.me/237689888291"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1ebd5a]"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Formulaire */}
            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-lg font-medium text-brand-dark">Envoyez un message</h2>
              <p className="mt-1 text-sm text-brand-muted">
                Votre message sera traité par notre équipe.
              </p>

              {isSent && (
                <div className="mt-5 rounded-xl border border-green-200/80 bg-green-50 px-4 py-3 text-sm text-green-700">
                  Message envoyé. Nous revenons vers vous rapidement.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm text-brand-muted">
                    Nom
                    <input
                      type="text"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className="form-input"
                      required
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm text-brand-muted">
                    Email
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="form-input"
                      required
                    />
                  </label>
                </div>
                <label className="grid gap-1.5 text-sm text-brand-muted">
                  Sujet
                  <input
                    type="text"
                    value={form.sujet}
                    onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                    placeholder="Réservation, disponibilité..."
                    className="form-input"
                    required
                  />
                </label>
                <label className="grid gap-1.5 text-sm text-brand-muted">
                  Message
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="form-input resize-none py-3"
                    required
                  />
                </label>
                <button type="submit" className="btn-accent mt-2">
                  <Send className="h-4 w-4" />
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
