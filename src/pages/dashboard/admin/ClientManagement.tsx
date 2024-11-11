import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { ClientForm } from '@/components/forms/ClientForm';
import { ClientTable } from '@/components/tables/ClientTable';
import { AlertCircle, Plus } from 'lucide-react';
import type { Client } from '@/types';

export function ClientManagement() {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { clients, error, isLoading, createClient, updateClient, deleteClient } = useClients();

  const handleAddClient = async (clientData: any) => {
    try {
      await createClient(clientData);
      setIsAddingClient(false);
    } catch (error) {
      console.error('Failed to add client:', error);
    }
  };

  const handleUpdateClient = async (id: string, clientData: any) => {
    try {
      await updateClient(id, clientData);
      setEditingClient(null);
      setIsAddingClient(false);
    } catch (error) {
      console.error('Failed to update client:', error);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      await deleteClient(id);
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsAddingClient(true);
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage your organization's clients</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      {isAddingClient ? (
        <Card className="mb-6">
          <ClientForm
            onSubmit={editingClient ? 
              (data) => handleUpdateClient(editingClient.id, data) : 
              handleAddClient}
            onCancel={() => {
              setIsAddingClient(false);
              setEditingClient(null);
            }}
            initialData={editingClient}
          />
        </Card>
      ) : (
        <Button
          onClick={() => setIsAddingClient(true)}
          className="mb-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      )}

      <Card>
        <ClientTable
          clients={clients}
          isLoading={isLoading}
          onUpdate={handleEdit}
          onDelete={handleDeleteClient}
        />
      </Card>
    </Container>
  );
}