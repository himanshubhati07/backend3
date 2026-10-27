<script lang="ts">
  import { Link } from 'svelte-routing';
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import { themeState } from '../theme/theme.svelte';
</script>

<main
  class="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center text-text transition-colors"
>
  <h1 class="text-2xl font-bold">Theme</h1>
  <p class="text-textSecondary" role="status">
    Current theme: <strong class="text-text">{themeState.mode}</strong>
  </p>
  <ThemeToggle size="lg" />
  <Link to="/home" class="text-sm text-toggleAccent underline">Open dashboard</Link>
</main>
