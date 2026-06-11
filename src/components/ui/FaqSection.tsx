import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '../../data/faq';

interface FaqSectionProps {
  items: FaqItem[];
  label?: string;
  title?: string;
  description?: string;
  limit?: number;
  showAllLink?: boolean;
  id?: string;
  className?: string;
}

export default function FaqSection({
  items,
  label = 'FAQ',
  title = 'Questions fréquentes',
  description,
  limit,
  showAllLink = false,
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

      <div className="mx-auto mt-8 max-w-3xl sm:mt-10">
        <div className="divide-y divide-stone-200/80 overflow-hidden rounded-2xl border border-stone-200/60 bg-white">
          {displayed.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${id ?? 'section'}-${index}`;
            const buttonId = `faq-button-${id ?? 'section'}-${index}`;

            return (
              <div key={item.question}>
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-brand-gray/60 sm:px-5 sm:py-5"
                >
                  <span className="text-sm font-medium text-brand-dark sm:text-base">{item.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-brand-muted transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-red' : ''
                    }`}
                    strokeWidth={1.5}
                  />
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
                    <p className="px-4 pb-4 text-sm leading-relaxed text-brand-muted sm:px-5 sm:pb-5">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
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
      </div>
    </div>
  );
}
