import { Car, Home, Smartphone, Shirt, Wrench, Briefcase, MapPin, Baby, Hammer, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
  color: string;
  subcategories: SubcategoryData[];
}

export interface SubcategoryData {
  name: string;
  slug: string;
}

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

export const allCategories: CategoryData[] = [
  {
    id: '1',
    name: 'Véhicules',
    slug: 'vehicules',
    icon: Car,
    color: 'text-blue-600',
    subcategories: [
      { name: 'Voitures', slug: generateSlug('Voitures') },
      { name: 'Motos', slug: generateSlug('Motos') },
      { name: 'Camions', slug: generateSlug('Camions') },
      { name: 'Bateaux', slug: generateSlug('Bateaux') },
      { name: 'Caravaning', slug: generateSlug('Caravaning') },
      { name: 'Utilitaires', slug: generateSlug('Utilitaires') },
      { name: 'Nautisme', slug: generateSlug('Nautisme') }
    ]
  },
  {
    id: '2',
    name: 'Immobilier',
    slug: 'immobilier',
    icon: Home,
    color: 'text-green-600',
    subcategories: [
      { name: 'Appartements', slug: generateSlug('Appartements') },
      { name: 'Maisons', slug: generateSlug('Maisons') },
      { name: 'Terrains', slug: generateSlug('Terrains') },
      { name: 'Locaux commerciaux', slug: generateSlug('Locaux commerciaux') },
      { name: 'Colocations', slug: generateSlug('Colocations') },
      { name: 'Bureaux & Commerces', slug: generateSlug('Bureaux & Commerces') }
    ]
  },
  {
    id: '3',
    name: 'Electronique',
    slug: 'electronique',
    icon: Smartphone,
    color: 'text-purple-600',
    subcategories: [
      { name: 'Téléphones & Objets connectés', slug: generateSlug('Téléphones & Objets connectés') },
      { name: 'Ordinateurs', slug: generateSlug('Ordinateurs') },
      { name: 'Accessoires informatiques', slug: generateSlug('Accessoires informatiques') },
      { name: 'Photo & vidéo', slug: generateSlug('Photo & vidéo') }
    ]
  },
  {
    id: '4',
    name: 'Mode',
    slug: 'mode',
    icon: Shirt,
    color: 'text-pink-600',
    subcategories: [
      { name: 'Vêtements', slug: generateSlug('Vêtements') },
      { name: 'Chaussures', slug: generateSlug('Chaussures') },
      { name: 'Accessoires', slug: generateSlug('Accessoires') },
      { name: 'Montres & Bijoux', slug: generateSlug('Montres & Bijoux') }
    ]
  },
  {
    id: '5',
    name: 'Maison & Jardin',
    slug: 'maison-jardin',
    icon: Wrench,
    color: 'text-orange-600',
    subcategories: [
      { name: 'Ameublement', slug: generateSlug('Ameublement') },
      { name: 'Appareils électroménagers', slug: generateSlug('Appareils électroménagers') },
      { name: 'Décoration', slug: generateSlug('Décoration') },
      { name: 'Plantes & jardin', slug: generateSlug('Plantes & jardin') },
      { name: 'Bricolage', slug: generateSlug('Bricolage') }
    ]
  },
  {
    id: '6',
    name: 'Services',
    slug: 'services',
    icon: Briefcase,
    color: 'text-indigo-600',
    subcategories: [
      { name: 'Services aux entreprises', slug: generateSlug('Services aux entreprises') },
      { name: 'Services à la personne', slug: generateSlug('Services à la personne') },
      { name: 'Événements', slug: generateSlug('Événements') },
      { name: 'Artisans & Musiciens', slug: generateSlug('Artisans & Musiciens') },
      { name: 'Baby-Sitting', slug: generateSlug('Baby-Sitting') },
      { name: 'Cours particuliers', slug: generateSlug('Cours particuliers') }
    ]
  },
  {
    id: '7',
    name: 'Emploi',
    slug: 'emploi',
    icon: Briefcase,
    color: 'text-slate-600',
    subcategories: [
      { name: 'Offres d\'emploi', slug: generateSlug('Offres d\'emploi') },
      { name: 'Formations professionnelles', slug: generateSlug('Formations professionnelles') }
    ]
  },
  {
    id: '8',
    name: 'Locations de vacances',
    slug: 'locations-vacances',
    icon: MapPin,
    color: 'text-teal-600',
    subcategories: [
      { name: 'Locations saisonnières', slug: generateSlug('Locations saisonnières') },
      { name: 'Ventes flash vacances', slug: generateSlug('Ventes flash vacances') },
      { name: 'Locations Europe', slug: generateSlug('Locations Europe') }
    ]
  },
  {
    id: '9',
    name: 'Famille',
    slug: 'famille',
    icon: Baby,
    color: 'text-yellow-600',
    subcategories: [
      { name: 'Équipement bébé', slug: generateSlug('Équipement bébé') },
      { name: 'Mobilier enfant', slug: generateSlug('Mobilier enfant') },
      { name: 'Jouets', slug: generateSlug('Jouets') }
    ]
  },
  {
    id: '10',
    name: 'Loisirs',
    slug: 'loisirs',
    icon: Package,
    color: 'text-red-600',
    subcategories: [
      { name: 'CD - Musique', slug: generateSlug('CD - Musique') },
      { name: 'DVD - Films', slug: generateSlug('DVD - Films') },
      { name: 'Livres', slug: generateSlug('Livres') },
      { name: 'Jeux & Jouets', slug: generateSlug('Jeux & Jouets') },
      { name: 'Sport & Plein Air', slug: generateSlug('Sport & Plein Air') }
    ]
  },
  {
    id: '11',
    name: 'Matériel professionnel',
    slug: 'materiel-professionnel',
    icon: Hammer,
    color: 'text-amber-600',
    subcategories: [
      { name: 'Tracteurs', slug: generateSlug('Tracteurs') },
      { name: 'BTP - Chantier', slug: generateSlug('BTP - Chantier') },
      { name: 'Matériel agricole', slug: generateSlug('Matériel agricole') },
      { name: 'Équipements pros', slug: generateSlug('Équipements pros') }
    ]
  },
  {
    id: '12',
    name: 'Autre',
    slug: 'autre',
    icon: Package,
    color: 'text-gray-600',
    subcategories: [
      { name: 'Divers', slug: generateSlug('Divers') },
      { name: 'Non catégorisé', slug: generateSlug('Non catégorisé') }
    ]
  }
];

export const getCategoryBySlug = (slug: string): CategoryData | undefined => {
  return allCategories.find(cat => cat.slug === slug);
};

export const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string): { category: CategoryData; subcategory: SubcategoryData } | undefined => {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  
  const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug);
  if (!subcategory) return undefined;
  
  return { category, subcategory };
};
