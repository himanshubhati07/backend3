<script lang="ts">
  import { Link } from 'svelte-routing';
  import {
    Home,
    FolderOpen,
    Wifi,
    Users,
    BookOpen,
    Cog,
  } from '@lucide/svelte';
  import { getAgents } from '../data/store';

  let agents: any[] = [];
  let agentStatus = $state<Record<string, string>>({});

  // Load agents data
  $effect(() => {
    getAgents().then((data) => {
      agents = data;
      data.forEach((agent: any) => {
        agentStatus[agent.id] = agent.statusColor;
      });
    });
  });

  const navItems = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Projects', to: '/projects', icon: FolderOpen },
    { label: 'Connections', to: '/connections', icon: Wifi },
    { label: 'Team & Access', to: '/team', icon: Users },
    { label: 'Harness Learning', to: '/learning', icon: BookOpen },
  ];

  const cognitiveAgents = [
    { id: 'agent-1', label: 'Backend Agent', to: '/agent/1' },
    { id: 'agent-2', label: 'Frontend Agent', to: '/agent/2' },
    { id: 'agent-3', label: 'IntegrationX', to: '/agent/3' },
  ];

  function getStatusDot(agentId: string) {
    const color = agentStatus[agentId];
    const colorMap: Record<string, string> = {
      green: 'bg-success',
      yellow: 'bg-warning',
      orange: 'bg-orange-500',
      red: 'bg-danger',
    };
    return colorMap[color] || 'bg-gray-400';
  }
</script>

<aside
  class="w-sidebar flex flex-col border-r border-border bg-surface px-4 py-6"
>
  <!-- Logo -->
  <div class="mb-8 flex items-center gap-3">
    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">
      X
    </div>
    <h1 class="text-xl font-semibold text-text">XCore</h1>
  </div>

  <!-- Main Navigation -->
  <nav class="mb-8 flex flex-1 flex-col gap-2">
    {#each navItems as item (item.to)}
      <Link
        to={item.to}
        getProps={({ isCurrent }) => ({
          class: isCurrent
            ? 'flex items-center gap-3 rounded-lg px-3 py-2 bg-primary text-white font-medium'
            : 'flex items-center gap-3 rounded-lg px-3 py-2 text-textSecondary hover:bg-white/50 transition',
        })}
      >
        {#if item.icon}
        <item.icon size={20} strokeWidth={1.5} />
      {/if}
      <span>{item.label}</span>
      </Link>
    {/each}

    <!-- Notification Badge -->
    <Link
      to="/team"
      getProps={({ isCurrent }) => ({
        class: isCurrent
          ? 'flex items-center gap-3 rounded-lg px-3 py-2 bg-primary text-white font-medium'
          : 'relative flex items-center gap-3 rounded-lg px-3 py-2 text-textSecondary hover:bg-white/50 transition',
      })}
    >
      <Users size={20} strokeWidth={1.5} />
      <span>Team & Access</span>
      <span class="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-danger text-xs font-semibold text-white">
        1
      </span>
    </Link>
  </nav>

  <!-- Cognitive Suite Section -->
  <div class="border-t border-border pt-4">
    <p class="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-textMuted">
      Cognitive Suite
    </p>
    <nav class="flex flex-col gap-2">
      {#each cognitiveAgents as agent (agent.id)}
        <Link
          to={agent.to}
          getProps={({ isCurrent }) => ({
            class: isCurrent
              ? 'flex items-center gap-3 rounded-lg px-3 py-2 bg-primary text-white font-medium'
              : 'flex items-center gap-3 rounded-lg px-3 py-2 text-textSecondary hover:bg-white/50 transition',
          })}
        >
          <div class={`h-2 w-2 rounded-full ${getStatusDot(agent.id)}`}></div>
        <span>{agent.label}</span>
        </Link>
      {/each}
    </nav>
  </div>

  <!-- Settings -->
  <div class="border-t border-border pt-4">
    <Link
      to="/settings"
      getProps={({ isCurrent }) => ({
        class: isCurrent
          ? 'flex items-center gap-3 rounded-lg px-3 py-2 bg-primary text-white font-medium'
          : 'flex items-center gap-3 rounded-lg px-3 py-2 text-textSecondary hover:bg-white/50 transition',
      })}
    >
      <Cog size={20} strokeWidth={1.5} />
      <span>Settings</span>
    </Link>
  </div>
</aside>
