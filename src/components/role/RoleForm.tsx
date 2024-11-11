import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import type { Permission, RoleDefinition } from '@/types/auth';

interface RoleFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: RoleDefinition | null;
}

const PERMISSION_GROUPS = {
  Quotes: [
    { id: 'quotes:read', label: 'View Quotes' },
    { id: 'quotes:create', label: 'Create Quotes' },
    { id: 'quotes:update', label: 'Update Quotes' },
    { id: 'quotes:delete', label: 'Delete Quotes' },
  ],
  Clients: [
    { id: 'clients:read', label: 'View Clients' },
    { id: 'clients:create', label: 'Create Clients' },
    { id: 'clients:update', label: 'Update Clients' },
    { id: 'clients:delete', label: 'Delete Clients' },
  ],
  Analytics: [
    { id: 'analytics:read', label: 'View Analytics' },
    { id: 'analytics:export', label: 'Export Analytics' },
  ],
  Users: [
    { id: 'users:read', label: 'View Users' },
    { id: 'users:create', label: 'Create Users' },
    { id: 'users:update', label: 'Update Users' },
    { id: 'users:delete', label: 'Delete Users' },
  ],
  System: [
    { id: 'roles:manage', label: 'Manage Roles' },
    { id: 'roles:manage:all', label: 'Manage All Roles' },
    { id: 'audit:read', label: 'View Audit Logs' },
    { id: 'audit:export', label: 'Export Audit Logs' },
  ],
};

export function RoleForm({ onSubmit, onCancel, initialData }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    permissions: [] as Permission[],
    isClientSpecific: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        displayName: initialData.displayName,
        description: initialData.description,
        permissions: initialData.permissions,
        isClientSpecific: initialData.isClientSpecific ?? true,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionToggle = (permission: Permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!initialData && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Display Name
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Permissions
        </label>
        {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => (
          <div key={group} className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {group}
            </h4>
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {permission.label}
                    </span>
                  </div>
                  <Switch
                    checked={formData.permissions.includes(permission.id as Permission)}
                    onCheckedChange={() => handlePermissionToggle(permission.id as Permission)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
}