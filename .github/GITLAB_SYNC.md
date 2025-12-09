# GitLab Synchronization Setup

This document explains how to configure automatic synchronization from GitHub to GitLab using the `saderi/push-to-gitlab` action.

## Overview

The `sync-to-gitlab` job in `.github/workflows/ci.yml` automatically mirrors this repository to GitLab whenever code is pushed to GitHub **and all CI tests pass**. This allows you to:
- Maintain the primary repository on GitHub
- Run fast CI tests on GitHub Actions
- Automatically sync to GitLab only if all tests pass
- Use GitLab for CD (Container Registry, Kubernetes, Terraform)
- Keep both repositories in sync without manual intervention

## Prerequisites

1. A GitLab account (GitLab.com or self-hosted GitLab server)
2. A GitLab repository to sync to
3. GitLab access token

## Setup Instructions

### 1. Create GitLab Repository

Create a repository on GitLab with the same name as your GitHub repository (or any name you prefer).

**For GitLab.com:**
- Repository URL will be: `https://gitlab.com/your-username/repository-name`

**For Self-hosted GitLab:**
- Repository URL will be: `https://gitlab.yourcompany.com/your-username/repository-name`

### 2. Create GitLab Access Token

You need a GitLab access token to authenticate the sync.

**Option A: Project Access Token (Recommended)**
1. Go to your GitLab repository
2. Navigate to **Settings → Access Tokens**
3. Click **Add new token**
4. Fill in the details:
   - Token name: `GitHub Sync`
   - Expiration date: Set as needed (or leave blank for no expiration)
   - Role: `Maintainer`
   - Scopes: Check `write_repository`
5. Click **Create project access token**
6. **Important**: Copy the token immediately (format: `glpat-xxxxxxxxxxxxxxxxxxxx`)

**Option B: Personal Access Token**
1. Go to your GitLab profile
2. Navigate to **Preferences → Access Tokens**
3. Click **Add new token**
4. Fill in the details:
   - Token name: `GitHub Sync`
   - Expiration date: Set as needed
   - Scopes: Check `write_repository` or `api`
5. Click **Create personal access token**
6. **Important**: Copy the token immediately

### 3. Add Secret to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**

Add the following secret:

**GITLAB_TOKEN**
- Name: `GITLAB_TOKEN`
- Value: Your GitLab access token (the one you copied in step 2)
- Format: `glpat-xxxxxxxxxxxxxxxxxxxx`

### 4. Configure GitLab Repository URL (if needed)

By default, the workflow syncs to `gitlab.com`. If you use a self-hosted GitLab instance:

1. Edit `.github/workflows/sync-gitlab.yml`
2. Change the `gitlab_repository` value:
   ```yaml
   gitlab_repository: 'gitlab.yourcompany.com'  # Without https://
   ```

### 5. Test the Sync

Push a commit to GitHub and verify:
1. Go to **Actions** tab in GitHub
2. Check that the "Sync to GitLab" workflow runs successfully
3. Verify the commit appears in your GitLab repository

## Workflow Configuration

### Current Configuration

```yaml
- name: Push to GitLab
  uses: saderi/push-to-gitlab@v1
  with:
    gitlab_repository: 'gitlab.com'  # do not include https://
    gitlab_token: ${{ secrets.GITLAB_TOKEN }}
```

### Branches Synced

The workflow automatically syncs:
- `main` branch
- `develop` branch
- All `feature/*` branches
- All `bugfix/*` branches
- All `hotfix/*` branches

### When Sync Happens

- **Only after all CI tests pass** (php-quality, php-tests, web-quality, web-tests)
- On every push to any of the synced branches
- Full repository history is maintained
- Prevents broken code from reaching GitLab

### How It Works

1. GitHub Actions detects a push to a synced branch
2. Runs all CI jobs in parallel (quality checks and tests)
3. **Sync job waits for all CI jobs to complete** (`needs: [php-quality, php-tests, web-quality, web-tests]`)
4. If all tests pass, checks out the full repository history (`fetch-depth: 0`)
5. Uses `saderi/push-to-gitlab@v1` to push to GitLab
6. Authenticates using the `GITLAB_TOKEN` secret
7. Mirrors all commits and branches to GitLab
8. GitLab CI/CD pipeline starts automatically (build, promote, deploy)

## Troubleshooting

### Sync Fails with "Authentication Failed"

**Possible causes:**
- Access token is invalid or expired
- Token doesn't have `write_repository` permission
- Token was revoked

**Solutions:**
1. Generate a new access token in GitLab
2. Ensure the token has `write_repository` scope
3. Update the `GITLAB_TOKEN` secret in GitHub

### Sync Fails with "Repository Not Found"

**Possible causes:**
- GitLab repository doesn't exist
- Repository URL in workflow is incorrect
- Token doesn't have access to the repository

**Solutions:**
1. Verify the repository exists on GitLab
2. Check that `gitlab_repository` matches your GitLab instance
3. Ensure the token owner has access to the repository

### Sync Fails with "Permission Denied"

**Possible causes:**
- Token has read-only access
- Repository is protected

**Solutions:**
1. Recreate token with `Maintainer` role
2. Check repository protection rules in GitLab
3. Ensure the token has `write_repository` scope

### Some Branches Don't Sync

The workflow only syncs specific branch patterns. To add more:

1. Edit `.github/workflows/ci.yml`
2. Add your branch pattern to the `sync-to-gitlab` job conditions:
   ```yaml
   sync-to-gitlab:
     if: |
       github.event_name == 'push' && (
         github.ref == 'refs/heads/main' ||
         github.ref == 'refs/heads/develop' ||
         startsWith(github.ref, 'refs/heads/feature/') ||
         startsWith(github.ref, 'refs/heads/bugfix/') ||
         startsWith(github.ref, 'refs/heads/hotfix/') ||
         startsWith(github.ref, 'refs/heads/your-pattern/')
       )
   ```

## Self-Hosted GitLab Configuration

If you use a self-hosted GitLab instance:

1. Edit `.github/workflows/ci.yml`
2. Find the `sync-to-gitlab` job
3. Update the `gitlab_repository` parameter:
   ```yaml
   - uses: saderi/push-to-gitlab@v1
     with:
       gitlab_repository: 'gitlab.yourcompany.com/your-username/repository-name'
       gitlab_token: ${{ secrets.GITLAB_TOKEN }}
   ```

**Note:** Format is `gitlab-domain/username/repository` (without `https://`).

## Security Considerations

- Access tokens are stored as GitHub secrets and encrypted at rest
- Only workflows in this repository can access the secret
- Use project access tokens instead of personal tokens when possible
- Set token expiration dates and rotate regularly
- Limit token scope to `write_repository` only
- Never commit tokens directly to the repository

## Configuration Examples

### GitLab.com (Default)

```yaml
gitlab_repository: 'gitlab.com'
```

**GitHub Secret:**
```
GITLAB_TOKEN: glpat-xxxxxxxxxxxxxxxxxxxx
```

### Self-Hosted GitLab

```yaml
gitlab_repository: 'gitlab.yourcompany.com'
```

**GitHub Secret:**
```
GITLAB_TOKEN: glpat-xxxxxxxxxxxxxxxxxxxx
```

### GitLab Enterprise Edition

```yaml
gitlab_repository: 'git.enterprise.com'
```

**GitHub Secret:**
```
GITLAB_TOKEN: glpat-xxxxxxxxxxxxxxxxxxxx
```

## Why This Approach?

**Hybrid CI/CD Benefits:**
- **GitHub Actions for CI**: Faster test execution, better GitHub integration
- **GitLab for CD**: Container Registry, Kubernetes, Terraform support
- **Quality Gates**: Only tested code reaches GitLab (sync depends on CI passing)
- **Best of both platforms**: Fast CI on GitHub, powerful CD on GitLab

**Advantages over GitLab mirroring:**
- Works on free GitLab plans (no Premium required)
- More control over sync triggers and branches
- Integrates with existing GitHub Actions workflows
- Can customize sync behavior easily
- Transparent sync process (visible in GitHub Actions)
- **Only syncs if CI tests pass** (prevents broken code)

**Advantages over SSH-based sync:**
- Simpler configuration (no SSH key management)
- Works with any GitLab instance
- Only one secret to manage
- Easier troubleshooting
- Integrated with CI pipeline

## Additional Resources

- [GitLab Access Tokens Documentation](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)
- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [saderi/push-to-gitlab Action](https://github.com/marketplace/actions/push-to-gitlab)
