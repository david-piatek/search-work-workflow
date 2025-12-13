les l'instrution doivent etre transive en gherkin en anglais

Feature: GitLab CI Docker Build with Buildx Bake

Scenario: Fix docker-bake.hcl context path for GitLab CI
Given the GitLab CI pipeline runs from the project root
And the docker-bake.hcl file is located at cloud/docker/docker-bake.hcl
When the build command "docker buildx bake -f cloud/docker/docker-bake.hcl prod --push" is executed
Then the context should be "." relative to the project root
And the dockerfile paths should be "cloud/docker/Dockerfile.backend" and "cloud/docker/Dockerfile.frontend"
And the build should not require access to parent directories outside the project root

Scenario: Disable GitHub Actions CI to save CI resources
Given the GitHub Actions workflow consumes CI resources
When the trigger branches are changed to "disabled-never-run" in .github/workflows/ci.yml
Then no CI jobs should run on push or pull_request events to main or develop
And GitHub Actions minutes should be preserved
And the workflow remains available for future reactivation by restoring branches to main and develop

Scenario: Fix GitLab Container Registry path for Docker push
Given the GitLab project is located at "dav.piatek/job-search-workflow"
And the Container Registry requires the full project path
When the REGISTRY variable is set to "registry.gitlab.com/dav.piatek/job-search-workflow"
Then Docker images can be pushed successfully to the GitLab Container Registry
And the registry path matches the project structure

Scenario: Clean up cloud/docker directory
Given the cloud/docker directory contains multiple duplicate and obsolete files
When obsolete Docker files are removed
Then only the actively used files remain: Dockerfile.backend, Dockerfile.frontend, compose.yaml, and docker-bake.hcl
And all references in .github/workflows/ci.yml and Taskfile.yml are updated
And Docker-specific tasks for letter-generator and qr-generator are removed

Scenario: Rename ArgoCD application to match project name
Given the ArgoCD application name is "job-search"
And the project is named "job-search-workflow"
When the ARGOCD_APP_NAME is changed to "job-search-workflow"
And the ArgoCD application manifest name is updated
And the Kubernetes namespace is updated to "job-search-workflow"
Then the ArgoCD application name matches the project naming convention

Scenario: Create Helm chart for Kubernetes deployment
Given the application needs to be deployed on Kubernetes via ArgoCD
When a Helm chart is created at cloud/helm/job-scraper-app
Then the chart includes Chart.yaml with metadata
And values.yaml contains configuration for backend and frontend
And templates include deployment and service manifests for both components
And the chart is ready for ArgoCD synchronization

Scenario: Deploy ArgoCD application
Given the Helm chart exists at cloud/helm/job-scraper-app
And the ArgoCD application manifest is at cloud/argocd/application.yaml
When kubectl apply -f cloud/argocd/application.yaml is executed
Then the ArgoCD application "job-search-workflow" is created
And ArgoCD automatically syncs with the GitLab repository
And Kubernetes resources are deployed to the "job-search-workflow" namespace
And the application is accessible via the configured services

Scenario: Optimize Docker layers for maximum CI cache efficiency
Given the Dockerfiles need to build quickly in CI pipelines
When layer ordering is optimized from least to most frequently changing
And BuildKit cache mounts are used for pnpm store
And .dockerignore excludes unnecessary files
Then pnpm dependencies are cached and reused between builds
And only changed source code triggers new builds
And build times are minimized in CI
And image sizes are reduced with multi-stage builds and cleanup

Scenario: Fix NestJS route ordering to prevent path matching issues
Given the CompaniesController has routes for both specific paths and parameterized paths
When specific routes like /upsert are placed before parameterized routes like /:id
Then NestJS correctly matches /upsert requests to the upsert handler
And parameterized routes do not incorrectly capture specific path names
And all API endpoints function as expected

Scenario: Rename company references to job-offer throughout the codebase
Given the codebase uses "company" and "companies" terminology
When all references are renamed to "job-offer" and "job-offers" respectively
And the backend module directory is renamed from companies to job-offers
And DTOs are renamed from CreateCompanyDto to CreateJobOfferDto
And the API controller route is changed from /api/companies to /api/job-offers
And frontend components are updated to use the new endpoint
Then the terminology consistently reflects the purpose of tracking job offers
And all API calls use the /api/job-offers endpoint
And the codebase builds successfully with the new naming

Scenario: Remove -simple suffix from Docker files
Given Docker files use -simple suffix (Dockerfile.backend-simple, Dockerfile.frontend-simple, compose-simple.yaml)
When the -simple suffix is removed from all Docker file names
And docker-bake.hcl is updated to reference the renamed files
Then Docker files follow standard naming conventions (Dockerfile.backend, Dockerfile.frontend, compose.yaml)
And the build configuration correctly references the renamed files

Scenario: Add workflow retry button to trigger n8n webhook
Given users need to manually trigger the n8n workflow for existing job offers
When a "Workflow" column is added to the job offers table
And a "🔄 Relancer" button is added in each row
And the button calls POST /api/job-offers/upsert with the job offer data
And the backend upsert endpoint creates or updates the offer and calls the n8n webhook
Then users can re-trigger the n8n workflow for any job offer
And the webhook at https://n8n.draw-me-the-moon.fr/webhook/58fc3205-46d2-4492-b75e-02dc5eed601a receives the job offer data
And the application builds successfully with the new functionality

Scenario: Implement automatic ArgoCD deployment with dynamic image tags
Given ArgoCD watches Git repository changes but not Docker registry changes
And using static image tags like "main" prevents ArgoCD from detecting new image builds
When Docker images are tagged with commit SHA using $CI_COMMIT_SHORT_SHA
And a GitLab CI update-helm-values job updates cloud/helm/job-scraper-app/values.yaml with the new tag
And the updated Helm values are committed back to Git with [skip ci] to prevent pipeline loops
And ArgoCD detects the Git change and automatically syncs the new deployment
Then ArgoCD automatically deploys new images without manual kubectl rollout restart
And each deployment uses a unique immutable image tag based on the commit SHA
And the CI_PUSH_TOKEN GitLab variable must be configured with a Personal Access Token having write_repository scope
