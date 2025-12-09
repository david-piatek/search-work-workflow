<script>
  import { createEventDispatcher } from 'svelte';

  export let data = {};

  const dispatch = createEventDispatcher();

  let template = data.template || 'elegant';
  let title = data.title || '';
  let subtitle = data.subtitle || '';
  let about = data.about || '';
  let matchingPoints = data.matchingPoints || [
    { icon: '🚀', title: '', description: '' },
  ];
  let stats = data.stats || [];

  function addMatchingPoint() {
    matchingPoints = [...matchingPoints, { icon: '✨', title: '', description: '' }];
  }

  function removeMatchingPoint(index) {
    matchingPoints = matchingPoints.filter((_, i) => i !== index);
  }

  function addStat() {
    stats = [...stats, { number: '', label: '' }];
  }

  function removeStat(index) {
    stats = stats.filter((_, i) => i !== index);
  }

  function handleNext() {
    dispatch('next', {
      siteContent: {
        template,
        title,
        subtitle,
        about,
        matchingPoints: matchingPoints.filter((p) => p.title && p.description),
        stats: stats.filter((s) => s.number && s.label),
      },
    });
  }

  function handleBack() {
    dispatch('back');
  }

  $: isValid =
    title.trim() !== '' &&
    subtitle.trim() !== '' &&
    about.trim() !== '' &&
    matchingPoints.some((p) => p.title && p.description);
</script>

<div class="step">
  <h3>Design du Site de Présentation</h3>
  <p class="subtitle">Personnalisez votre site de présentation professionnel</p>

  <div class="form-group">
    <label for="template">Template</label>
    <select id="template" bind:value={template}>
      <option value="elegant">Élégant (Classique et professionnel)</option>
      <option value="synthwave">Synthwave (Rétro-futuriste)</option>
    </select>
  </div>

  <div class="form-group">
    <label for="title">Titre principal *</label>
    <input
      id="title"
      type="text"
      bind:value={title}
      placeholder="Votre nom"
      required
    />
  </div>

  <div class="form-group">
    <label for="subtitle">Sous-titre *</label>
    <input
      id="subtitle"
      type="text"
      bind:value={subtitle}
      placeholder="Votre titre professionnel"
      required
    />
  </div>

  <div class="form-group">
    <label for="about">À propos *</label>
    <textarea
      id="about"
      bind:value={about}
      placeholder="Décrivez brièvement votre parcours et vos compétences..."
      rows="4"
      required
    />
  </div>

  <div class="section">
    <div class="section-header">
      <h4>Points de Matching</h4>
      <button type="button" class="btn-add" on:click={addMatchingPoint}>+ Ajouter</button>
    </div>

    {#each matchingPoints as point, i}
      <div class="array-item">
        <div class="array-item-header">
          <input
            type="text"
            bind:value={point.icon}
            placeholder="🚀"
            class="icon-input"
          />
          <input
            type="text"
            bind:value={point.title}
            placeholder="Titre du point"
            class="title-input"
          />
          <button
            type="button"
            class="btn-remove"
            on:click={() => removeMatchingPoint(i)}
          >
            ✕
          </button>
        </div>
        <textarea
          bind:value={point.description}
          placeholder="Description du point de matching..."
          rows="2"
        />
      </div>
    {/each}
  </div>

  <div class="section">
    <div class="section-header">
      <h4>Statistiques (Optionnel)</h4>
      <button type="button" class="btn-add" on:click={addStat}>+ Ajouter</button>
    </div>

    {#if stats.length > 0}
      {#each stats as stat, i}
        <div class="stat-item">
          <input
            type="text"
            bind:value={stat.number}
            placeholder="10+"
            class="stat-number"
          />
          <input
            type="text"
            bind:value={stat.label}
            placeholder="Années d'expérience"
            class="stat-label"
          />
          <button
            type="button"
            class="btn-remove"
            on:click={() => removeStat(i)}
          >
            ✕
          </button>
        </div>
      {/each}
    {:else}
      <p class="empty-state">Aucune statistique ajoutée</p>
    {/if}
  </div>

  <div class="actions">
    <button class="btn-secondary" on:click={handleBack}>← Retour</button>
    <button class="btn-primary" on:click={handleNext} disabled={!isValid}>
      Suivant →
    </button>
  </div>
</div>

<style>
  .step {
    max-width: 700px;
    margin: 0 auto;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    color: #333;
  }

  h4 {
    margin: 0;
    font-size: 1.1rem;
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

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #646cff;
  }

  textarea {
    resize: vertical;
  }

  .section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f9f9f9;
    border-radius: 6px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .btn-add {
    padding: 0.5rem 1rem;
    background: #646cff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  .btn-add:hover {
    background: #535bf2;
  }

  .array-item {
    margin-bottom: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .array-item-header {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .icon-input {
    width: 60px;
    text-align: center;
  }

  .title-input {
    flex: 1;
  }

  .btn-remove {
    width: 32px;
    height: 32px;
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background 0.2s;
  }

  .btn-remove:hover {
    background: #cc0000;
  }

  .stat-item {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .stat-number {
    width: 120px;
  }

  .stat-label {
    flex: 1;
  }

  .empty-state {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 1rem;
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
