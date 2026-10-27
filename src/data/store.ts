import { apiClient } from '../api/client';
import { mockAgents, mockProjects, mockProjectStats } from './mockData';
import type { Agent, Project, ProjectStats } from '../types';

// TODO(USE_MOCK): verify path + response shape against the real backend's
// OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

// ============================================================================
// AGENTS
// ============================================================================

// MOCK: Local agents retrieval
function localGetAgents(): Agent[] {
  return mockAgents;
}

/**
 * Get all agents
 */
export async function getAgents(): Promise<Agent[]> {
  if (USE_MOCK) return localGetAgents();
  const res = await apiClient.get('/api/v1/agents');
  return res.data;
}

// ============================================================================
// PROJECTS
// ============================================================================

// MOCK: Local projects retrieval
function localGetProjects(): Project[] {
  const raw = localStorage.getItem('projects');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('projects', JSON.stringify(mockProjects));
  return mockProjects;
}

// MOCK: Local single project retrieval
function localGetProject(id: string): Project | undefined {
  return localGetProjects().find((p) => p.id === id);
}

/**
 * Get all projects
 */
export async function getProjects(): Promise<Project[]> {
  if (USE_MOCK) return localGetProjects();
  const res = await apiClient.get('/api/v1/projects');
  return res.data;
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<Project | undefined> {
  if (USE_MOCK) return localGetProject(id);
  const res = await apiClient.get(`/api/v1/projects/${id}`);
  return res.data;
}

/**
 * Create a new project
 */
export async function createProject(
  input: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> {
  if (USE_MOCK) {
    const all = localGetProjects();
    const now = new Date().toISOString();
    const project: Project = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    all.unshift(project);
    localStorage.setItem('projects', JSON.stringify(all));
    return project;
  }
  const res = await apiClient.post('/api/v1/projects', input);
  return res.data;
}

// ============================================================================
// PROJECT STATS
// ============================================================================

// MOCK: Local stats retrieval
function localGetProjectStats(): ProjectStats {
  return mockProjectStats;
}

/**
 * Get project statistics
 */
export async function getProjectStats(): Promise<ProjectStats> {
  if (USE_MOCK) return localGetProjectStats();
  const res = await apiClient.get('/api/v1/projects/stats');
  return res.data;
}
