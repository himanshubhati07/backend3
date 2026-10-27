<script lang="ts">
  import { Link } from 'svelte-routing';
</script>

<div class="flex h-screen items-center justify-center bg-background">
  <div class="text-center">
    <h1 class="text-6xl font-bold text-text">404</h1>
    <p class="mt-4 text-xl text-textSecondary">Page not found</p>
    <Link
      to="/"
      class="mt-8 inline-block rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-blue-600 transition"
    >
      Go Home
    </Link>
  </div>
</div>
