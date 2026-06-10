import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import residenceLasMoras1 from '../assets/residencelasmoras1.jpeg';
import residenceLasMoras2 from '../assets/residencelasmoras2.jpeg';
import residenceLasMoras3 from '../assets/residencelasmoras3.jpeg';

export type LogementStatus = 'disponible' | 'occupe' | 'maintenance';
export type ReservationStatus = 'demande' | 'confirmee' | 'en_cours' | 'terminee' | 'annulee';
export type PaymentMethod = 'espece' | 'mobile_money' | 'virement' | 'carte';
export type PaymentStatus = 'non_paye' | 'acompte' | 'paye' | 'rembourse';

export interface Logement {
  id: string;
  nom: string;
  type: 'Studio' | 'Appartement' | 'Villa' | 'Chambre' | string;
  prix: number;
  description: string;
  statut: LogementStatus;
  photos: string[];
  dateCreation: string;
  surface?: number;
  equipements?: string[];
}

export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  date: string;
  lu: boolean;
}

export interface Reservation {
  id: string;
  logementId: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  dateArrivee: string;
  dateDepart: string;
  nombreNuits: number;
  montantTotal: number;
  montantPaye: number;
  methodePaiement: PaymentMethod;
  statutPaiement: PaymentStatus;
  statutReservation: ReservationStatus;
  notes?: string;
  dateCreation: string;
}

type LogementDraft = Omit<Logement, 'id' | 'dateCreation'>;
type ContactMessageDraft = Omit<ContactMessage, 'id' | 'date' | 'lu'>;
type ReservationDraft = Omit<Reservation, 'id' | 'dateCreation'>;

interface LocalStorageStore {
  logements: Logement[];
  messages: ContactMessage[];
  reservations: Reservation[];
  addLogement: (draft: LogementDraft) => void;
  updateLogement: (id: string, draft: LogementDraft) => void;
  deleteLogement: (id: string) => void;
  addMessage: (draft: ContactMessageDraft) => void;
  markMessageAsRead: (id: string) => void;
  markAllMessagesAsRead: () => void;
  deleteReadMessages: () => void;
  deleteMessage: (id: string) => void;
  addReservation: (draft: ReservationDraft) => void;
  updateReservation: (id: string, draft: ReservationDraft) => void;
  deleteReservation: (id: string) => void;
}

const LOGEMENTS_KEY = 'las-moras-logements';
const MESSAGES_KEY = 'las-moras-contact-messages';
const RESERVATIONS_KEY = 'las-moras-reservations';

const initialLogements: Logement[] = [
  {
    id: 'cappadocia',
    nom: 'Cappadocia',
    type: 'Appartement',
    prix: 75000,
    description:
      'Appartement meuble spacieux avec salon lumineux, cuisine equipee et confort premium pour les sejours professionnels ou familiaux.',
    statut: 'disponible',
    photos: [residenceLasMoras1, residenceLasMoras2, residenceLasMoras3],
    dateCreation: '2026-06-01T09:00:00.000Z',
    surface: 120,
    equipements: ['Climatisation', 'Wi-Fi Fibre', 'Parking securise'],
  },
  {
    id: 'cancun',
    nom: 'Cancun',
    type: 'Studio',
    prix: 35000,
    description:
      'Studio moderne, pratique et bien amenage, ideal pour un court sejour a Yaounde avec acces rapide aux services essentiels.',
    statut: 'occupe',
    photos: [residenceLasMoras2, residenceLasMoras1],
    dateCreation: '2026-06-02T10:30:00.000Z',
    surface: 45,
    equipements: ['Climatisation', 'Smart TV', 'Cuisine equipee'],
  },
  {
    id: 'galapagos',
    nom: 'Galapagos',
    type: 'Appartement',
    prix: 95000,
    description:
      'Grand logement de standing avec chambres confortables, terrasse et prestations adaptees aux longs sejours.',
    statut: 'maintenance',
    photos: [residenceLasMoras3, residenceLasMoras2],
    dateCreation: '2026-06-03T14:15:00.000Z',
    surface: 150,
    equipements: ['Terrasse', 'Gardien 24/7', 'Wi-Fi'],
  },
];

const initialReservations: Reservation[] = [
  {
    id: 'reservation-demo-1',
    logementId: 'cancun',
    clientNom: 'Jean Dupont',
    clientEmail: 'jean.dupont@example.com',
    clientTelephone: '+237 690 00 00 01',
    dateArrivee: '2026-06-11',
    dateDepart: '2026-06-15',
    nombreNuits: 4,
    montantTotal: 140000,
    montantPaye: 140000,
    methodePaiement: 'mobile_money',
    statutPaiement: 'paye',
    statutReservation: 'confirmee',
    notes: 'Paiement Orange Money confirme.',
    dateCreation: '2026-06-08T10:00:00.000Z',
  },
  {
    id: 'reservation-demo-2',
    logementId: 'cappadocia',
    clientNom: 'Marie Claire',
    clientEmail: 'marie@example.com',
    clientTelephone: '+237 690 00 00 02',
    dateArrivee: '2026-06-20',
    dateDepart: '2026-06-24',
    nombreNuits: 4,
    montantTotal: 300000,
    montantPaye: 100000,
    methodePaiement: 'espece',
    statutPaiement: 'acompte',
    statutReservation: 'demande',
    notes: 'Acompte a encaisser a l arrivee.',
    dateCreation: '2026-06-09T14:30:00.000Z',
  },
];

const StoreContext = createContext<LocalStorageStore | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function countNights(dateArrivee: string, dateDepart: string) {
  const start = new Date(`${dateArrivee}T00:00:00`);
  const end = new Date(`${dateDepart}T00:00:00`);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / 86_400_000));
}

export function rangesOverlap(startA: string, endA: string, startB: string, endB: string) {
  return startA < endB && startB < endA;
}

export function LocalStorageStoreProvider({ children }: { children: ReactNode }) {
  const [logements, setLogements] = useState<Logement[]>(() =>
    readStorage(LOGEMENTS_KEY, initialLogements),
  );
  const [messages, setMessages] = useState<ContactMessage[]>(() =>
    readStorage(MESSAGES_KEY, []),
  );
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    readStorage(RESERVATIONS_KEY, initialReservations),
  );

  useEffect(() => {
    window.localStorage.setItem(LOGEMENTS_KEY, JSON.stringify(logements));
  }, [logements]);

  useEffect(() => {
    window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    window.localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const value = useMemo<LocalStorageStore>(
    () => ({
      logements,
      messages,
      reservations,
      addLogement: (draft) => {
        setLogements((current) => [
          {
            ...draft,
            id: createId('logement'),
            dateCreation: new Date().toISOString(),
          },
          ...current,
        ]);
      },
      updateLogement: (id, draft) => {
        setLogements((current) =>
          current.map((logement) => (logement.id === id ? { ...logement, ...draft } : logement)),
        );
      },
      deleteLogement: (id) => {
        setLogements((current) => current.filter((logement) => logement.id !== id));
      },
      addMessage: (draft) => {
        setMessages((current) => [
          {
            ...draft,
            id: createId('message'),
            date: new Date().toISOString(),
            lu: false,
          },
          ...current,
        ]);
      },
      markMessageAsRead: (id) => {
        setMessages((current) =>
          current.map((message) => (message.id === id ? { ...message, lu: true } : message)),
        );
      },
      markAllMessagesAsRead: () => {
        setMessages((current) => current.map((message) => ({ ...message, lu: true })));
      },
      deleteReadMessages: () => {
        setMessages((current) => current.filter((message) => !message.lu));
      },
      deleteMessage: (id) => {
        setMessages((current) => current.filter((message) => message.id !== id));
      },
      addReservation: (draft) => {
        setReservations((current) => [
          {
            ...draft,
            id: createId('reservation'),
            dateCreation: new Date().toISOString(),
          },
          ...current,
        ]);
      },
      updateReservation: (id, draft) => {
        setReservations((current) =>
          current.map((reservation) =>
            reservation.id === id ? { ...reservation, ...draft } : reservation,
          ),
        );
      },
      deleteReservation: (id) => {
        setReservations((current) => current.filter((reservation) => reservation.id !== id));
      },
    }),
    [logements, messages, reservations],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useLocalStorageStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useLocalStorageStore must be used inside LocalStorageStoreProvider');
  }

  return context;
}
