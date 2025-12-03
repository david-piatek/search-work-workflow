# ArgoCD Deployment

## Prerequisites

1. ArgoCD installed on your Kubernetes cluster
2. kubectl configured to access your cluster
3. Git repository with the Helm charts

## Installation

### 1. Update the Git Repository URL

Edit `application.yaml` and replace `YOUR_USERNAME` with your GitHub username:

```yaml
repoURL: https://github.com/YOUR_USERNAME/searc-work-workflow.git
```

### 2. Apply the Application

```bash
kubectl apply -f argocd/application.yaml
```

### 3. Check Application Status

```bash
kubectl get applications -n argocd
argocd app get job-scraper-app
```

### 4. Sync Application (if not auto-sync)

```bash
argocd app sync job-scraper-app
```

## Configuration

### Environment-specific Values

Create environment-specific value files:

```bash
# Production
helm/job-scraper-app/values-prod.yaml

# Staging
helm/job-scraper-app/values-staging.yaml
```

Update `application.yaml` to use the appropriate values file:

```yaml
helm:
  valueFiles:
    - values.yaml
    - values-prod.yaml
```

### Secrets Management

For production, use sealed secrets or external secret operators:

```bash
# Install Sealed Secrets
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Create sealed secret
kubeseal --format yaml < secret.yaml > sealed-secret.yaml
```

## Monitoring

Access ArgoCD UI:

```bash
argocd login <ARGOCD_SERVER>
argocd app list
argocd app logs job-scraper-app
```

## Troubleshooting

### Check sync status
```bash
argocd app get job-scraper-app --show-operation
```

### View resources
```bash
kubectl get all -n job-scraper
```

### Check logs
```bash
kubectl logs -n job-scraper -l app.kubernetes.io/component=backend
kubectl logs -n job-scraper -l app.kubernetes.io/component=frontend
```
