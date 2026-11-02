// Adresses des formulaires Formspree (partenariat, contact) et avertissement tant qu'elles
// sont des placeholders. Utilisé par FormPartenariat (étape g) et FormContact (étape h).
// Phase : P1 (étape g)
//
// ─────────────────────────────────────────────────────────────────────────────
// À FAIRE AVANT LE LANCEMENT : créer chaque formulaire dans Formspree
// (Formspree › New form), puis remplacer l'adresse ci-dessous par celle qu'il donne,
// de la forme https://formspree.io/f/xxxxxxxx.
// Tant qu'une adresse contient « REMPLACER », un avertissement s'affiche dans la
// console de `npm run build` (rien sur la page).
//
// Forfait gratuit (P1) : après l'envoi, le visiteur voit la page de remerciement de Formspree.
// La redirection vers /merci/ est un réglage de Formspree (Settings) réservé aux forfaits
// payants : aucun champ _next dans le code. P2 : garder les gens sur le site
// (forfait payant ou autre service) ; voir le README, « Formulaires ».
// ─────────────────────────────────────────────────────────────────────────────
export const FORMSPREE = {
  partenariat: 'https://formspree.io/f/REMPLACER_PARTENARIAT',
  contact: 'https://formspree.io/f/REMPLACER_CONTACT',
} as const;

export type FormulaireFormspree = keyof typeof FORMSPREE;

/** true tant que l'adresse est un placeholder ; avertit dans la console du build (pas sur la page). */
export function estPlaceholder(nom: FormulaireFormspree): boolean {
  const placeholder = FORMSPREE[nom].includes('REMPLACER');
  if (placeholder && import.meta.env.PROD) {
    console.warn(
      `\n⚠  À FAIRE AVANT LE LANCEMENT : le formulaire Formspree « ${nom} » pointe encore vers un placeholder (src/lib/formulaires.ts).\n`,
    );
  }
  return placeholder;
}
