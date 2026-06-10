import lamorasResidence from '../assets/lamorasresidence.jpeg';
import lasmoras from '../assets/lasmoras.jpeg';
import lasmorasResidence from '../assets/lasmorasresidence.jpeg';
import residenceLasMoras from '../assets/residencelasmoras.jpeg';
import residenceLasMoras1 from '../assets/residencelasmoras1.jpeg';
import residenceLasMoras2 from '../assets/residencelasmoras2.jpeg';
import residenceLasMoras3 from '../assets/residencelasmoras3.jpeg';
import vueResidence from '../assets/Vue residence.jpeg';

export type GalleryCategory = 'Résidence' | 'Intérieurs' | 'Ambiance';

export interface GalleryImage {
  src: string;
  label: string;
  category: GalleryCategory;
}

export const galleryImages: GalleryImage[] = [
  { src: vueResidence, label: 'Vue panoramique', category: 'Résidence' },
  { src: residenceLasMoras, label: 'Façade principale', category: 'Résidence' },
  { src: lasmorasResidence, label: 'Entrée de la résidence', category: 'Résidence' },
  { src: lamorasResidence, label: 'Espaces communs', category: 'Résidence' },
  { src: residenceLasMoras1, label: 'Salon lumineux', category: 'Intérieurs' },
  { src: residenceLasMoras2, label: 'Espace de vie', category: 'Intérieurs' },
  { src: residenceLasMoras3, label: 'Chambre confortable', category: 'Intérieurs' },
  { src: lasmoras, label: 'Ambiance chaleureuse', category: 'Ambiance' },
];

export const galleryCategories: GalleryCategory[] = ['Résidence', 'Intérieurs', 'Ambiance'];
