import {
  Car,
  Coffee,
  Droplets,
  Shield,
  Tv,
  Wifi,
  Wind,
  type LucideIcon,
} from 'lucide-react';

const amenityIconMap: Record<string, LucideIcon> = {
  climatisation: Wind,
  wifi: Wifi,
  'wi-fi': Wifi,
  'wi-fi fibre': Wifi,
  parking: Car,
  'parking sécurisé': Car,
  'parking securise': Car,
  tv: Tv,
  'smart tv': Tv,
  'canal+': Tv,
  café: Coffee,
  cafe: Coffee,
  'machine à café': Coffee,
  'machine a cafe': Coffee,
  gardien: Shield,
  sécurité: Shield,
  securite: Shield,
  eau: Droplets,
  'eau chaude': Droplets,
};

export function getAmenityIcon(name: string): LucideIcon {
  const key = name.toLowerCase().trim();
  for (const [pattern, icon] of Object.entries(amenityIconMap)) {
    if (key.includes(pattern)) return icon;
  }
  return Wifi;
}
