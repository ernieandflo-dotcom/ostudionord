// Outils de la boutique : prix, libellés de statut, lien de commande par courriel.
// Phase : P1 (étape f ; places restantes et lecture de Stripe à l'étape h.1)
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
// Brevo : si l'attribut INTERETS est à choix multiples, chaque valeur doit exister dans Brevo,
// écrite exactement pareil (ex. « Autre vêtement », ajoutée à l'étape h.1).
export const INTERETS = [
  'T-shirt',
  'Casquette',
  'Autre vêtement',
  'CD',
  'Vinyle',
  "Poster d’artiste",
] as const;

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

// ---------- Places restantes (VIP Pass, étape h.1) ----------
//
// Mode hybride :
//   1. Automatique : la carte a un `lienStripe` ET la variable d'environnement
//      STRIPE_CLE_LECTURE existe (clé restreinte Stripe, lecture seule des Payment Links).
//      Au build, on demande à Stripe le lien correspondant : sa limite (« Limit the number
//      of payments ») et le nombre de paiements déjà faits. Stripe bloque lui-même la vente
//      une fois la limite atteinte. Après chaque vente, un webhook Stripe appelle le deploy
//      hook de Cloudflare : le site se reconstruit et le compteur baisse.
//      La requête part du serveur de build, jamais du navigateur du visiteur (Loi 25),
//      et la clé n'est jamais écrite dans les pages.
//   2. Manuel (repli) : quota − vendus, depuis le .md.
// Sans quota ni lien Stripe limité : aucun compteur affiché.

type Carte = CollectionEntry<'cartesCadeaux'>;
export type Places = { restants: number; source: 'stripe' | 'manuel' };

type LienStripe = {
  url: string;
  active: boolean;
  restrictions?: { completed_sessions?: { count: number; limit: number } } | null;
};

const avertir = (msg: string) =>
  import.meta.env.PROD && console.warn(`\n⚠  Boutique (places restantes) : ${msg}\n`);

// Une seule requête à Stripe par build (toutes les pages et cartes partagent le résultat).
let liensStripe: Promise<LienStripe[] | null> | undefined;

async function chargerLiensStripe(cle: string): Promise<LienStripe[] | null> {
  try {
    const rep = await fetch('https://api.stripe.com/v1/payment_links?limit=100', {
      headers: { Authorization: `Bearer ${cle}` },
    });
    if (!rep.ok) {
      avertir(`Stripe a répondu ${rep.status} (clé STRIPE_CLE_LECTURE invalide ou sans la permission « Payment Links : lecture »). Repli sur quota et vendus.`);
      return null;
    }
    const json = (await rep.json()) as { data: LienStripe[] };
    return json.data;
  } catch {
    avertir('Stripe injoignable pendant le build. Repli sur quota et vendus.');
    return null;
  }
}

/** Places restantes d'une carte ou d'un pass ; undefined = aucun compteur à afficher. */
export async function placesRestantes(carte: Carte): Promise<Places | undefined> {
  const d = carte.data;
  const cle = import.meta.env.STRIPE_CLE_LECTURE as string | undefined;

  if (d.lienStripe && cle) {
    liensStripe ??= chargerLiensStripe(cle);
    const liens = await liensStripe;
    if (liens) {
      const lien = liens.find((l) => l.url === d.lienStripe);
      const limite = lien?.restrictions?.completed_sessions;
      if (!lien) {
        avertir(`lien Stripe de « ${d.nom} » introuvable dans le compte Stripe. Repli sur quota et vendus.`);
      } else if (!lien.active) {
        return { restants: 0, source: 'stripe' };
      } else if (!limite) {
        avertir(`le lien Stripe de « ${d.nom} » n'a pas de limite (« Limit the number of payments »). Repli sur quota et vendus.`);
      } else {
        // Vente hors Stripe (comptant, événement) : baisser la limite du lien dans Stripe,
        // pas `vendus` (c'est Stripe qui bloque la vente une fois la limite atteinte).
        return { restants: Math.max(0, limite.limit - limite.count), source: 'stripe' };
      }
    }
  }

  if (d.quota !== undefined) {
    return { restants: Math.max(0, d.quota - d.vendus), source: 'manuel' };
  }
  return undefined;
}

/** « Il n'en reste que 12 » ; « Il n'en reste qu'un ». */
export function texteRestants(n: number): string {
  return n === 1 ? 'Il n’en reste qu’un' : `Il n’en reste que ${n}`;
}
