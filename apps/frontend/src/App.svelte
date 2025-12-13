<script>
  import { onMount } from 'svelte';
  import JobOfferManager from './components/JobOfferManager.svelte';
  import OfferPage from './components/OfferPage.svelte';

  let currentPath = window.location.pathname;
  let slug = null;

  // Détecter les changements de route
  function updateRoute() {
    currentPath = window.location.pathname;

    // Si c'est la racine, pas de slug
    if (currentPath === '/') {
      slug = null;
    } else {
      // Extraire le slug du path (ex: /mon-offre -> mon-offre)
      slug = currentPath.substring(1);
    }
  }

  onMount(() => {
    updateRoute();

    // Gérer les changements de route (navigation via <a href>)
    window.addEventListener('popstate', updateRoute);

    // Intercepter les clics sur les liens pour éviter le rechargement de la page
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a');

      // Ignorer si:
      // - pas un lien
      // - lien externe
      // - target="_blank"
      // - modification key pressed (ctrl, cmd, etc.)
      if (
        !target ||
        !target.href ||
        !target.href.startsWith(window.location.origin) ||
        target.target === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      e.preventDefault();
      const newPath = target.getAttribute('href');
      window.history.pushState({}, '', newPath);
      updateRoute();
    });

    return () => {
      window.removeEventListener('popstate', updateRoute);
    };
  });
</script>

<main>
  {#if slug}
    <OfferPage {slug} />
  {:else}
    <JobOfferManager />
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  }

  :global(body) {
    margin: 0;
    padding: 0;
    color: #2c3e50;
  }
</style>
