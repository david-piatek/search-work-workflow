# docker-bake.hcl
# Docker Bake configuration for multi-target builds

variable "REGISTRY" {
  default = "registry.gitlab.com/david-piatek-oney/job-search-workflow"
}

variable "TAG" {
  default = "latest"
}

variable "COMMIT_SHA" {
  default = "dev"
}

variable "BUILD_DATE" {
  default = ""
}

# Default group - build everything
group "default" {
  targets = ["backend", "frontend"]
}

# Production group
group "prod" {
  targets = ["backend-prod", "frontend-prod"]
}

# Development group
group "dev" {
  targets = ["backend-dev", "frontend-dev"]
}

# Backend targets
target "backend" {
  inherits = ["_common"]
  context = "."
  dockerfile = "cloud/docker/Dockerfile.backend"
  tags = [
    "${REGISTRY}/job-search-backend:${TAG}",
    "${REGISTRY}/job-search-backend:${COMMIT_SHA}",
  ]
  platforms = ["linux/amd64", "linux/arm64"]
}

target "backend-prod" {
  inherits = ["backend"]
  cache-from = ["type=registry,ref=${REGISTRY}/job-search-backend:buildcache"]
  cache-to = ["type=registry,ref=${REGISTRY}/job-search-backend:buildcache,mode=max"]
}

target "backend-dev" {
  inherits = ["backend"]
  tags = [
    "${REGISTRY}/job-search-backend:dev",
  ]
}

# Frontend targets
target "frontend" {
  inherits = ["_common"]
  context = "."
  dockerfile = "cloud/docker/Dockerfile.frontend"
  tags = [
    "${REGISTRY}/job-search-frontend:${TAG}",
    "${REGISTRY}/job-search-frontend:${COMMIT_SHA}",
  ]
  platforms = ["linux/amd64", "linux/arm64"]
}

target "frontend-prod" {
  inherits = ["frontend"]
  cache-from = ["type=registry,ref=${REGISTRY}/job-search-frontend:buildcache"]
  cache-to = ["type=registry,ref=${REGISTRY}/job-search-frontend:buildcache,mode=max"]
}

target "frontend-dev" {
  inherits = ["frontend"]
  tags = [
    "${REGISTRY}/job-search-frontend:dev",
  ]
}

# Common configuration
target "_common" {
  pull = true
  labels = {
    "org.opencontainers.image.source" = "https://gitlab.com/david-piatek-oney/job-search-workflow"
    "org.opencontainers.image.created" = "${BUILD_DATE}"
    "org.opencontainers.image.revision" = "${COMMIT_SHA}"
  }
}
