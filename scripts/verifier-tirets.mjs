// Intégration Astro « verifier-tirets » : aucun tiret cadratin (—) dans le texte affiché.
// Phase : P1 (étape i). Branchée dans astro.config.mjs (integrations).
//
// Une intégration est un petit module qu'Astro appelle à certains moments du build.
// Ici, le crochet `astro:build:done` s'exécute une fois les pages écrites dans dist/.
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// À la fin de `npm run build`, on relit les pages HTML générées (dist/) et on avertit
// pour chaque page qui en contient encore (titre d'onglet, alt, texte d'un .md…).
// Les commentaires HTML et les blocs <style> sont ignorés. Le build n'échoue pas :
// c'est un avertissement, comme les autres « À FAIRE ». Remplacer par « · », « : » ou « | ».
/** @returns {import('astro').AstroIntegration} */
export function verifierTirets() {
  return {
    name: 'verifier-tirets',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const racine = fileURLToPath(dir);
        const fichiers = (await readdir(racine, { recursive: true })).filter((f) => f.endsWith('.html'));
        const fautifs = [];
        for (const f of fichiers) {
          const html = (await readFile(path.join(racine, f), 'utf-8'))
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<style[\s\S]*?<\/style>/g, '');
          const n = html.split('—').length - 1;
          if (n > 0) fautifs.push(`${f.split(path.sep).join('/')} (${n})`);
        }
        if (fautifs.length > 0) {
          logger.warn(
            `\n⚠  À CORRIGER : tiret cadratin (—) dans ${fautifs.length} page(s). Remplacer par « · », « : » ou « | ».\n   ` +
              fautifs.join('\n   ') + '\n',
          );
        } else {
          logger.info('Aucun tiret cadratin (—) dans les pages générées.');
        }
      },
    },
  };
}
