import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEstimates } from '@/hooks/useEstimates';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import {
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Send,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { Estimate, EstimateItem } from '@/types';

interface EstimateFormData {
  projectId: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  items: Array<{
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

const INITIAL_FORM_DATA: EstimateFormData = {
  projectId: '',
  status: 'draft',
  items: [
    {
      description: '',
      quantity: 1,
      unitPrice: 0,
    },
  ],
};

const STATUS_ICONS = {
  draft: FileText,
  sent: Send,
  approved: CheckCircle,
  rejected: XCircle,
};

export function EstimateManagement() {
  const { user, hasPermission } = useAuth();
  const {
    estimates,
    isLoading,
    error: apiError,
    fetchEstimates,
    createEstimate,
    updateEstimate,
    deleteEstimate,
  } = useEstimates();

  const [isAddingEstimate, setIsAddingEstimate] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [formData, setFormData] = useState<EstimateFormData>(INITIAL_FORM_DATA);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.clientId) {
      fetchEstimates(user.clientId);
    }
  }, [user?.clientId]);

  if (!hasPermission('estimates:read')) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>You don't have permission to manage estimates.</span>
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (editingEstimate) {
        await updateEstimate(editingEstimate.id, {
          status: formData.status,
          items: formData.items,
        });
      } else {
        await createEstimate(formData);
      }

      setIsAddingEstimate(false);
      setEditingEstimate(null);
      setFormData(INITIAL_FORM_DATA);
      fetchEstimates(user?.clientId);
    } catch (err) {
      setFormError(
        editingEstimate ? 'Failed to update estimate' : 'Failed to create estimate'
      );
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof EstimateItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === 'description' ? value : Number(value),
            }
          : item
      ),
    }));
  };

  const calculateTotal = (items: EstimateItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const handleEdit = (estimate: Estimate) => {
    setEditingEstimate(estimate);
    setFormData({
      projectId: estimate.projectId,
      status: estimate.status,
      items: estimate.items,
    });
    setIsAddingEstimate(true);
  };

  const handleDelete = async (estimateId: string) => {
    if (!window.confirm('Are you sure you want to delete this estimate?')) {
      return;
    }

    try {
      await deleteEstimate(estimateId);
      fetchEstimates(user?.clientId);
    } catch (err) {
      // Error is handled by useEstimates hook
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estimate Management</h1>
          <p className="text-gray-600">Create and manage project estimates</p>
        </div>
        {hasPermission('estimates:create') && !isAddingEstimate && (
          <Button onClick={() => setIsAddingEstimate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Estimate
          </Button>
        )}
      </div>

      {(apiError || formError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <span>{apiError || formError}</span>
        </Alert>
      )}

      {isAddingEstimate && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingEstimate ? 'Edit Estimate' : 'Create New Estimate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as EstimateFormData['status'],
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Items</h3>
                  <Button type="button" variant="outline" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-start border rounded-lg p-4"
                  >
                    <div className="col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, 'description', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, 'quantity', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, 'unitPrice', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-1 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total: ${calculateTotal(formData.items).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingEstimate(false);
                    setEditingEstimate(null);
                    setFormData(INITIAL_FORM_DATA);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEstimate ? 'Update Estimate' : 'Create Estimate'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Project
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {estimates.map((estimate) => {
                    const StatusIcon = STATUS_ICONS[estimate.status];
                    return (
                      <tr key={estimate.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {estimate.projectId}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex items-center">
                            <StatusIcon className="h-4 w-4 mr-2" />
                            <span
                              className={`capitalize ${
                                estimate.status === 'approved'
                                  ? 'text-green-600'
                                  : estimate.status === 'rejected'
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              {estimate.status}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          ${estimate.total.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(estimate.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex space-x-2">
                            {hasPermission('estimates:update') && (
                              <button
                                onClick={() => handleEdit(estimate)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {hasPermission('estimates:delete') && (
                              <button
                                onClick={() => handleDelete(estimate.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}