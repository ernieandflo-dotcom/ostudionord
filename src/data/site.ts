// Données globales : navigation, liens réseaux, Discord, courriel, adresse,
// et la constante MEDIA_URL (R2 ou repli local /media).
// Phase : P1 (étape a)

export const SITE = {
  nom: 'Studio Nord',
  titreDefaut: 'Studio Nord · Son, image, histoires',
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
  { label: 'Partenaires', href: '/partenaires/' },
  { label: 'À propos', href: '/a-propos/' },
] as const;

// Sous-navigation des pages « À propos » (étape h) : sous le titre des 3 pages.
// Contact et FAQ sont aussi ajoutés au pied de page (Footer).
export const SOUS_NAV_A_PROPOS = [
  { label: 'Le studio', href: '/a-propos/' },
  { label: 'Contact', href: '/a-propos/contact/' },
  { label: 'FAQ', href: '/a-propos/faq/' },
] as const;

export const DISCORD = 'https://discord.gg/kTXP3u4tdQ';

// Seule adresse courriel publique. L'adresse de gestion n'apparaît jamais sur le site.
export const COURRIEL = 'info@ostudionord.ca';

// Responsable de la protection des renseignements personnels (Loi 25, art. 3.1) : son titre
// et ses coordonnées doivent être publiés sur le site (page /confidentialite/). Le nom n'est
// pas exigé : on n'affiche que le titre (les fondateurs restent anonymes).
// ─────────────────────────────────────────────────────────────────────────────
// À FAIRE AVANT LE LANCEMENT : désigner la personne (par défaut, la loi confie ce rôle à
// la personne ayant la plus haute autorité dans l'entreprise ; on peut le déléguer par écrit),
// puis remplacer le titre ci-dessous (ex. « Cofondateur de Studio Nord »).
// Tant que le titre contient « REMPLACER », un avertissement s'affiche au build.
// ─────────────────────────────────────────────────────────────────────────────
export const RESPONSABLE_RP = {
  titre: 'REMPLACER (titre du ou de la responsable)',
  courriel: COURRIEL,
} as const;

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

// Drop de merch : géré par Textilart, hors site (GT Média crée l'outil de vente).
// url à null = « bientôt », sans lien. Mettre l'URL de la page du drop quand elle existera.
export const DROP_MERCH: { url: string | null; quand: string; par: string } = {
  url: null,
  quand: 'août 2027',
  par: 'Textilart',
};

// Vente des licences de beats (P3, Stripe Payment Links).
// Tant que c'est false, aucun bouton d'achat ne s'affiche, même si un beat a déjà
// un `prix` et un `lienStripe` dans son .md. Passer à true le jour du lancement des ventes.
export const VENTES_BEATS = false;
