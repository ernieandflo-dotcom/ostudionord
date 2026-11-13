# Studio Nord — Site 2.0 : stack et arborescence

*Mise à jour : 10 novembre 2026 (étape l : /artistes/ et /createurs/ en grilles d'avatars ronds, classe commune `.grille-av` ; étape k : revue de la liste de contrôle, cartes Séries de l'accueil avec image de fond, initiales des fondateurs DF, GT, SO, MK ; étape j : _redirects, _headers, CSP générée par Astro, plan du site, robots.txt, vérification finale ; étape i : /confidentialite/ (Loi 25), /merci/, /404, tirets cadratins remplacés et garde-fou au build ; étape h.1 : quota du VIP Pass, compteur hybride Stripe/manuel, intérêt « Autre vêtement » ; étape H terminée : /a-propos/ remplace /contact/ dans le menu, avec /a-propos/contact/ et /a-propos/faq/ ; sous-navigation commune ; collection `faq`) · Lancement visé : 15 novembre 2026 (initialement le 8)*

## Décisions prises

| Sujet | Décision |
|---|---|
| Direction visuelle | Accueil variante B (« Studio de création multimédia ») comme référence ; boutique en version « Lookbook Bluestorm » ; partenaires en « index éditorial » (option B) |
| Framework | Astro (phase 1), fixé à 7.4.1 |
| CMS | Sveltia CMS en phase 2, non prioritaire. La publication est assurée à la main jusqu'au début 2027 |
| Synchronisation YouTube | Abandonnée pour l'instant : les clips sont souvent publiés sur les chaînes des artistes |
| Vidéo | Stratégie à trois niveaux : YouTube, Cloudflare R2, Bunny Stream au besoin |
| Ventes | Stripe Payment Links pour les beats (phase 3, « en 2027 » dans les textes). Le drop de merch (août 2027) est géré par Textilart, hors site (GT Média crée l'outil de vente) |
| Cartes-cadeaux et VIP Pass | Commande par courriel dès la phase 1 (montants 30, 100, 250 $ ; VIP Pass 100 $). Cartes de services de production masquées pour l'instant. **VIP Pass : quota de 25** (jamais affiché), « Il n'en reste que N » toujours visible, puis « Complet ». Compteur **hybride** : automatique si le pass a un lien Stripe limité à 25 et que `STRIPE_CLE_LECTURE` est définie (lecture au build, rebuild par webhook Stripe → deploy hook Cloudflare) ; sinon manuel (`quota`, `vendus`). Après un paiement Stripe : redirection vers /merci/, puis « on te contacte par courriel » |
| Infolettre | Brevo (formulaires **Simple HTML**, sans script ni captcha ; champ caché `html_type=simple` ; case de consentement `OPT_IN` ; choix multiples `INTERETS[]`), avec un compte au nom de Studio Nord : listes « infolettre », « beats » et « drop ». Sans double confirmation (double opt-in) pour l'instant ; redirection après l'inscription vers /merci/ |
| Page Studio | Remplacée par **/partenaires/** : partenaires locaux de Québec + formulaire « Vous souhaitez faire partenariat ? ». Vouvoiement sur cette page (tutoiement partout ailleurs). Nom affiché « GT Média », nom complet « Grosse-Tête Média » |
| À propos | « À propos » (`/a-propos/`) remplace « Contact » dans le menu : histoire (ouverture le 15 janvier 2026, transition de studio d'enregistrement à maison de création), le lieu (photos du studio), fondateurs, séances en pause. Sous-pages `/a-propos/contact/` et `/a-propos/faq/`. Sous-navigation commune aux 3 pages (Le studio · Contact · FAQ) ; Contact et FAQ aussi dans le pied de page |
| Séries (accueil, P1) | Deux cartes « Arrive bientôt » avec image de fond décorative (`alt=""`) et voile sombre : « Les fondateurs » (`src/assets/series/les-fondateurs.jpg`) et « Coulisses ALFROMEGA » (`src/assets/sorties/thumbnail_ALFROMEGA.png`). Collection `series` en P2 |
| Fondateurs | Initiales seulement (DF, GT, SO, MK), **jamais liées aux fiches d'artistes** (deux univers séparés). Noms et visages dévoilés dans la série « Les fondateurs » (P2) |
| Séances d'enregistrement | En pause, aucun retour annoncé. La page À propos et la FAQ renvoient vers Kota Studios (enregistrement, mix, master) |
| Visites du studio | Sur rendez-vous seulement |
| Contact | Formspree (`FormContact`), sujets regroupés (Collaboration, Studio Nord, Autre), sans téléphone ni pièce jointe. Partenariats : renvoi vers `/partenaires/#partenariat` |
| FAQ | Collection `faq` (un .md par question), `<details>`/`<summary>` sans JS, JSON-LD FAQPage (Google n'affiche plus les résultats enrichis FAQ depuis mai 2026, mais lit encore ces données) |
| Données structurées | Organization sur /a-propos/ (sans dénomination légale ni NEQ avant l'incorporation, sans fondateurs) ; FAQPage sur la FAQ ; Person/MusicGroup et VideoObject ailleurs |
| Formulaires Formspree | Forfait gratuit en P1 (50 envois par mois) : après l'envoi, le visiteur voit la page de remerciement de Formspree. **P2 : garder les visiteurs sur le site** (forfait payant avec redirection vers /merci/, ou autre service) |
| Confidentialité (Loi 25) | `/confidentialite/`, tutoiement, texte à faire valider par un juriste (`POLITIQUE_A_VALIDER`). Responsable : titre et courriel seulement (`RESPONSABLE_RP` dans `site.ts`, placeholder + avertissement au build). Conservation : contact et partenariat 2 ans après le dernier échange ; infolettre et beats jusqu'au désabonnement ; drop 1 an après le drop ; ventes 6 ans. Fournisseurs : Formspree (États-Unis), Brevo (Union européenne), Stripe (États-Unis), Namecheap Private Email (États-Unis, Arizona), Cloudflare (Pages, R2, Web Analytics sans témoins), YouTube (après clic). EFVP à réaliser avant le lancement (art. 17) avec le modèle de rapport de la CAI. Cloudflare Web Analytics conservé (script chargé dès l'ouverture de la page, mentionné dans la politique ; à confirmer par le juriste) |
| /merci/ et /404 | Pages `noindex`, sans lien canonique. /merci/ : générique (liste Brevo, VIP Pass, message), sans JS ni lecture de l'URL. /404 : liens vers Contenu, Artistes, Boutique, FAQ. Composant commun `LiensUtiles` |
| Titres et ponctuation | Aucun tiret cadratin (—) dans le texte affiché : « · », « : » ou « \| ». Onglets : « Titre · détail \| Studio Nord » ; accueil : « Studio Nord · Son, image, histoires ». Garde-fou au build (`scripts/verifier-tirets.mjs`) |
| Domaine | `ostudionord.ca` reste enregistré chez Namecheap, mais son DNS passe chez Cloudflare |
| Créateurs | Section séparée `/createurs/` (BHNWTH) |
| Index /artistes/ et /createurs/ (étape l) | Même look partout : surtitre mono + h2 (« Voix » / « Les artistes », « Production » / « Le beatmaker », « Créateur de contenu » / « Les créateurs »), puis grille d'avatars ronds (`CarteArtiste`, classe globale `.grille-av` dans `global.css`, aussi utilisée par les fiches). Sous-titre des cartes : 2 premiers genres (beatmakers compris) ou catégories. Section beatmaker : phrase « Les instrus de la maison… » sous le titre et lien « Écouter les beats → » vers `/boutique/#beats`. Carte d'un créateur : pastille « En live » (slot de `CarteArtiste`) ; pseudo, « Géré par … » et « Regarder sur … » sur la fiche seulement |
| Bloc infolettre sur les pages | Composant `BlocInfolettre` (sans JS), cible des liens « M'avertir… » : fiches d'artistes et de créateurs, À propos, FAQ (id `inscription`, car la question « infolettre » a déjà l'id `infolettre`), /contenu/. Un seul bloc par page (ids du formulaire uniques) ; l'accueil garde son bloc |
| Responsable Loi 25 | « PDG » (`RESPONSABLE_RP`), affiché « PDG, Studio Nord » |
| Dépôt de code | GitHub, migration possible vers GitLab : aucune dépendance propre à GitHub |
| Langues | Bouton de langue (anglais, i18n d'Astro) envisagé en phase 3 |
| Redirections | `public/_redirects` (Cloudflare Pages, 301) : anciennes URL avec et sans `.html`, `/contact` et `/contact/`, `/studio` et `/studio/`, `/archive` et `/archive/*` (règle avec joker en dernier). Cibles finissant par « / ». `www` → domaine principal : **Bulk Redirects** dans le tableau de bord Cloudflare (méthode de la documentation de Pages ; pas possible dans `_redirects`), avec un enregistrement DNS `www` proxifié |
| Sécurité (CSP) | CSP **générée par Astro** (`security.csp`, stable depuis Astro 6) : balise `<meta>` dans chaque page, empreintes SHA-256 des scripts et styles en ligne recalculées à chaque build. Autorisés : media.ostudionord.ca (`media-src`), youtube-nocookie.com (`frame-src`), Formspree et Brevo (`form-action`, avec `'self'` et **`https://ostudionord.ca`** : Chrome vérifie aussi la cible de la redirection de Brevo vers /merci/, qui diffère de `'self'` en local et sur `.pages.dev`), Cloudflare Web Analytics (`script-src`, `connect-src`), attributs `style` (`style-src-attr 'unsafe-inline'`). Stripe : simple lien, rien à déclarer. Absente en `npm run dev`. `public/_headers` : `frame-ancestors 'none'`, X-Frame-Options, nosniff, Referrer-Policy `strict-origin-when-cross-origin` (requise par YouTube et Web Analytics), Permissions-Policy (caméra, micro, géolocalisation, paiement, USB), cache d'un an pour `/_astro/*`, d'un jour pour `/audio/*`, noindex sur `ostudionord.pages.dev` |
| HTTPS | « Always Use HTTPS » dans Cloudflare. HSTS : décision après le lancement |
| Plan du site et robots | `@astrojs/sitemap` fixé à 3.7.4 : `sitemap-index.xml`, 404 exclue d'office, /merci/ exclue par filtre (toute nouvelle page `noindex` à ajouter au filtre). `robots.txt` : tout admis sauf `/admin/`, **robots d'IA compris (découvrabilité)** ; « Block AI bots » et robots.txt géré par Cloudflare désactivés |
| Fonctions Cloudflare | Désactivées (elles injectent des scripts que la CSP bloquerait, ou font doublon) : Rocket Loader, Email Obfuscation, Web Analytics automatique de Pages (on garde le script avec jeton) |

## Pourquoi Brevo plutôt que MailerLite

| | MailerLite gratuit | Brevo gratuit |
|---|---|---|
| Abonnés | 500 actifs maximum | jusqu'à 100 000 contacts |
| Envois | 12 000 par mois, sans plafond quotidien | 300 par jour |
| Marque de l'outil dans les courriels | oui | oui |
| Au-delà de la limite | campagnes bloquées dès 501 abonnés | envoi possible, étalé sur plusieurs jours |
| Premier forfait payant | — | Starter, à partir de 9 $ US par mois |

La priorité n° 1 est d'agrandir l'auditoire. Avec Brevo, la liste peut grossir gratuitement. Le seul inconvénient : au-delà de 300 abonnés, une annonce de sortie s'envoie sur plusieurs jours, ce que le forfait Starter règle. Brevo offre aussi une interface en français et des courriels automatiques (par exemple « Ton beat est disponible »).

## Stack complet par phase

### Phase 1 — Lancement du 15 novembre 2026

| Rôle | Outil | Coût |
|---|---|---|
| Dépôt de code | GitHub (ou GitLab) | 0 $ |
| Framework | Astro | 0 $ |
| Hébergement | Cloudflare Pages | 0 $ |
| DNS | Cloudflare, avec l'enregistrement du domaine conservé chez Namecheap | 0 $ |
| Courriel `info@ostudionord.ca` | Namecheap Private Email (serveurs aux États-Unis) | abonnement existant |
| Vidéos courtes et boucles | Cloudflare R2, servi sur `media.ostudionord.ca` | 0 $ sous 10 Go |
| Clips et épisodes | YouTube, intégrés avec une façade légère | 0 $ |
| Formulaires contact, collaborations et partenariats | Formspree (forfait gratuit), avec honeypot | 0 $ |
| Infolettre, « M'avertir » et avis du drop | Brevo (compte Studio Nord) ; intérêts du drop : T-shirt, Casquette, Autre vêtement, CD, Vinyle, Poster d'artiste | 0 $ |
| VIP Pass (facultatif dès la P1) | Stripe Payment Link limité à 25 + deploy hook Cloudflare | 2,9 % + 0,30 $ CA par vente |
| Statistiques | Cloudflare Web Analytics, sans cookies | 0 $ |
| Conversion des médias | Script Python + ffmpeg (.MOV et .heic vers MP4 et AVIF) | 0 $ |

### Phase 2 — Décembre 2026 à début 2027

| Rôle | Outil | Coût |
|---|---|---|
| Publication sans code | Sveltia CMS sur `/admin` | 0 $ |
| Vidéos exclusives hors YouTube (au besoin) | Bunny Stream | ~1 à 3 $ US par mois |
| Confirmation des formulaires sur le site (/merci/) | Forfait payant Formspree ou autre service | à choisir |

### Phase 3 — Mars 2027 (beats)

| Rôle | Outil | Coût |
|---|---|---|
| Vente de beats | Stripe Payment Links | 2,9 % + 0,30 $ CA par vente |

À l'ajout de la vente de beats : mettre à jour /confidentialite/ (tableau, date) et l'EFVP.

### Hors site

- Drop de merch d'août 2027 : géré par Textilart (outil de vente créé par GT Média). La boutique affiche « bientôt » tant que l'URL n'existe pas. Les cartes-cadeaux Studio Nord y sont acceptées.

### Retiré pour l'instant

- Synchronisation automatique avec YouTube.
- Services de studio (enregistrement, mix, master) : en pause, renvoi vers Kota Studios.

## Plan du site (URL)

```
ostudionord.ca/
├── /                              Accueil (variante B)                        P1
├── /contenu/                      Mur filtrable : musique, vidéos,
│                                  coulisses, séries, lives                    P1
│   └── /contenu/[slug]/           Une page par sortie (porter-ton-nom, ofv…)  P1
├── /series/[slug]/                les-fondateurs, coulisses-alfromega         P2
├── /artistes/                     Artistes et beatmaker                       P1
│   └── /artistes/[slug]/          sadaboy-oelcoepl, don-fenom, molie,
│                                  777pluvieux, ness-gt,
│                                  purp-beatzz                                 P1
├── /createurs/                    Créateurs de contenu et live streaming      P1
│   └── /createurs/[slug]/         bhnwth (géré par GT Média)                  P1
├── /evenements/                   Meet & greet (fév. 2027), spectacle…        P2
├── /boutique/                     Merch (hoodie + avis du drop Textilart),
│                                  beats (écoute + M'informer → achat en P3),
│                                  VIP Pass, cartes-cadeaux                    P1 → P3
├── /partenaires/                  Partenaires locaux de Québec : ALFROMEGA,
│                                  Kota Studios, GT Média, On Est L'Atelier,
│                                  NF Studio, Branche-Toi + formulaire
│                                  de partenariat (vouvoiement)                P1 ✓
├── /a-propos/                     Remplace Contact : histoire, le lieu,
│   │                              fondateurs (initiales), séances en pause    P1 ✓
│   ├── /a-propos/contact/         Coordonnées + formulaire (partenariats :
│   │                              renvoi vers /partenaires/#partenariat)      P1 ✓
│   └── /a-propos/faq/             FAQ (cible de booking.html : #reserver)     P1 ✓
├── /confidentialite/              Politique de confidentialité (Loi 25)       P1 ✓
├── /merci/  /404                  Non indexées (noindex)                      P1 ✓
└── /admin/                        Sveltia CMS                                 P2
```

Les anciennes URL (`booking.html`, `decompte.html`, `contact.html`…) sont redirigées en 301 grâce à `_redirects` (étape j). `/studio/` → `/partenaires/` ; `/booking.html` → `/a-propos/faq/#reserver` ; `/contact.html` et `/contact/` → `/a-propos/contact/`.

## Arborescence du projet (dépôt)

```
ostudionord/
├── astro.config.mjs               Polices, intégrations (tirets, sitemap), CSP
├── package.json
├── README.md
├── public/                        Fichiers servis tels quels
│   ├── _redirects                 Redirections des anciennes URL
│   ├── _headers                   Cache et sécurité (CSP : astro.config.mjs)
│   ├── robots.txt                 Robots (IA compris) + lien vers le sitemap
│   ├── favicon.svg
│   ├── audio/beats/               Extraits SNB-0001…0020.mp3
│   └── admin/                     (P2) index.html + config.yml de Sveltia
├── src/
│   ├── content.config.ts          Schémas des collections (.strict() partout)
│   ├── content/                   ← Ce que tu modifies pour publier
│   │   ├── artistes/              un .md par artiste ou beatmaker
│   │   ├── createurs/             bhnwth.md
│   │   ├── sorties/               un .md par clip, BTS, live ou mixtape
│   │   ├── series/                (P2)
│   │   ├── evenements/            (P2)
│   │   ├── beats/                 un .md par beat (titre, n° SNB, prix en P3)
│   │   ├── merch/                 un .md par produit (variantes) ou aperçu (maquettes)
│   │   ├── cartes-cadeaux/        un .md par carte ou pass
│   │   ├── partenaires/           un .md par partenaire (liens, rôle,
│   │   │                          propriétaire, ordre, logo)
│   │   └── faq/                   un .md par question (question, catégorie,
│   │                              ordre ; réponse en Markdown)
│   ├── data/
│   │   └── site.ts                Navigation, sous-navigation À propos, réseaux,
│   │                              Discord, adresse, RESPONSABLE_RP (Loi 25),
│   │                              DROP_MERCH, VENTES_BEATS
│   ├── components/                Header, Footer, SousNav, RetourHaut (bouton
│   │                              « Retour en haut », mobile, sans JS), Tuile, CarteArtiste,
│   │                              LecteurYouTube, LecteurBeat, ListeBeats,
│   │                              Filtres, FormInfolettre, FormContact,
│   │                              FormPartenariat, EnTetePersonne,
│   │                              EncadrePartenaire, StatutLive,
│   │                              ConfigurateurMerch, LiensUtiles (/merci/, /404)
│   ├── lib/                       sorties.ts, personnes.ts, boutique.ts,
│   │                              partenaires.ts, formulaires.ts (Formspree),
│   │                              faq.ts (catégories)
│   ├── layouts/                   Base.astro (head, header, footer), Page.astro
│   │                              (emplacements « head » et « sous-nav »)
│   ├── pages/                     Une route par page du plan ci-dessus
│   │   │                          (dont confidentialite.astro, merci.astro, 404.astro)
│   │   └── a-propos/              index.astro, contact.astro, faq.astro
│   ├── styles/                    tokens.css (palette, polices), global.css
│   └── assets/                    Images optimisées par Astro : logos,
│                                  séries (fonds des cartes de l'accueil),
│                                  merch, cartes-cadeaux, portraits,
│                                  partenaires (logos + image de partage),
│                                  studio (photos du matériel : /a-propos/)
├── scripts/
│   ├── convertir_medias.py        ffmpeg + heic → MP4 720p, AVIF, vignettes
│   ├── envoyer_r2.sh              Envoi des vidéos vers le bucket R2
│   └── verifier-tirets.mjs        Intégration Astro : avertit au build s'il reste
│                                  un tiret cadratin dans les pages générées
└── maquettes/                     Brouillons HTML (accueil v1 A/B/C), archivés

Bucket R2 (media.ostudionord.ca)
└── video/
    ├── hero/                      background_landing-page.webm…
    ├── decompte/                  DecompteSN_*.mp4
    └── tuiles/                    Boucles verticales du mur de contenu
```

Pour publier une nouvelle vidéo, il suffit d'ajouter un fichier dans `src/content/sorties/` puis de pousser le code. La page de la sortie, la fiche de l'artiste ou du créateur et le mur de l'accueil se mettent à jour d'eux-mêmes.

## Tâches préalables au lancement

- [ ] Créer un compte Cloudflare au nom de Studio Nord.
- [ ] Ajouter `ostudionord.ca` dans Cloudflare, puis remplacer les serveurs de noms chez Namecheap par ceux de Cloudflare. La propagation peut prendre jusqu'à 24 à 48 h : à faire tôt.
- [ ] Recréer dans Cloudflare les enregistrements DNS existants (courriel `info@ostudionord.ca` en particulier) avant de basculer.
- [ ] Créer le bucket R2 et le sous-domaine `media.ostudionord.ca`.
- [x] Créer le compte Brevo de Studio Nord, avec les listes « infolettre », « beats » et « drop » (attributs TAILLE, COULEUR, INTERETS), et régler la redirection après l'inscription vers `/merci/`.
- [x] Ajouter « Autre vêtement » aux valeurs de l'attribut Brevo INTERETS (s'il est à choix multiples).
- [ ] VIP Pass : garder le compteur manuel, ou configurer Stripe (README, « VIP Pass : places restantes »), avec redirection vers `/merci/`.
- [x] Créer les formulaires Formspree « partenariat » et « contact » et coller leurs adresses dans `src/lib/formulaires.ts`.
- [ ] Valider les textes de /a-propos/ (brouillons), puis passer `TEXTES_A_VALIDER` à `false`.
- [x] Faire valider leur description par les partenaires, et leur accord pour l'image de partage (mosaïque des logos).
- [ ] Confirmer GitHub ou GitLab, puis créer le dépôt.
- [x] Désigner le ou la responsable de la protection des renseignements personnels (titre dans `RESPONSABLE_RP`, `src/data/site.ts`). Une délégation doit être faite par écrit.
- [ ] Réaliser l'EFVP (communication hors Québec, art. 17) avec le modèle de rapport de la CAI, en consultant le ou la responsable ; conserver les ententes écrites des fournisseurs (conditions, ententes de traitement des données).
- [ ] Faire valider `/confidentialite/` par un juriste, puis passer `POLITIQUE_A_VALIDER` à `false`.
- [x] Activer la double authentification sur les comptes Formspree, Brevo, Stripe, Namecheap, Cloudflare et GitHub (affirmé dans la politique).
- [ ] Tenir un registre des incidents de confidentialité (même vide).
- [ ] Cloudflare (reporté dans la liste de contrôle, section A) : Bulk Redirects `www.ostudionord.ca` → `ostudionord.ca` (301) et enregistrement DNS `www` ; activer « Always Use HTTPS » ; laisser désactivés Rocket Loader, Email Obfuscation, le Web Analytics automatique de Pages, « Block AI bots » et le robots.txt géré.
- [ ] Sur la prévisualisation Cloudflare : vérifier les redirections et les en-têtes avec `curl.exe -sI` (README, « Tester en local »).

## Sources

- [Cloudflare Pages — Limits](https://developers.cloudflare.com/pages/platform/limits)
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Cloudflare Stream — Pricing](https://developers.cloudflare.com/stream/pricing)
- [Bunny Stream — Pricing](https://bunny.net/docs/stream/pricing)
- [Filebase — Cloudflare R2 Pricing 2026](https://filebase.com/blog/cloudflare-r2-pricing-costs-savings-and-alternatives-in-2026/)
- [Sveltia CMS (GitHub)](https://github.com/sveltia/sveltia-cms) · [Prise en charge de GitLab, issue #22](https://github.com/sveltia/sveltia-cms/issues/22)
- [Ecommerce Platforms — Brevo Pricing 2026](https://ecommerce-platforms.com/email-marketing-services-reviews/sendinblue-pricing)
- [GroupMail — MailerLite Free Plan 2026](https://blog.groupmail.io/mailerlite-free-plan-limits/)
- [Venn — Stripe fees for Canadian businesses](https://www.venn.ca/resources/how-to-save-on-your-stripe-payments-for-canadian-businesses)
- [Formspree — Thank You redirect (forfaits payants)](https://help.formspree.io/hc/en-us/articles/360012378333--Thank-You-redirect)
- [Search Engine Journal — Google Drops FAQ Rich Results](https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/)
- Commission d'accès à l'information, *Réaliser une évaluation des facteurs relatifs à la vie privée*, guide v3.1 (avril 2024), et modèle de rapport d'EFVP v1.1 (fichiers fournis)
- [Brevo — Data storage location](https://help.brevo.com/hc/en-us/articles/360001005510)
- [Namecheap — Where are your datacenters located?](https://www.namecheap.com/support/knowledgebase/article.aspx/136/22/where-are-your-datacenters-located-how-can-i-request-to-change-the-datacenter/)
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)
- [Cloudflare Pages — Redirects](https://developers.cloudflare.com/pages/configuration/redirects/) · [Headers](https://developers.cloudflare.com/pages/configuration/headers/) · [Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) · [Redirecting www to domain apex](https://developers.cloudflare.com/pages/how-to/www-redirect/)
- [Cloudflare — Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- [Cloudflare — CSP et produits Cloudflare](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/)
- [Astro 6 — CSP stable](https://astro.build/blog/astro-6) ; code d'astro@7.4.1 (`dist/core/csp/config.js`)
