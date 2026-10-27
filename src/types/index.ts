export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  statusColor: 'green' | 'yellow' | 'orange';
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  completedRuns: number;
  totalRuns: number;
  lastRunDate: string;
  projects: number;
}

export interface ProjectTab {
  id: 'new' | 'history' | 'config';
  label: string;
  icon?: string;
}

export interface FormField {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'number';
  required: boolean;
}
