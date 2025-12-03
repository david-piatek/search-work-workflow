<script>
  import ScraperSelector from './components/ScraperSelector.svelte';
  import JobsList from './components/JobsList.svelte';
  import Stats from './components/Stats.svelte';

  let selectedScraper = null;
  let scrapedJobs = [];
  let isLoading = false;

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
</script>

<main>
  <h1>Job Scraper</h1>

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
      <JobsList jobs={scrapedJobs} />
    {/if}
  </div>
</main>

<style>
  main {
    text-align: center;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    color: #646cff;
    margin-bottom: 2rem;
  }
</style>
