<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { Code2, History, Settings as SettingsIcon } from '@lucide/svelte';
  import { getProjectStats } from '../data/store';
  import type { ProjectStats } from '../types';

  let stats = $state<ProjectStats | null>(null);
  let activeTab = $state<'new' | 'history' | 'config'>('new');
  let projectName = $state('');
  let projectType = $state('');

  // Load project stats
  $effect(() => {
    getProjectStats().then((data) => {
      stats = data;
    });
  });

  function handleNewProject() {
    if (!projectName.trim()) {
      return;
    }
    // MOCK: Create new project (navigate for now)
    navigate('/projects');
  }

  function handleExistingProject() {
    navigate('/projects');
  }
</script>

<div class="flex flex-col gap-6 p-6">
  <!-- Breadcrumb -->
  <div class="flex items-center gap-2 text-sm">
    <span class="text-textSecondary">Home</span>
    <span class="text-textMuted">/</span>
    <span class="font-medium text-text">Frontend Agent</span>
  </div>

  <!-- Project Header -->
  <div class="flex items-start justify-between">
    <div class="flex items-start gap-4">
      <div class="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-2xl">
        ⚡
      </div>
      <div>
        <h1 class="text-3xl font-bold text-text">Frontend Agent</h1>
        <p class="mt-1 text-xs uppercase tracking-wide text-textMuted">
          Web & Native
        </p>
        <p class="mt-3 max-w-2xl text-sm text-textSecondary">
          Web and native in one place — React, Angular, Next.js, Vue, Svelte
          for the browser; Android and iOS as native builds. Generates UI code
          matched to your existing backend.
        </p>
      </div>
    </div>

    <!-- Status Badge -->
    <div class="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
      <div class="h-2 w-2 rounded-full bg-success"></div>
      <span class="text-sm font-medium text-success">Active</span>
    </div>
  </div>

  <!-- Stats Cards -->
  {#if stats}
    <div class="grid grid-cols-3 gap-4">
      <!-- Projects Card -->
      <div class="rounded-lg border border-border bg-foreground p-6">
        <p class="text-xs uppercase tracking-wide text-textMuted">Projects</p>
        <p class="mt-2 text-4xl font-bold text-text">{stats.projects}</p>
      </div>

      <!-- Runs Card -->
      <div class="rounded-lg border border-border bg-foreground p-6">
        <p class="text-xs uppercase tracking-wide text-textMuted">Runs</p>
        <p class="mt-2 text-4xl font-bold text-text">{stats.totalRuns}</p>
      </div>

      <!-- Last Run Card -->
      <div class="rounded-lg border border-border bg-foreground p-6">
        <p class="text-xs uppercase tracking-wide text-textMuted">Last Run</p>
        <p class="mt-2 text-4xl font-bold text-warning">{stats.lastRunDate}</p>
        <p class="mt-1 text-xs text-textMuted">completed • 3m 15s</p>
      </div>
    </div>
  {/if}

  <!-- Tabs Section -->
  <div class="rounded-lg border border-border bg-foreground">
    <!-- Tab Headers -->
    <div class="flex border-b border-border">
      <button
        onclick={() => (activeTab = 'new')}
        class={`flex items-center gap-2 border-b-2 px-6 py-4 font-medium transition ${
          activeTab === 'new'
            ? 'border-primary text-primary'
            : 'border-transparent text-textSecondary hover:text-text'
        }`}
      >
        <span>+ New project</span>
      </button>
      <button
        onclick={() => (activeTab = 'history')}
        class={`flex items-center gap-2 border-b-2 px-6 py-4 font-medium transition ${
          activeTab === 'history'
            ? 'border-primary text-primary'
            : 'border-transparent text-textSecondary hover:text-text'
        }`}
      >
        <History size={18} strokeWidth={1.5} />
        <span>History</span>
      </button>
      <button
        onclick={() => (activeTab = 'config')}
        class={`flex items-center gap-2 border-b-2 px-6 py-4 font-medium transition ${
          activeTab === 'config'
            ? 'border-primary text-primary'
            : 'border-transparent text-textSecondary hover:text-text'
        }`}
      >
        <SettingsIcon size={18} strokeWidth={1.5} />
        <span>LLM Configuration</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
      {#if activeTab === 'new'}
        <!-- New Project Tab -->
        <div class="space-y-6">
          <!-- Project Details Section -->
          <div>
            <div class="flex items-center gap-3 mb-6">
              <Code2 size={24} strokeWidth={1.5} class="text-text" />
              <h2 class="text-2xl font-bold text-text">Project details</h2>
            </div>
            <p class="mb-6 text-sm text-textSecondary">
              Set up the foundation of your frontend project.
            </p>

            <!-- Action Buttons -->
            <div class="mb-8 flex gap-4">
              <button
                onclick={handleNewProject}
                class="rounded-lg border-2 border-secondary bg-cyan-50 px-6 py-3 font-medium text-secondary hover:bg-cyan-100 transition"
              >
                New Project
              </button>
              <button
                onclick={handleExistingProject}
                class="rounded-lg border border-border bg-transparent px-6 py-3 font-medium text-text hover:bg-background transition"
              >
                Existing Project
              </button>
            </div>

            <!-- Form Fields -->
            <div class="space-y-6">
              <!-- Project Name -->
              <div>
                <label
                  for="projectName"
                  class="block text-xs uppercase tracking-wide text-textMuted"
                >
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="e.g. storefront-web"
                  bind:value={projectName}
                  class="mt-2 w-full max-w-md rounded-lg border border-border bg-background px-4 py-3 text-text placeholder-textMuted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <!-- Project Type -->
              <div>
                <label
                  for="projectType"
                  class="block text-xs uppercase tracking-wide text-textMuted"
                >
                  Project Type
                </label>
                <select
                  id="projectType"
                  bind:value={projectType}
                  class="mt-2 w-full max-w-md rounded-lg border border-border bg-background px-4 py-3 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a type</option>
                  <option value="react">React</option>
                  <option value="vue">Vue</option>
                  <option value="svelte">Svelte</option>
                  <option value="angular">Angular</option>
                  <option value="nextjs">Next.js</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === 'history'}
        <!-- History Tab -->
        <div class="py-8 text-center text-textSecondary">
          <p class="text-lg">No history yet. Create your first project!</p>
        </div>
      {:else if activeTab === 'config'}
        <!-- LLM Configuration Tab -->
        <div class="py-8 text-center text-textSecondary">
          <p class="text-lg">Configure your LLM settings here.</p>
        </div>
      {/if}
    </div>
  </div>
</div>
