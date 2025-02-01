import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, DocumentCheckIcon, ChartBarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Influencers', href: '/influencers', icon: UserGroupIcon },
  { name: 'Claims', href: '/claims', icon: DocumentCheckIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Research', href: '/research', icon: MagnifyingGlassIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700">
        <div className="flex items-center h-16 px-6 bg-gray-900">
          <DocumentCheckIcon className="w-8 h-8 text-emerald-500" />
          <span className="ml-3 text-xl font-bold text-white">HealthGuard</span>
        </div>
        <nav className="px-4 mt-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-emerald-500'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
