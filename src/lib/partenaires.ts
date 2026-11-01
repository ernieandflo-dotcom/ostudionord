// Outils pour la collection « partenaires » : tri, liens, relations (propriétaire, personnes gérées).
// Utilisé par /partenaires/ et EncadrePartenaire (« Géré par » des fiches d'artistes et de créateurs).
// Phase : P1 (étape g)

import { getCollection, type CollectionEntry } from 'astro:content';
import type { LienExterne } from './personnes';

export type Partenaire = CollectionEntry<'partenaires'>;
type LiensPartenaire = Partenaire['data']['liens'];

// Même comparateur que pour les artistes : ignore majuscules et accents.
const alpha = new Intl.Collator('fr-CA', { sensitivity: 'base', numeric: true });

/** Tri : champ `ordre` d'abord (petit = en premier), puis ordre alphabétique. */
export function parOrdre(a: Partenaire, b: Partenaire): number {
  return a.data.ordre - b.data.ordre || alpha.compare(a.data.nom, b.data.nom);
}

// ---------- Liens externes ----------

/** Libellé de chaque champ `liens`, dans l'ordre d'affichage (le site d'abord). */
const LIBELLES: Record<keyof LiensPartenaire, string> = {
  site: 'Site web',
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
};

/** Liens remplis seulement, dans l'ordre de LIBELLES. */
export function liensPartenaire(p: Partenaire): LienExterne[] {
  const liens = p.data.liens;
  return (Object.keys(LIBELLES) as (keyof LiensPartenaire)[])
    .filter((cle) => liens[cle])
    .map((cle) => ({ nom: LIBELLES[cle], url: liens[cle]! }));
}

/**
 * Lien principal d'un partenaire (encadré « Géré par ») : le site, sinon YouTube,
 * sinon Instagram, sinon Facebook, sinon TikTok. undefined s'il n'a aucun lien.
 */
export const lienPrincipal = (p: Partenaire): string | undefined => liensPartenaire(p)[0]?.url;

// ---------- Relations ----------

/** Une personne ou un partenaire relié, avec l'adresse de sa fiche sur le site. */
export interface Relie {
  nom: string;
  href: string;
}

export interface Relations {
  /** Partenaire propriétaire (ex. ALFROMEGA pour Kota Studios). */
  proprietaire?: Relie;
  /** Partenaires dont il est propriétaire (ex. Kota Studios pour ALFROMEGA). */
  possede: Relie[];
  /** Artistes et créateurs dont la fiche indique `partenaire: <ce partenaire>`. */
  gere: Relie[];
}

/**
 * Relations de chaque partenaire, calculées une seule fois au build.
 * La relation inverse n'est jamais écrite à la main : il suffit de `proprietaire:` dans le .md
 * du partenaire possédé, ou de `partenaire:` dans la fiche d'un artiste ou d'un créateur.
 */
export async function relationsPartenaires(
  partenaires: Partenaire[],
): Promise<Map<string, Relations>> {
  const [artistes, createurs] = await Promise.all([
    getCollection('artistes'),
    getCollection('createurs'),
  ]);
  const parId = new Map(partenaires.map((p) => [p.id, p]));
  const ancre = (p: Partenaire): Relie => ({ nom: p.data.nom, href: `/partenaires/#${p.id}` });

  const relations = new Map<string, Relations>(
    partenaires.map((p) => [p.id, { possede: [], gere: [] }]),
  );

  for (const p of partenaires) {
    const idProprio = p.data.proprietaire?.id;
    if (!idProprio) continue;
    if (idProprio === p.id) {
      throw new Error(`Partenaire « ${p.id} » : il ne peut pas être son propre propriétaire.`);
    }
    const proprio = parId.get(idProprio);
    if (!proprio) continue; // reference() a déjà signalé un identifiant inconnu
    relations.get(p.id)!.proprietaire = ancre(proprio);
    relations.get(proprio.id)!.possede.push(ancre(p));
  }

  const personnes = [
    ...artistes.map((a) => ({ e: a, href: `/artistes/${a.id}/` })),
    ...createurs.map((c) => ({ e: c, href: `/createurs/${c.id}/` })),
  ].sort((x, y) => x.e.data.ordre - y.e.data.ordre || alpha.compare(x.e.data.nom, y.e.data.nom));

  for (const { e, href } of personnes) {
    const id = e.data.partenaire?.id;
    if (id && relations.has(id)) relations.get(id)!.gere.push({ nom: e.data.nom, href });
  }

  return relations;
}
