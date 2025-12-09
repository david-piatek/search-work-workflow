# Déploiement ArgoCD + GitLab

✅ **Infrastructure créée :**
- Helm Chart complet (`cloud/helm/job-scraper-app/`)
- Application ArgoCD (`cloud/argocd/application.yaml`)
- GitLab CI/CD configuré (`.gitlab-ci.yml`)
- Dockerfiles optimisés (`-simple`)

## Quick Start

### 1. Modifier les URLs GitLab

Éditer `cloud/helm/job-scraper-app/values-simple.yaml` et `cloud/argocd/application.yaml` :
- Remplacer `YOUR_GITLAB_USER` par votre username GitLab

### 2. Push vers GitLab

```bash
git add .
git commit -m "Setup ArgoCD deployment"
git push origin main
```

Le pipeline GitLab va :
- ✅ Builder les images Docker
- ✅ Les pusher vers GitLab Container Registry

### 3. Déployer avec ArgoCD

```bash
# Créer le secret pour pull images
kubectl create namespace job-scraper
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=YOUR_USER \
  --docker-password=YOUR_TOKEN \
  --namespace=job-scraper

# Déployer l'application
kubectl apply -f cloud/argocd/application.yaml

# Vérifier
argocd app get job-scraper-hello-world
argocd app sync job-scraper-hello-world
```

### 4. Accéder à l'app

```bash
kubectl get ingress -n job-scraper
curl http://hello-world.example.com
```

## Architecture

```
GitLab → Build Images → Registry
                          ↓
                    ArgoCD sync
                          ↓
                   K8s Cluster
                   (Backend + Frontend)
```

## Fichiers importants

- `.gitlab-ci.yml` : Pipeline CI/CD
- `cloud/docker/Dockerfile.backend-simple` : Image backend
- `cloud/docker/Dockerfile.frontend-simple` : Image frontend
- `cloud/helm/job-scraper-app/` : Helm chart
- `cloud/argocd/application.yaml` : App ArgoCD

## Troubleshooting

Voir les logs :
```bash
kubectl logs -f deployment/job-scraper-hello-world-backend -n job-scraper
kubectl logs -f deployment/job-scraper-hello-world-frontend -n job-scraper
```
