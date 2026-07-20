import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon,
  MessageSquare, 
  GraduationCap, 
  LogOut,
  Settings,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, logout, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Paramètres', path: '/admin/settings', icon: <Settings size={20} /> },
    { name: 'Formations', path: '/admin/formations', icon: <GraduationCap size={20} /> },
    { name: 'Produits (Soleil)', path: '/admin/products', icon: <ShoppingBag size={20} /> },
    { name: 'Réalisations', path: '/admin/realizations', icon: <ImageIcon size={20} /> },
    { name: 'Messages', path: '/admin/contacts', icon: <MessageSquare size={20} /> },
  ];

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sogip-primary text-white flex flex-col shadow-xl z-10">
        <div className="h-16 flex items-center justify-center border-b border-blue-800 px-4">
          <h1 className="text-xl font-bold tracking-wider">SOGIP Admin</h1>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-sogip-secondary text-white'
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-0">
          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find((item) => item.path === location.pathname)?.name || 'Administration'}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-sogip-primary transition-colors">
              <Settings size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                {user?.prenom?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.prenom || 'Administrateur'} {user?.nom}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
