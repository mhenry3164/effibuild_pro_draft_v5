import { useState, useEffect } from 'react';
import type { Client } from '@/types';

// Mock data for development until database is connected
const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Terrell Pearson',
    email: 'mhenry3164@gmail.com',
    phone: '662-424-1001',
    company: 'Pearson Construction',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

interface UseClientsReturn {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  createClient: (clientData: CreateClientData) => Promise<void>;
  updateClient: (id: string, clientData: UpdateClientData) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  company: string;
  companyLogo?: string;
  assistantId?: string;
}

interface UpdateClientData extends Partial<CreateClientData> {}

export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, use mock data
      setClients(INITIAL_CLIENTS);
    } catch (err) {
      setError('Failed to fetch clients');
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (clientData: CreateClientData) => {
    setError(null);
    try {
      const newClient: Client = {
        id: (clients.length + 1).toString(),
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setClients(prev => [...prev, newClient]);
    } catch (err) {
      setError('Failed to create client');
      console.error('Error creating client:', err);
      throw err;
    }
  };

  const updateClient = async (id: string, clientData: UpdateClientData) => {
    setError(null);
    try {
      setClients(prev =>
        prev.map(client =>
          client.id === id
            ? { ...client, ...clientData, updatedAt: new Date() }
            : client
        )
      );
    } catch (err) {
      setError('Failed to update client');
      console.error('Error updating client:', err);
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    setError(null);
    try {
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      setError('Failed to delete client');
      console.error('Error deleting client:', err);
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}