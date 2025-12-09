<script>
  import { createEventDispatcher } from 'svelte';

  export let data = {};

  const dispatch = createEventDispatcher();

  let name = data.name || '';
  let email = data.email || '';
  let phone = data.phone || '';
  let linkedin = data.linkedin || '';
  let github = data.github || '';

  function handleNext() {
    dispatch('next', {
      personalInfo: { name, email, phone, linkedin, github },
    });
  }

  $: isValid = name.trim() !== '' && email.trim() !== '';
</script>

<div class="step">
  <h3>Informations Personnelles</h3>
  <p class="subtitle">Vos coordonnées pour la candidature</p>

  <div class="form-group">
    <label for="name">Nom complet *</label>
    <input
      id="name"
      type="text"
      bind:value={name}
      placeholder="Jean Dupont"
      required
    />
  </div>

  <div class="form-group">
    <label for="email">Email *</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      placeholder="jean.dupont@example.com"
      required
    />
  </div>

  <div class="form-group">
    <label for="phone">Téléphone</label>
    <input
      id="phone"
      type="tel"
      bind:value={phone}
      placeholder="+33 6 12 34 56 78"
    />
  </div>

  <div class="form-group">
    <label for="linkedin">LinkedIn</label>
    <input
      id="linkedin"
      type="url"
      bind:value={linkedin}
      placeholder="https://linkedin.com/in/jeandupont"
    />
  </div>

  <div class="form-group">
    <label for="github">GitHub</label>
    <input
      id="github"
      type="url"
      bind:value={github}
      placeholder="https://github.com/jeandupont"
    />
  </div>

  <div class="actions">
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

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
  }

  .btn-primary {
    padding: 0.75rem 2rem;
    background: #646cff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    background: #535bf2;
  }

  .btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style>
