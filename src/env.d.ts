// Types des variables d'environnement (autocomplétion et vérification dans VS Code).
// Les valeurs viennent de .env en local et des réglages de Cloudflare Pages en ligne.
// Phase : P1 (étape a)

interface ImportMetaEnv {
  /** Adresse des médias R2, ex. https://media.ostudionord.ca (vide = repli local /media) */
  readonly PUBLIC_MEDIA_URL?: string;
  /** Jeton Cloudflare Web Analytics (vide = aucune statistique) */
  readonly PUBLIC_CF_ANALYTICS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
