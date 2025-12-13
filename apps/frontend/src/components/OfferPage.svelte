<script>
  import { onMount } from 'svelte';
  import { API_BASE_URL } from '../lib/api.js';

  export let slug;

  let offer = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    await loadOffer();
  });

  async function loadOffer() {
    try {
      loading = true;
      const response = await fetch(`${API_BASE_URL}/job-offers/by-slug/${slug}`);

      if (!response.ok) {
        throw new Error('Offre non trouvée');
      }

      offer = await response.json();
      error = '';
    } catch (err) {
      error = err.message || "Erreur lors du chargement de l'offre";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function visitOffer() {
    if (offer && offer.url) {
      window.open(offer.url, '_blank');
    }
  }
</script>

<div class="offer-page">
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Chargement de l'offre...</p>
    </div>
  {:else if error}
    <div class="error-page">
      <h1>❌ Erreur</h1>
      <p>{error}</p>
      <a href="/" class="back-link">← Retour à la liste</a>
    </div>
  {:else if offer}
    <div class="offer-container">
      <div class="offer-card">
        <div class="offer-header">
          <h1>{offer.name || offer.slug}</h1>
          {#if offer.name}
            <p class="slug-info">Slug: <code>{offer.slug}</code></p>
          {/if}
        </div>

        <div class="offer-content">
          <div class="info-grid">
            <div class="info-section">
              <span class="field-label">URL de l'offre</span>
              <a href={offer.url} target="_blank" rel="noopener noreferrer" class="offer-url">
                {offer.url}
                <span class="external-icon">↗</span>
              </a>
            </div>

            {#if offer.companyName}
              <div class="info-section">
                <span class="field-label">Entreprise</span>
                <p>{offer.companyName}</p>
              </div>
            {/if}

            {#if offer.jobTitle}
              <div class="info-section">
                <span class="field-label">Poste</span>
                <p>{offer.jobTitle}</p>
              </div>
            {/if}

            {#if offer.salary}
              <div class="info-section">
                <span class="field-label">Salaire</span>
                <p>{offer.salary}</p>
              </div>
            {/if}

            {#if offer.remotePolicy}
              <div class="info-section">
                <span class="field-label">Télétravail</span>
                <p>{offer.remotePolicy}</p>
              </div>
            {/if}

            {#if offer.status}
              <div class="info-section">
                <span class="field-label">Statut</span>
                <p class="status-badge">{offer.status}</p>
              </div>
            {/if}

            {#if offer.cvMatchScore !== null && offer.cvMatchScore !== undefined}
              <div class="info-section">
                <span class="field-label">Score de correspondance CV</span>
                <p class="score">{offer.cvMatchScore}%</p>
              </div>
            {/if}
          </div>

          {#if offer.resumeJob}
            <div class="info-section full-width">
              <span class="field-label">Résumé de l'offre</span>
              <div class="text-content">{offer.resumeJob}</div>
            </div>
          {/if}

          {#if offer.cvPersonalizationHint}
            <div class="info-section full-width">
              <span class="field-label">Conseils de personnalisation CV</span>
              <div class="text-content">{offer.cvPersonalizationHint}</div>
            </div>
          {/if}

          {#if offer.cvMatchScoreReason}
            <div class="info-section full-width">
              <span class="field-label">Raison du score de correspondance</span>
              <div class="text-content">{offer.cvMatchScoreReason}</div>
            </div>
          {/if}

          <div class="actions">
            <button on:click={visitOffer} class="primary-btn"> 🔗 Visiter l'offre </button>
            <a href="/" class="secondary-btn"> ← Retour à la liste </a>
          </div>
        </div>

        {#if offer.createdAt}
          <div class="offer-footer">
            <small>Ajoutée le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}</small>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .offer-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
    padding: 2rem;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 1.5rem;
  }

  .spinner {
    border: 4px solid #e9ecef;
    border-top: 4px solid #646cff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading p {
    color: #495057;
    font-size: 1.1rem;
  }

  .error-page {
    max-width: 600px;
    margin: 4rem auto;
    padding: 2rem;
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .error-page h1 {
    color: #c53030;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .error-page p {
    color: #495057;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .back-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #646cff;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    transition: background 0.2s;
  }

  .back-link:hover {
    background: #535bf2;
  }

  .offer-container {
    max-width: 800px;
    margin: 2rem auto;
  }

  .offer-card {
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }

  .offer-header {
    padding: 2.5rem 2rem 1.5rem;
    border-bottom: 1px solid #e9ecef;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  }

  .offer-header h1 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: -0.5px;
  }

  .slug-info {
    margin: 0;
    color: #6c757d;
    font-size: 0.95rem;
  }

  .slug-info code {
    background: #e9ecef;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    color: #495057;
  }

  .offer-content {
    padding: 2rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .info-section {
    margin-bottom: 0;
  }

  .info-section.full-width {
    grid-column: 1 / -1;
    margin-top: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .field-label {
    display: block;
    margin-bottom: 0.75rem;
    color: #495057;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-section p {
    margin: 0;
    color: #2c3e50;
    font-size: 1rem;
    line-height: 1.6;
  }

  .text-content {
    color: #2c3e50;
    font-size: 1rem;
    line-height: 1.8;
    white-space: pre-wrap;
  }

  .status-badge {
    display: inline-block;
    padding: 0.4rem 1rem;
    background: #e9ecef;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: capitalize;
  }

  .score {
    font-size: 1.5rem;
    font-weight: 700;
    color: #646cff;
  }

  .offer-url {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    color: #646cff;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.05rem;
    transition: all 0.2s;
    word-break: break-all;
  }

  .offer-url:hover {
    background: #e9ecef;
    color: #535bf2;
    border-color: #ced4da;
  }

  .external-icon {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .primary-btn {
    flex: 1;
    padding: 1rem 1.5rem;
    background: #646cff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }

  .primary-btn:hover {
    background: #535bf2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3);
  }

  .secondary-btn {
    flex: 1;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .secondary-btn:hover {
    background: #e9ecef;
    border-color: #ced4da;
  }

  .offer-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e9ecef;
    background: #f8f9fa;
  }

  .offer-footer small {
    color: #6c757d;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .offer-page {
      padding: 1rem;
    }

    .offer-container {
      margin: 1rem auto;
    }

    .offer-header {
      padding: 1.5rem 1rem 1rem;
    }

    .offer-header h1 {
      font-size: 1.5rem;
    }

    .offer-content {
      padding: 1.5rem 1rem;
    }

    .actions {
      flex-direction: column;
    }

    .offer-url {
      font-size: 0.95rem;
      padding: 0.85rem 1rem;
    }
  }
</style>
