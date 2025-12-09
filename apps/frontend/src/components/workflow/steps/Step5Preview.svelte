<script>
  import { createEventDispatcher } from 'svelte';

  export let data = {};

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch('submit', {
      options: { qrStyle: 'elegant' },
    });
  }

  function handleBack() {
    dispatch('back');
  }
</script>

<div class="step">
  <h3>Prévisualisation</h3>
  <p class="subtitle">Vérifiez vos informations avant de générer votre candidature</p>

  <div class="preview-section">
    <h4>👤 Informations Personnelles</h4>
    <div class="preview-item">
      <strong>Nom :</strong>
      {data.personalInfo.name}
    </div>
    <div class="preview-item">
      <strong>Email :</strong>
      {data.personalInfo.email}
    </div>
    {#if data.personalInfo.phone}
      <div class="preview-item">
        <strong>Téléphone :</strong>
        {data.personalInfo.phone}
      </div>
    {/if}
    {#if data.personalInfo.linkedin}
      <div class="preview-item">
        <strong>LinkedIn :</strong>
        <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
          {data.personalInfo.linkedin}
        </a>
      </div>
    {/if}
    {#if data.personalInfo.github}
      <div class="preview-item">
        <strong>GitHub :</strong>
        <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer">
          {data.personalInfo.github}
        </a>
      </div>
    {/if}
  </div>

  <div class="preview-section">
    <h4>🏢 Entreprise</h4>
    <div class="preview-item">
      <strong>Nom :</strong>
      {data.companyInfo.name}
    </div>
    <div class="preview-item">
      <strong>Poste :</strong>
      {data.companyInfo.position}
    </div>
  </div>

  <div class="preview-section">
    <h4>🌐 Site de Présentation</h4>
    <div class="preview-item">
      <strong>Template :</strong>
      {data.siteContent.template === 'elegant' ? 'Élégant' : 'Synthwave'}
    </div>
    <div class="preview-item">
      <strong>Titre :</strong>
      {data.siteContent.title}
    </div>
    <div class="preview-item">
      <strong>Sous-titre :</strong>
      {data.siteContent.subtitle}
    </div>
    <div class="preview-item">
      <strong>Points de matching :</strong>
      {data.siteContent.matchingPoints?.length || 0}
    </div>
    {#if data.siteContent.stats?.length > 0}
      <div class="preview-item">
        <strong>Statistiques :</strong>
        {data.siteContent.stats.length}
      </div>
    {/if}
  </div>

  <div class="preview-section">
    <h4>📝 Lettre de Motivation</h4>
    <div class="preview-item">
      <strong>Template :</strong>
      {data.letterContent.template === 'elegant' ? 'Élégant' : 'Standard'}
    </div>
    <div class="preview-text">
      <strong>Introduction :</strong>
      <p>{data.letterContent.introduction}</p>
    </div>
    <div class="preview-text">
      <strong>Motivation :</strong>
      <p>{data.letterContent.motivation}</p>
    </div>
    <div class="preview-text">
      <strong>Conclusion :</strong>
      <p>{data.letterContent.closing}</p>
    </div>
  </div>

  <div class="info-box">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
      />
      <path
        d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
      />
    </svg>
    <div>
      <strong>Prêt à générer !</strong>
      <p>
        Le workflow va créer : site HTML + site PDF + QR code + lettre PDF avec QR intégré.
        La génération prend environ 30-60 secondes.
      </p>
    </div>
  </div>

  <div class="actions">
    <button class="btn-secondary" on:click={handleBack}>← Retour</button>
    <button class="btn-primary" on:click={handleSubmit}>🚀 Générer la Candidature</button>
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
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .subtitle {
    margin: 0 0 2rem 0;
    color: #666;
    font-size: 0.95rem;
  }

  .preview-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
  }

  .preview-item {
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }

  .preview-item:last-child {
    margin-bottom: 0;
  }

  .preview-item strong {
    color: #555;
    font-weight: 500;
  }

  .preview-item a {
    color: #646cff;
    text-decoration: none;
  }

  .preview-item a:hover {
    text-decoration: underline;
  }

  .preview-text {
    margin-bottom: 1rem;
  }

  .preview-text:last-child {
    margin-bottom: 0;
  }

  .preview-text strong {
    display: block;
    color: #555;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .preview-text p {
    margin: 0;
    color: #333;
    line-height: 1.6;
    padding: 0.75rem;
    background: white;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .info-box {
    display: flex;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #e7f9e7;
    border: 1px solid #8fce8f;
    border-radius: 4px;
    color: #2d662d;
    margin-bottom: 1.5rem;
  }

  .info-box svg {
    flex-shrink: 0;
    margin-top: 0.25rem;
  }

  .info-box strong {
    display: block;
    margin-bottom: 0.25rem;
  }

  .info-box p {
    margin: 0;
    font-size: 0.9rem;
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

  .btn-primary:hover {
    background: #535bf2;
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
