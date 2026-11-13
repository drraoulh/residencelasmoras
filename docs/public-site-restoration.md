# Restauration du site public historique

Le site LWS provenait de `feat/whatsapp-confirm-reservation` (`7b164a8`), plus complète que la branche `main` initiale. La publication de `main` avait omis des pages, les avis clients, les réseaux sociaux et les parcours de réservation. Le contenu historique est désormais réintégré dans `main`, avec l’administration moderne et ses droits d’accès.

## Contenu retrouvé

- Pages d’accueil, catalogue, galerie, présentation et contact ; identité visuelle, photos optimisées et polices locales.
- Les quatre avis enregistrés dans `src/data/googleReviews.ts`, repris sans inventer de témoignages. Il s’agit des avis déjà présents dans le code historique, pas d’une synchronisation Google en temps réel.
- Les liens Instagram, Facebook, TikTok et Google Maps d’origine ; téléphone, e-mail et WhatsApp cliquables.
- Recherche de disponibilités, galerie avec agrandissement des photos, demande WhatsApp et lien de confirmation.
- Routes admin du planning, des rapports et de la galerie ; `/admin/contacts` redirige vers les messages.

## Intégration avec les corrections récentes

- Un seul client Supabase/Auth et une seule source de logements pour le public et l’administration.
- L’image principale reste la première photo définie par l’administrateur.
- Les visiteurs ne lisent pas les tables de réservations ou de contacts. `get_availability_slots` ne renvoie que les identifiants des logements, les dates et les statuts qui bloquent le calendrier.
- `create_reservation_request` valide les dates et les coordonnées, utilise le tarif serveur et crée une référence avec un jeton aléatoire. Aucun prix ni statut confirmé n’est accepté du navigateur.
- Les confirmations demandent une vraie session de membre de l’équipe, au lieu d’un code PIN placé dans le JavaScript public. Les confirmations concurrentes portant sur les mêmes dates sont refusées.
- Un lien WhatsApp reste affiché après l’enregistrement si le navigateur bloque l’ouverture automatique d’un nouvel onglet.
- La galerie n’effectue plus d’importation ou de réparation automatique à l’ouverture de la page admin ; ces opérations sont explicites.

## Vérification

`npm test` applique les deux migrations au schéma de test et vérifie les droits, la confidentialité, les tarifs, les jetons et les conflits de dates. `npm run test:e2e` couvre les avis, réseaux sociaux, liens internes, galerie, demandes WhatsApp, contacts, gestion d’équipe, photos et suppressions. L’administration est contrôlée à 320, 390, 768 et 1440 pixels ; le site public sur mobile et ordinateur, avec le fuseau Africa/Douala.

Les essais de formulaires utilisent une API simulée : ils n’envoient aucun message et ne créent aucune réservation réelle. La vérification sur le domaine en production est limitée à la navigation et aux lectures publiques.
