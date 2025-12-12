# Configuration des Secrets pour GitLab Container Registry

## Problème

Kubernetes ne peut pas pull les images depuis le GitLab Container Registry privé sans credentials.

## Solution: Créer un imagePullSecret

### 1. Créer un Personal Access Token GitLab

1. Aller sur GitLab: https://gitlab.com/-/profile/personal_access_tokens
2. Créer un token avec le scope **`read_registry`**
3. Copier le token (vous ne pourrez plus le voir après)

### 2. Créer le Secret Kubernetes

```bash
# Créer le namespace si pas déjà fait
kubectl create namespace job-search-workflow

# Créer le secret Docker Registry
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=<VOTRE_GITLAB_USERNAME> \
  --docker-password=<VOTRE_GITLAB_TOKEN> \
  --docker-email=<VOTRE_EMAIL> \
  --namespace=job-search-workflow

# Vérifier la création
kubectl get secret gitlab-registry -n job-search-workflow
```

### 3. Mettre à jour le Helm Chart pour utiliser le secret

Le secret sera automatiquement utilisé si on l'ajoute dans `values-simple.yaml`.

## Alternative: Utiliser le GitLab Deploy Token

### 1. Créer un Deploy Token GitLab

1. Aller sur votre projet: https://gitlab.com/dav.piatek/job-search-workflow/-/settings/repository
2. Section **Deploy Tokens**
3. Créer un token:
   - Name: `k8s-pull`
   - Scopes: ✓ `read_registry`
4. Copier le username et token

### 2. Créer le Secret avec Deploy Token

```bash
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=<DEPLOY_TOKEN_USERNAME> \
  --docker-password=<DEPLOY_TOKEN> \
  --namespace=job-search-workflow
```

## Vérification

```bash
# Vérifier que le secret existe
kubectl get secret gitlab-registry -n job-search-workflow -o yaml

# Tester le pull manuellement
kubectl run test-pull \
  --image=registry.gitlab.com/dav.piatek/job-search-workflow/job-search-backend:main \
  --image-pull-policy=Always \
  --overrides='{"spec":{"imagePullSecrets":[{"name":"gitlab-registry"}]}}' \
  -n job-search-workflow
```

## Synchroniser ArgoCD après création du secret

```bash
# Forcer le refresh de l'app
argocd app get job-search-workflow --refresh --hard-refresh

# Ou supprimer et recréer les pods
kubectl delete pods -n job-search-workflow --all
```
