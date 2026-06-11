import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import BrandName from '../../components/ui/BrandName';
import FaqSection from '../../components/ui/FaqSection';
import { faqItems } from '../../data/faq';
import { useMessages } from '../../hooks/useMessages';
import vueResidence from '../../assets/Vue residence.jpeg';

const initialForm = { nom: '', email: '', sujet: '', message: '' };

const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6237.579855042787!2d11.46227783168611!3d3.8416910906414037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf3b9065b93b%3A0x625deca93be02be1!2sResidence%20las%20Moras!5e1!3m2!1sen!2sfr!4v1781078204189!5m2!1sen!2sfr';

const MAP_LINK = 'https://share.google/GUJ0aaC0urzsl247t';
const WHATSAPP_LINK = 'https://wa.me/237689888291';

const contactMethods = [
  {
    icon: Phone,
    label: 'Téléphone',
    value: '+237 6 89 88 82 91',
    href: 'tel:+237689888291',
    hint: 'Appel ou SMS',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contactlasmoras@gmail.com',
    href: 'mailto:contactlasmoras@gmail.com',
    hint: 'Réponse sous 24 h',
  },
  {
    icon: MapPin,
    label: 'Adresse',
    value: 'Nkolzie, Mendong, Yaoundé',
    href: MAP_LINK,
    hint: 'Voir sur la carte',
    external: true,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Discuter avec nous',
    href: WHATSAPP_LINK,
    hint: 'Réponse rapide',
    external: true,
    accent: true,
  },
];

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/contactlasmoras?igsh=emMxZW0wdm5xMWcz' },
  { label: 'Facebook', href: 'https://www.facebook.com/share/v/1ENz4iRMWg/' },
  { label: 'TikTok', href: 'https://vt.tiktok.com/ZSQS8AC2T/' },
  { label: 'Google', href: MAP_LINK },
];

const subjectPresets = ['Réservation', 'Disponibilité', 'Tarifs', 'Autre'];

const contactFaq = faqItems.filter((_, index) => [2, 3, 5].includes(index));

export default function Contact() {
  const { addMessage } = useMessages();
  const [form, setForm] = useState(initialForm);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSent(false);

    try {
      await addMessage.mutateAsync({
        nom: form.nom.trim(),
        email: form.email.trim(),
        sujet: form.sujet.trim(),
        message: form.message.trim(),
      });
      setForm(initialForm);
      setIsSent(true);
    } catch {
      // Erreur affichée via addMessage.isError
    }
  };

  return (
    <main className="bg-brand-white">
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
        <img
          src={vueResidence}
          alt="Contact LAS MORAS"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/55" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-16 text-center sm:px-6">
          <div className="glass-on-image mx-auto inline-block max-w-xl">
            <p className="section-label !text-white/60">Contact</p>
            <div className="mt-3 flex justify-center">
              <BrandName variant="light" size="lg" />
            </div>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/75">
              Réservation, disponibilité ou renseignement — notre équipe vous répond rapidement,
              7 jours sur 7.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 min-[400px]:flex-row">
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-accent w-full min-[400px]:w-auto">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a href="tel:+237689888291" className="btn-glass w-full min-[400px]:w-auto">
                <Phone className="h-4 w-4" />
                Appeler
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Coordonnées */}
      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">Nous joindre</p>
            <h2 className="section-title mt-2 sm:mt-3">Plusieurs moyens de nous contacter</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-brand-muted">
              Choisissez le canal qui vous convient. Pour une réservation urgente, WhatsApp est le
              plus rapide.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {contactMethods.map(({ icon: Icon, label, value, href, hint, external, accent }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className={`group glass-card flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-6 ${
                  accent ? 'border-[#25D366]/30 bg-[#25D366]/5 hover:border-[#25D366]/50' : ''
                }`}
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 transition group-hover:bg-red-50 ${
                    accent
                      ? 'bg-[#25D366]/10 text-[#1a9e4a] ring-[#25D366]/30'
                      : 'bg-red-50 text-brand-red ring-stone-200/60'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-brand-muted">{label}</p>
                  <p className="mt-1 text-sm font-medium leading-snug text-brand-dark transition group-hover:text-brand-red">
                    {value}
                  </p>
                  <p className="mt-1.5 text-xs text-brand-muted">{hint}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-brand-gray px-4 py-2.5 text-xs text-brand-muted">
              <Clock className="h-3.5 w-3.5 shrink-0 text-brand-red" strokeWidth={1.5} />
              Assistance disponible 7j/7 · Réponse généralement sous 24 h
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire + carte */}
      <section className="border-y border-stone-200/60 bg-brand-gray px-4 py-16 sm:px-6 md:py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5 lg:gap-14 xl:gap-16">
          {/* Formulaire */}
          <div className="lg:col-span-3">
            <div className="glass-card-neutral p-6 sm:p-8 lg:p-10">
              <p className="section-label">Message</p>
              <h2 className="mt-2 text-xl font-medium text-brand-dark sm:text-2xl">
                Envoyez-nous un message
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                Décrivez votre demande et nous reviendrons vers vous par email ou téléphone.
              </p>

              {isSent && (
                <div className="mt-6 rounded-xl border border-green-200/80 bg-green-50 px-4 py-3 text-sm text-green-800">
                  Message envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.
                </div>
              )}

              {addMessage.isError && (
                <div className="mt-6 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-800">
                  Envoi impossible pour le moment. Réessayez ou contactez-nous par WhatsApp.
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-brand-muted">
                    Nom complet
                    <input
                      type="text"
                      value={form.nom}
                      onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className="form-input"
                      placeholder="Votre nom"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-brand-muted">
                    Email
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="form-input"
                      placeholder="vous@exemple.com"
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-2">
                  <span className="text-sm text-brand-muted">Sujet</span>
                  <div className="flex flex-wrap gap-2">
                    {subjectPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setForm({ ...form, sujet: preset })}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                          form.sujet === preset
                            ? 'border-brand-red bg-brand-red text-white'
                            : 'border-stone-200/80 bg-white/80 text-brand-muted hover:border-brand-red/30 hover:text-brand-dark'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={form.sujet}
                    onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                    placeholder="Précisez votre sujet si besoin"
                    className="form-input"
                    required
                  />
                </div>

                <label className="grid gap-2 text-sm text-brand-muted">
                  Message
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Dates souhaitées, type de logement, nombre de personnes..."
                    className="form-input min-h-[140px] resize-y py-3"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={addMessage.isPending}
                  className="btn-accent mt-1 w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {addMessage.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Carte + infos */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-stone-200/60 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <iframe
                src={MAP_EMBED}
                title="Carte LAS MORAS — Nkolzie, Mendong, Yaoundé"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full sm:h-[320px]"
              />
              <div className="border-t border-stone-200/60 bg-white/80 px-4 py-3.5 sm:px-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-brand-dark">Résidence LAS MORAS</p>
                    <p className="mt-0.5 text-xs text-brand-muted">Carrefour Nkolzie, Mendong, Yaoundé</p>
                  </div>
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand-red transition hover:underline"
                  >
                    Itinéraire
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <p className="text-sm font-medium text-brand-dark">Besoin d'une réponse immédiate ?</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                Pour vérifier une disponibilité ou confirmer une réservation, écrivez-nous sur
                WhatsApp.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1ebd5a] sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Ouvrir WhatsApp
              </a>
            </div>

            <div className="glass-card p-6">
              <p className="section-label !mb-3 !text-brand-red">Suivez-nous</p>
              <div className="flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-stone-200/80 bg-white/80 px-3.5 py-2 text-xs font-medium text-brand-muted transition hover:border-brand-red/30 hover:bg-red-50 hover:text-brand-red"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ contact */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <FaqSection
            id="contact-faq"
            items={contactFaq}
            label="Avant de nous écrire"
            title="Questions fréquentes"
            description="Localisation, réservation et services — les réponses aux demandes les plus courantes."
          />
          <div className="mt-8 text-center">
            <Link to="/a-propos#faq" className="btn-ghost text-xs">
              Voir toutes les questions
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card flex flex-col items-center justify-between gap-6 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
            <div>
              <p className="section-label">Réserver</p>
              <h2 className="section-title mt-2 text-2xl sm:text-3xl">Prêt à choisir votre logement ?</h2>
              <p className="mt-2 text-sm text-brand-muted">
                Parcourez le catalogue et consultez les disponibilités en ligne.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <Link to="/catalogue" className="btn-accent w-full sm:w-auto">
                Voir le catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/a-propos#faq" className="btn-ghost w-full sm:w-auto">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
