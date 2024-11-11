import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  HomeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClipboardIcon,
  BuildingOffice2Icon,
  Square3Stack3DIcon,
  ArrowLeftOnRectangleIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import { PermissionGate } from '../auth/PermissionGate';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderIcon },
  { name: 'Estimates', href: '/dashboard/estimates', icon: ClipboardIcon },
  { name: 'Takeoff Tool', href: '/dashboard/takeoff', icon: Square3Stack3DIcon },
  { name: 'AI Assistant', href: '/dashboard/ai-assistant', icon: ChatBubbleLeftRightIcon },
];

const platformAdminNavigation = [
  { 
    name: 'Clients',
    href: '/dashboard/admin/clients',
    icon: BuildingOffice2Icon,
    permission: 'clients:read' as const,
  },
  { 
    name: 'Platform Users',
    href: '/dashboard/admin/users',
    icon: UsersIcon,
    permission: 'users:read' as const,
  },
  { 
    name: 'Role Management',
    href: '/dashboard/admin/roles',
    icon: ShieldCheckIcon,
    permission: 'roles:manage' as const,
  },
  {
    name: 'Audit Logs',
    href: '/dashboard/admin/audit-logs',
    icon: ClipboardIcon,
    permission: 'audit:read' as const,
  },
];

const clientAdminNavigation = [
  {
    name: 'User Management',
    href: '/dashboard/client-admin/users',
    icon: UsersIcon,
    permission: 'client:users:manage' as const,
  },
  {
    name: 'Settings',
    href: '/dashboard/client-admin/settings',
    icon: DocumentTextIcon,
    permission: 'client:settings:manage' as const,
  },
];

export function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isPlatformAdmin = user?.role === 'master_admin' || user?.role === 'platform_admin';
  const isClientAdmin = user?.role === 'client_admin';

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800">
        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <Link to="/dashboard" className="text-xl font-bold text-white">
            EffiBuild Pro
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-4 space-y-1">
          {/* Main Navigation */}
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <item.icon
                className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-300"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}

          {/* Platform Admin Navigation */}
          {isPlatformAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-700">
              <h3 className="px-3 text-sm font-medium text-gray-500">
                Platform Admin
              </h3>
              {platformAdminNavigation.map((item) => (
                <PermissionGate key={item.name} permissions={[item.permission]}>
                  <Link
                    to={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white mt-1"
                  >
                    <item.icon
                      className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-300"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </PermissionGate>
              ))}
            </div>
          )}

          {/* Client Admin Navigation */}
          {isClientAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-700">
              <h3 className="px-3 text-sm font-medium text-gray-500">
                Client Admin
              </h3>
              {clientAdminNavigation.map((item) => (
                <PermissionGate key={item.name} permissions={[item.permission]}>
                  <Link
                    to={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white mt-1"
                  >
                    <item.icon
                      className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-300"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </PermissionGate>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Top Navigation */}
        <div className="fixed top-0 right-0 left-64 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-end px-6">
            <Menu as="div" className="relative">
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {user?.name[0]}
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full px-4 py-2 text-sm text-gray-700 items-center`}
                      >
                        <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Page Content */}
        <main className="pt-16">
          <div className="mx-auto px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}