export const GOOGLE_REVIEWS_URL = 'https://share.google/GUJ0aaC0urzsl247t';

export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  badge?: string;
}

export const googleReviews: GoogleReview[] = [
  {
    id: 'francois-elat',
    author: 'François koron Elat',
    rating: 4,
    badge: 'Local Guide',
    text: "J'ai beaucoup apprécié mon séjour à la Résidence LAS-MORAS à Nkolzié. Cadre paisible, chambres confortables et bon accueil. Je recommande vivement.",
  },
  {
    id: 'emmanuel-djiokeng',
    author: 'Emmanuel Djiokeng',
    rating: 5,
    text: 'Le service est vraiment de qualité avec un prix imbattable. Je suis plus que satisfait.',
  },
  {
    id: 'dominique-neveu',
    author: 'Dominique Neveu',
    rating: 5,
    text: "J'ai fait 2 séjours au sein de la résidence LAS MORAS. L'hébergement est de qualité : salon, chambre. Climatisation de toutes les pièces qui fonctionne très bien. Salle de bain et cuisine correct. Le personnel est très sympathique, compétent à votre service immédiatement en cas de besoin. Le ménage est fait régulièrement. Résidence très bien sécurisée. En conclusion : je recommande cette résidence pour votre séjour sur Yaoundé.",
  },
  {
    id: 'bernadette-peh',
    author: 'Bernadette PEH',
    rating: 4,
    text: "Séjour en famille très agréable dans l'appartement Cancun. Personnel et promoteur disponibles et très à l'écoute. Je vous recommande cette résidence.",
  },
];

export const googleReviewsAverage =
  Math.round((googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length) * 10) / 10;
