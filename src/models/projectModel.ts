import { query } from '@/config/database';
import type { Project } from '@/types';

interface CreateProjectData {
  name: string;
  clientId: string;
  status?: 'active' | 'completed' | 'pending';
}

interface UpdateProjectData {
  name?: string;
  status?: 'active' | 'completed' | 'pending';
}

class ProjectModel {
  async createProject(data: CreateProjectData): Promise<Project> {
    try {
      const sql = `
        INSERT INTO projects (name, client_id, status)
        VALUES (?, ?, ?)
      `;

      const result = await query(sql, [
        data.name,
        data.clientId,
        data.status || 'pending',
      ]);

      const insertId = (result as any).insertId;
      return this.getProjectById(insertId);
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  async getProjects(clientId?: string): Promise<Project[]> {
    try {
      let sql = `
        SELECT 
          id,
          name,
          status,
          client_id as clientId,
          created_at as createdAt,
          updated_at as updatedAt
        FROM projects
      `;

      const params: any[] = [];
      if (clientId) {
        sql += ' WHERE client_id = ?';
        params.push(clientId);
      }

      sql += ' ORDER BY created_at DESC';

      const results = await query(sql, params);
      return results as Project[];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  async getProjectById(id: string): Promise<Project> {
    try {
      const sql = `
        SELECT 
          id,
          name,
          status,
          client_id as clientId,
          created_at as createdAt,
          updated_at as updatedAt
        FROM projects
        WHERE id = ?
      `;

      const results = await query(sql, [id]);
      const projects = results as Project[];

      if (projects.length === 0) {
        throw new Error('Project not found');
      }

      return projects[0];
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }
  }

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.name) {
        updates.push('name = ?');
        values.push(data.name);
      }
      if (data.status) {
        updates.push('status = ?');
        values.push(data.status);
      }

      if (updates.length === 0) {
        throw new Error('No updates provided');
      }

      const sql = `
        UPDATE projects
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = ?
      `;

      values.push(id);
      await query(sql, values);

      return this.getProjectById(id);
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const sql = 'DELETE FROM projects WHERE id = ?';
      const result = await query(sql, [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }
}

export const projectModel = new ProjectModel();