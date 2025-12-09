# Intégration Frontend/Backend - Plan Complet

## Objectif

Fusionner les services autonomes (letter-generator, qr-generator, static-site) dans l'application principale (frontend Svelte + backend NestJS).

## Architecture Cible

```
apps/
├── backend/              # NestJS - API unifiée
│   ├── src/
│   │   ├── scrapers/     # Module scraping (existant)
│   │   ├── jobs/         # Module jobs (existant)
│   │   └── generators/   # Module générateurs (NOUVEAU)
│   │       ├── letter/   # Service génération lettres
│   │       ├── qr/       # Service génération QR codes
│   │       └── site/     # Service génération sites
│   └── package.json
│
└── frontend/             # Svelte - Interface unifiée
    ├── src/
    │   ├── components/
    │   │   ├── scrapers/ # Composants scraping (existant)
    │   │   └── generators/ # Composants générateurs (NOUVEAU)
    │   │       ├── LetterGenerator.svelte
    │   │       ├── QrGenerator.svelte
    │   │       └── SiteGenerator.svelte
    │   ├── lib/
    │   │   └── api/
    │   │       └── generators.ts  # API client
    │   └── routes/
    │       ├── scrapers/  # Routes scraping (existant)
    │       └── generators/ # Routes générateurs (NOUVEAU)
    └── package.json
```

## Backend - Modules NestJS

### 1. Module Generators (Créé ✅)

**Fichiers créés:**
- `src/generators/generators.module.ts`
- `src/generators/letter/letter.module.ts`
- `src/generators/letter/letter.service.ts`
- `src/generators/letter/letter.controller.ts`

**À créer:**
- `src/generators/qr/qr.module.ts`
- `src/generators/qr/qr.service.ts`
- `src/generators/qr/qr.controller.ts`
- `src/generators/site/site.module.ts`
- `src/generators/site/site.service.ts`
- `src/generators/site/site.controller.ts`

### 2. API Endpoints

#### Letter Generator

```typescript
POST   /api/generators/letter/generate
Body: {
  template: 'elegant' | 'standard' | 'christmas',
  data: {
    'sender-name': string,
    'company-name': string,
    // ... autres champs
  },
  includeQr: boolean,
  qrUrl?: string
}
Response: {
  success: true,
  filename: 'letter-123456.pdf',
  downloadUrl: '/api/generators/letter/download/letter-123456.pdf'
}

GET    /api/generators/letter/download/:filename
Response: PDF file stream

GET    /api/generators/letter/templates
Response: ['standard', 'elegant', 'christmas']
```

#### QR Generator

```typescript
POST   /api/generators/qr/generate
Body: {
  data: string,  // URL ou texte
  style: 'standard' | 'elegant',
  width: number,
  color?: { dark: string, light: string }
}
Response: {
  success: true,
  filename: 'qr-123456.png',
  dataUrl: 'data:image/png;base64,...',
  downloadUrl: '/api/generators/qr/download/qr-123456.png'
}

POST   /api/generators/qr/batch
Body: {
  items: Array<{ data: string, filename: string }>
}
Response: {
  success: true,
  results: Array<{ filename, dataUrl, success }>
}
```

#### Site Generator

```typescript
POST   /api/generators/site/generate
Body: {
  template: 'elegant' | 'synthwave',
  data: {
    'main-title': string,
    'company-name': string,
    'workflow-steps': Array<{title, description}>,
    'matching-points': Array<{icon, title, description}>,
    // ... autres champs
  }
}
Response: {
  success: true,
  siteUrl: '/generated-sites/site-123456',
  downloadUrl: '/api/generators/site/download/site-123456.zip'
}

GET    /api/generators/site/templates
Response: ['elegant', 'synthwave']
```

### 3. Intégration dans app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ScrapersModule } from './scrapers/scrapers.module';
import { JobsModule } from './jobs/jobs.module';
import { GeneratorsModule } from './generators/generators.module'; // NOUVEAU

@Module({
  imports: [
    ScrapersModule,
    JobsModule,
    GeneratorsModule, // AJOUTÉ
  ],
})
export class AppModule {}
```

### 4. Dépendances à Ajouter

```bash
cd apps/backend
npm install puppeteer qrcode marked
```

## Frontend - Composants Svelte

### 1. API Client

**Fichier: `src/lib/api/generators.ts`**

```typescript
import { api } from './client';

export const generatorsApi = {
  // Letter Generator
  async generateLetter(data: LetterData) {
    return api.post('/generators/letter/generate', data);
  },

  async getLetterTemplates() {
    return api.get('/generators/letter/templates');
  },

  // QR Generator
  async generateQr(data: QrData) {
    return api.post('/generators/qr/generate', data);
  },

  // Site Generator
  async generateSite(data: SiteData) {
    return api.post('/generators/site/generate', data);
  },

  async getSiteTemplates() {
    return api.get('/generators/site/templates');
  },
};
```

### 2. Composant Letter Generator

**Fichier: `src/components/generators/LetterGenerator.svelte`**

```svelte
<script lang="ts">
  import { generatorsApi } from '$lib/api/generators';

  let template = 'elegant';
  let companyName = '';
  let senderName = '';
  let loading = false;
  let result = null;

  async function generate() {
    loading = true;
    try {
      result = await generatorsApi.generateLetter({
        template,
        data: {
          'company-name': companyName,
          'sender-name': senderName,
          // ... autres champs
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="letter-generator">
  <h2>📄 Génération de Lettre</h2>

  <select bind:value={template}>
    <option value="standard">Standard</option>
    <option value="elegant">Élégant</option>
    <option value="christmas">Noël</option>
  </select>

  <input type="text" bind:value={companyName} placeholder="Nom entreprise" />
  <input type="text" bind:value={senderName} placeholder="Votre nom" />

  <button on:click={generate} disabled={loading}>
    {loading ? 'Génération...' : 'Générer Lettre'}
  </button>

  {#if result}
    <div class="result">
      <p>✅ Lettre générée : {result.filename}</p>
      <a href={result.downloadUrl} download>Télécharger PDF</a>
    </div>
  {/if}
</div>
```

### 3. Composant QR Generator

**Fichier: `src/components/generators/QrGenerator.svelte`**

```svelte
<script lang="ts">
  import { generatorsApi } from '$lib/api/generators';

  let url = '';
  let style = 'elegant';
  let qrDataUrl = null;
  let loading = false;

  async function generate() {
    loading = true;
    try {
      const result = await generatorsApi.generateQr({
        data: url,
        style,
        width: 300
      });
      qrDataUrl = result.dataUrl;
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="qr-generator">
  <h2>🔲 Génération QR Code</h2>

  <input type="url" bind:value={url} placeholder="URL ou texte" />

  <select bind:value={style}>
    <option value="standard">Standard</option>
    <option value="elegant">Élégant</option>
  </select>

  <button on:click={generate} disabled={loading || !url}>
    {loading ? 'Génération...' : 'Générer QR Code'}
  </button>

  {#if qrDataUrl}
    <div class="result">
      <img src={qrDataUrl} alt="QR Code" />
      <a href={qrDataUrl} download="qrcode.png">Télécharger PNG</a>
    </div>
  {/if}
</div>
```

### 4. Page Générateurs

**Fichier: `src/routes/generators/+page.svelte`**

```svelte
<script lang="ts">
  import LetterGenerator from '$components/generators/LetterGenerator.svelte';
  import QrGenerator from '$components/generators/QrGenerator.svelte';
  import SiteGenerator from '$components/generators/SiteGenerator.svelte';

  let activeTab = 'letter';
</script>

<div class="generators-page">
  <h1>🚀 Générateurs</h1>

  <div class="tabs">
    <button class:active={activeTab === 'letter'} on:click={() => activeTab = 'letter'}>
      📄 Lettres
    </button>
    <button class:active={activeTab === 'qr'} on:click={() => activeTab = 'qr'}>
      🔲 QR Codes
    </button>
    <button class:active={activeTab === 'site'} on:click={() => activeTab = 'site'}>
      🌐 Sites
    </button>
  </div>

  <div class="content">
    {#if activeTab === 'letter'}
      <LetterGenerator />
    {:else if activeTab === 'qr'}
      <QrGenerator />
    {:else if activeTab === 'site'}
      <SiteGenerator />
    {/if}
  </div>
</div>
```

### 5. Navigation

**Fichier: `src/components/Nav.svelte` (modifier)**

```svelte
<nav>
  <a href="/scrapers">🔍 Scrapers</a>
  <a href="/jobs">💼 Jobs</a>
  <a href="/generators">🚀 Générateurs</a> <!-- NOUVEAU -->
  <a href="/stats">📊 Stats</a>
</nav>
```

## Workflow Complet Intégré

### Scénario: Candidature pour une entreprise

```typescript
// 1. Scraper détecte une offre
const job = await scrapersApi.execute('linkedin');

// 2. Calculer le matching
const matching = calculateMatching(job);

// 3. Générer le site personnalisé
const site = await generatorsApi.generateSite({
  template: 'synthwave',
  data: {
    'company-name': job.company,
    'matching-points': matching.points,
    // ...
  }
});

// 4. Générer QR code vers le site
const qr = await generatorsApi.generateQr({
  data: site.siteUrl,
  style: 'elegant'
});

// 5. Générer lettre avec QR code
const letter = await generatorsApi.generateLetter({
  template: 'elegant',
  data: {
    'company-name': job.company,
    'qr-code': qr.dataUrl,
    // ...
  }
});

// 6. Tout est prêt !
console.log('Candidature complète générée !');
```

## Migration Progressive

### Phase 1: Backend (Terminé ✅)
- [x] Créer module generators
- [x] Implémenter LetterService (PDF)
- [x] Implémenter QrService (PNG)
- [x] Implémenter SiteService (PDF)
- [x] Intégrer dans app.module.ts
- [x] Build TypeScript sans erreurs
- [ ] Tester les endpoints (nécessite PostgreSQL)

### Phase 2: Frontend
- [ ] Créer API client generators.ts
- [ ] Créer composant LetterGenerator
- [ ] Créer composant QrGenerator
- [ ] Créer composant SiteGenerator
- [ ] Créer page /generators
- [ ] Ajouter navigation

### Phase 3: Workflow Intégré
- [ ] Créer workflow automatisé
- [ ] Lier scraping → matching → génération
- [ ] Dashboard de suivi
- [ ] Statistiques de génération

### Phase 4: Optimisations
- [ ] Cache des templates
- [ ] Queue pour génération batch
- [ ] Preview avant génération
- [ ] Historique des générations
- [ ] **Branding personnalisé** : Personnaliser les couleurs du site selon l'entreprise (MUST-HAVE)

## Commands Utiles

```bash
# Backend
cd apps/backend
npm install
npm run dev

# Frontend
cd apps/frontend
npm install
npm run dev

# Tester l'intégration
curl -X POST http://localhost:3000/api/generators/letter/generate \
  -H "Content-Type: application/json" \
  -d '{"template":"elegant","data":{"company-name":"Acme"}}'
```

## Backend Intégré - Résumé

### Modules Créés

1. **Letter Generator** (`/api/generators/letter`)
   - Service: Génère des lettres de motivation en PDF
   - Templates: standard, elegant, christmas
   - Fichiers: letter.service.ts, letter.controller.ts, letter.module.ts

2. **QR Code Generator** (`/api/generators/qr`)
   - Service: Génère des QR codes en PNG
   - Styles: standard, elegant
   - Fichiers: qr.service.ts, qr.controller.ts, qr.module.ts

3. **Site Generator** (`/api/generators/site`)
   - Service: Génère des sites de présentation en PDF
   - Templates: elegant, synthwave
   - Fichiers: site.service.ts, site.controller.ts, site.module.ts

### Dépendances Installées
- puppeteer@24 (avec Chrome automatiquement téléchargé)
- qrcode
- @types/qrcode

### Statut
- ✅ Build TypeScript réussi
- ✅ Modules chargés correctement
- ⏳ Tests API (nécessitent PostgreSQL + Redis en local)

## Prochaines Étapes

1. **Créer le frontend:**
   ```bash
   # Créer les composants Svelte
   # Intégrer dans la navigation
   # Tester l'interface
   ```

3. **Tester end-to-end:**
   ```bash
   # Frontend → Backend → Génération
   # Vérifier les downloads
   # Tester tous les templates
   ```

## Avantages de l'Intégration

✅ **Interface unifiée** - Tout dans une seule app
✅ **API centralisée** - Un seul backend
✅ **Workflow automatisé** - Scraping → Génération
✅ **Meilleure UX** - Interface graphique vs CLI
✅ **Historique** - Tracking des générations
✅ **Scalabilité** - Queue, cache, optimisations

Le travail d'intégration a commencé ! Le backend LetterService est créé et prêt. Il reste à compléter QR et Site, puis créer le frontend.
