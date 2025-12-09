<script>
  import { createEventDispatcher } from 'svelte';

  export let data = {};

  const dispatch = createEventDispatcher();

  let name = data.name || '';
  let position = data.position || '';
  let jobId = data.jobId || null;

  function handleNext() {
    dispatch('next', {
      companyInfo: { name, position, jobId },
    });
  }

  function handleBack() {
    dispatch('back');
  }

  $: isValid = name.trim() !== '' && position.trim() !== '';
</script>

<div class="step">
  <h3>Informations Entreprise</h3>
  <p class="subtitle">Détails sur l'entreprise et le poste ciblé</p>

  <div class="form-group">
    <label for="company-name">Nom de l'entreprise *</label>
    <input
      id="company-name"
      type="text"
      bind:value={name}
      placeholder="Entreprise Cible"
      required
    />
  </div>

  <div class="form-group">
    <label for="position">Intitulé du poste *</label>
    <input
      id="position"
      type="text"
      bind:value={position}
      placeholder="Développeur Full Stack Senior"
      required
    />
  </div>

  {#if jobId}
    <div class="info-box">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
        />
        <path
          d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
        />
      </svg>
      <span>Candidature liée à une offre scrapée</span>
    </div>
  {/if}

  <div class="actions">
    <button class="btn-secondary" on:click={handleBack}>← Retour</button>
    <button class="btn-primary" on:click={handleNext} disabled={!isValid}>
      Suivant →
    </button>
  </div>
</div>

<style>
  .step {
    max-width: 600px;
    margin: 0 auto;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #333;
  }

  .subtitle {
    margin: 0 0 2rem 0;
    color: #666;
    font-size: 0.95rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
    font-size: 0.95rem;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #646cff;
  }

  .info-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #e7f3ff;
    border: 1px solid #b3d9ff;
    border-radius: 4px;
    color: #0066cc;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .info-box svg {
    flex-shrink: 0;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #646cff;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #535bf2;
  }

  .btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: white;
    color: #646cff;
    border: 1px solid #646cff;
  }

  .btn-secondary:hover {
    background: #f5f5ff;
  }
</style>
