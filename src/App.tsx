import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Demo } from './pages/Demo';
import { Updates } from './pages/Updates';
import { AIFeatures } from './pages/updates/AIFeatures';
import { Dashboard } from './pages/dashboard/Dashboard';
import { AIAssistant } from './pages/dashboard/AIAssistant';
import { EstimateManagement } from './pages/dashboard/EstimateManagement';
import { CustomerManagement } from './pages/dashboard/CustomerManagement';
import { ProjectManagement } from './pages/dashboard/ProjectManagement';
import { TakeoffTool } from './pages/dashboard/TakeoffTool';
import { UserManagement } from './pages/dashboard/admin/UserManagement';
import { RoleManagement } from './pages/dashboard/admin/RoleManagement';
import { ClientManagement } from './pages/dashboard/admin/ClientManagement';
import { AuditLogs } from './pages/dashboard/admin/AuditLogs';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/updates/ai" element={<AIFeatures />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="estimates" element={<EstimateManagement />} />
          <Route path="takeoff" element={<TakeoffTool />} />
          
          {/* Admin routes */}
          <Route
            path="admin/users"
            element={
              <ProtectedRoute permissions={['users:read']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/roles"
            element={
              <ProtectedRoute permissions={['roles:manage']}>
                <RoleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/clients"
            element={
              <ProtectedRoute permissions={['clients:read']}>
                <ClientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/audit-logs"
            element={
              <ProtectedRoute permissions={['audit:read']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}