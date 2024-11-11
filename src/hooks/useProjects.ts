import { useState } from 'react';
import axios from 'axios';
import type { Project } from '@/types';

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: (clientId?: string) => Promise<void>;
  createProject: (projectData: CreateProjectData) => Promise<void>;
  updateProject: (id: string, projectData: UpdateProjectData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

interface CreateProjectData {
  name: string;
  clientId: string;
  status?: 'active' | 'completed' | 'pending';
}

interface UpdateProjectData {
  name?: string;
  status?: 'active' | 'completed' | 'pending';
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async (clientId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = clientId ? { clientId } : {};
      const response = await axios.get('/api/projects', { params });
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: CreateProjectData) => {
    setError(null);
    try {
      const response = await axios.post('/api/projects', projectData);
      setProjects(prevProjects => [...prevProjects, response.data]);
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
      throw err;
    }
  };

  const updateProject = async (id: string, projectData: UpdateProjectData) => {
    setError(null);
    try {
      const response = await axios.put(`/api/projects/${id}`, projectData);
      setProjects(prevProjects =>
        prevProjects.map(project => (project.id === id ? response.data : project))
      );
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}