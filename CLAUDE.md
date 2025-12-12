les l'instrution doivent etre transive en gherkin en anglais

Feature: GitLab CI Docker Build with Buildx Bake

Scenario: Fix docker-bake.hcl context path for GitLab CI
Given the GitLab CI pipeline runs from the project root
And the docker-bake.hcl file is located at cloud/docker/docker-bake.hcl
When the build command "docker buildx bake -f cloud/docker/docker-bake.hcl prod --push" is executed
Then the context should be "." relative to the project root
And the dockerfile paths should be "cloud/docker/Dockerfile.backend-simple" and "cloud/docker/Dockerfile.frontend-simple"
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
