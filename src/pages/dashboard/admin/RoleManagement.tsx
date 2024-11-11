import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { RoleForm } from '@/components/role/RoleForm';
import {
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
} from 'lucide-react';
import type { Role, RoleDefinition } from '@/types/auth';

export function RoleManagement() {
  const { user, hasPermission } = useAuth();
  const {
    roles,
    isLoading,
    error: apiError,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  } = useRoles();

  const [isAddingRole, setIsAddingRole] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  if (!hasPermission('roles:manage')) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>You don't have permission to manage roles.</span>
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (formData: any) => {
    setFormError(null);

    try {
      if (editingRole) {
        await updateRole(editingRole.name as Role, {
          displayName: formData.displayName,
          description: formData.description,
          permissions: formData.permissions,
        });
      } else {
        await createRole({
          ...formData,
          clientId: user?.clientId,
        });
      }

      setIsAddingRole(false);
      setEditingRole(null);
      fetchRoles();
    } catch (err) {
      setFormError(
        editingRole ? 'Failed to update role' : 'Failed to create role'
      );
    }
  };

  const handleEdit = (role: RoleDefinition) => {
    setEditingRole(role);
    setIsAddingRole(true);
  };

  const handleDelete = async (roleName: Role) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      await deleteRole(roleName);
      fetchRoles();
    } catch (err) {
      // Error is handled by useRoles hook
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600">Manage roles and their permissions</p>
        </div>
        {!isAddingRole && (
          <Button onClick={() => setIsAddingRole(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Role
          </Button>
        )}
      </div>

      {(apiError || formError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <span>{apiError || formError}</span>
        </Alert>
      )}

      {isAddingRole ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RoleForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsAddingRole(false);
                setEditingRole(null);
              }}
              initialData={editingRole}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.name}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {role.displayName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {role.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {role.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(role)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {role.name !== 'master_admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(role.name as Role)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}