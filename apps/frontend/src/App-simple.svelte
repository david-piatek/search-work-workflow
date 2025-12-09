<script>
  import axios from 'axios';

  let message = 'Click the button to call the backend';
  let loading = false;

  async function callBackend() {
    loading = true;
    try {
      const response = await axios.get('http://localhost:3001/api/hello');
      message = `✅ ${response.data.message} (at ${response.data.timestamp})`;
    } catch (error) {
      message = `❌ Error: ${error.message}`;
    } finally {
      loading = false;
    }
  }
</script>

<main>
  <h1>Hello World Frontend</h1>

  <div class="card">
    <p>{message}</p>

    <button on:click={callBackend} disabled={loading}>
      {loading ? 'Loading...' : '🚀 Call Backend'}
    </button>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 3rem;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #646cff;
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  .card {
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-top: 2rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    min-height: 3rem;
  }

  button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    background: #646cff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  button:hover:not(:disabled) {
    background: #535bf2;
    transform: translateY(-2px);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
