// @ts-check
// Configuration Astro — Studio Nord (ostudionord.ca)
// Site 100 % statique, déployé par l'intégration Git de Cloudflare Pages.
import { defineConfig, fontProviders } from 'astro/config';
// Garde-fou des tirets cadratins (étape i) : voir scripts/verifier-tirets.mjs.
import { verifierTirets } from './scripts/verifier-tirets.mjs';
// Plan du site (étape j) : intégration officielle, fixée à 3.7.4.
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ostudionord.ca',
  // Les URL du plan finissent par « / » (/contenu/, /artistes/molie/…).
  trailingSlash: 'always',

  integrations: [
    verifierTirets(),
    // Écrit dist/sitemap-index.xml (lié dans public/robots.txt).
    // La 404 est exclue d'office ; /merci/ (noindex) est exclue ici.
    // Une nouvelle page noindex doit aussi être ajoutée à ce filtre.
    sitemap({ filter: (page) => !page.endsWith('/merci/') }),
  ],

  // Politique de sécurité du contenu (CSP), étape j.
  // Au build, Astro calcule l'empreinte (hachage SHA-256) de chaque script et style
  // en ligne et écrit une balise <meta http-equiv="content-security-policy"> dans
  // chaque page. Rien en `npm run dev` : tester avec `npm run build` puis `npm run preview`.
  // frame-ancestors est dans public/_headers (une balise <meta> ne peut pas le porter).
  // Nouveau service tiers (script, iframe, formulaire, média) : l'ajouter ici, sinon
  // le navigateur le bloque. Voir le README, « Sécurité (CSP) ».
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        // Vidéos et sous-titres R2
        "media-src 'self' https://media.ostudionord.ca",
        // Lecteur YouTube, chargé seulement après le clic (façade)
        "frame-src https://www.youtube-nocookie.com",
        // Envoi des statistiques de Cloudflare Web Analytics
        "connect-src 'self' https://cloudflareinsights.com",
        // Formspree et Brevo ; 'self' pour la redirection de Brevo vers /merci/.
        // Stripe n'est qu'un lien : rien à déclarer.
        "form-action 'self' https://formspree.io https://sibforms.com https://*.sibforms.com",
        "upgrade-insecure-requests",
      ],
      // Scripts : les nôtres (empreintes ajoutées par Astro) + Cloudflare Web Analytics.
      scriptDirective: { resources: ["'self'", 'https://static.cloudflareinsights.com'] },
      // Styles : les nôtres (empreintes) ; attributs style="--fond: …" permis
      // (style-src-attr), sans ouvrir les balises <style> à n'importe quoi.
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },

  // Polices (API Fonts d'Astro), fournisseur « local » : les fichiers sont
  // dans src/assets/fonts/ (licence SIL OFL, jointe). Astro génère les
  // @font-face, les polices de repli ajustées et les liens de préchargement.
  // Aucune requête à Google, ni par les visiteurs ni pendant le build.
  // Chaque police devient une variable CSS, utilisée dans tokens.css.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-bricolage',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            // Police variable : graisse 200-800, largeur 75-100 (« wdth »)
            // et taille optique 12-96, dans un seul fichier.
            weight: '200 800',
            style: 'normal',
            src: ['./src/assets/fonts/BricolageGrotesque-latin-variable.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-plex-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/IBMPlexMono-latin-400.woff2'] },
          { weight: 500, style: 'normal', src: ['./src/assets/fonts/IBMPlexMono-latin-500.woff2'] },
        ],
      },
    },
  ],
});
