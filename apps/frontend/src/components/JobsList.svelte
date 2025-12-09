<script>
  import { createEventDispatcher } from 'svelte';

  export let jobs = [];

  const dispatch = createEventDispatcher();

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  function handleApply(job) {
    dispatch('apply', { job });
  }
</script>

<div class="card jobs-list">
  <h2>Scraped Jobs ({jobs.length})</h2>

  {#if jobs.length === 0}
    <p>No jobs scraped yet. Select a website and start scraping!</p>
  {:else}
    <div class="jobs-grid">
      {#each jobs as job}
        <div class="job-card">
          <h3>{job.title || 'Untitled'}</h3>

          {#if job.company}
            <p class="company">{job.company}</p>
          {/if}

          {#if job.location}
            <p class="location">📍 {job.location}</p>
          {/if}

          {#if job.salary}
            <p class="salary">💰 {job.salary}</p>
          {/if}

          {#if job.type}
            <span class="job-type">{job.type}</span>
          {/if}

          {#if job.description}
            <p class="description">{job.description.slice(0, 150)}...</p>
          {/if}

          <div class="job-meta">
            <span class="source">Source: {job.scrapedFrom}</span>
            <span class="date">{formatDate(job.postedDate || job.scrapedAt)}</span>
          </div>

          <div class="job-actions">
            {#if job.url}
              <a href={job.url} target="_blank" rel="noopener noreferrer" class="view-link">
                View Job →
              </a>
            {/if}
            <button class="apply-btn" on:click={() => handleApply(job)}>
              📧 Postuler
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .jobs-list {
    text-align: left;
  }

  h2 {
    margin-bottom: 1.5rem;
  }

  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .job-card {
    padding: 1.5rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.2s;
  }

  .job-card:hover {
    transform: translateY(-2px);
    border-color: #646cff;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: #646cff;
  }

  .company {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .location,
  .salary {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    opacity: 0.8;
  }

  .job-type {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background-color: rgba(100, 108, 255, 0.2);
    border-radius: 4px;
    font-size: 0.8rem;
    margin: 0.5rem 0;
  }

  .description {
    margin: 1rem 0;
    font-size: 0.9rem;
    line-height: 1.4;
    opacity: 0.9;
  }

  .job-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    opacity: 0.6;
    margin: 1rem 0;
  }

  .job-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .view-link {
    display: inline-block;
    color: #646cff;
    text-decoration: none;
    font-weight: 500;
  }

  .view-link:hover {
    text-decoration: underline;
  }

  .apply-btn {
    padding: 0.5rem 1rem;
    background: #646cff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .apply-btn:hover {
    background: #535bf2;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(100, 108, 255, 0.3);
  }

  .apply-btn:active {
    transform: translateY(0);
  }

  @media (prefers-color-scheme: light) {
    .job-card {
      background-color: white;
      border-color: #ddd;
    }
  }
</style>
