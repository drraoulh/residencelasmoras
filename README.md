# Résidence Las Moras

Site React / TypeScript / Vite avec Supabase Auth, Postgres, Storage et Edge Functions.

## Développement

```sh
npm ci
cp .env.example .env.local
npm run dev -- --host 0.0.0.0
```

Configurer `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` pour le projet `niljvtfulfauijvwqfpo`. `.env.local` est exclu de Git. Ne jamais placer de mot de passe PostgreSQL ou de clé `service_role` dans Vite.

## Fonctionnement

Les logements publics et administratifs utilisent la même table. Un adaptateur dans `src/lib/logements.ts` traduit les colonnes existantes `prix` / `statut` pour l’interface. La première entrée de `photos` est la couverture sur l’accueil, le catalogue et la fiche ; le formulaire permet d’importer et de choisir cette photo. Les fichiers sont stockés dans le bucket `logements`, avec des noms UUID uniques.

L’ajout et la modification attendent une réponse serveur valide. La suppression exige une confirmation ; les réservations et leurs paiements sont conservés avec une référence au logement mise à `NULL`.

Les rôles sont enregistrés dans `team_members`. L’administrateur peut créer des membres et retirer leurs accès dans **Équipe et accès**. Les gestionnaires accèdent aux logements, réservations et messages. **Mon compte** permet de remplacer le mot de passe initial. Le retrait d’un membre est contrôlé en base à chaque requête et prend effet même si son ancien jeton est encore valide.

Les demandes publiques de réservation utilisent les colonnes existantes `client_nom`, `date_arrivee`, etc. Un trigger calcule les nuits et le montant depuis le prix du logement. Le statut initial est `demande`. Les visiteurs ne peuvent lire aucune réservation ni fixer un statut confirmé. La confirmation d’une demande ne bloque pas automatiquement un calendrier : l’équipe vérifie les disponibilités et met à jour le logement.

Les messages du formulaire de contact sont enregistrés dans `contacts`, puis consultables et marquables comme lus dans **Messages**. L’envoi d’e-mails dépend de la configuration existante du service `send-email` ; le site ne promet pas une notification e-mail.

## Migration de la base existante

La migration `20261106073646_secure_existing_lasmoras.sql` est une **mise à niveau du schéma existant**, pas une installation sur une base vide. Elle a été appliquée au projet Lasmoras. Ne pas la réexécuter à la main. Les tests utilisent un schéma minimal représentatif dans `tests/fixtures/existing-schema.sql`.

La migration préserve les colonnes et données existantes, ajoute les rôles et la date de libération, restreint les politiques RLS, corrige la suppression en cascade et protège les fonctions SQL internes d’envoi d’e-mails. Les deux opérateurs existants sont conservés : le compte de la résidence est administrateur, le second est gestionnaire.

Pour déployer une nouvelle version de la fonction d’équipe :

```sh
npx supabase login
npx supabase link --project-ref niljvtfulfauijvwqfpo
npx supabase functions deploy manage-team
```

`manage-team` vérifie le bearer token avec `auth.getUser`, puis le rôle en base. La clé privilégiée reste dans l’environnement des Edge Functions. Le contrôle JWT de la passerelle est désactivé car l’authentification est effectuée dans le handler.

## Vérifications

```sh
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm test` applique la vraie migration à un Postgres embarqué PGlite sur une copie du schéma existant. Les tests vérifient la conservation de l’historique et des paiements, les tarifs serveur, les rôles, la confidentialité des réservations, les permissions de stockage et les photos.

Les tests navigateur démarrent Vite sur le port 5187 avec une API simulée, sans modifier Supabase : import de photos, choix de couverture, catalogue et fiche, annulation puis confirmation de suppression.

## Publication du frontend

Compiler avec les variables publiques du projet Supabase dans l’environnement de l’hébergeur, puis publier `dist`. Les routes inconnues doivent être réécrites vers `index.html` pour les liens React Router. La migration de la base et le déploiement d’une Edge Function ne publient pas le frontend.

## Limites connues

- Les photos retirées restent dans Storage pour préserver les références ; nettoyer les fichiers orphelins après contrôle.
- L’API publique de confirmation par jeton est volontairement conservée pour les liens existants ; le jeton est maintenant validé et comparé exactement.
- La table `app_secrets` reste sans politique publique, volontairement inaccessible aux visiteurs.
- Activer la protection Supabase contre les mots de passe compromis dans les paramètres Auth, selon les possibilités du forfait.
