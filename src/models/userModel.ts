import { query } from '@/config/database';
import type { User, Role } from '@/types/auth';

interface CreateUserData {
  email: string;
  name: string;
  password: string; // Note: This should be pre-hashed before reaching this function
  role: Role;
  clientId?: string;
}

interface UpdateUserData {
  email?: string;
  name?: string;
  role?: Role;
  clientId?: string;
}

class UserModel {
  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const { email, name, password, role, clientId } = userData;
      
      const sql = `
        INSERT INTO users (email, name, password, role, client_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      const result = await query(sql, [email, name, password, role, clientId]);
      const insertId = (result as any).insertId;

      // Fetch the created user
      const user = await this.getUserById(insertId);
      if (!user) throw new Error('Failed to create user');

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Get all users with optional filtering
   */
  async getUsers(filters?: { role?: Role; clientId?: string }): Promise<User[]> {
    try {
      let sql = `
        SELECT 
          id, email, name, role, client_id as clientId,
          created_at as createdAt, updated_at as updatedAt
        FROM users
        WHERE 1=1
      `;
      
      const params: any[] = [];

      if (filters?.role) {
        sql += ' AND role = ?';
        params.push(filters.role);
      }

      if (filters?.clientId) {
        sql += ' AND client_id = ?';
        params.push(filters.clientId);
      }

      sql += ' ORDER BY created_at DESC';

      const users = await query(sql, params);
      return users as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const sql = `
        SELECT 
          id, email, name, role, client_id as clientId,
          created_at as createdAt, updated_at as updatedAt
        FROM users
        WHERE id = ?
      `;
      
      const results = await query(sql, [id]);
      const users = results as User[];
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Get a single user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const sql = `
        SELECT 
          id, email, name, role, client_id as clientId,
          created_at as createdAt, updated_at as updatedAt
        FROM users
        WHERE email = ?
      `;
      
      const results = await query(sql, [email]);
      const users = results as User[];
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Update a user's details
   */
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      // Build dynamic update query
      if (userData.email) {
        updates.push('email = ?');
        values.push(userData.email);
      }
      if (userData.name) {
        updates.push('name = ?');
        values.push(userData.name);
      }
      if (userData.role) {
        updates.push('role = ?');
        values.push(userData.role);
      }
      if (userData.clientId !== undefined) {
        updates.push('client_id = ?');
        values.push(userData.clientId);
      }

      updates.push('updated_at = NOW()');

      if (updates.length === 0) {
        throw new Error('No updates provided');
      }

      const sql = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = ?
      `;

      values.push(id);
      await query(sql, values);

      // Fetch and return the updated user
      const updatedUser = await this.getUserById(id);
      if (!updatedUser) throw new Error('User not found after update');

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Delete a user by ID
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const sql = 'DELETE FROM users WHERE id = ?';
      const result = await query(sql, [id]);
      
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Verify user credentials
   */
  async verifyCredentials(email: string, hashedPassword: string): Promise<User | null> {
    try {
      const sql = `
        SELECT 
          id, email, name, role, client_id as clientId,
          created_at as createdAt, updated_at as updatedAt
        FROM users
        WHERE email = ? AND password = ?
      `;
      
      const results = await query(sql, [email, hashedPassword]);
      const users = results as User[];
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error verifying credentials:', error);
      throw new Error('Failed to verify credentials');
    }
  }
}

export const userModel = new UserModel();