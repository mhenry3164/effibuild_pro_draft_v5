export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: '/users',
  CLIENTS: '/clients',
  PROJECTS: '/projects',
  ESTIMATES: '/estimates',
  ROLES: '/roles',
  MATERIALS: '/materials',
  AI: {
    THREADS: '/ai/threads',
    MESSAGES: '/ai/messages',
    ACTIONS: '/ai/actions',
  },
};

export const OPENAI_ASSISTANT_ID = 'asst_4pPHFBQccM4fNvXyQLBYHxZx';

export const AI_QUICK_ACTIONS = {
  ESTIMATE: {
    id: 'estimate',
    label: 'Create Estimate',
    prompt: 'Help me create a new construction estimate.',
  },
  MATERIALS: {
    id: 'materials',
    label: 'Material Calculator',
    prompt: 'Calculate required materials for my project.',
  },
  COSTS: {
    id: 'costs',
    label: 'Cost Analysis',
    prompt: 'Analyze costs for my construction project.',
  },
} as const;