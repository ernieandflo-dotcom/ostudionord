#!/usr/bin/env python3
"""
convertir_medias.py — Conversion des vidéos brutes pour le site.
Phase : P1 (étape b)

Les fichiers bruts vivent dans medias-sources/ (à la racine du dépôt, ignoré par Git).
Pour chaque vidéo, le script produit trois fichiers :

  1. public/media/video/<dossier>/<slug>.mp4   vidéo complète, H.264, 720p, son AAC
                                                (page de la sortie, étape c)
  2. public/media/video/tuiles/<slug>.mp4       boucle muette de 6 s, 480p
                                                (tuile du mur de contenu)
  3. src/assets/sorties/<slug>.jpg              image fixe = 1re image de la boucle
                                                (vignette, poster, mouvement réduit)

Les fichiers 1 et 2 vont ensuite dans R2 avec la même arborescence (video/…).
Le fichier 3 est commité : c'est une image du site, optimisée par Astro.

« 720p » = 720 px sur le côté COURT : une vidéo verticale sort en 720 × 1280.

Dépendances : Python 3.10+ et ffmpeg (bibliothèque standard seulement).
Fonctionne sous Windows 11, macOS et Linux.

Utilisation (depuis la racine du dépôt) :
  Windows : py scripts\\convertir_medias.py decompte
  Mac     : python3 scripts/convertir_medias.py decompte

  Une seule vidéo :
    py scripts\\convertir_medias.py video medias-sources\\clip.MOV --slug mon-clip --dossier tuiles

Options :
  --debut 3      seconde où commence la boucle (et l'image fixe). Défaut : 3,
                 ou la valeur du tableau DECOMPTE plus bas.
  --force        refait les fichiers déjà présents (sinon, ils sont sautés).
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

# Accents lisibles dans le terminal Windows.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

RACINE = Path(__file__).resolve().parent.parent
SOURCES = RACINE / "medias-sources"
SORTIE_VIDEO = RACINE / "public" / "media" / "video"
SORTIE_IMAGES = RACINE / "src" / "assets" / "sorties"

DUREE_BOUCLE = 6  # secondes

DEBUT_DEFAUT = 3  # seconde où commencent la boucle et l'image fixe

# Vidéos du décompte : fichier brut -> (slug de la sortie, seconde de départ de la boucle).
# Le slug correspond à src/content/sorties/<slug>.md. La seconde est choisie
# pour que l'image fixe soit lisible (ex. J-1 : 10 s, après l'escalier flou).
DECOMPTE = {
    "DecompteSN_Jour5-Comp65.mp4": ("decompte-j5", 3),
    "DecompteSN_Jour4_720.mp4": ("decompte-j4", 3),
    "DecompteSN_Jour3.MP4": ("decompte-j3", 3),
    "DecompteSN_Jour2.mp4": ("decompte-j2", 3),
    "DecompteSN_Jour1_720.mp4": ("decompte-j1", 10),
    "DecompteSN_JourJ-Keven.mp4": ("decompte-jour-j", 3),
}


def echelle(cote_court: int) -> str:
    """Filtre ffmpeg : ramène le côté court à `cote_court` px au maximum, sans agrandir.
    -2 = dimension calculée pour garder les proportions (et rester paire)."""
    return (
        f"scale='if(gte(iw,ih),-2,min(iw,{cote_court}))'"
        f":'if(gte(iw,ih),min(ih,{cote_court}),-2)'"
    )


def ffmpeg(*args: str) -> None:
    commande = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args]
    resultat = subprocess.run(commande)
    if resultat.returncode != 0:
        sys.exit(f"Échec de ffmpeg : {' '.join(commande)}")


def taille(chemin: Path) -> str:
    return f"{chemin.stat().st_size / 1_000_000:.1f} Mo"


def convertir(source: Path, slug: str, dossier: str, debut: float, force: bool) -> None:
    if not source.is_file():
        print(f"  ⚠ Introuvable : {source}")
        return

    complete = SORTIE_VIDEO / dossier / f"{slug}.mp4"
    boucle = SORTIE_VIDEO / "tuiles" / f"{slug}.mp4"
    image = SORTIE_IMAGES / f"{slug}.jpg"
    for f in (complete, boucle, image):
        f.parent.mkdir(parents=True, exist_ok=True)

    print(f"• {source.name} → {slug}")

    # 1. Vidéo complète : H.264 (lu partout), 30 i/s max, son AAC,
    #    +faststart = la lecture commence avant la fin du téléchargement.
    if force or not complete.exists():
        ffmpeg(
            "-i", str(source),
            "-vf", echelle(720), "-fpsmax", "30",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "24",
            "-profile:v", "high", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "128k",
            "-movflags", "+faststart",
            str(complete),
        )
    print(f"  vidéo complète : {complete.relative_to(RACINE)} ({taille(complete)})")

    # 2. Boucle de tuile : 6 s, sans son (-an), plus petite.
    if force or not boucle.exists():
        ffmpeg(
            "-ss", str(debut), "-t", str(DUREE_BOUCLE), "-i", str(source),
            "-vf", echelle(480), "-fpsmax", "30",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "28",
            "-profile:v", "high", "-pix_fmt", "yuv420p",
            "-an", "-movflags", "+faststart",
            str(boucle),
        )
    print(f"  boucle de tuile : {boucle.relative_to(RACINE)} ({taille(boucle)})")

    # 3. Image fixe : la même image que le début de la boucle,
    #    pour que le passage poster → vidéo ne saute pas.
    if force or not image.exists():
        ffmpeg(
            "-ss", str(debut), "-i", str(source),
            "-frames:v", "1", "-vf", echelle(1080), "-q:v", "3",
            str(image),
        )
    print(f"  image fixe : {image.relative_to(RACINE)} ({taille(image)})")


def main() -> None:
    parser = argparse.ArgumentParser(description="Conversion des vidéos de Studio Nord.")
    sous = parser.add_subparsers(dest="commande", required=True)

    p_dec = sous.add_parser("decompte", help="Les 6 vidéos de medias-sources/decompte/")
    p_dec.add_argument("--debut", type=float, default=None, help="remplace la seconde du tableau DECOMPTE")
    p_dec.add_argument("--force", action="store_true")

    p_vid = sous.add_parser("video", help="Une seule vidéo")
    p_vid.add_argument("source", type=Path)
    p_vid.add_argument("--slug", required=True, help="ex. porter-ton-nom-bts")
    p_vid.add_argument("--dossier", default="tuiles", help="sous-dossier de video/ (ex. decompte)")
    p_vid.add_argument("--debut", type=float, default=DEBUT_DEFAUT)
    p_vid.add_argument("--force", action="store_true")

    args = parser.parse_args()

    if not shutil.which("ffmpeg"):
        sys.exit(
            "ffmpeg est introuvable.\n"
            "  Windows : winget install --id Gyan.FFmpeg -e   (puis rouvrir le terminal)\n"
            "  Mac     : brew install ffmpeg"
        )

    if args.commande == "decompte":
        dossier_src = SOURCES / "decompte"
        print(f"Source : {dossier_src}\n")
        for fichier, (slug, debut) in DECOMPTE.items():
            debut = args.debut if args.debut is not None else debut
            convertir(dossier_src / fichier, slug, "decompte", debut, args.force)
    else:
        convertir(args.source.resolve(), args.slug, args.dossier, args.debut, args.force)

    print("\nTerminé. Rappel : les .mp4 de public/media/ ne vont jamais dans Git (R2 seulement).")


if __name__ == "__main__":
    main()
