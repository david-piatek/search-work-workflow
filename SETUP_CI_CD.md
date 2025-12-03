# CI/CD Setup Guide

This project uses GitHub for Continuous Integration (CI) and GitLab for Continuous Deployment (CD).

## Architecture

- **GitHub Actions**: Runs tests, linting, builds, and Docker image validation
- **GitLab CI/CD**: Builds Docker images, pushes to registry, and deploys to Kubernetes
- **Workflow**: GitHub CI triggers GitLab CD upon successful completion

## Setup Instructions

### 1. GitHub Setup

#### Create Repository

1. Go to https://github.com/david-piatek
2. Create a new repository: `search-work-workflow`
3. Don't initialize with README (we already have code)

#### Configure Secrets

Go to Settings > Secrets and variables > Actions and add:

- `GITLAB_TRIGGER_TOKEN`: Token from GitLab (see step 2)
- `GITLAB_TRIGGER_URL`: Your GitLab pipeline trigger URL

Example:
```
GITLAB_TRIGGER_URL=https://gitlab.com/api/v4/projects/YOUR_PROJECT_ID/trigger/pipeline
```

#### Repository Already Pushed

The code has already been pushed to:
```
git@github.com:david-piatek/search-work-workflow.git
```

### 2. GitLab Setup

#### Create Repository

1. Go to https://gitlab.com/dav.piatek
2. Create a new project: `search-work-workflow`
3. Set visibility (Private/Public)
4. Don't initialize with README

#### Push Code to GitLab

Once the repository is created:

```bash
git push -u gitlab main
```

#### Configure CI/CD Variables

Go to Settings > CI/CD > Variables and add:

**Container Registry:**
- `CI_REGISTRY`: Your GitLab registry (default: registry.gitlab.com)
- `CI_REGISTRY_USER`: Your GitLab username
- `CI_REGISTRY_PASSWORD`: Personal Access Token with registry access

**Kubernetes Credentials:**
- `KUBE_CONFIG_STAGING`: Base64 encoded kubeconfig for staging (Type: File, Protected: Yes)
- `KUBE_CONFIG_PROD`: Base64 encoded kubeconfig for production (Type: File, Protected: Yes)

To encode kubeconfig:
```bash
cat ~/.kube/config | base64 -w 0
```

**GitHub Integration:**
- `GITLAB_TRIGGER_TOKEN`: Create in Settings > CI/CD > Pipeline triggers

#### GitLab Runner

Ensure you have GitLab runners with the following tags:
- `docker`: For Docker build jobs
- `kubernetes`: For deployment jobs

### 3. Workflow Configuration

#### How It Works

1. **Push to GitHub** → GitHub Actions runs CI
2. **CI Passes** → GitHub triggers GitLab pipeline
3. **GitLab CD** → Builds Docker images, pushes to registry
4. **Deploy** → Deploys to Kubernetes (staging/production)

#### Branch Strategy

- **develop branch** → Auto-deploys to staging
- **main branch** → Manual deploy to production

### 4. Environment URLs

Update `.gitlab-ci.yml` with your actual URLs:

```yaml
environment:
  name: staging
  url: https://staging.job-scraper.your-domain.com

environment:
  name: production
  url: https://job-scraper.your-domain.com
```

### 5. ArgoCD (Optional Alternative)

If you prefer GitOps with ArgoCD instead of GitLab CD:

1. Update `cloud/argocd/application.yaml` with your GitHub repo
2. Apply to your cluster:
   ```bash
   kubectl apply -f cloud/argocd/application.yaml
   ```
3. ArgoCD will auto-sync from GitHub

### 6. Testing the Pipeline

#### Test GitHub CI

```bash
git checkout -b test-ci
# Make a small change
git add .
git commit -m "test: CI pipeline"
git push github test-ci
```

Check GitHub Actions tab for results.

#### Test GitLab CD

After GitLab repo is created and configured:

```bash
git checkout develop
git push gitlab develop
```

Check GitLab CI/CD > Pipelines for results.

### 7. Local Testing

#### Run CI Locally

```bash
# Install dependencies
pnpm install

# Run all CI checks
task lint
task test
task build

# Build Docker images
task docker:build
```

#### Test Helm Deployment

```bash
# Install to local cluster
task helm:install

# Or with custom values
helm install job-scraper ./cloud/helm/job-scraper-app \
  --namespace job-scraper \
  --create-namespace \
  --set image.backend.tag=latest \
  --set image.frontend.tag=latest
```

## Troubleshooting

### GitHub CI Fails

1. Check Actions tab for detailed logs
2. Verify all tests pass locally: `task test`
3. Ensure PostgreSQL/Redis services are working

### GitLab CD Fails

1. Check CI/CD > Pipelines for logs
2. Verify all variables are set correctly
3. Test Docker builds locally: `task docker:build`
4. Verify kubeconfig access: `kubectl get nodes`

### GitLab Trigger Not Working

1. Verify `GITLAB_TRIGGER_TOKEN` in GitHub secrets
2. Check GitLab pipeline trigger is enabled
3. Review GitHub Actions logs for trigger step

### Kubernetes Deployment Fails

1. Check pod logs: `kubectl logs -n job-scraper -l app=backend`
2. Verify images are pushed to registry
3. Check secrets are configured correctly
4. Verify resource limits aren't too restrictive

## Security Notes

- Never commit sensitive data (credentials, tokens)
- Use Kubernetes Secrets for sensitive env vars
- Rotate tokens regularly
- Use Protected branches for main/develop
- Enable branch protection rules
- Require CI to pass before merge

## Next Steps

1. Create GitLab repository: https://gitlab.com/dav.piatek/search-work-workflow
2. Push code: `git push -u gitlab main`
3. Configure GitLab variables (see step 2)
4. Test the full pipeline
5. Set up staging/production environments
6. Configure monitoring and alerts

## Useful Commands

```bash
# View remotes
git remote -v

# Push to both remotes
git push github main
git push gitlab main

# Check GitHub Actions
gh run list

# Check GitLab pipelines (requires gitlab-ci-token)
curl --header "PRIVATE-TOKEN: <token>" \
  "https://gitlab.com/api/v4/projects/<project-id>/pipelines"

# Deploy with Helm
task helm:install
task helm:upgrade

# View Kubernetes resources
kubectl get all -n job-scraper
kubectl get pods -n job-scraper
kubectl logs -f -n job-scraper deployment/backend
```

## Documentation Links

- [GitHub Actions](https://docs.github.com/en/actions)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [Helm](https://helm.sh/docs/)
- [ArgoCD](https://argo-cd.readthedocs.io/)
- [Kubernetes](https://kubernetes.io/docs/)
