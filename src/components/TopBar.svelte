<script lang="ts">
  import { Bell, Search } from '@lucide/svelte';
  import ThemeToggle from './ThemeToggle.svelte';
</script>

<header class="border-b border-border bg-foreground">
  <div class="flex items-center justify-between px-6 py-4">
    <!-- Search Bar -->
    <div class="flex-1">
      <div class="relative max-w-sm">
        <Search
          size={18}
          strokeWidth={1.5}
          class="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
        />
        <input
          type="text"
          placeholder="Search XCore..."
          class="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-text placeholder-textMuted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>

    <!-- Right Actions -->
    <div class="ml-8 flex items-center gap-4">
      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- Notifications -->
      <button
        class="relative rounded-lg p-2 text-textSecondary hover:bg-background transition"
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={1.5} />
        <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger"></span>
      </button>

      <!-- User Avatar -->
      <button
        class="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white"
        aria-label="User menu"
      >
        H
      </button>
    </div>
  </div>
</header>
