<script>
  import { createEventDispatcher } from 'svelte';

  export let data = {};

  const dispatch = createEventDispatcher();

  let template = data.template || 'elegant';
  let introduction = data.introduction || '';
  let motivation = data.motivation || '';
  let closing = data.closing || '';

  function handleNext() {
    dispatch('next', {
      letterContent: {
        template,
        introduction,
        motivation,
        closing,
      },
    });
  }

  function handleBack() {
    dispatch('back');
  }

  $: isValid =
    introduction.trim() !== '' &&
    motivation.trim() !== '' &&
    closing.trim() !== '';
</script>

<div class="step">
  <h3>Contenu de la Lettre de Motivation</h3>
  <p class="subtitle">Rédigez le contenu de votre lettre professionnelle</p>

  <div class="form-group">
    <label for="letter-template">Template</label>
    <select id="letter-template" bind:value={template}>
      <option value="elegant">Élégant (Polices manuscrites, style Noël)</option>
      <option value="standard">Standard (Professionnel classique)</option>
    </select>
  </div>

  <div class="form-group">
    <label for="introduction">Paragraphe d'introduction *</label>
    <textarea
      id="introduction"
      bind:value={introduction}
      placeholder="Présentez-vous brièvement et exprimez votre intérêt pour le poste..."
      rows="4"
      required
    />
    <small>Exemple : "Passionné par le développement web depuis X ans, je suis particulièrement intéressé par le poste de..."</small>
  </div>

  <div class="form-group">
    <label for="motivation">Motivation et matching *</label>
    <textarea
      id="motivation"
      bind:value={motivation}
      placeholder="Expliquez ce qui vous a interpellé dans cette offre et pourquoi vous seriez un bon fit..."
      rows="5"
      required
    />
    <small>Exemple : "Ce qui m'a particulièrement interpellé dans votre offre est..."</small>
  </div>

  <div class="form-group">
    <label for="closing">Paragraphe de conclusion *</label>
    <textarea
      id="closing"
      bind:value={closing}
      placeholder="Concluez votre lettre en exprimant votre souhait d'échanger..."
      rows="3"
      required
    />
    <small>Exemple : "Je serais ravi d'échanger avec vous pour discuter de..."</small>
  </div>

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
    <span>Le QR code vers votre site sera automatiquement intégré au PDF final</span>
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

  select,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  select:focus,
  textarea:focus {
    outline: none;
    border-color: #646cff;
  }

  textarea {
    resize: vertical;
  }

  small {
    display: block;
    margin-top: 0.5rem;
    color: #666;
    font-size: 0.85rem;
    font-style: italic;
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
