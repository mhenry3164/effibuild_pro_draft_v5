import { Edit2, Trash2 } from 'lucide-react';
import type { Client } from '@/types';

interface ClientTableProps {
  clients: Client[];
  isLoading: boolean;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export function ClientTable({ clients, isLoading, onUpdate, onDelete }: ClientTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Company
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Contact
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <div className="flex items-center">
                  {client.companyLogo ? (
                    <img
                      src={client.companyLogo}
                      alt={client.company}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      {client.company[0]}
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{client.company}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {client.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {client.email}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {client.phone}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onUpdate(client.id, client)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(client.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}