import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import {
  AlertCircle,
  Save,
  FileText,
  Trash2,
  Edit2,
  Download,
} from 'lucide-react';
import {
  getEstimate,
  updateEstimate,
  deleteEstimate,
  generateEstimatePDF,
} from '@/services/estimateService';
import type { Estimate, EstimateMaterial } from '@/types';

export function EstimateDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEstimate(id);
    }
  }, [id]);

  const loadEstimate = async (estimateId: string) => {
    try {
      const data = await getEstimate(estimateId);
      setEstimate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load estimate');
    }
  };

  const handleSave = async () => {
    if (!estimate || !id) return;

    setIsSaving(true);
    setError(null);

    try {
      const updated = await updateEstimate(id, {
        materials: estimate.materials,
        notes: estimate.notes,
      });
      setEstimate(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save estimate');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this estimate?')) {
      return;
    }

    try {
      await deleteEstimate(id);
      navigate('/dashboard/estimates');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete estimate');
    }
  };

  const handleGeneratePDF = async () => {
    if (!id) return;

    try {
      const blob = await generateEstimatePDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estimate-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    }
  };

  const updateMaterial = (index: number, updates: Partial<EstimateMaterial>) => {
    if (!estimate) return;

    const updatedMaterials = [...estimate.materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      ...updates,
      totalPrice:
        updates.quantity !== undefined && updates.unitPrice !== undefined
          ? updates.quantity * updates.unitPrice
          : updates.quantity !== undefined
          ? updates.quantity * updatedMaterials[index].unitPrice
          : updates.unitPrice !== undefined
          ? updates.unitPrice * updatedMaterials[index].quantity
          : updatedMaterials[index].totalPrice,
    };

    setEstimate({
      ...estimate,
      materials: updatedMaterials,
      totalCost: updatedMaterials.reduce((sum, m) => sum + m.totalPrice, 0),
    });
  };

  if (!estimate) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error || 'Loading estimate...'}</span>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estimate Details</h1>
          <p className="text-gray-600">Manage estimate information and materials</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Estimate
              </Button>
              <Button onClick={handleGeneratePDF} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Material
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {estimate.materials.map((material, index) => (
                    <tr key={material.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {isEditing ? (
                          <input
                            type="text"
                            value={material.name}
                            onChange={(e) =>
                              updateMaterial(index, { name: e.target.value })
                            }
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          material.name
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {isEditing ? (
                          <input
                            type="text"
                            value={material.description || ''}
                            onChange={(e) =>
                              updateMaterial(index, { description: e.target.value })
                            }
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          material.description
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {isEditing ? (
                          <input
                            type="number"
                            value={material.quantity}
                            onChange={(e) =>
                              updateMaterial(index, {
                                quantity: parseFloat(e.target.value),
                              })
                            }
                            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          material.quantity
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {material.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {isEditing ? (
                          <input
                            type="number"
                            value={material.unitPrice}
                            onChange={(e) =>
                              updateMaterial(index, {
                                unitPrice: parseFloat(e.target.value),
                              })
                            }
                            className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          `$${material.unitPrice.toFixed(2)}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        ${material.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-3 text-right font-semibold text-gray-900"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ${estimate.totalCost.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <textarea
                value={estimate.notes || ''}
                onChange={(e) =>
                  setEstimate({ ...estimate, notes: e.target.value })
                }
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-600">{estimate.notes || 'No notes'}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}