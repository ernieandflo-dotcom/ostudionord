// FAQ : catégories (ordre et titres), tri des questions, texte brut pour les données structurées.
// Phase : P1 (étape h)
import type { CollectionEntry } from 'astro:content';

// Ordre d'affichage des catégories sur /a-propos/faq/.
// Nouvelle catégorie : l'ajouter ici (valeur + titre), puis l'utiliser dans un .md.
export const CATEGORIES_FAQ = ['studio', 'collaborations', 'boutique', 'donnees'] as const;
export type CategorieFaq = (typeof CATEGORIES_FAQ)[number];

export const TITRES_CATEGORIES: Record<CategorieFaq, string> = {
  studio: 'Le studio',
  collaborations: 'Collaborations',
  boutique: 'Boutique',
  donnees: 'Le site et tes données',
};

type Question = CollectionEntry<'faq'>;

/** Tri dans une catégorie : `ordre`, puis la question par ordre alphabétique. */
export const parOrdre = (a: Question, b: Question) =>
  a.data.ordre - b.data.ordre || a.data.question.localeCompare(b.data.question, 'fr');

/** Réponse en texte brut (balises retirées), pour le JSON-LD FAQPage. */
export function texteBrut(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, '’')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
