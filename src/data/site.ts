// Données globales : navigation, liens réseaux, Discord, courriel, adresse,
// et la constante MEDIA_URL (R2 ou repli local /media).
// Phase : P1 (étape a)

export const SITE = {
  nom: 'Studio Nord',
  titreDefaut: 'Studio Nord — Son, image, histoires',
  description:
    'Studio Nord, studio de création multimédia de Limoilou (Québec) : musique, vidéo, coulisses et séries avec les artistes de la maison.',
  locale: 'fr_CA',
} as const;

// Menu principal (Header) et menu du pied de page (Footer).
export const NAVIGATION = [
  { label: 'Contenu', href: '/contenu/' },
  { label: 'Artistes', href: '/artistes/' },
  { label: 'Créateurs', href: '/createurs/' },
  { label: 'Boutique', href: '/boutique/' },
  { label: 'Studio', href: '/studio/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const DISCORD = 'https://discord.gg/kTXP3u4tdQ';

// Seule adresse courriel publique. L'adresse de gestion n'apparaît jamais sur le site.
export const COURRIEL = 'info@ostudionord.ca';

export const ADRESSE = {
  rue: '199, 2e Avenue',
  quartier: 'Limoilou',
  ville: 'Québec',
  province: 'QC',
  codePostal: 'G1L 3A5',
} as const;

// Réseaux du studio. Un lien à null est masqué partout sur le site :
// il suffit d'ajouter l'URL ici pour qu'il apparaisse.
type Reseau = { nom: string; url: string | null };

export const RESEAUX: Reseau[] = [
  { nom: 'Instagram', url: 'https://www.instagram.com/o.studionord/' },
  { nom: 'TikTok', url: null },
  { nom: 'YouTube', url: null },
];

export const reseauxActifs = RESEAUX.filter(
  (r): r is { nom: string; url: string } => r.url !== null,
);

// Médias lourds (vidéos) : servis par R2 (media.ostudionord.ca).
// Sans PUBLIC_MEDIA_URL, repli local sur /media (dossier public/media/, ignoré par Git).
export const MEDIA_URL = (import.meta.env.PUBLIC_MEDIA_URL || '/media').replace(/\/+$/, '');

/** Construit l'URL complète d'un média. Ex. : media('video/decompte/DecompteSN_Jour1_720.mp4') */
export function media(chemin: string): string {
  return `${MEDIA_URL}/${chemin.replace(/^\/+/, '')}`;
}

// ---------- Boutique (étape f) ----------

// Drop de merch : landing page de GT Média, hors site.
// url à null = texte « Drop · {quand} » sans lien. Remplacer l'URL par celle de la landing page
// du drop quand elle existera (pour l'instant : le site de GT Média).
export const DROP_MERCH: { url: string | null; quand: string; par: string } = {
  url: 'https://grossetete.ca/',
  quand: 'août 2027',
  par: 'GT Média',
};

// Vente des licences de beats (P3, Stripe Payment Links).
// Tant que c'est false, aucun bouton d'achat ne s'affiche, même si un beat a déjà
// un `prix` et un `lienStripe` dans son .md. Passer à true le jour du lancement des ventes.
export const VENTES_BEATS = false;
