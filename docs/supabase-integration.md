# Vérification du raccordement Lasmoras

Projet : `niljvtfulfauijvwqfpo`, compte de connexion Lasmoras.

## Modifications appliquées

- Migration `secure_existing_lasmoras` appliquée avec succès.
- Fonction Edge `manage-team` déployée et active ; elle valide la session utilisateur puis son rôle dans la base.
- `team_members` installé : `h@lasmoras.com` est administrateur ; le second opérateur existant est gestionnaire.
- Accès public aux réservations retiré.
- Modifications des logements, messages, galerie et fichiers limitées aux membres de l’équipe.
- Suppression d’un logement : les réservations sont conservées (`ON DELETE SET NULL`).
- Prix total et nombre de nuits calculés côté base pour les nouvelles demandes.
- Fonctions SQL internes d’envoi d’e-mails retirées de l’accès RPC public.
- Confirmation par jeton protégée contre les jokers et les correspondances partielles.

## Résultats constatés

- Avant et après migration : **9 logements et 80 réservations**, aucune suppression.
- API publique des logements : HTTP 200, avec les colonnes réelles `prix`, `statut`, `photos`, `date_liberation`.
- API publique des réservations : HTTP 401, permission refusée.
- API publique de l’équipe : HTTP 401, permission refusée.
- Fonction de gestion d’équipe appelée sans session : HTTP 401.
- Test SQL sur la vraie base : un non-membre connecté ne lit aucune réservation et ne peut ajouter de logement ; un administrateur peut créer, changer la couverture et supprimer un logement de test. Toutes ces écritures de test ont été annulées par ROLLBACK.
- Site local connecté à Supabase : 9 logements affichés ; couverture de catalogue identique à celle de la fiche ; vraie image Storage chargée ; aucun débordement mobile ni erreur JavaScript.
- Tests de migration et navigateur simulé, lint et compilation : voir les commandes du README.

## Vérifications restantes lors de la publication

Le frontend doit être publié avec les variables publiques du bon projet. La connexion avec le mot de passe d’un utilisateur existant et la création complète d’un membre depuis l’interface n’ont pas été testées avec une session utilisateur réelle. Les autorisations SQL et le refus des appels non authentifiés ont été vérifiés séparément.

## Avis Supabase restants

- `app_secrets` : absence de politique volontaire pour une table de secrets.
- Fonction `confirm_reservation_by_token` : confirmation réservée aux membres connectés ; contrôle du jeton et des conflits de dates.
- Protection des mots de passe compromis désactivée : réglage Auth à activer si disponible.

Liens de référence :
- [Fonctions privilégiées exposées](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)
- [Protection des mots de passe](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## Restauration des parcours publics

La migration `restore_public_booking_flow` a été appliquée le 13 novembre 2026. Les visiteurs peuvent consulter une projection minimale des disponibilités et créer une demande avec un tarif calculé côté serveur. L’accès direct aux réservations reste refusé ; les confirmations nécessitent un membre de l’équipe. Les tests SQL couvrent les montants, la confidentialité, le rôle requis et les confirmations qui se chevauchent.
