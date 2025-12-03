# Quick Start Guide

## Installation Rapide (5 minutes)

### 1. Prérequis

Installer si nécessaire:
```bash
# Node.js 18+
brew install node

# pnpm
npm install -g pnpm

# Task
brew install go-task

# Docker Desktop
# Télécharger depuis https://www.docker.com/products/docker-desktop
```

### 2. Installation du Projet

```bash
# Cloner
git clone <votre-repo>
cd searc-work-workflow

# Installer les dépendances
pnpm install

# Configurer l'environnement
cp apps/backend/.env.example apps/backend/.env
```

### 3. Lancer en Développement

```bash
# Option 1: Tout avec Docker
task docker:up

# Option 2: Dev local (plus rapide)
# Terminal 1: Démarrer PostgreSQL + Redis
docker-compose up -d postgres redis

# Terminal 2: Backend
cd apps/backend
pnpm dev

# Terminal 3: Frontend
cd apps/frontend
pnpm dev
```

### 4. Accéder à l'Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api

## Premier Scraping

1. Ouvrir http://localhost:5173
2. Cliquer sur "freework" ou un autre site
3. Cliquer sur "Start Scraping"
4. Attendre 30 secondes
5. Voir les résultats s'afficher

## Commandes Essentielles

```bash
# Développement
task dev                # Lance tout

# Tests
task test              # Tous les tests
task test:e2e          # Tests e2e uniquement

# Build
task build             # Build prod

# Docker
task docker:up         # Lance avec Docker
task docker:down       # Arrête Docker
task docker:logs       # Voir les logs

# Documentation
task storybook         # Composants UI
task swagger           # API docs (ou http://localhost:3000/api)

# Nettoyage
task clean            # Nettoie tout
```

## Structure du Code

```
apps/
├── backend/
│   └── src/
│       ├── scrapers/        ← Logique de scraping
│       ├── jobs/            ← Gestion des jobs scrapés
│       └── main.ts
└── frontend/
    └── src/
        ├── components/      ← Composants Svelte
        ├── lib/             ← API client
        └── App.svelte
```

## Ajouter un Nouveau Site

### Méthode 1: Interface Web

1. Entrer l'URL dans "Or enter custom URL..."
2. Cliquer "Start Scraping"
3. Le scraper est généré automatiquement

### Méthode 2: API

```bash
curl -X POST http://localhost:3000/scrapers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "nouveau-site",
    "url": "https://example.com/jobs"
  }'
```

## Déploiement Rapide

### Docker Compose

```bash
# Build
task docker:build

# Deploy
task docker:up

# Accéder
open http://localhost:5173
```

### Kubernetes + Helm

```bash
# Build images
docker build -t job-scraper-backend:latest -f apps/backend/Dockerfile .
docker build -t job-scraper-frontend:latest -f apps/frontend/Dockerfile .

# Deploy
helm install job-scraper ./helm/job-scraper-app \
  --namespace job-scraper \
  --create-namespace
```

### ArgoCD (GitOps)

```bash
# Pousser vers GitHub
git remote add origin <your-repo>
git push -u origin main

# Configurer ArgoCD
kubectl apply -f argocd/application.yaml

# ArgoCD synchronise automatiquement
```

## Workflow n8n

1. **Installer n8n** (si pas déjà fait):
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

2. **Importer le workflow**:
   - Ouvrir http://localhost:5678
   - Workflows → Import from File
   - Sélectionner `n8n/job-scraper-workflow.json`

3. **Configurer**:
   - GitHub token pour backup
   - Slack webhook (optionnel)
   - Activer le workflow

## Troubleshooting Rapide

### Port déjà utilisé
```bash
# Trouver et tuer le processus
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Base de données ne démarre pas
```bash
docker-compose down -v
docker-compose up -d postgres
```

### Dépendances manquantes
```bash
pnpm install --force
```

### Reset complet
```bash
task clean
rm -rf node_modules apps/*/node_modules
pnpm install
```

## Documentation Complète

- **README principal**: Voir [README.md](README.md)
- **Helm/K8s**: Voir [argocd/README.md](argocd/README.md)
- **n8n Workflow**: Voir [n8n/README.md](n8n/README.md)
- **CLAUDE.md**: Documentation technique interne

## Support

- Issues GitHub pour bugs
- README.md pour documentation complète
- Swagger pour API reference
- Storybook pour composants UI

## Next Steps

Une fois l'app lancée:

1. Tester le scraping sur différents sites
2. Explorer l'API Swagger
3. Voir les composants dans Storybook
4. Configurer le workflow n8n
5. Déployer sur Kubernetes
6. Configurer ArgoCD pour GitOps

Bon scraping ! 🚀
