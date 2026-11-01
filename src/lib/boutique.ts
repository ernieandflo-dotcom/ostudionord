// Outils de la boutique : prix, libellés de statut, lien de commande par courriel.
// Phase : P1 (étape f)
import type { CollectionEntry } from 'astro:content';
import { COURRIEL } from '../data/site';

const dollars = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** 80 → « 80 $ » ; 12.5 → « 12,50 $ » (format québécois). */
export function formaterPrix(prix: number): string {
  if (!Number.isInteger(prix)) {
    return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(prix);
  }
  return dollars.format(prix);
}

export const STATUTS_MERCH = {
  disponible: 'En vente',
  bientot: 'Pas encore en vente',
  apercu: 'Maquettes · sujet à changement',
} as const;

export const STATUTS_CARTES = {
  disponible: 'Disponible',
  bientot: 'Bientôt disponible',
  masquee: '',
} as const;

/**
 * Lien « Commander par courriel » : ouvre l'application de courriel du visiteur
 * avec l'objet et un modèle de message déjà remplis. Aucune requête à un tiers.
 */
export function lienCommande(produit: string): string {
  const objet = `Commande : ${produit}`;
  const corps = [
    'Bonjour Studio Nord,',
    '',
    `J'aimerais commander : ${produit}`,
    'Quantité : 1',
    "C'est pour offrir (oui / non) :",
    '',
    'Merci!',
  ].join('\n');
  return `mailto:${COURRIEL}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(corps)}`;
}

/** Choix facultatifs du formulaire du drop : « Qu'est-ce qui te tenterait aussi ? ». */
export const INTERETS = ['T-shirt', 'Casquette', 'CD', 'Vinyle', "Poster d'artiste"] as const;

/**
 * Plus petite carte-cadeau (montant, disponible) qui couvre un prix.
 * Ex. hoodie à 80 $ → carte de 100 $. Aucune carte assez grande : undefined.
 */
export function carteQuiCouvre(
  prix: number,
  cartes: CollectionEntry<'cartesCadeaux'>[],
): CollectionEntry<'cartesCadeaux'> | undefined {
  return cartes
    .filter((c) => c.data.genre === 'montant' && c.data.statut === 'disponible' && c.data.prix >= prix)
    .sort((a, b) => a.data.prix - b.data.prix)[0];
}
