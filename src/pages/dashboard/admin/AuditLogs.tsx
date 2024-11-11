import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { AlertCircle, Download } from 'lucide-react';
import type { AuditLog } from '@/types/auth';

export function AuditLogs() {
  const { hasPermission } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // TODO: Implement actual API call
        const mockLogs: AuditLog[] = [
          {
            id: '1',
            adminId: '1',
            action: 'update',
            targetUserId: '2',
            roleChanged: {
              from: 'project_manager',
              to: 'admin',
            },
            timestamp: new Date(),
          },
          // Add more mock logs as needed
        ];
        setLogs(mockLogs);
      } catch (err) {
        setError('Failed to fetch audit logs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (!hasPermission('audit:read')) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <span>You don't have permission to view audit logs.</span>
      </Alert>
    );
  }

  const handleExport = async () => {
    if (!hasPermission('audit:export')) {
      setError('You don\'t have permission to export audit logs');
      return;
    }
    
    // TODO: Implement export functionality
    console.log('Exporting logs:', logs);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Track system changes and user activities</p>
        </div>
        {hasPermission('audit:export') && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export Logs
          </button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </p>
                      {log.roleChanged && (
                        <p className="text-sm text-gray-600">
                          Role changed from {log.roleChanged.from} to{' '}
                          {log.roleChanged.to}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {log.timestamp.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}