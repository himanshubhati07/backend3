<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  let { to }: { to: string } = $props();

  onMount(() => {
    setTimeout(() => navigate(to, { replace: true }), 0);
  });
</script>
