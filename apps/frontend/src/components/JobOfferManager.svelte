<script>
  import { onMount } from 'svelte';
  import { API_BASE_URL } from '../lib/api.js';

  let jobOffers = [];
  let newJobOffer = { name: '', slug: '', url: '' };
  let loading = false;
  let error = '';
  let selectedJobOffer = null;
  let emailTemplate = '';
  let qrCodeImage = '';
  let loadingQr = false;

  onMount(async () => {
    await loadJobOffers();
  });

  async function loadJobOffers() {
    try {
      const response = await fetch(`${API_BASE_URL}/job-offers`);
      jobOffers = await response.json();
    } catch (err) {
      error = 'Erreur lors du chargement des offres';
      console.error(err);
    }
  }

  async function createJobOffer() {
    if (!newJobOffer.slug || !newJobOffer.url) {
      error = "Veuillez remplir les champs slug et URL de l'offre (le nom est optionnel)";
      return;
    }

    loading = true;
    error = '';

    try {
      const response = await fetch(`${API_BASE_URL}/job-offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJobOffer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création');
      }

      newJobOffer = { name: '', slug: '', url: '' };
      error = '';
      await loadJobOffers();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function generateEmailTemplate(jobOffer) {
    selectedJobOffer = jobOffer;
    loadingQr = true;
    const jobOfferName = jobOffer.name || jobOffer.slug;
    const qrUrl = `https://job-search-workflow.draw-me-the-moon.fr/${jobOffer.slug}`;

    emailTemplate = `Objet: Candidature spontanée - [Votre poste souhaité]

Madame, Monsieur,

Je me permets de vous adresser ma candidature spontanée pour un poste de [Votre poste] au sein de ${jobOfferName}.

Passionné(e) par [votre domaine], je suis convaincu(e) que mon profil et mes compétences pourraient apporter une valeur ajoutée à votre entreprise.

Vous trouverez ci-joint mon CV détaillant mon parcours et mes expériences.

Je reste à votre disposition pour un entretien afin de vous présenter plus en détail mes motivations.

Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Votre nom]
[Votre téléphone]
[Votre email]

---
Site web: ${jobOffer.url}
QR Code pour accès rapide: ${qrUrl}`;

    // Générer le QR code
    try {
      console.log('Génération QR code pour:', qrUrl);
      const response = await fetch(`${API_BASE_URL}/generators/qr/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: qrUrl,
          size: 300,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('QR code généré:', result);
      qrCodeImage = result.dataUrl;
    } catch (err) {
      console.error('Erreur génération QR code:', err);
      error = 'Erreur lors de la génération du QR code';
      qrCodeImage = '';
    } finally {
      loadingQr = false;
    }
  }

  function copyEmailTemplate() {
    navigator.clipboard.writeText(emailTemplate);
    alert('Email copié dans le presse-papier !');
  }

  function closeEmailTemplate() {
    selectedJobOffer = null;
    emailTemplate = '';
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeEmailTemplate();
    }
  }
</script>

<div class="jobOffer-qr-manager">
  <h2>job-search</h2>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <div class="section">
    <h3>Ajouter une offre</h3>
    <div class="form-group">
      <input type="text" bind:value={newJobOffer.name} placeholder="Nom de l'offre (optionnel)" />
      <input
        type="text"
        bind:value={newJobOffer.slug}
        placeholder="Slug (ex: mon-offre) *"
        pattern="[a-z0-9-]+"
        required
      />
      <input type="url" bind:value={newJobOffer.url} placeholder="URL de l'offre *" required />
      <button on:click={createJobOffer} disabled={loading}>
        {loading ? 'Création...' : "Créer l'offre"}
      </button>
    </div>

    {#if jobOffers.length > 0}
      <div class="jobOffers-table">
        <h4>Offres existantes ({jobOffers.length})</h4>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Slug</th>
              <th>Page</th>
              <th>URL</th>
              <th>Template Mail</th>
            </tr>
          </thead>
          <tbody>
            {#each jobOffers as jobOffer}
              <tr>
                <td class="jobOffer-name">{jobOffer.name || 'Sans nom'}</td>
                <td class="jobOffer-slug"><code>{jobOffer.slug}</code></td>
                <td class="jobOffer-action">
                  <a href="/{jobOffer.slug}" class="btn-page"> 🔗 Voir la page </a>
                </td>
                <td class="jobOffer-url">
                  <a href={jobOffer.url} target="_blank" rel="noopener noreferrer">
                    {jobOffer.url}
                    <span class="external-link">↗</span>
                  </a>
                </td>
                <td class="jobOffer-action">
                  <button on:click={() => generateEmailTemplate(jobOffer)} class="btn-template">
                    📧 Voir template
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  {#if selectedJobOffer}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      on:click={closeEmailTemplate}
      on:keydown={handleKeydown}
    >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <div class="modal-content" role="document" tabindex="-1" on:click|stopPropagation>
        <div class="modal-header">
          <h3>Template Email - {selectedJobOffer.name || selectedJobOffer.slug}</h3>
          <button class="close-btn" on:click={closeEmailTemplate}>✕</button>
        </div>
        <div class="modal-body">
          <textarea readonly rows="15" value={emailTemplate}></textarea>

          <div class="qr-section">
            <h4>QR Code à inclure dans l'email</h4>
            {#if loadingQr}
              <p>⏳ Génération du QR code...</p>
            {:else if qrCodeImage}
              <img src={qrCodeImage} alt="QR Code" class="qr-code-preview" />
              <p class="qr-info">
                URL: https://job-search-workflow.draw-me-the-moon.fr/{selectedJobOffer.slug}
              </p>
            {:else}
              <p class="qr-error">❌ Erreur lors de la génération du QR code</p>
            {/if}
          </div>
        </div>
        <div class="modal-footer">
          <button on:click={copyEmailTemplate} class="primary"> 📋 Copier le template </button>
          <button on:click={closeEmailTemplate} class="secondary"> Fermer </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .jobOffer-qr-manager {
    max-width: 100%;
    margin: 0 auto;
    padding: 2rem;
  }

  h2 {
    color: #2c3e50;
    font-size: 2.2rem;
    margin-bottom: 2.5rem;
    text-align: center;
    font-weight: 600;
    letter-spacing: -0.5px;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
    font-weight: 600;
    letter-spacing: -0.3px;
  }

  h4 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #495057;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .section {
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 1rem;
    background-color: #ffffff;
    color: #2c3e50;
    transition: all 0.2s;
  }

  input::placeholder,
  textarea::placeholder {
    color: #adb5bd;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: #646cff;
    background-color: #fff;
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.1);
  }

  textarea {
    resize: vertical;
    font-family: inherit;
  }

  button {
    padding: 0.85rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }

  button.primary {
    background: #646cff;
    color: white;
  }

  button.primary:hover:not(:disabled) {
    background: #535bf2;
  }

  button.secondary {
    background: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
  }

  button.secondary:hover:not(:disabled) {
    background: #e9ecef;
  }

  button:not(.primary):not(.secondary) {
    background: #646cff;
    color: white;
  }

  button:not(.primary):not(.secondary):hover:not(:disabled) {
    background: #535bf2;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error {
    background: #fff5f5;
    color: #c53030;
    border: 1px solid #feb2b2;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    font-weight: 500;
    font-size: 0.95rem;
  }

  .jobOffers-table {
    margin-top: 2rem;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
    table-layout: auto;
  }

  thead {
    background: #f8f9fa;
    border-bottom: 2px solid #dee2e6;
  }

  th {
    padding: 1rem 0.75rem;
    text-align: left;
    font-weight: 600;
    color: #495057;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  td {
    padding: 1rem 0.75rem;
    border-bottom: 1px solid #e9ecef;
    color: #2c3e50;
  }

  tbody tr {
    transition: background 0.2s;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }

  .jobOffer-name {
    font-weight: 600;
    color: #2c3e50;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .jobOffer-slug {
    min-width: 120px;
  }

  .jobOffer-slug code {
    background: #e9ecef;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    color: #495057;
    border: 1px solid #dee2e6;
  }

  .jobOffer-url {
    max-width: 250px;
  }

  .jobOffer-url a {
    color: #646cff;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .jobOffer-url a:hover {
    color: #535bf2;
    text-decoration: underline;
  }

  .external-link {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .jobOffer-action {
    text-align: center;
  }

  .btn-template,
  .btn-page {
    padding: 0.5rem 1rem;
    background: #646cff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
  }

  .btn-template:hover,
  .btn-page:hover {
    background: #535bf2;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e9ecef;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 1.3rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    background: #f8f9fa;
    color: #2c3e50;
  }

  .modal-body {
    padding: 2rem;
    overflow-y: auto;
    max-height: calc(90vh - 180px);
  }

  .modal-body textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    resize: vertical;
    background: #f8f9fa;
  }

  .modal-footer {
    display: flex;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-top: 1px solid #e9ecef;
    justify-content: flex-end;
  }

  .qr-section {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    text-align: center;
  }

  .qr-section h4 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #495057;
    text-transform: none;
  }

  .qr-code-preview {
    max-width: 250px;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    padding: 0.5rem;
    background: white;
  }

  .qr-info {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #6c757d;
    font-family: 'Courier New', monospace;
  }

  .qr-error {
    color: #c53030;
    font-weight: 500;
    margin: 1rem 0;
  }

  @media (max-width: 768px) {
    .jobOffer-qr-manager {
      padding: 1rem;
    }

    h2 {
      font-size: 1.8rem;
    }

    .section {
      padding: 1rem;
    }
  }
</style>
