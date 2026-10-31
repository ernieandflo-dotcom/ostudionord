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
- [ ] **Bios des artistes** : remplacer le lorem ipsum sous le second `---` de chaque
      `src/content/artistes/*.md` (et ajouter une `accroche` au besoin). Tant que ce n'est pas
      fait, `npm run build` affiche « bio en lorem ipsum ».

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

### Sous-titres (vidéos R2)

Fichier WebVTT (`.vtt`) envoyé dans R2 à côté de la vidéo, puis déclaré dans la sortie :
`sousTitresR2: video/decompte/decompte-j1.vtt`. Le fichier vient d'un autre domaine
(`media.ostudionord.ca`) : le bucket R2 doit autoriser `https://ostudionord.ca` dans sa
règle CORS (R2 › bucket › Settings › CORS policy, méthode `GET`), sinon les sous-titres
ne s'affichent pas et la vidéo peut refuser de jouer.

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

## À quoi sert chaque fichier de configuration

| Fichier | Rôle | Quand y toucher |
|---|---|---|
| `package.json` | Carte d'identité du projet : nom, version d'Astro (fixée à 7.4.1), Node minimal, et les commandes `npm run dev`, `build`, `preview`. | Pour mettre Astro à jour ou ajouter un paquet. |
| `package-lock.json` | Créé par `npm install`. Fige la version exacte de chaque paquet pour que ton Mac et Cloudflare installent la même chose. | Jamais à la main. Toujours le commiter. |
| `astro.config.mjs` | Réglages d'Astro : adresse du site (sitemap, liens absolus) et URL qui finissent par « / ». | Rarement (intégrations, options de build). |
| `tsconfig.json` | Réglages de TypeScript. Permet à VS Code de souligner les erreurs (champ manquant dans un `.md`, faute dans un nom de composant). N'a aucun effet sur le site publié. | Jamais, en principe. |
| `.nvmrc` | Indique la version majeure de Node (22). Cloudflare Pages le lit pour choisir son Node au build ; `nvm use` le lit aussi si tu installes nvm. | Au passage à Node 24. |
| `.gitignore` | Liste de ce que Git ne doit jamais envoyer : `node_modules/`, `dist/`, `.env`, vidéos, `.heic`, `.MOV`, `medias-sources/`. C'est le garde-fou qui empêche une vidéo d'atterrir dans le dépôt. | Pour exclure un nouveau type de fichier. |
| `.env.example` | Modèle des variables d'environnement. Copié en `.env` (jamais commité), il sert à indiquer l'adresse des médias R2. Vide = repli local sur `public/media/`. | Quand une nouvelle variable apparaît. |
| `public/media/` | Repli local des vidéos tant que `media.ostudionord.ca` n'existe pas. Tu y déposes les vidéos pour les voir en local ; Git les ignore. | Pour tester une vidéo en local. |
| `.vscode/extensions.json` | Fait proposer par VS Code l'extension officielle Astro (coloration, autocomplétion, erreurs). | Jamais. |
