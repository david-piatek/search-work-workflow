<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { scrapersApi } from '../lib/api';

  const dispatch = createEventDispatcher();

  const availableSites = [
    { name: 'freework', url: 'https://www.freework.com/jobs' },
    { name: 'welcometothejungle', url: 'https://www.welcometothejungle.com/fr/jobs' },
    { name: 'apec', url: 'https://www.apec.fr/candidat/recherche-emploi.html' },
    { name: 'indeed', url: 'https://fr.indeed.com/jobs' },
    { name: 'linkedin', url: 'https://www.linkedin.com/jobs' },
  ];

  let existingScrapers = [];
  let selectedSite = '';
  let customUrl = '';
  let loading = false;
  let error = null;

  onMount(async () => {
    await loadScrapers();
  });

  async function loadScrapers() {
    try {
      const response = await scrapersApi.getAll();
      existingScrapers = response.data;
    } catch (err) {
      console.error('Failed to load scrapers:', err);
    }
  }

  async function handleScrape() {
    if (!selectedSite && !customUrl) {
      error = 'Please select a site or enter a custom URL';
      return;
    }

    loading = true;
    error = null;
    dispatch('loadingStart');

    try {
      const site = availableSites.find(s => s.name === selectedSite);
      const scraperData = {
        name: selectedSite || 'custom',
        url: site?.url || customUrl,
      };

      // Create or get scraper
      const scraperResponse = await scrapersApi.createOrGet(scraperData);
      const scraper = scraperResponse.data;

      dispatch('scraperSelected', { scraper });

      // Execute scraper
      const executeResponse = await scrapersApi.execute(scraper.name);

      // Poll for results (in a real app, use WebSocket or SSE)
      setTimeout(async () => {
        try {
          const jobsResponse = await fetch(`/api/jobs?source=${scraper.name}`);
          const jobs = await jobsResponse.json();
          dispatch('jobsScraped', { jobs });
        } catch (err) {
          console.error('Failed to fetch jobs:', err);
        }
        loading = false;
      }, 5000);

    } catch (err) {
      error = err.response?.data?.message || 'Failed to scrape website';
      loading = false;
      console.error('Scraping error:', err);
    }
  }

  function isScraperExists(name) {
    return existingScrapers.some(s => s.name === name);
  }
</script>

<div class="card scraper-selector">
  <h2>Select Website to Scrape</h2>

  <div class="sites-grid">
    {#each availableSites as site}
      <button
        class="site-button"
        class:selected={selectedSite === site.name}
        class:exists={isScraperExists(site.name)}
        on:click={() => selectedSite = site.name}
        disabled={loading}
      >
        {site.name}
        {#if isScraperExists(site.name)}
          <span class="badge">Exists</span>
        {/if}
      </button>
    {/each}
  </div>

  <div class="custom-url">
    <input
      type="url"
      placeholder="Or enter custom URL..."
      bind:value={customUrl}
      on:input={() => selectedSite = ''}
      disabled={loading}
    />
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <button
    class="scrape-button"
    on:click={handleScrape}
    disabled={loading || (!selectedSite && !customUrl)}
  >
    {loading ? 'Scraping...' : 'Start Scraping'}
  </button>
</div>

<style>
  .scraper-selector {
    margin-bottom: 2rem;
  }

  h2 {
    margin-bottom: 1.5rem;
  }

  .sites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .site-button {
    padding: 1rem;
    position: relative;
    text-transform: capitalize;
  }

  .site-button.selected {
    border-color: #646cff;
    background-color: rgba(100, 108, 255, 0.1);
  }

  .site-button.exists {
    border-color: #4caf50;
  }

  .badge {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background-color: #4caf50;
    color: white;
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
  }

  .custom-url {
    margin-bottom: 1.5rem;
  }

  input[type="url"] {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    background-color: #1a1a1a;
    color: inherit;
  }

  input[type="url"]:focus {
    outline: none;
    border-color: #646cff;
  }

  .scrape-button {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    background-color: #646cff;
    color: white;
    border: none;
  }

  .scrape-button:hover:not(:disabled) {
    background-color: #535bf2;
  }

  .error {
    color: #ff4444;
    margin: 1rem 0;
    padding: 0.5rem;
    background-color: rgba(255, 68, 68, 0.1);
    border-radius: 4px;
  }

  @media (prefers-color-scheme: light) {
    input[type="url"] {
      background-color: white;
      border-color: #ddd;
    }
  }
</style>
