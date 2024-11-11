import { useState } from 'react';
import axios from 'axios';
import type { Customer } from '@/types';

interface UseCustomersReturn {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  fetchCustomers: (clientId: string) => Promise<void>;
  createCustomer: (customerData: CreateCustomerData) => Promise<void>;
  updateCustomer: (id: string, customerData: UpdateCustomerData) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

interface CreateCustomerData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  notes?: string;
  clientId: string;
}

interface UpdateCustomerData extends Partial<Omit<CreateCustomerData, 'clientId'>> {}

export function useCustomers(): UseCustomersReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async (clientId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/customers?clientId=${clientId}`);
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomer = async (customerData: CreateCustomerData) => {
    setError(null);
    try {
      const response = await axios.post('/api/customers', customerData);
      setCustomers(prev => [...prev, response.data]);
    } catch (err) {
      setError('Failed to create customer');
      console.error('Error creating customer:', err);
      throw err;
    }
  };

  const updateCustomer = async (id: string, customerData: UpdateCustomerData) => {
    setError(null);
    try {
      const response = await axios.put(`/api/customers/${id}`, customerData);
      setCustomers(prev =>
        prev.map(customer => (customer.id === id ? response.data : customer))
      );
    } catch (err) {
      setError('Failed to update customer');
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/customers/${id}`);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error deleting customer:', err);
      throw err;
    }
  };

  return {
    customers,
    isLoading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}