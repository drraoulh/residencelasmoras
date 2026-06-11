import { Star } from 'lucide-react';
import { GOOGLE_REVIEWS_URL, googleReviews, googleReviewsAverage } from '../../data/googleReviews';

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const iconClass = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <div className="flex gap-0.5" aria-label={`${rating} sur 5 étoiles`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconClass} ${
            star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
          }`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

interface GoogleReviewsProps {
  limit?: number;
  className?: string;
}

export default function GoogleReviews({ limit, className = '' }: GoogleReviewsProps) {
  const displayed = limit ? googleReviews.slice(0, limit) : googleReviews;

  return (
    <div className={className}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-label">Avis clients</p>
        <h2 className="section-title mt-2 sm:mt-3">Ce que disent nos voyageurs</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-brand-muted sm:text-base">
          Avis authentiques laissés sur Google par des clients ayant séjourné à LAS MORAS.
        </p>

        <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 shadow-sm">
          <GoogleIcon className="h-5 w-5" />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-brand-dark">{googleReviewsAverage}</span>
              <StarRating rating={Math.round(googleReviewsAverage)} size="md" />
            </div>
            <p className="text-[11px] text-brand-muted">{googleReviews.length} avis Google</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-4 sm:mt-10 sm:grid-cols-2 lg:gap-5">
        {displayed.map((review) => (
          <article key={review.id} className="glass-card-neutral flex flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-brand-dark">{review.author}</p>
                {review.badge && (
                  <p className="mt-0.5 text-[11px] text-brand-muted">{review.badge}</p>
                )}
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-muted">
              « {review.text} »
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center sm:mt-10">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-xs"
        >
          <GoogleIcon className="h-4 w-4" />
          Voir tous les avis sur Google
        </a>
      </div>
    </div>
  );
}
