// Schémas des collections de contenu (artistes, createurs, sorties, beats, partenaires).
// Déclaration : defineCollection() + loader glob() (astro/loaders) + z (astro/zod).
// Phase : P1 (étape a ; sorties revues aux étapes b, c et d ; horaire des créateurs à l'étape e)
//
// Un schéma décrit les champs attendus dans le frontmatter de chaque .md.
// Champ manquant ou mal écrit = erreur claire au `npm run dev` ou au build,
// avant que la page ne parte en ligne.
// L'identifiant d'une entrée (entry.id) est le nom du fichier : molie.md → « molie ».

import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ---------- Morceaux réutilisés ----------

// Liens externes d'une personne (tous facultatifs).
const liens = z
  .object({
    instagram: z.url().optional(),
    tiktok: z.url().optional(),
    youtube: z.url().optional(),
    twitch: z.url().optional(),
    spotify: z.url().optional(),
    appleMusic: z.url().optional(),
    soundcloud: z.url().optional(),
    site: z.url().optional(),
  })
  .default({});

// Une image doit toujours avoir son texte alternatif.
const altObligatoire = (champ: string) => ({
  message: `${champ}Alt est obligatoire quand ${champ} est fourni.`,
  path: [`${champ}Alt`],
});

// Chemin d'une vidéo dans R2 (sans « / » au début), ex. video/decompte/decompte-j1.mp4
const cheminR2 = z
  .string()
  .regex(/^[^/].*\.(mp4|webm)$/, 'Chemin relatif dans R2, ex. video/decompte/x.mp4');

// Horaire de diffusion d'un créateur (heure du Québec, America/Toronto).
// Une plage dont la fin est plus tôt que le début se termine le lendemain (ex. 22:00 → 01:00).
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;
const heure = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Heure au format HH:MM, ex. 20:00');
const horaire = z.object({
  plages: z
    .array(
      z
        .object({
          jours: z.array(z.enum(JOURS)).min(1),
          debut: heure,
          fin: heure,
        })
        .refine((p) => p.debut !== p.fin, { message: 'debut et fin doivent être différents.' }),
    )
    .default([]),
  // Phrase libre affichée sous l'horaire, ex. « Horaire variable : annonces sur Instagram. »
  note: z.string().optional(),
});

// ---------- Collections ----------

const partenaires = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/partenaires' }),
  schema: ({ image }) =>
    z
      .object({
        nom: z.string(),
        description: z.string(),
        lien: z.url().optional(),
        logo: image().optional(),
        logoAlt: z.string().optional(),
      })
      .refine((d) => !d.logo || d.logoAlt, altObligatoire('logo')),
});

const artistes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artistes' }),
  schema: ({ image }) =>
    z
      .object({
        nom: z.string(),
        role: z.enum(['artiste', 'beatmaker']),
        genres: z.array(z.string()).default([]),
        initiales: z.string().min(1).max(3), // affichées tant qu'il n'y a pas de portrait
        accroche: z.string().optional(), // une phrase pour les cartes
        portrait: image().optional(),
        portraitAlt: z.string().optional(),
        liens,
        partenaire: reference('partenaires').optional(), // ex. gt-media
        // Ordre d'affichage : petit = en premier ; à égalité (ou absent), ordre alphabétique.
        ordre: z.number().int().default(100),
      })
      .refine((d) => !d.portrait || d.portraitAlt, altObligatoire('portrait')),
});

const createurs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/createurs' }),
  schema: ({ image }) =>
    z
      .object({
        nom: z.string(),
        pseudo: z.string().optional(), // ex. @bigheadnesswiththehyphen
        categories: z.array(z.string()).default([]), // ex. Live streaming, Divertissement
        initiales: z.string().min(1).max(3),
        accroche: z.string().optional(),
        portrait: image().optional(),
        portraitAlt: z.string().optional(),
        // Plateformes de diffusion. url: null = pastille grisée « YouTube · bientôt », sans lien.
        plateformes: z
          .array(
            z.object({
              nom: z.enum(['twitch', 'youtube', 'tiktok', 'kick', 'instagram']),
              url: z.url().nullable().default(null),
            }),
          )
          .default([]),
        // Horaire des lives (facultatif). Pendant une plage, la fiche affiche « En live ».
        horaire: horaire.optional(),
        liens,
        partenaire: reference('partenaires').optional(),
        // Ordre d'affichage : petit = en premier ; à égalité (ou absent), ordre alphabétique.
        ordre: z.number().int().default(100),
      })
      .refine((d) => !d.portrait || d.portraitAlt, altObligatoire('portrait')),
});

const sorties = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sorties' }),
  schema: ({ image }) =>
    z
      .object({
        titre: z.string(),
        type: z.enum(['musique', 'video', 'coulisses', 'serie', 'live']),
        statut: z.enum(['publiee', 'a-venir']).default('publiee'),
        // AAAA-MM-JJ. Obligatoire si publiée ; pour « a-venir » : date prévue, si connue.
        date: z.coerce.date().optional(),
        // Texte affiché à la place d'une date pour une sortie à venir (ex. « Bientôt »).
        echeance: z.string().optional(),
        vedette: z.boolean().default(false), // vidéo vedette de l'accueil
        legende: z.string().optional(), // sous-titre court sur les tuiles
        artistes: z.array(reference('artistes')).default([]),
        createurs: z.array(reference('createurs')).default([]),
        // Une seule source vidéo : YouTube OU R2 (ou aucune si à venir).
        youtubeId: z
          .string()
          .regex(/^[A-Za-z0-9_-]{11}$/, 'Un ID YouTube compte 11 caractères.')
          .optional(),
        videoR2: cheminR2.optional(), // vidéo complète (page de la sortie)
        boucleR2: cheminR2.optional(), // boucle muette des tuiles (sinon : videoR2)
        // Image hébergée dans src/assets/sorties/ : aucune requête à Google avant le clic.
        // Forme de la tuile : image verticale = tuile 9:16, horizontale = tuile large.
        vignette: image().optional(),
        vignetteAlt: z.string().optional(),
        resume: z.string().optional(),
        // Sous-titres français (WebVTT) d'une vidéo R2, ex. video/decompte/decompte-j1.vtt
        sousTitresR2: z
          .string()
          .regex(/^[^/].*\.vtt$/, 'Chemin relatif dans R2, ex. video/decompte/x.vtt')
          .optional(),
        // Regroupement de sorties liées (ex. les 6 jours du décompte), en minuscules-tirets.
        // Le titre affiché vient de SERIES dans src/lib/sorties.ts.
        // P2 : deviendra reference('series') avec les mêmes valeurs, sans retoucher les .md.
        serie: z
          .string()
          .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Identifiant en minuscules-tirets, ex. decompte-ouverture')
          .optional(),
        // Image de partage (Facebook, iMessage…) quand le recadrage automatique 1200 × 630
        // de la vignette coupe mal (ex. vignette verticale). Horizontale de préférence.
        imagePartage: image().optional(),
        imagePartageAlt: z.string().optional(),
      })
      .refine((d) => !(d.youtubeId && d.videoR2), {
        message: 'Choisir youtubeId OU videoR2, pas les deux.',
        path: ['videoR2'],
      })
      .refine((d) => !d.boucleR2 || d.videoR2, {
        message: 'boucleR2 accompagne une videoR2.',
        path: ['boucleR2'],
      })
      .refine((d) => !d.sousTitresR2 || d.videoR2, {
        message: 'sousTitresR2 accompagne une videoR2 (YouTube gère ses propres sous-titres).',
        path: ['sousTitresR2'],
      })
      .refine((d) => d.statut !== 'publiee' || d.date, {
        message: 'Une sortie publiée doit avoir une date (AAAA-MM-JJ).',
        path: ['date'],
      })
      .refine((d) => d.statut !== 'a-venir' || d.date || d.echeance, {
        message: 'Une sortie à venir a besoin d’une date prévue ou d’une echeance (ex. « Bientôt »).',
        path: ['echeance'],
      })
      .refine((d) => !(d.youtubeId || d.videoR2) || d.vignette, {
        message:
          'Une vidéo exige une vignette dans src/assets/sorties/ (voir le README, « Vignettes YouTube »).',
        path: ['vignette'],
      })
      .refine((d) => !d.vignette || d.vignetteAlt, altObligatoire('vignette'))
      .refine((d) => !d.imagePartage || d.imagePartageAlt, altObligatoire('imagePartage')),
});

const beats = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/beats' }),
  schema: z
    .object({
      numero: z.string().regex(/^SNB-\d{4}$/, 'Format attendu : SNB-0000'),
      titre: z.string(),
      fichier: z.string().regex(/^\/audio\/beats\/SNB-\d{4}\.mp3$/),
      beatmaker: reference('artistes'),
      bpm: z.number().int().positive().optional(),
      tonalite: z.string().optional(),
      // Phase 3 (Stripe Payment Links)
      prix: z.number().positive().optional(),
      lienStripe: z.url().optional(),
    })
    .refine((d) => d.fichier.endsWith(`/${d.numero}.mp3`), {
      message: 'Le nom du fichier doit correspondre au numéro (SNB-0001 → SNB-0001.mp3).',
      path: ['fichier'],
    }),
});

export const collections = { partenaires, artistes, createurs, sorties, beats };
