---
# VIP Pass : accès à tous les événements en personne de Studio Nord pendant un an
# Phase : P1 (étape f) · prix temporaire · quota à l'étape h.1
nom: VIP Pass
genre: pass # montant | service | pass
prix: 100
statut: disponible # disponible | bientot | masquee
details: Accès à tous les événements en personne de Studio Nord pendant un an.
# Quota (jamais affiché) : la page affiche « Il n'en reste que N ».
#   - Mode automatique : lienStripe + variable STRIPE_CLE_LECTURE dans Cloudflare.
#     Le compte vient de Stripe (limite du lien) ; quota et vendus servent de repli.
#     Vente hors Stripe (comptant) : baisser la limite du lien dans Stripe, pas « vendus ».
#   - Mode manuel : augmenter « vendus » après chaque vente confirmée, puis pousser.
quota: 25
vendus: 0
# lienStripe: https://buy.stripe.com/…   (décommenter le jour où le lien Stripe est prêt)
# visuel: ../../assets/cartes-cadeaux/… (facultatif : sans visuel, une carte graphique s'affiche)
# visuelAlt: "…"
ordre: 1
---
