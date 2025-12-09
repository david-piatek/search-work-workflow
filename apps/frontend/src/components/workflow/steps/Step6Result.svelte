<script>
  import { createEventDispatcher } from 'svelte';

  export let result = null;
  export let isProcessing = false;

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }

  function getStepLabel(progress) {
    if (progress === 0) return 'Initialisation...';
    if (progress <= 20) return 'Génération du site HTML...';
    if (progress <= 40) return 'Génération du site PDF...';
    if (progress <= 50) return 'Création de l\'URL...';
    if (progress <= 70) return 'Génération du QR code...';
    if (progress <= 90) return 'Génération de la lettre PDF...';
    return 'Finalisation...';
  }

  $: stepLabel = result ? getStepLabel(result.progress) : 'En attente...';
  $: isCompleted = result?.status === 'completed';
  $: isFailed = result?.status === 'failed';
</script>

<div class="step">
  {#if isProcessing || (!isCompleted && !isFailed)}
    <div class="processing">
      <div class="spinner" />
      <h3>Génération en cours...</h3>
      <p class="step-label">{stepLabel}</p>

      {#if result}
        <div class="progress-bar">
          <div class="progress-fill" style="width: {result.progress}%" />
        </div>
        <p class="progress-text">{result.progress}%</p>
      {/if}

      <div class="info-box">
        <p>
          Votre candidature est en cours de génération. Cela prend généralement entre 30 et 60
          secondes. Veuillez patienter...
        </p>
      </div>
    </div>
  {:else if isFailed}
    <div class="failed">
      <div class="error-icon">⚠️</div>
      <h3>Erreur lors de la génération</h3>
      <p class="error-message">{result.error || 'Une erreur inconnue s\'est produite'}</p>

      <div class="actions">
        <button class="btn-primary" on:click={handleClose}>Fermer</button>
      </div>
    </div>
  {:else if isCompleted}
    <div class="completed">
      <div class="success-icon">✅</div>
      <h3>Candidature générée avec succès !</h3>
      <p class="success-message">
        Tous vos fichiers sont prêts. Vous pouvez maintenant les consulter et les télécharger.
      </p>

      <div class="files-section">
        <h4>📁 Fichiers générés</h4>

        <div class="file-item">
          <div class="file-info">
            <div class="file-icon">🌐</div>
            <div>
              <strong>Site de présentation (HTML)</strong>
              <p>Site hébergé accessible en ligne</p>
            </div>
          </div>
          <a
            href={`${result.files.siteHtml}`}
            target="_blank"
            rel="noopener noreferrer"
            class="btn-view"
          >
            Voir
          </a>
        </div>

        <div class="file-item">
          <div class="file-info">
            <div class="file-icon">📄</div>
            <div>
              <strong>Site de présentation (PDF)</strong>
              <p>Version PDF du site pour impression</p>
            </div>
          </div>
          <a href={result.files.sitePdf} download class="btn-download">Télécharger</a>
        </div>

        <div class="file-item">
          <div class="file-info">
            <div class="file-icon">📱</div>
            <div>
              <strong>QR Code</strong>
              <p>QR code pointant vers votre site</p>
            </div>
          </div>
          <a href={result.files.qrImage} download class="btn-download">Télécharger</a>
        </div>

        <div class="file-item">
          <div class="file-info">
            <div class="file-icon">✉️</div>
            <div>
              <strong>Lettre de motivation (PDF)</strong>
              <p>Lettre avec QR code intégré</p>
            </div>
          </div>
          <a href={result.files.letterPdf} download class="btn-download">Télécharger</a>
        </div>
      </div>

      <div class="info-box success">
        <p>
          <strong>Prochaines étapes :</strong><br />
          1. Consultez votre site de présentation<br />
          2. Téléchargez les PDF<br />
          3. Utilisez-les pour votre candidature !
        </p>
      </div>

      <div class="actions">
        <button class="btn-primary" on:click={handleClose}>Terminer</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .step {
    max-width: 700px;
    margin: 0 auto;
  }

  .processing,
  .completed,
  .failed {
    text-align: center;
  }

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #646cff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 2rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .success-icon,
  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.75rem;
    color: #333;
  }

  .step-label {
    font-size: 1.1rem;
    color: #646cff;
    margin-bottom: 2rem;
    font-weight: 500;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #646cff, #535bf2);
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 2rem;
  }

  .success-message,
  .error-message {
    font-size: 1.05rem;
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .error-message {
    color: #cc0000;
    padding: 1rem;
    background: #ffe7e7;
    border-radius: 4px;
    border: 1px solid #ffcccc;
  }

  .files-section {
    text-align: left;
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f9f9f9;
    border-radius: 6px;
  }

  .files-section h4 {
    margin: 0 0 1.5rem 0;
    font-size: 1.2rem;
    color: #333;
  }

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    margin-bottom: 1rem;
  }

  .file-item:last-child {
    margin-bottom: 0;
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .file-icon {
    font-size: 2rem;
  }

  .file-info strong {
    display: block;
    margin-bottom: 0.25rem;
    color: #333;
  }

  .file-info p {
    margin: 0;
    font-size: 0.85rem;
    color: #666;
  }

  .btn-view,
  .btn-download {
    padding: 0.5rem 1.5rem;
    background: #646cff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background 0.2s;
  }

  .btn-view:hover,
  .btn-download:hover {
    background: #535bf2;
  }

  .info-box {
    padding: 1rem 1.25rem;
    background: #e7f3ff;
    border: 1px solid #b3d9ff;
    border-radius: 4px;
    color: #0066cc;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .info-box.success {
    background: #e7f9e7;
    border-color: #8fce8f;
    color: #2d662d;
  }

  .info-box p {
    margin: 0;
  }

  .actions {
    display: flex;
    justify-content: center;
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

  .btn-primary:hover {
    background: #535bf2;
  }
</style>
