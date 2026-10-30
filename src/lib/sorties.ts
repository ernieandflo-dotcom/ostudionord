// Outils pour la collection « sorties » : tri, libellés des types, dates, liens.
// Utilisé par l'accueil (étape b) et par /contenu/ (étape c).
// Phase : P1 (étape b)

import type { CollectionEntry } from 'astro:content';

export type Sortie = CollectionEntry<'sorties'>;
export type TypeSortie = Sortie['data']['type'];

/** Libellés de chaque type : badge des tuiles (singulier) et puces de filtre (pluriel). */
export const LIBELLES: Record<TypeSortie, { un: string; plusieurs: string }> = {
  musique: { un: 'Musique', plusieurs: 'Musique' },
  video: { un: 'Vidéo', plusieurs: 'Vidéos' },
  coulisses: { un: 'Coulisses', plusieurs: 'Coulisses' },
  serie: { un: 'Série', plusieurs: 'Séries' },
  live: { un: 'Livestream', plusieurs: 'Livestreams' },
};

/** Ordre d'affichage des puces de filtre. */
export const ORDRE_TYPES: TypeSortie[] = ['musique', 'video', 'coulisses', 'serie', 'live'];

const temps = (s: Sortie) => s.data.date?.getTime();

/**
 * Trie les sorties :
 *  1. à venir d'abord : la date prévue la plus proche en premier, puis celles sans date ;
 *  2. ensuite les publiées, de la plus récente à la plus ancienne.
 * Renvoie une copie : la liste reçue n'est pas modifiée.
 */
export function trierSorties(sorties: Sortie[]): Sortie[] {
  const aVenir = sorties
    .filter((s) => s.data.statut === 'a-venir')
    .sort((a, b) => (temps(a) ?? Infinity) - (temps(b) ?? Infinity));
  const publiees = sorties
    .filter((s) => s.data.statut === 'publiee')
    .sort((a, b) => (temps(b) ?? 0) - (temps(a) ?? 0));
  return [...aVenir, ...publiees];
}

/** Types réellement présents dans une liste, dans l'ordre des puces. */
export function typesPresents(sorties: Sortie[]): TypeSortie[] {
  const presents = new Set(sorties.map((s) => s.data.type));
  return ORDRE_TYPES.filter((t) => presents.has(t));
}

// timeZone UTC : une date « 2026-09-11 » du frontmatter est lue à minuit UTC.
// Sans cette option, elle s'afficherait « 10 septembre » au Québec.
const formatDate = new Intl.DateTimeFormat('fr-CA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Ex. « 11 septembre 2026 ». */
export function formaterDate(date: Date): string {
  return formatDate.format(date);
}

/** Texte de date d'une sortie : l'échéance (« Bientôt ») pour une sortie à venir, sinon la date. */
export function quand(s: Sortie): string {
  if (s.data.statut === 'a-venir') {
    return s.data.echeance ?? (s.data.date ? `Prévu le ${formaterDate(s.data.date)}` : 'Bientôt');
  }
  return s.data.date ? formaterDate(s.data.date) : '';
}

/**
 * Lien d'une sortie : sa page, ou l'infolettre de l'accueil tant qu'elle est à venir.
 * « /#infolettre » marche partout : sur l'accueil, le navigateur défile sans recharger.
 */
export function lienSortie(s: Sortie): string {
  return s.data.statut === 'a-venir' ? '/#infolettre' : `/contenu/${s.id}/`;
}

/** Une sortie a-t-elle une page ? (Faux tant qu'elle est à venir.) */
export const aUnePage = (s: Sortie) => s.data.statut === 'publiee';
