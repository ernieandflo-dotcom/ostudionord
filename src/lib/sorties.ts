// Outils pour la collection « sorties » : tri, libellés des types, dates, liens.
// Utilisé par l'accueil (étape b), /contenu/ et /contenu/[slug]/ (étape c).
// Phase : P1 (étapes b et c)

import { getEntries, type CollectionEntry } from 'astro:content';

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
 * Lien d'une sortie : sa page, ou un formulaire d'infolettre tant qu'elle est à venir.
 * « /#infolettre » marche partout : sur l'accueil, le navigateur défile sans recharger.
 * /contenu/ passe « #infolettre » pour viser son propre bloc « M'avertir ».
 */
export function lienSortie(s: Sortie, infolettre = '/#infolettre'): string {
  return s.data.statut === 'a-venir' ? infolettre : `/contenu/${s.id}/`;
}

/** Une sortie a-t-elle une page ? (Faux tant qu'elle est à venir.) */
export const aUnePage = (s: Sortie) => s.data.statut === 'publiee';

// ---------- Personnes liées (étape c) ----------

export interface Personne {
  id: string;
  nom: string;
  initiales: string;
  /** Fiche de l'artiste ou du créateur. */
  href: string;
}

/** Artistes puis créateurs d'une sortie. Une référence introuvable est ignorée. */
export async function personnes(s: Sortie): Promise<Personne[]> {
  const [artistes, createurs] = await Promise.all([
    getEntries(s.data.artistes),
    getEntries(s.data.createurs),
  ]);
  return [
    ...artistes.filter(Boolean).map((e) => ({
      id: e.id,
      nom: e.data.nom,
      initiales: e.data.initiales,
      href: `/artistes/${e.id}/`,
    })),
    ...createurs.filter(Boolean).map((e) => ({
      id: e.id,
      nom: e.data.nom,
      initiales: e.data.initiales,
      href: `/createurs/${e.id}/`,
    })),
  ];
}

/** « Mølie X Sadaboy OELCOEPL » : noms des artistes et créateurs d'une sortie. */
export async function nomsDe(s: Sortie): Promise<string> {
  return (await personnes(s)).map((p) => p.nom).join(' X ');
}

// ---------- Regroupements (champ `serie`) ----------

/**
 * Titre affiché de chaque regroupement. Nouvelle valeur de `serie` dans un .md → l'ajouter ici.
 * P2 : ces titres passeront dans la collection « series ».
 */
export const SERIES: Record<string, string> = {
  'decompte-ouverture': "Le décompte de l'ouverture",
};

export const titreSerie = (id: string) => SERIES[id] ?? id;

/** Sorties publiées du même regroupement, de la plus ancienne à la plus récente. */
export function episodes(s: Sortie, toutes: Sortie[]): Sortie[] {
  const serie = s.data.serie;
  if (!serie) return [];
  return toutes
    .filter((x) => x.data.serie === serie && aUnePage(x))
    .sort((a, b) => (temps(a) ?? 0) - (temps(b) ?? 0));
}

// ---------- À voir aussi ----------

const cles = (s: Sortie) =>
  new Set([...s.data.artistes, ...s.data.createurs].map((r) => `${r.collection}/${r.id}`));

/**
 * Suggestions pour la page d'une sortie (publiées seulement, sans la sortie elle-même).
 * Points : +2 par artiste ou créateur en commun, +1 si même type.
 * À égalité : la plus proche dans le temps d'abord.
 * Les sorties du même regroupement sont exclues : la liste des épisodes les montre déjà.
 */
export function aVoirAussi(s: Sortie, toutes: Sortie[], max = 4): Sortie[] {
  const miennes = cles(s);
  const t = temps(s) ?? 0;
  return toutes
    .filter((x) => x.id !== s.id && aUnePage(x))
    .filter((x) => !(s.data.serie && x.data.serie === s.data.serie))
    .map((x) => {
      let points = x.data.type === s.data.type ? 1 : 0;
      for (const p of cles(x)) if (miennes.has(p)) points += 2;
      return { x, points, ecart: Math.abs((temps(x) ?? 0) - t) };
    })
    .sort((a, b) => b.points - a.points || a.ecart - b.ecart)
    .slice(0, max)
    .map((r) => r.x);
}
