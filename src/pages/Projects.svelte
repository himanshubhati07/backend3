<script lang="ts">
  import { getProjects } from '../data/store';
  import type { Project } from '../types';

  let projects = $state<Project[]>([]);

  $effect(() => {
    getProjects().then((data) => {
      projects = data;
    });
  });
</script>

<div class="flex flex-col gap-6 p-6">
  <h1 class="text-3xl font-bold text-text">Projects</h1>

  {#if projects.length > 0}
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each projects as project (project.id)}
        <div class="rounded-lg border border-border bg-foreground p-6 hover:shadow-md transition">
          <h3 class="text-lg font-bold text-text">{project.name}</h3>
          <p class="mt-2 text-sm text-textSecondary">{project.description}</p>
          <div class="mt-4 flex items-center justify-between">
            <span
              class={`rounded-full px-3 py-1 text-xs font-medium ${
                project.status === 'active'
                  ? 'bg-green-50 text-success'
                  : 'bg-gray-100 text-textMuted'
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-textSecondary">No projects yet.</p>
  {/if}
</div>
