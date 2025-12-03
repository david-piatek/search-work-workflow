# Job Scraper Application

Application complète de scraping d'offres d'emploi avec génération dynamique de scrapers, frontend Svelte et backend NestJS.

## Architecture

### Stack Technique

- **Frontend**: Vite + Svelte
- **Backend**: NestJS + TypeORM + Bull Queue
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Scraping**: Puppeteer + Cheerio
- **Documentation**: Swagger + Storybook
- **Tests**: Jest, Vitest, Playwright
- **Deployment**: Docker, Kubernetes, Helm, ArgoCD
- **Automation**: n8n workflow

### Structure du Projet

```
searc-work-workflow/
├── apps/
│   ├── backend/              # API NestJS
│   │   ├── src/
│   │   │   ├── scrapers/     # Module de scraping
│   │   │   ├── jobs/         # Module des jobs
│   │   │   └── main.ts
│   │   └── test/
│   └── frontend/             # Application Svelte
│       ├── src/
│       │   ├── components/   # Composants UI
│       │   ├── lib/          # API client
│       │   └── App.svelte
│       ├── tests/
│       └── .storybook/
├── cloud/
│   ├── docker/
│   │   ├── compose.yaml
│   │   ├── Dockerfile.backend
│   │   └── Dockerfile.frontend
│   ├── helm/
│   │   └── job-scraper-app/  # Charts Helm
│   │       ├── templates/
│   │       └── values.yaml
│   └── argocd/
│       └── application.yaml  # Config ArgoCD
├── n8n/
│   └── job-scraper-workflow.json
├── Taskfile.yml
└── package.json
```

## Fonctionnalités

### Backend

- **Génération Dynamique de Scrapers**: Crée automatiquement des scrapers pour de nouveaux sites
- **Gestion des Scrapers**: CRUD complet sur les scrapers
- **Execution Asynchrone**: Queue Redis pour traiter les scraping jobs
- **Stockage**: Sauvegarde des résultats en JSON et PostgreSQL
- **API REST**: Documentation Swagger automatique
- **Tests**: Tests unitaires et e2e avec Jest

### Frontend

- **Sélection de Sites**: Interface pour choisir les sites à scraper
- **Gestion des Scrapers**: Visualisation et gestion des scrapers existants
- **Affichage des Résultats**: Liste des jobs scrapés avec détails
- **Statistiques**: Dashboard avec métriques en temps réel
- **Storybook**: Documentation des composants
- **Tests E2E**: Tests Playwright

### Sites Supportés

- Freework
- Welcome to the Jungle
- APEC
- Indeed
- LinkedIn
- Sites personnalisés (via URL)

## Installation

### Prérequis

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- Task (go-task)
- Kubernetes cluster (pour déploiement)

### Installation Locale

```bash
# Cloner le repo
git clone <repo-url>
cd searc-work-workflow

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp apps/backend/.env.example apps/backend/.env

# Démarrer les services (PostgreSQL, Redis)
docker compose -f cloud/docker/compose.yaml up -d postgres redis

# Lancer l'application
task dev
```

L'application sera disponible sur:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/api

## Commandes Task

```bash
# Développement
task dev                  # Démarre frontend + backend
task dev:backend          # Backend uniquement
task dev:frontend         # Frontend uniquement

# Build
task build                # Build frontend + backend
task build:backend
task build:frontend

# Tests
task test                 # Lance tous les tests
task test:backend         # Tests backend
task test:frontend        # Tests frontend
task test:e2e            # Tests end-to-end

# Linting
task lint                 # Lint tout le code
task format               # Format le code

# Docker
task docker:build         # Build les images Docker
task docker:up            # Lance avec Docker Compose
task docker:down          # Arrête les services
task docker:logs          # Affiche les logs

# Storybook & Documentation
task storybook           # Lance Storybook
task swagger             # Info sur Swagger

# Helm
task helm:package        # Package le chart Helm
task helm:install        # Install avec Helm
task helm:upgrade        # Upgrade l'application

# Nettoyage
task clean               # Nettoie build artifacts
```

## Déploiement

### Docker Compose (Développement)

```bash
task docker:build
task docker:up
```

### Kubernetes avec Helm

```bash
# Build et push les images
docker build -t your-registry/job-scraper-backend:latest -f cloud/docker/Dockerfile.backend .
docker build -t your-registry/job-scraper-frontend:latest -f cloud/docker/Dockerfile.frontend .
docker push your-registry/job-scraper-backend:latest
docker push your-registry/job-scraper-frontend:latest

# Installer avec Helm
helm install job-scraper ./cloud/helm/job-scraper-app \
  --namespace job-scraper \
  --create-namespace

# Ou utiliser Task
task helm:install
```

### ArgoCD (GitOps)

1. Mettre à jour `cloud/argocd/application.yaml` avec votre repo GitHub
2. Appliquer l'application:

```bash
kubectl apply -f cloud/argocd/application.yaml
```

ArgoCD synchronisera automatiquement les changements du repo.

Voir [cloud/argocd/README.md](cloud/argocd/README.md) pour plus de détails.

## Workflow n8n

Un workflow n8n automatise le scraping et la sauvegarde:

1. Exécution programmée (toutes les 6h)
2. Scraping de tous les sites configurés
3. Sauvegarde locale + GitHub
4. Notifications Slack

### Importer le Workflow

1. Ouvrir n8n
2. Importer `n8n/job-scraper-workflow.json`
3. Configurer les credentials GitHub et Slack
4. Activer le workflow

Voir [n8n/README.md](n8n/README.md) pour la configuration complète.

## API Documentation

### Swagger

Documentation interactive disponible sur: http://localhost:3000/api

### Endpoints Principaux

#### Scrapers

- `GET /scrapers` - Liste tous les scrapers
- `GET /scrapers/:name` - Détails d'un scraper
- `POST /scrapers` - Créer/récupérer un scraper
- `POST /scrapers/execute` - Exécuter un scraper
- `DELETE /scrapers/:name` - Supprimer un scraper

#### Jobs

- `GET /jobs` - Liste des jobs scrapés
- `GET /jobs/:id` - Détails d'un job
- `GET /jobs/stats` - Statistiques

### Exemples

```bash
# Créer un scraper
curl -X POST http://localhost:3000/scrapers \
  -H "Content-Type: application/json" \
  -d '{"name": "freework", "url": "https://www.freework.com/jobs"}'

# Exécuter un scraper
curl -X POST http://localhost:3000/scrapers/execute \
  -H "Content-Type: application/json" \
  -d '{"scraperName": "freework"}'

# Récupérer les résultats
curl http://localhost:3000/jobs?source=freework&limit=50
```

## Tests

### Backend

```bash
cd apps/backend

# Tests unitaires
pnpm test

# Tests e2e
pnpm test:e2e

# Coverage
pnpm test:cov
```

### Frontend

```bash
cd apps/frontend

# Tests unitaires
pnpm test

# Tests e2e
pnpm test:e2e

# Storybook
pnpm storybook
```

## Pre-commit & Pre-push Hooks

Des hooks Git sont configurés pour maintenir la qualité du code:

- **pre-commit**: Linting et formatting automatique
- **pre-push**: Exécution des tests

Pour installer les hooks:

```bash
pnpm install
npx husky install
```

## Configuration

### Variables d'Environnement

#### Backend (`apps/backend/.env`)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://admin:admin123@localhost:5432/jobscraper
REDIS_URL=redis://localhost:6379
DATA_DIR=./data
```

#### Helm (`cloud/helm/job-scraper-app/values.yaml`)

Personnaliser:
- Images Docker
- Ressources (CPU/Memory)
- Ingress hostname
- Persistence storage
- Secrets

## Monitoring & Logs

### Kubernetes

```bash
# Logs backend
kubectl logs -n job-scraper -l app.kubernetes.io/component=backend -f

# Logs frontend
kubectl logs -n job-scraper -l app.kubernetes.io/component=frontend -f

# Status des pods
kubectl get pods -n job-scraper
```

### Docker Compose

```bash
# Tous les logs
task docker:logs

# Service spécifique
docker compose -f cloud/docker/compose.yaml logs -f backend
```

## Troubleshooting

### Le scraper ne retourne pas de résultats

1. Vérifier que le site est accessible
2. Augmenter le timeout dans le code du scraper
3. Vérifier les sélecteurs CSS (le site a peut-être changé)
4. Consulter les logs du backend

### Erreur de connexion PostgreSQL

1. Vérifier que PostgreSQL est démarré: `docker compose -f cloud/docker/compose.yaml ps`
2. Vérifier la DATABASE_URL dans `.env`
3. Tester la connexion: `psql $DATABASE_URL`

### Erreur lors du build Docker

1. Vérifier que pnpm-lock.yaml est à jour
2. Nettoyer le cache: `docker compose -f cloud/docker/compose.yaml down -v`
3. Rebuild: `task docker:build`

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing`)
5. Ouvrir une Pull Request

## Roadmap

- [ ] Support de plus de sites d'emploi
- [ ] Amélioration de la génération automatique de scrapers (IA)
- [ ] Dashboard analytics avancé
- [ ] Alertes personnalisées par email
- [ ] Export vers CSV/Excel
- [ ] API publique avec authentification
- [ ] Support multi-langues
- [ ] Mobile app (React Native)

## License

MIT

## Support

Pour toute question ou problème:
- Ouvrir une issue sur GitHub
- Consulter la documentation dans `/docs`
- Vérifier les logs d'exécution
