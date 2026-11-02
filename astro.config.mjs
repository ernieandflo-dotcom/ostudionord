// @ts-check
// Configuration Astro — Studio Nord (ostudionord.ca)
// Site 100 % statique, déployé par l'intégration Git de Cloudflare Pages.
import { defineConfig, fontProviders } from 'astro/config';
// Garde-fou des tirets cadratins (étape i) : voir scripts/verifier-tirets.mjs.
import { verifierTirets } from './scripts/verifier-tirets.mjs';

export default defineConfig({
  site: 'https://ostudionord.ca',
  // Les URL du plan finissent par « / » (/contenu/, /artistes/molie/…).
  trailingSlash: 'always',

  integrations: [verifierTirets()],

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
