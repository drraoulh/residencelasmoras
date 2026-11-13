import type { GalleryCategory, GalleryImage } from '../types';
import lamorasResidence from '../assets/lamorasresidence.jpeg';
import lasmoras from '../assets/lasmoras.jpeg';
import lasmorasResidence from '../assets/lasmorasresidence.jpeg';
import residenceLasMoras from '../assets/residencelasmoras.jpeg';
import residenceLasMoras1 from '../assets/residencelasmoras1.jpeg';
import residenceLasMoras2 from '../assets/residencelasmoras2.jpeg';
import residenceLasMoras3 from '../assets/residencelasmoras3.jpeg';
import vueResidence from '../assets/Vue residence.jpeg';

export type { GalleryCategory };

/** Images par défaut (fallback si la table Supabase est vide). */
export const defaultGalleryImages: GalleryImage[] = [
  { id: 'default-1', label: 'Vue panoramique', category: 'Résidence', image_url: vueResidence, sort_order: 1, visible: true },
  { id: 'default-2', label: 'Façade principale', category: 'Résidence', image_url: residenceLasMoras, sort_order: 2, visible: true },
  { id: 'default-3', label: 'Entrée de la résidence', category: 'Résidence', image_url: lasmorasResidence, sort_order: 3, visible: true },
  { id: 'default-4', label: 'Espaces communs', category: 'Résidence', image_url: lamorasResidence, sort_order: 4, visible: true },
  { id: 'default-5', label: 'Salon lumineux', category: 'Intérieurs', image_url: residenceLasMoras1, sort_order: 5, visible: true },
  { id: 'default-6', label: 'Espace de vie', category: 'Intérieurs', image_url: residenceLasMoras2, sort_order: 6, visible: true },
  { id: 'default-7', label: 'Chambre confortable', category: 'Intérieurs', image_url: residenceLasMoras3, sort_order: 7, visible: true },
  { id: 'default-8', label: 'Ambiance chaleureuse', category: 'Ambiance', image_url: lasmoras, sort_order: 8, visible: true },
];

export const galleryCategories: GalleryCategory[] = ['Résidence', 'Intérieurs', 'Ambiance'];
