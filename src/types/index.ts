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
  created_at?: string;
  surface?: number;
  equipements?: string[];
}

export type GalleryCategory = 'Résidence' | 'Intérieurs' | 'Ambiance';

export interface GalleryImage {
  id: string;
  label: string;
  category: GalleryCategory;
  image_url: string;
  storage_path?: string | null;
  sort_order?: number;
  visible?: boolean;
  created_at?: string;
}

export interface GalleryImageDraft {
  label: string;
  category: GalleryCategory;
  image_url: string;
  storage_path?: string | null;
  sort_order?: number;
  visible?: boolean;
}

export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  created_at?: string;
  lu: boolean;
}

export interface Reservation {
  id: string;
  logement_id: string;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  date_arrivee: string;
  date_depart: string;
  nombre_nuits: number;
  montant_total: number;
  montant_paye: number;
  methode_paiement: PaymentMethod;
  statut_paiement: PaymentStatus;
  statut_reservation: ReservationStatus;
  notes?: string;
  created_at?: string;
  logements?: { nom: string };
}
