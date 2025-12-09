<script>
  import ScraperSelector from './components/ScraperSelector.svelte';
  import JobsList from './components/JobsList.svelte';
  import Stats from './components/Stats.svelte';
  import WorkflowWizard from './components/workflow/WorkflowWizard.svelte';

  let selectedScraper = null;
  let scrapedJobs = [];
  let isLoading = false;
  let showWorkflow = false;
  let workflowInitialData = null;

  function handleScraperSelected(event) {
    selectedScraper = event.detail.scraper;
  }

  function handleJobsScraped(event) {
    scrapedJobs = event.detail.jobs;
    isLoading = false;
  }

  function handleLoadingStart() {
    isLoading = true;
  }

  function openWorkflow(jobData = null) {
    workflowInitialData = jobData;
    showWorkflow = true;
  }

  function closeWorkflow() {
    showWorkflow = false;
    workflowInitialData = null;
  }

  function handleApply(event) {
    openWorkflow(event.detail.job);
  }
</script>

<main>
  <div class="header">
    <h1>Job Scraper</h1>
    <button class="btn-workflow" on:click={() => openWorkflow()}>
      📧 Créer une Candidature
    </button>
  </div>

  <div class="container">
    <ScraperSelector
      on:scraperSelected={handleScraperSelected}
      on:loadingStart={handleLoadingStart}
      on:jobsScraped={handleJobsScraped}
    />

    <Stats />

    {#if isLoading}
      <div class="card">
        <p>Scraping in progress...</p>
      </div>
    {/if}

    {#if scrapedJobs.length > 0}
      <JobsList jobs={scrapedJobs} on:apply={handleApply} />
    {/if}
  </div>
</main>

{#if showWorkflow}
  <WorkflowWizard initialData={workflowInitialData} on:close={closeWorkflow} />
{/if}

<style>
  main {
    text-align: center;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    color: #646cff;
    margin: 0;
  }

  .btn-workflow {
    padding: 0.75rem 1.5rem;
    background: #646cff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(100, 108, 255, 0.3);
  }

  .btn-workflow:hover {
    background: #535bf2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.4);
  }

  .btn-workflow:active {
    transform: translateY(0);
  }
</style>
