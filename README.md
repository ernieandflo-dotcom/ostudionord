# ostudionord.ca — Site 2.0

Site média de Studio Nord (Limoilou, Québec). Astro, déployé sur Cloudflare Pages.
Source de vérité du stack et du plan : `stack_arborescence_site2.0.md` (projet Claude).

## Avant la mise en ligne

- [ ] **Brevo** : remplacer les deux adresses `REMPLACER.sibforms.com` dans
      `src/components/FormInfolettre.astro` (listes « infolettre » et « beats »),
      vérifier les noms des champs avec le code HTML de Brevo et régler la redirection
      vers `/merci/`. Tant que ce n'est pas fait, `npm run build` affiche
      « À FAIRE AVANT LE LANCEMENT ».
- [ ] **Vidéos** : envoyer `public/media/video/` dans R2 (`video/decompte/`, `video/tuiles/`)
      et définir `PUBLIC_MEDIA_URL=https://media.ostudionord.ca` dans Cloudflare Pages.
- [x] **Bios des artistes et des créateurs** : remplacer le lorem ipsum sous le second `---`
      de chaque `src/content/artistes/*.md` et `src/content/createurs/*.md` (et ajouter une `accroche` au besoin). Tant que ce n'est pas
      fait, `npm run build` affiche « bio en lorem ipsum ».
- [ ] **Formspree** : créer les formulaires « Partenariat » et « Contact », puis remplacer
      `REMPLACER_PARTENARIAT` et `REMPLACER_CONTACT` dans `src/lib/formulaires.ts`
      (voir « Formulaires » plus bas).
- [ ] **Brevo, liste « drop »** : si l'attribut `INTERETS` est à choix multiples, y ajouter
      la valeur « Autre vêtement » (écrite exactement pareil).
- [ ] **VIP Pass** : choisir le mode du compteur (voir « VIP Pass : places restantes »).
      Par défaut, mode manuel (`quota: 25`, `vendus: 0`).
- [ ] **À propos** : relire les textes de `src/pages/a-propos/index.astro`, puis passer
      `TEXTES_A_VALIDER` à `false`. Tant que ce n'est pas fait, `npm run build` affiche
      « textes de /a-propos/ en brouillon ».
- [ ] **Confidentialité (Loi 25)** : désigner le ou la responsable de la protection des
      renseignements personnels et remplacer son titre dans `RESPONSABLE_RP`
      (`src/data/site.ts`). Réaliser l'EFVP pour les fournisseurs hors Québec (Formspree,
      Brevo, Stripe, Namecheap, Cloudflare, YouTube ; modèle de rapport de la CAI), faire
      valider `src/pages/confidentialite.astro` par un juriste, puis passer
      `POLITIQUE_A_VALIDER` à `false`. Tant que ce n'est pas fait, `npm run build` affiche
      deux avertissements.
- [ ] **Double authentification** : l'activer sur les comptes Formspree, Brevo, Stripe,
      Namecheap, Cloudflare et GitHub (la politique de confidentialité l'affirme).
- [ ] **Redirections vers `/merci/`** : Brevo (chaque formulaire › après l'inscription) et
      Stripe (Payment Link du VIP Pass › après le paiement) : `https://ostudionord.ca/merci/`.
      Si la double confirmation (double opt-in) est activée dans Brevo, ajuster la phrase
      « Tu t'es abonné·e à une liste » de `src/pages/merci.astro`.
- [ ] **Partenaires** : faire valider leur description par Kota Studios, GT Média, NF Studio
      et Branche-Toi, et leur accord pour l'image de partage (mosaïque des logos).

- [ ] **Cloudflare (liste de contrôle, section A)** : Bulk Redirects
      `www.ostudionord.ca` → `ostudionord.ca` (301) et enregistrement DNS `www` ;
      activer « Always Use HTTPS » (HSTS : décision après le lancement) ; laisser
      désactivés Rocket Loader, Email Obfuscation, le Web Analytics automatique de Pages
      (on utilise déjà le script avec jeton) et « Block AI bots » / robots.txt géré
      (découvrabilité). Voir « Mise en ligne : redirections, sécurité, plan du site ».

## Démarrer

```sh
node -v          # doit afficher v22.22.0 ou plus récent
npm install
npm run dev      # http://localhost:4321  (Ctrl+C pour arrêter)
```

## Publier un contenu

Ajouter un fichier `.md` dans `src/content/sorties/`, puis pousser sur `main`.

- Sortie publiée : `date` obligatoire.
- Sortie à venir : `statut: a-venir` avec une `date` prévue ou une `echeance` (ex. « Bientôt »).
- Toute vidéo (YouTube ou R2) exige une `vignette` dans `src/assets/sorties/`.
  Vignette horizontale = tuile large sur le mur ; verticale = tuile 9:16.
- Chaque sortie publiée a sa page : `src/content/sorties/ofv.md` → `/contenu/ofv/`.
  Une sortie à venir n'a pas de page ; sa tuile mène au formulaire « M'avertir ».
- `resume` : une ou deux phrases, affichées sur la page et reprises par Google et les réseaux.
- Texte libre (crédits, réalisation…) : l'écrire en Markdown **sous** le second `---`.
- `serie` : regroupe des sorties liées (ex. `decompte-ouverture`). La page affiche alors la
  liste des épisodes. Nouvelle valeur → ajouter son titre dans `SERIES` (`src/lib/sorties.ts`).
- Mur filtré par lien : `/contenu/?type=coulisses` (types : musique, video, coulisses, serie, live).

- Image de partage : la vignette est recadrée au centre en 1200 × 630. Si le recadrage coupe
  mal (vignette verticale), ajouter `imagePartage` (image horizontale dans `src/assets/sorties/`)
  et `imagePartageAlt`.

### Ajouter un artiste

Créer `src/content/artistes/<slug>.md` (le nom du fichier donne l'adresse `/artistes/<slug>/`) :

```yaml
---
nom: Mølie
role: artiste            # ou beatmaker
genres: [Pop, "R&B"]     # "R&B" entre guillemets (à cause du &)
initiales: MØ            # affichées tant qu'il n'y a pas de portrait
accroche: Une phrase.    # facultatif : cartes et partage (sinon phrase générée)
portrait: ../../assets/artistes/molie.jpg   # carré, 1080 px idéalement
portraitAlt: "Description du portrait"      # obligatoire avec un portrait
liens:                   # seulement ceux qui existent
  instagram: https://www.instagram.com/…
  spotify: https://open.spotify.com/artist/…   # sans le « ?si=… » de partage
  youtube: https://www.youtube.com/@…
  site: https://…
partenaire: gt-media     # facultatif : « Géré par » sur la fiche
ordre: 1                 # facultatif : épingle en tête ; sinon ordre alphabétique
---

Bio en Markdown (3 à 5 phrases).
```

La fiche affiche d'elle-même les sorties où l'artiste figure (`artistes: [molie]` dans une
sortie) et, pour un beatmaker, ses beats (`beatmaker: <slug>` dans `src/content/beats/`).

### Ajouter un créateur

Créer `src/content/createurs/<slug>.md` (adresse : `/createurs/<slug>/`). Mêmes champs que
pour un artiste (`nom`, `initiales`, `accroche`, `portrait`, `portraitAlt`, `liens`,
`partenaire`, `ordre`, bio sous le `---`), plus :

```yaml
pseudo: "@bigheadnesswiththehyphen"
categories: [Live streaming, Divertissement]
plateformes:                 # boutons « Regarder sur … » de la fiche
  - nom: twitch              # twitch, youtube, tiktok, kick, instagram
    url: https://www.twitch.tv/…
  - nom: youtube
    url: null                # pas encore de chaîne : pastille grisée « YouTube · bientôt »
horaire:                     # facultatif, heure du Québec
  plages:
    - jours: [mardi, jeudi]  # lundi … dimanche
      debut: "20:00"
      fin: "23:00"           # plus tôt que debut = se termine le lendemain
  note: L'horaire peut changer ; les annonces passent sur Instagram.
```

Pendant une plage de l'horaire, la fiche et la carte du créateur sur `/createurs/` affichent
« En live, selon l'horaire ». C'est un calcul d'après l'horaire (dans le navigateur, chaque minute), pas l'état
réel de la chaîne : interroger Twitch ferait une requête à un tiers (Loi 25).

### Ajouter un partenaire

Créer `src/content/partenaires/<slug>.md` et le logo dans `src/assets/partenaires/`
(carré, 800 px, fond uni). La rangée apparaît sur `/partenaires/`, avec l'ancre
`/partenaires/#<slug>`.

```yaml
---
nom: GT Média
nomComplet: Grosse-Tête Média   # facultatif, affiché sous le nom
role: Production multimédia · gérance
description: Une ou deux phrases.
liens:                          # seulement ceux qui existent : site, youtube, instagram, facebook, tiktok
  site: https://grossetete.ca/
proprietaire: alfromega         # facultatif : « Propriété d'ALFROMEGA » (+ « Possède : … » chez lui)
logo: ../../assets/partenaires/gt-media.jpg
logoAlt: Logo de Grosse-Tête Média
logoFond: '#000000'             # couleur du fond du logo (remplit le cadre) ; défaut : noir
ordre: 30                       # petit = en premier
---
```

« Gère : … » s'ajoute de lui-même quand un artiste ou un créateur a `partenaire: <slug>`.
L'encadré « Géré par » de sa fiche renvoie au lien principal du partenaire
(site, sinon YouTube, Instagram, Facebook, TikTok).

### Ajouter une question à la FAQ

Créer `src/content/faq/<slug>.md` : la question apparaît sur `/a-propos/faq/`, avec l'ancre
`/a-propos/faq/#<slug>`. La réponse s'écrit en Markdown sous le second `---` (liens permis).

```yaml
---
question: "Est-ce que je peux réserver une séance d'enregistrement ?"
categorie: studio   # studio | collaborations | boutique | donnees
ordre: 10           # petit = en premier dans sa catégorie
---

Réponse en Markdown, avec un [lien](/a-propos/contact/).
```

Titres et ordre des catégories : `src/lib/faq.ts` (`CATEGORIES_FAQ`, `TITRES_CATEGORIES`).
Les données structurées FAQPage (JSON-LD) se génèrent d'elles-mêmes.
Ne pas renommer `reserver.md` : c'est la cible de la redirection de `booking.html`.

### Tirets cadratins (—) : interdits dans le texte affiché

Dans les titres, les `alt`, les textes des pages et des `.md`, on utilise « · », « : » ou « | ».
Titre d'onglet : « Titre · détail | Studio Nord » (le « | Studio Nord » est ajouté par
`Base.astro`). Les commentaires du code peuvent en contenir.
Garde-fou : à la fin de `npm run build`, `scripts/verifier-tirets.mjs` relit les pages
générées et affiche « À CORRIGER : tiret cadratin » avec la liste des pages en cause.

### Politique de confidentialité

`src/pages/confidentialite.astro`. À mettre à jour (texte et `MISE_A_JOUR`) à chaque nouveau
formulaire, fournisseur ou type de vente (ex. beats en 2027). Le titre et le courriel du ou de
la responsable sont dans `RESPONSABLE_RP` (`src/data/site.ts`).

### VIP Pass : places restantes

Le quota (25) n'est jamais affiché ; la boutique affiche « Il n'en reste que N », puis
« Complet » (bouton retiré). Deux modes, choisis tout seuls au build :

**Mode manuel** (par défaut) : commande par courriel. Dans
`src/content/cartes-cadeaux/vip-pass.md`, augmenter `vendus` après chaque vente confirmée,
puis pousser. `vendus` plus grand que `quota` = erreur claire au build.

**Mode automatique** (Stripe) : paiement par carte sur la page de Stripe ; le compteur se met
à jour seul après chaque vente (une à deux minutes). À faire une seule fois (les chemins des
menus peuvent varier légèrement) :

1. **Stripe** › Catalogue de produits : créer « VIP Pass » à 100 $ CAD.
2. **Stripe** › Payment Links › Nouveau lien pour ce produit : cocher
   « Limit the number of payments » (limiter le nombre de paiements) = **25**, personnaliser
   le message du lien désactivé (ex. « Les VIP Pass sont tous partis ! »). Après le paiement :
   rediriger vers `https://ostudionord.ca/merci/`. Copier l'URL du lien (`https://buy.stripe.com/…`).
3. **Stripe** › Développeurs › Clés API › **Créer une clé restreinte** : permission
   « Payment Links » en **lecture** seulement, tout le reste à « Aucun ». Copier la clé (`rk_live_…`).
4. **Cloudflare Pages** › projet › Settings › Variables and secrets : ajouter
   `STRIPE_CLE_LECTURE` (type **Secret**, environnement Production) avec cette clé.
5. **Cloudflare Pages** › Settings › Builds › **Deploy hooks** : créer un hook pour la branche
   `main` et copier son URL (c'est un secret : ne jamais la mettre dans le dépôt).
6. **Stripe** › Développeurs › **Webhooks** › Ajouter une destination : coller l'URL du deploy
   hook, événement `checkout.session.completed`. Chaque vente relance ainsi le build.
7. Dans `vip-pass.md`, décommenter `lienStripe:` avec l'URL de l'étape 2, puis pousser.

Le build lit la limite et le nombre de paiements du lien chez Stripe (une requête depuis le
serveur de build, jamais depuis le navigateur des visiteurs). Si Stripe ne répond pas ou si le
lien n'a pas de limite, `npm run build` affiche un avertissement et revient au mode manuel.

- **Vente hors Stripe** (comptant, événement) : baisser la limite du lien dans Stripe d'une
  unité, puis relancer un build (Cloudflare › Deployments › Retry deployment, ou
  `curl -X POST "<URL du deploy hook>"`). Ne pas toucher `vendus` en mode automatique.
- **Tester en local** : mettre la clé dans `.env` (jamais commité), puis `npm run build`.
- **Confidentialité** : Stripe (États-Unis) traite le paiement ; mentionné dans `/confidentialite/`.

### Sous-titres (vidéos R2)

Fichier WebVTT (`.vtt`) envoyé dans R2 à côté de la vidéo, puis déclaré dans la sortie :
`sousTitresR2: video/decompte/decompte-j1.vtt`. Le fichier vient d'un autre domaine
(`media.ostudionord.ca`) : le bucket R2 doit autoriser `https://ostudionord.ca` dans sa
règle CORS (R2 › bucket › Settings › CORS policy, méthode `GET`), sinon les sous-titres
ne s'affichent pas et la vidéo peut refuser de jouer.

## Formulaires

- **Brevo** (infolettre, beats, drop) : `src/components/FormInfolettre.astro`.
- **Formspree** : adresses dans `src/lib/formulaires.ts`.
  - « partenariat » : `FormPartenariat` sur `/partenaires/#partenariat` (vouvoiement) ;
  - « contact » : `FormContact` sur `/a-propos/contact/` (tutoiement). Sujets regroupés
    (Collaboration, Studio Nord, Autre) : liste `SUJETS` dans le composant. Les partenariats
    n'y sont pas : la page renvoie vers `/partenaires/#partenariat`.
  Honeypot `_gotcha`, objet du courriel `_subject`, consentement obligatoire. Aucun JavaScript.
- **Forfait gratuit de Formspree (P1)** : 50 envois par mois ; après l'envoi, le visiteur voit
  la page de remerciement de Formspree, pas `/merci/` (la redirection est réservée aux
  forfaits payants et se règle dans Formspree › Settings, sans toucher au code).
- **À revoir en P2** : garder les visiteurs sur le site après l'envoi (forfait payant de
  Formspree ou autre service de formulaires).

## Médias

- Images : `src/assets/` (optimisées par Astro au build).
- Beats (écoute intégrale) : `public/audio/beats/`. Lecteur maison sans bouton
  de téléchargement, avec un avis de licence : toute distribution ou utilisation
  commerciale sans licence est interdite.
- Vidéos : bucket R2 (`media.ostudionord.ca`), jamais dans le dépôt.
  En local, les copier dans `public/media/video/…` (ignoré par Git).

### Vignettes YouTube

Téléchargées **une fois** et commitées : la page ne contacte pas Google avant le clic (Loi 25).
Depuis la racine du dépôt (Mac, ou Windows avec PowerShell : `curl.exe` au lieu de `curl`) :

```sh
curl -fo src/assets/sorties/porter-ton-nom.jpg https://i.ytimg.com/vi/sPWAPI32QAg/maxresdefault.jpg
curl -fo src/assets/sorties/ofv.jpg            https://i.ytimg.com/vi/gQxgzxCWyzU/maxresdefault.jpg
curl -fo src/assets/sorties/keep-going.jpg     https://i.ytimg.com/vi/ELPGrYm5N7Y/maxresdefault.jpg
```

Si une commande échoue (erreur 404 : la vidéo n'a pas de version 1280 px),
remplacer `maxresdefault.jpg` par `hqdefault.jpg`.

### Conversion des vidéos (`scripts/convertir_medias.py`)

Les vidéos brutes vont dans `medias-sources/` (ignoré par Git). Le script produit,
pour chaque vidéo : la vidéo complète 720p (`public/media/video/<dossier>/`),
une boucle muette de 6 s pour les tuiles (`public/media/video/tuiles/`) et une
image fixe (`src/assets/sorties/<slug>.jpg`, à commiter).

Windows 11 (PowerShell), une seule fois :

```powershell
winget install --id Python.Python.3.12 -e
winget install --id Gyan.FFmpeg -e
# fermer puis rouvrir PowerShell, et vérifier :
py --version ; ffmpeg -version
```

Puis, depuis la racine du dépôt :

```powershell
py scripts\convertir_medias.py decompte          # les 6 vidéos du décompte
py scripts\convertir_medias.py video medias-sources\clip.MOV --slug mon-clip --dossier tuiles
```

Sur Mac : `python3 scripts/convertir_medias.py decompte`.
Options : `--debut 5` (seconde de départ de la boucle), `--force` (tout refaire).

## Mise en ligne : redirections, sécurité, plan du site

Étape j. Trois fichiers dans `public/` (copiés tels quels dans `dist/`) et deux réglages
dans `astro.config.mjs`.

### Redirections (`public/_redirects`)

Anciennes URL du site GitHub Pages → nouvelles pages, en 301 (permanentes).
Une ligne = `source destination 301`. La première règle qui correspond s'applique ;
la règle avec joker (`/archive/*`) reste la dernière. Une cible peut contenir une ancre
(`#reserver`) ou un paramètre (`?type=coulisses`) et finit toujours par « / ».
Les redirections d'un domaine entier (`www.` → domaine principal) ne se font pas ici,
mais dans le tableau de bord Cloudflare, page **Bulk Redirects** (liste + règle,
méthode de la documentation de Cloudflare Pages), avec un enregistrement DNS `www` proxifié.

### Sécurité (CSP et en-têtes)

- **CSP** (politique de sécurité du contenu : la liste de ce que la page a le droit de
  charger) : écrite par Astro dans chaque page (`security.csp` dans `astro.config.mjs`).
  Astro y met l'empreinte de chaque script et style en ligne, recalculée à chaque build.
  **Elle n'existe pas en `npm run dev`** : tester avec `npm run build` puis `npm run preview`.
- **Ajout d'un service tiers** (script, iframe, formulaire, vidéo hébergée ailleurs) :
  l'ajouter à la bonne directive de `security.csp` (`frame-src`, `form-action`,
  `media-src`…), sinon le navigateur le bloque. Symptôme : rien ne s'affiche, et la
  console (F12) dit « Refused to … because it violates the following Content Security
  Policy directive ». Penser aussi à la politique de confidentialité (Loi 25).
- **`public/_headers`** : `frame-ancestors 'none'` (aucun site ne peut afficher nos pages
  dans un cadre ; impossible dans une balise `<meta>`), autres en-têtes de sécurité,
  cache d'un an pour `/_astro/*`, d'un jour pour `/audio/*` (pour remplacer un extrait
  tout de suite, changer son nom de fichier).
- **Cloudflare** : Rocket Loader, Email Obfuscation et les autres fonctions qui injectent
  des scripts doivent rester désactivés (la CSP les bloquerait).

### Plan du site et robots

- `@astrojs/sitemap` (fixé à 3.7.4) écrit `sitemap-index.xml` au build. La 404 est exclue
  d'office ; `/merci/` est exclue par le filtre dans `astro.config.mjs`. Toute nouvelle
  page `noindex` doit aussi être ajoutée à ce filtre.
- `public/robots.txt` : tous les robots admis (y compris ceux des IA : découvrabilité),
  sauf `/admin/`, et lien vers le plan du site. Ne jamais y bloquer une page `noindex` :
  le robot doit pouvoir la lire pour voir la balise.

### Tester en local

`npm run preview` sert `dist/` avec la CSP, mais ignore `_redirects` et `_headers`.
Pour les tester, Wrangler (l'outil de Cloudflare qui simule Pages) via `npx`, sans
l'ajouter au projet (premier lancement : téléchargement d'environ une minute) :

```sh
npm run build
npx wrangler@4 pages dev dist --port 8788
# dans un 2e terminal (PowerShell : curl.exe ; Mac : curl)
curl.exe -sI http://localhost:8788/booking.html     # 301, Location: /a-propos/faq/#reserver
curl.exe -sI http://localhost:8788/                 # en-têtes de sécurité
```

Sur la prévisualisation Cloudflare, remplacer `http://localhost:8788` par l'adresse de la
branche (`https://<branche>.ostudionord.pages.dev`).

## À quoi sert chaque fichier de configuration

| Fichier | Rôle | Quand y toucher |
|---|---|---|
| `package.json` | Carte d'identité du projet : nom, version d'Astro (fixée à 7.4.1), Node minimal, et les commandes `npm run dev`, `build`, `preview`. | Pour mettre Astro à jour ou ajouter un paquet. |
| `package-lock.json` | Créé par `npm install`. Fige la version exacte de chaque paquet pour que ton Mac et Cloudflare installent la même chose. | Jamais à la main. Toujours le commiter. |
| `astro.config.mjs` | Réglages d'Astro : adresse du site (sitemap, liens absolus), URL qui finissent par « / », polices, garde-fou des tirets (`scripts/verifier-tirets.mjs`), plan du site (`@astrojs/sitemap`) et CSP (`security.csp`). | Nouveau service tiers (CSP), nouvelle page `noindex` (filtre du plan du site). |
| `public/_redirects` | Redirections 301 des anciennes URL (Cloudflare Pages). | Quand une page change d'adresse. |
| `public/_headers` | En-têtes de sécurité et de cache (Cloudflare Pages). | Rarement. |
| `public/robots.txt` | Règles pour les robots et lien vers le plan du site. | Rarement. |
| `tsconfig.json` | Réglages de TypeScript. Permet à VS Code de souligner les erreurs (champ manquant dans un `.md`, faute dans un nom de composant). N'a aucun effet sur le site publié. | Jamais, en principe. |
| `.nvmrc` | Indique la version majeure de Node (22). Cloudflare Pages le lit pour choisir son Node au build ; `nvm use` le lit aussi si tu installes nvm. | Au passage à Node 24. |
| `.gitignore` | Liste de ce que Git ne doit jamais envoyer : `node_modules/`, `dist/`, `.env`, vidéos, `.heic`, `.MOV`, `medias-sources/`. C'est le garde-fou qui empêche une vidéo d'atterrir dans le dépôt. | Pour exclure un nouveau type de fichier. |
| `.env.example` | Modèle des variables d'environnement. Copié en `.env` (jamais commité), il sert à indiquer l'adresse des médias R2. Vide = repli local sur `public/media/`. | Quand une nouvelle variable apparaît. |
| `public/media/` | Repli local des vidéos tant que `media.ostudionord.ca` n'existe pas. Tu y déposes les vidéos pour les voir en local ; Git les ignore. | Pour tester une vidéo en local. |
| `.vscode/extensions.json` | Fait proposer par VS Code l'extension officielle Astro (coloration, autocomplétion, erreurs). | Jamais. |
