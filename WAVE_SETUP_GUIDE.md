# Guide de configuration Wave Payment

## Configuration requise

### 1. Obtenir les clés API Wave

1. **Connectez-vous au portail Wave Business** : https://business.wave.com
   - Utilisez le numéro : +221784634040
   - Mot de passe : celui du compte Wave personnel

2. **Créer les clés API** :
   - Aller dans l'onglet "Développeurs" (en bas du menu)
   - Cliquer sur "Créer clés APIs"
   - Copier la clé API générée

3. **Configurer le webhook** :
   - Dans "Développeurs" → "Webhook"
   - Cliquer "Nouveau webhook"
   - URL webhook : `https://votre-domaine.com/api/webhooks/wave` (HTTPS obligatoire)
   - Méthode : POST
   - Événements à cocher :
     - ✅ `checkout session completed`
     - ✅ `checkout session payment failed`

### 2. Mise à jour du fichier .env

Remplacez les valeurs de test par les vraies clés :

```env
# Wave Payment Configuration
VITE_WAVE_API_KEY=wave_sn_prod_VOTRE_VRAIE_CLE_API
VITE_WAVE_BASE_URL=https://api.wave.com
VITE_WAVE_WEBHOOK_SECRET=votre_webhook_secret_reel
VITE_LISTING_PRICE=500
```

### 3. Test de l'intégration

1. **Démarrer l'application** :
   ```bash
   npm run dev
   ```

2. **Tester le flux complet** :
   - Se connecter avec un compte utilisateur
   - Aller sur `/publier`
   - Remplir le formulaire d'annonce
   - Cliquer "Publier l'annonce"
   - Vérifier la redirection vers Wave
   - Effectuer un paiement test
   - Vérifier la création de l'annonce après paiement

### 4. Vérifications de sécurité

- ✅ Les clés API ne sont pas exposées côté client
- ✅ Les sessions expirent après 30 minutes
- ✅ Vérification double du paiement (DB + API Wave)
- ✅ RLS activé sur la table checkout_sessions
- ✅ Validation des données avant création d'annonce

## Troubleshooting

### Erreur "Wave API key is not configured"
- Vérifier que `VITE_WAVE_API_KEY` est défini dans `.env`
- Redémarrer le serveur de développement après modification

### Erreur de redirection Wave
- Vérifier que les URLs de succès/erreur sont accessibles
- S'assurer que l'application est accessible via HTTPS en production

### Erreur TypeScript sur checkout_sessions
- Les erreurs sont temporaires, utilisation de `(supabase as any)` comme contournement
- Les types seront automatiquement synchronisés par Supabase

### Paiement réussi mais annonce non créée
- Vérifier les logs dans PaymentSuccessPage
- S'assurer que le bucket 'listings' existe dans Supabase Storage
- Vérifier les permissions RLS sur la table listings

## Monitoring

### Logs à surveiller
- Sessions de paiement créées
- Paiements réussis/échoués  
- Création d'annonces après paiement
- Erreurs d'upload d'images

### Métriques importantes
- Taux de conversion paiement → annonce créée
- Temps moyen de traitement
- Taux d'abandon de paiement
- Erreurs de webhook

## Support Wave

En cas de problème technique avec l'API Wave :
- Email support : prm@wave.com
- Documentation : https://docs.wave.com/business
- Portail business : https://business.wave.com
