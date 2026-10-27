// MOCK DATA — placeholder records for local development only.
// Replace with real API data before production use.

import type { Agent, Project, ProjectStats } from '../types';

// MOCK: Agents with statuses
export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Backend Agent',
    status: 'active',
    statusColor: 'green',
    icon: '⚙️',
  },
  {
    id: 'agent-2',
    name: 'Frontend Agent',
    status: 'active',
    statusColor: 'green',
    icon: '⚡',
  },
  {
    id: 'agent-3',
    name: 'IntegrationX',
    status: 'active',
    statusColor: 'orange',
    icon: '🔗',
  },
];

// MOCK: Projects list
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Frontend Agent',
    description:
      'Web and native in one place — React, Angular, Next.js, Vue, Svelte for the browser; Android and iOS as native builds. Generates UI code matched to your existing backend.',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-10-27T15:30:00Z',
  },
  {
    id: 'proj-2',
    name: 'Backend Agent',
    description: 'API generation and backend scaffolding tool.',
    status: 'active',
    createdAt: '2024-02-10T08:30:00Z',
    updatedAt: '2024-10-26T12:00:00Z',
  },
  {
    id: 'proj-3',
    name: 'Mobile Converter',
    description: 'Convert web designs to native mobile apps.',
    status: 'completed',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-09-30T14:45:00Z',
  },
];

// MOCK: Project statistics
export const mockProjectStats: ProjectStats = {
  completedRuns: 56,
  totalRuns: 100,
  lastRunDate: '10/27/2026',
  projects: 56,
};
