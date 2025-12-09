<script>
  import { createEventDispatcher } from 'svelte';
  import { workflowApi } from '../../lib/api';
  import Step1PersonalInfo from './steps/Step1PersonalInfo.svelte';
  import Step2CompanyInfo from './steps/Step2CompanyInfo.svelte';
  import Step3SiteDesign from './steps/Step3SiteDesign.svelte';
  import Step4LetterContent from './steps/Step4LetterContent.svelte';
  import Step5Preview from './steps/Step5Preview.svelte';
  import Step6Result from './steps/Step6Result.svelte';

  export let initialData = null;

  const dispatch = createEventDispatcher();

  let currentStep = 1;
  let workflowData = {
    personalInfo: {},
    companyInfo: {},
    siteContent: {
      matchingPoints: [],
      stats: [],
    },
    letterContent: {},
    options: {},
  };
  let isProcessing = false;
  let workflowId = null;
  let result = null;

  // Pre-fill if job data provided
  if (initialData) {
    workflowData.companyInfo = {
      name: initialData.company || '',
      position: initialData.title || '',
      jobId: initialData.id || null,
    };
  }

  function handleNext(event) {
    workflowData = { ...workflowData, ...event.detail };
    currentStep++;
  }

  function handleBack() {
    currentStep--;
  }

  async function handleSubmit(event) {
    workflowData = { ...workflowData, ...event.detail };
    isProcessing = true;

    try {
      const response = await workflowApi.create(workflowData);
      workflowId = response.data.workflowId;
      currentStep = 6;

      // Poll for status
      await pollStatus(workflowId);
    } catch (error) {
      console.error('Workflow failed:', error);
      alert(`Erreur lors de la création du workflow: ${error.response?.data?.message || error.message}`);
      isProcessing = false;
    }
  }

  async function pollStatus(id) {
    const interval = setInterval(async () => {
      try {
        const response = await workflowApi.getStatus(id);
        result = response.data;

        if (result.status === 'completed' || result.status === 'failed') {
          clearInterval(interval);
          isProcessing = false;
        }
      } catch (error) {
        console.error('Status check failed:', error);
        clearInterval(interval);
        isProcessing = false;
      }
    }, 2000);
  }

  function handleClose() {
    dispatch('close');
  }
</script>

<div class="wizard-overlay" on:click={handleClose}>
  <div class="wizard-container" on:click|stopPropagation>
    <div class="wizard-header">
      <h2>Générateur de Candidature</h2>
      <button class="close-btn" on:click={handleClose}>&times;</button>
    </div>

    <div class="steps-indicator">
      {#each [1, 2, 3, 4, 5, 6] as step}
        <div
          class="step-dot"
          class:active={step === currentStep}
          class:completed={step < currentStep}
        >
          {step}
        </div>
      {/each}
    </div>

    <div class="wizard-content">
      {#if currentStep === 1}
        <Step1PersonalInfo data={workflowData.personalInfo} on:next={handleNext} />
      {:else if currentStep === 2}
        <Step2CompanyInfo data={workflowData.companyInfo} on:next={handleNext} on:back={handleBack} />
      {:else if currentStep === 3}
        <Step3SiteDesign data={workflowData.siteContent} on:next={handleNext} on:back={handleBack} />
      {:else if currentStep === 4}
        <Step4LetterContent data={workflowData.letterContent} on:next={handleNext} on:back={handleBack} />
      {:else if currentStep === 5}
        <Step5Preview data={workflowData} on:submit={handleSubmit} on:back={handleBack} />
      {:else if currentStep === 6}
        <Step6Result {result} {isProcessing} on:close={handleClose} />
      {/if}
    </div>
  </div>
</div>

<style>
  .wizard-overlay {
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

  .wizard-container {
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .wizard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .wizard-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #999;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: #333;
  }

  .steps-indicator {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    background: #f5f5f5;
  }

  .step-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 2px solid #ccc;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .step-dot.active {
    border-color: #646cff;
    color: #646cff;
  }

  .step-dot.completed {
    background: #646cff;
    border-color: #646cff;
    color: white;
  }

  .wizard-content {
    padding: 2rem;
    overflow-y: auto;
    flex: 1;
  }
</style>
