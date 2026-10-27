<script lang="ts">
  let { id }: { id: string } = $props();

  const agents: Record<string, string> = {
    '1': 'Backend Agent',
    '2': 'Frontend Agent',
    '3': 'IntegrationX',
  };

  let agentName = $derived(agents[id] || 'Unknown Agent');
</script>

<div class="flex flex-col gap-6 p-6">
  <button
    onclick={() => history.back()}
    class="w-fit text-sm text-primary hover:underline"
  >
    ← Back
  </button>
  <h1 class="text-3xl font-bold text-text">{agentName}</h1>
  <p class="text-textSecondary">Agent details and configuration.</p>
</div>
