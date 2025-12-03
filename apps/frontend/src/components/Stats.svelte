<script>
  import { onMount } from 'svelte';
  import { jobsApi } from '../lib/api';

  let stats = null;
  let loading = true;

  onMount(async () => {
    await loadStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  });

  async function loadStats() {
    try {
      const response = await jobsApi.getStats();
      stats = response.data;
      loading = false;
    } catch (err) {
      console.error('Failed to load stats:', err);
      loading = false;
    }
  }
</script>

{#if !loading && stats}
  <div class="card stats">
    <h2>Statistics</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{stats.total}</div>
        <div class="stat-label">Total Jobs</div>
      </div>

      {#if stats.bySource && stats.bySource.length > 0}
        {#each stats.bySource as source}
          <div class="stat-card">
            <div class="stat-value">{source.count}</div>
            <div class="stat-label">{source.source}</div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<style>
  .stats {
    margin-bottom: 2rem;
  }

  h2 {
    margin-bottom: 1rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
    background-color: rgba(100, 108, 255, 0.1);
    border-radius: 8px;
    text-align: center;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #646cff;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    text-transform: capitalize;
  }
</style>
