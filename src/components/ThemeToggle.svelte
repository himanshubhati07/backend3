<script lang="ts">
  import { Sun, Moon } from '@lucide/svelte';
  import { themeState, toggleTheme } from '../theme/theme.svelte';

  let { size = 'md' }: { size?: 'md' | 'lg' } = $props();

  let isDark = $derived(themeState.mode === 'dark');
  let label = $derived(
    isDark ? 'Dark mode is on. Switch to light mode' : 'Light mode is on. Switch to dark mode',
  );
</script>

<button
  type="button"
  onclick={toggleTheme}
  aria-label={label}
  aria-pressed={isDark}
  title={label}
  class={size === 'lg'
    ? 'flex items-center gap-3 rounded-full bg-toggleAccent px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-toggleAccent focus-visible:ring-offset-2'
    : 'flex items-center gap-2 rounded-lg border border-toggleAccent p-2 text-toggleAccent transition hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-toggleAccent'}
>
  {#if isDark}
    <Sun size={size === 'lg' ? 24 : 20} strokeWidth={1.75} />
  {:else}
    <Moon size={size === 'lg' ? 24 : 20} strokeWidth={1.75} />
  {/if}
  {#if size === 'lg'}
    <span>{isDark ? 'Switch to light' : 'Switch to dark'}</span>
  {/if}
</button>
