import { query } from '@/config/database';
import type { Client } from '@/types';

interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  company: string;
  companyLogo?: string;
  assistantId?: string;
}

interface UpdateClientData extends Partial<CreateClientData> {}

class ClientModel {
  async createClient(data: CreateClientData): Promise<Client> {
    try {
      const sql = `
        INSERT INTO clients (
          name, email, phone, company, company_logo, assistant_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const result = await query(sql, [
        data.name,
        data.email,
        data.phone,
        data.company,
        data.companyLogo || null,
        data.assistantId || null,
      ]);

      const insertId = (result as any).insertId;
      return this.getClientById(insertId);
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error('Failed to create client');
    }
  }

  async getClients(): Promise<Client[]> {
    try {
      const sql = `
        SELECT 
          id,
          name,
          email,
          phone,
          company,
          company_logo as companyLogo,
          assistant_id as assistantId,
          created_at as createdAt,
          updated_at as updatedAt
        FROM clients
        ORDER BY created_at DESC
      `;

      const results = await query(sql);
      return results as Client[];
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new Error('Failed to fetch clients');
    }
  }

  async getClientById(id: string): Promise<Client> {
    try {
      const sql = `
        SELECT 
          id,
          name,
          email,
          phone,
          company,
          company_logo as companyLogo,
          assistant_id as assistantId,
          created_at as createdAt,
          updated_at as updatedAt
        FROM clients
        WHERE id = ?
      `;

      const results = await query(sql, [id]);
      const clients = results as Client[];
      
      if (clients.length === 0) {
        throw new Error('Client not found');
      }

      return clients[0];
    } catch (error) {
      console.error('Error fetching client:', error);
      throw new Error('Failed to fetch client');
    }
  }

  async updateClient(id: string, data: UpdateClientData): Promise<Client> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.name) {
        updates.push('name = ?');
        values.push(data.name);
      }
      if (data.email) {
        updates.push('email = ?');
        values.push(data.email);
      }
      if (data.phone) {
        updates.push('phone = ?');
        values.push(data.phone);
      }
      if (data.company) {
        updates.push('company = ?');
        values.push(data.company);
      }
      if (data.companyLogo !== undefined) {
        updates.push('company_logo = ?');
        values.push(data.companyLogo);
      }
      if (data.assistantId !== undefined) {
        updates.push('assistant_id = ?');
        values.push(data.assistantId);
      }

      if (updates.length === 0) {
        throw new Error('No updates provided');
      }

      const sql = `
        UPDATE clients
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = ?
      `;

      values.push(id);
      await query(sql, values);

      return this.getClientById(id);
    } catch (error) {
      console.error('Error updating client:', error);
      throw new Error('Failed to update client');
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      const sql = 'DELETE FROM clients WHERE id = ?';
      const result = await query(sql, [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw new Error('Failed to delete client');
    }
  }
}

export const clientModel = new ClientModel();