<script lang="ts">
  import { initTheme } from '../theme/theme.svelte';

  let { children } = $props();

  // Apply the persisted theme as soon as the provider mounts.
  initTheme();
</script>

{@render children()}
