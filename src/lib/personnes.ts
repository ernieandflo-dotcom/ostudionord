// Outils pour les collections « artistes » et « createurs » : tri, sous-titres, liens externes,
// dégradés des avatars, description de partage.
// Utilisé par l'accueil, CarteArtiste, /artistes/ et /artistes/[slug]/ (étape d), /createurs/ (étape e).
// Phase : P1 (étape d)

import type { CollectionEntry } from 'astro:content';

export type Artiste = CollectionEntry<'artistes'>;
export type Createur = CollectionEntry<'createurs'>;
export type Liens = Artiste['data']['liens'];

// ---------- Tri ----------

// Comparateur « à la française » : ignore majuscules et accents (Mølie avec les M),
// et range les nombres dans l'ordre naturel (777pluvieux avant les lettres).
const alpha = new Intl.Collator('fr-CA', { sensitivity: 'base', numeric: true });

/**
 * Tri des artistes et créateurs : champ `ordre` d'abord (petit = en premier),
 * puis ordre alphabétique. Sans `ordre` dans le .md (défaut : 100), c'est donc alphabétique.
 * S'utilise avec .sort() : artistes.sort(parOrdre)
 */
export function parOrdre(a: Artiste | Createur, b: Artiste | Createur): number {
  return a.data.ordre - b.data.ordre || alpha.compare(a.data.nom, b.data.nom);
}

// ---------- Textes ----------

export const ROLES: Record<Artiste['data']['role'], string> = {
  artiste: 'Artiste',
  beatmaker: 'Beatmaker',
};

/** Ligne sous le nom sur les cartes : « Beatmaker », ou les deux premiers genres. */
export function sousTitreArtiste(a: Artiste): string {
  return a.data.role === 'beatmaker' ? ROLES.beatmaker : a.data.genres.slice(0, 2).join(' · ');
}

// « Pop » → « pop », mais « R&B » reste « R&B ».
const minuscule = (g: string) => (/^[A-Z&]+$/.test(g) ? g : g.toLocaleLowerCase('fr-CA'));

/** Genres dans une phrase : « rap, pop, drill, trap, cinematic » (R&B garde ses majuscules). */
export const genresEnTexte = (genres: string[]) => genres.map(minuscule).join(', ');

/**
 * Description d'un artiste (balise meta et partage) : l'accroche si elle existe,
 * sinon une phrase générée, ex. « Mølie — pop, R&B, hip-hop. Artiste de Studio Nord à Limoilou (Québec). »
 */
export function descriptionArtiste(a: Artiste): string {
  const { nom, accroche, genres, role } = a.data;
  if (accroche) return accroche;
  const styles = genresEnTexte(genres);
  return role === 'beatmaker'
    ? `${nom}, beatmaker de Studio Nord à Limoilou (Québec)${styles ? ` : ${styles}` : ''}. Écoute ses beats.`
    : `${nom}${styles ? ` — ${styles}` : ''}. Artiste de Studio Nord à Limoilou (Québec).`;
}

// ---------- Liens externes ----------

/** Libellé affiché de chaque champ `liens`, dans l'ordre d'affichage. */
const LIBELLES_LIENS: Record<keyof Liens, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  soundcloud: 'SoundCloud',
  twitch: 'Twitch',
  site: 'Site web',
};

export interface LienExterne {
  nom: string;
  url: string;
}

/** Liens remplis seulement (un champ absent du .md n'apparaît pas). */
export function liensActifs(liens: Liens): LienExterne[] {
  return (Object.keys(LIBELLES_LIENS) as (keyof Liens)[])
    .filter((cle) => liens[cle])
    .map((cle) => ({ nom: LIBELLES_LIENS[cle], url: liens[cle]! }));
}

// ---------- Avatars sans portrait ----------

/**
 * Dégradés de la maquette B, dans l'ordre. Le dégradé d'un avatar dépend de sa position
 * dans la liste : rien à saisir dans le contenu. L'index 2 est pâle (initiales foncées).
 */
export const DEGRADES = [
  'linear-gradient(160deg, #009ee2, #003f6b)',
  'linear-gradient(160deg, #0e5fb6, #003f6b)',
  'linear-gradient(160deg, #c1e8ff, #0078c2)',
  'linear-gradient(200deg, #003f6b, #040a14)',
  'linear-gradient(160deg, #0078c2, #003f6b)',
  'repeating-linear-gradient(90deg, #009ee2 0 3px, #003f6b 3px 8px)',
] as const;

export const DEGRADE_PALE = 2;
