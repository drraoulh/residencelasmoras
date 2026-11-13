import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_LINK } from '../../utils/whatsapp';
import {
  BedDouble,
  ChevronDown,
  CircleHelp,
  CreditCard,
  MapPin,
  MessageCircle,
  Wifi,
} from 'lucide-react';
import type { FaqCategory, FaqItem } from '../../data/faq';

interface FaqSectionProps {
  items: FaqItem[];
  label?: string;
  title?: string;
  description?: string;
  limit?: number;
  showAllLink?: boolean;
  showContactCta?: boolean;
  id?: string;
  className?: string;
}

const categoryIcons: Record<FaqCategory, typeof BedDouble> = {
  Hébergement: BedDouble,
  Services: Wifi,
  Réservation: CreditCard,
  Pratique: MapPin,
};

function FaqCategoryBadge({ category }: { category: FaqCategory }) {
  const Icon = categoryIcons[category];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-brand-red">
      <Icon className="h-3 w-3" strokeWidth={1.5} />
      {category}
    </span>
  );
}

export default function FaqSection({
  items,
  label = 'FAQ',
  title = 'Questions fréquentes',
  description,
  limit,
  showAllLink = false,
  showContactCta = false,
  id,
  className = '',
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const displayed = limit ? items.slice(0, limit) : items;

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div id={id} className={className}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label">{label}</p>
        <h2 className="section-title mt-2 sm:mt-3">{title}</h2>
        {description && (
          <p className="mx-auto mt-3 max-w-lg text-sm text-brand-muted sm:text-base">{description}</p>
        )}
      </div>

      <div className="mx-auto mt-8 max-w-3xl space-y-3 sm:mt-10">
        {displayed.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `faq-panel-${id ?? 'section'}-${index}`;
          const buttonId = `faq-button-${id ?? 'section'}-${index}`;

          return (
            <article
              key={item.question}
              className={`overflow-hidden rounded-2xl border transition duration-300 ${
                isOpen
                  ? 'border-brand-red/25 bg-white shadow-[0_8px_32px_rgba(196,30,30,0.08)]'
                  : 'border-stone-200/60 bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-stone-300/80'
              }`}
            >
              <button
                id={buttonId}
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-start gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-semibold transition ${
                    isOpen ? 'bg-brand-red text-white' : 'bg-brand-gray text-brand-muted'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <FaqCategoryBadge category={item.category} />
                  <span className="mt-2 block text-sm font-medium leading-snug text-brand-dark sm:text-base">
                    {item.question}
                  </span>
                </span>
                <span
                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                    isOpen
                      ? 'border-brand-red/20 bg-red-50 text-brand-red'
                      : 'border-stone-200/80 bg-white text-brand-muted'
                  }`}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={1.5}
                  />
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-stone-100 px-4 pb-4 sm:px-5 sm:pb-5">
                    <p className="border-l-2 border-brand-red/30 pl-4 text-sm leading-relaxed text-brand-muted">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {showAllLink && limit && items.length > limit && (
        <div className="mt-6 text-center">
          <Link to="/a-propos#faq" className="btn-ghost text-xs">
            Voir toutes les questions
          </Link>
        </div>
      )}

      {showContactCta && (
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-stone-200/60 bg-white p-5 sm:mt-10 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex items-start gap-3 sm:items-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-brand-red">
              <CircleHelp className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-medium text-brand-dark">Une autre question ?</p>
              <p className="mt-0.5 text-xs text-brand-muted sm:text-sm">
                Notre équipe vous répond rapidement, 7j/7.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 min-[400px]:flex-row sm:mt-0">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn-accent w-full text-xs sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <Link to="/contact" className="btn-ghost w-full text-xs sm:w-auto">
              Nous écrire
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
