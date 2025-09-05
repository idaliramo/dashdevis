# CARRE Quotes CRM (React + Supabase) — Netlify Ready

MVP pour gérer **services**, **clients**, **devis** (overrides par ligne) et **factures**. Auth et DB via Supabase.

## Déploiement rapide sur Netlify
1. **Créer Supabase** (gratuit) et activer Login email. Copiez `Project URL` et `anon key`.
2. Dans Supabase > SQL, exécutez le fichier [`supabase/schema.sql`](supabase/schema.sql).
3. **Netlify**: Créez un nouveau site depuis Git ou déposez ce dossier. Dans **Site settings → Environment**, ajoutez:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Build command: `npm run build` — Publish directory: `dist`. (Déjà dans `netlify.toml`)
5. Lancez le site → créez un compte (email/mot de passe).

## Dev local
```bash
npm i
cp .env.example .env # renseignez vos clés
npm run dev
```

## Fonctionnalités
- Auth email/mot de passe (Supabase)
- Catalogue **Services** (master) + import **seed** (bouton dans Paramètres)
- **Devis**: sélection de services, override prix/libellé/qty, TVA, remise, total, statut
- **Factures**: création en 1 clic depuis devis **accepté**
- **Numérotation** par utilisateur: `Q-YYYY-0001`, `F-YYYY-0001` (table `counters`)
- **Export**: impression (Ctrl/Cmd+P); à étendre vers PDF (jsPDF/pdfmake)

## Sécurité (RLS)
Toutes les tables sont protégées par des politiques RLS par `user_id`. Voir `schema.sql`.

## À faire (roadmap)
- Envoi email devis/factures (Resend/Brevo) + lien public de signature/validation
- PDF A4 brandé CARE Agency (template)
- Paiements et suivi règlements
- TVA Maroc/UE, multi-taux, mentions légales
