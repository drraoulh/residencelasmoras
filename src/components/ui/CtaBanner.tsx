import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '../../utils/whatsapp';

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-brand-dark px-4 pt-16 pb-0 md:pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(213,0,0,0.15),_transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl pb-14 text-center md:pb-16">
        <p className="section-label mb-4 text-red-400">Prêt à réserver ?</p>
        <h2 className="font-heading text-3xl font-medium leading-tight text-white md:text-5xl">
          Votre prochain séjour d&apos;exception vous attend
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-400">
          Découvrez nos appartements thématiques et réservez en quelques clics. Notre équipe est
          disponible pour vous accompagner.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/catalogue" className="btn-primary px-8 py-4 text-base">
            Voir nos logements
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#25D366] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#1ebd5a] hover:shadow-lg hover:shadow-green-500/20"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
