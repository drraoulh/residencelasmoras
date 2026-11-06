import { useState } from "react";
import type { FormEvent } from "react";
import { supabase, configurationError } from "../../lib/supabase";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export default function Contact() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (!supabase) {
      setMessage(configurationError);
      return;
    }
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true);
    const { error } = await supabase
      .from("contacts")
      .insert({
        nom: fields.get("nom"),
        email: fields.get("email"),
        sujet: fields.get("sujet"),
        message: fields.get("message"),
      });
    setBusy(false);
    setMessage(
      error
        ? "Votre message n’a pas pu être envoyé. Réessayez."
        : "Votre message a été transmis à l’équipe de la résidence.",
    );
    if (!error) form.reset();
  };
  return (
    <div className="min-h-screen bg-brand-gray px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Contactez-<span className="text-brand-red">Nous</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Une question sur un logement ? Un besoin particulier ? Notre équipe
            est à votre disposition pour préparer votre séjour.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-8 lg:gap-10">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-brand-dark sm:mb-8">
                Nos Coordonnées
              </h2>

              <div className="flex flex-col gap-6 sm:gap-8">
                {[
                  {
                    icon: MapPin,
                    title: "Adresse",
                    text: "Yaoundé, Cameroun",
                  },
                  {
                    icon: Phone,
                    title: "Téléphone",
                    text: "+237 6 98 98 82 91",
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    text: "contactlasmoras@gmail.com",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white text-brand-red shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                        {title}
                      </h3>
                      <p className="mt-1 text-base leading-relaxed text-gray-600 sm:mt-2 sm:text-lg">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/237698988291"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1ebd5a] hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)] active:scale-95 sm:w-auto sm:self-start sm:px-8 sm:text-lg"
            >
              <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
              Contactez-nous sur WhatsApp
            </a>

            <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gray-200 shadow-md sm:h-64 sm:rounded-3xl">
              <span className="px-4 text-center text-base font-bold text-gray-500 sm:text-lg">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Residence+Las+Moras+Yaounde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Rechercher la résidence sur Google Maps
                </a>
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-8 lg:rounded-3xl lg:p-12">
            <h2 className="mb-6 text-2xl font-bold text-brand-dark sm:mb-8">
              Envoyez-nous un message
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Votre message sera transmis à l’équipe de la résidence.
            </p>
            {message && (
              <p role="status" className="notice mb-4">
                {message}
              </p>
            )}
            <form onSubmit={send} className="flex flex-col gap-5 sm:gap-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-nom"
                    className="text-sm font-bold uppercase tracking-wide text-gray-700"
                  >
                    Nom complet
                  </label>
                  <input
                    maxLength={150}
                    id="contact-nom"
                    name="nom"
                    type="text"
                    placeholder="Votre nom"
                    className="h-12 w-full rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red sm:h-14 sm:px-5"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-bold uppercase tracking-wide text-gray-700"
                  >
                    Adresse Email
                  </label>
                  <input
                    maxLength={254}
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 w-full rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red sm:h-14 sm:px-5"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-sujet"
                  className="text-sm font-bold uppercase tracking-wide text-gray-700"
                >
                  Sujet
                </label>
                <input
                  maxLength={250}
                  id="contact-sujet"
                  name="sujet"
                  type="text"
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="h-12 w-full rounded-xl bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red sm:h-14 sm:px-5"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-bold uppercase tracking-wide text-gray-700"
                >
                  Message
                </label>
                <textarea
                  maxLength={10000}
                  id="contact-message"
                  name="message"
                  rows={6}
                  placeholder="Votre message..."
                  className="w-full resize-none rounded-xl bg-gray-50 px-4 py-4 font-medium outline-none ring-1 ring-gray-200 transition focus:bg-white focus:ring-2 focus:ring-brand-red sm:px-5"
                  required
                />
              </div>

              <button
                disabled={busy}
                type="submit"
                className="mt-2 w-full rounded-xl bg-brand-red py-4 text-lg font-bold text-white transition hover:bg-red-700 hover:shadow-xl active:scale-95"
              >
                {busy ? "Envoi…" : "Envoyer le message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
