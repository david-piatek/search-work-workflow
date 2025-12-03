# n8n Workflow for Job Scraper

## Overview

This n8n workflow automates job scraping and backup processes:

1. Runs every 6 hours (configurable via cron)
2. Retrieves all available scrapers from the API
3. Executes each scraper sequentially
4. Waits for results to be generated
5. Fetches scraped job data
6. Saves results to JSON files
7. Backs up to GitHub repository
8. Sends Slack notifications with summary

## Installation

### 1. Import the Workflow

1. Open your n8n instance
2. Go to Workflows
3. Click "Import from File"
4. Select `job-scraper-workflow.json`

### 2. Configure Credentials

#### GitHub Token
1. Create a Personal Access Token on GitHub with `repo` scope
2. In n8n, create HTTP Header Auth credentials:
   - Name: `github-token`
   - Header Name: `Authorization`
   - Header Value: `token YOUR_GITHUB_TOKEN`

#### Slack (Optional)
1. Create a Slack App and get OAuth token
2. Add Slack credentials in n8n
3. Update the channel name in the "Send Slack Notification" node

### 3. Update Configuration

Update these nodes with your information:

- **Backup to GitHub**: Replace `YOUR_USERNAME` with your GitHub username
- **Send Slack Notification**: Update the channel name if needed

### 4. Activate the Workflow

Click the toggle to activate the workflow.

## Workflow Nodes

### 1. Schedule Trigger
- Runs every 6 hours by default
- Cron expression: `0 */6 * * *`
- Modify the cron expression for different schedules

### 2. Get Available Scrapers
- Fetches list of all configured scrapers
- Endpoint: `GET /scrapers`

### 3. Split Scrapers
- Processes scrapers one at a time
- Prevents overwhelming the system

### 4. Execute Scraper
- Triggers scraping for each website
- Endpoint: `POST /scrapers/execute`

### 5. Wait for Results
- Waits 30 seconds for scraping to complete
- Adjust based on scraping duration

### 6. Get Scraping Results
- Retrieves scraped job data
- Endpoint: `GET /jobs?source={scraper}&limit=100`

### 7. Has Results?
- Checks if any jobs were scraped
- Branches workflow based on results

### 8. Save to JSON
- Converts results to JSON file
- Filename includes timestamp

### 9. Write to File System
- Saves JSON to `/data/n8n-backups/`
- Ensures local backup exists

### 10. Backup to GitHub
- Commits JSON file to GitHub repository
- Stores in `backup/` directory
- Automatic versioning via Git

### 11. Format Summary
- Creates summary of scraping results
- Includes job count and timestamp

### 12. Send Slack Notification
- Sends summary to Slack channel
- Notifies team of completion

## Environment Variables

If running n8n in Docker/Kubernetes, ensure these environment variables are set:

```yaml
N8N_BASIC_AUTH_ACTIVE: "true"
N8N_BASIC_AUTH_USER: "admin"
N8N_BASIC_AUTH_PASSWORD: "your-password"
WEBHOOK_URL: "https://your-n8n-instance.com"
```

## Deploy n8n with Helm

Add n8n to your Kubernetes cluster:

```bash
helm repo add n8n https://8gears.com/helm-charts
helm repo update

helm install n8n n8n/n8n \
  --namespace n8n \
  --create-namespace \
  --set persistence.enabled=true \
  --set persistence.size=5Gi
```

## Backup Strategy

The workflow creates backups in multiple locations:

1. **Local File System**: `/data/n8n-backups/`
2. **GitHub Repository**: `backup/` directory
3. **Database**: Jobs stored in PostgreSQL

## Monitoring

View workflow execution logs in n8n:

1. Go to Executions
2. Filter by workflow name
3. View detailed logs for each run

## Troubleshooting

### Workflow not triggering
- Check if workflow is activated
- Verify cron expression is correct
- Check n8n logs for errors

### GitHub backup failing
- Verify GitHub token has correct permissions
- Check repository URL is correct
- Ensure `backup/` directory exists in repo

### No results returned
- Verify backend API is accessible
- Check scraper execution logs
- Increase wait time if needed

## Customization

### Change Schedule
Modify the cron expression in Schedule Trigger:
- Every hour: `0 * * * *`
- Daily at 2am: `0 2 * * *`
- Twice daily: `0 */12 * * *`

### Add Email Notifications
Add an Email node after "Format Summary":
1. Add Email node
2. Configure SMTP credentials
3. Set recipient and template

### Custom Backup Location
Modify the "Write to File System" node:
- Update the `path` parameter
- Ensure directory exists and is writable
