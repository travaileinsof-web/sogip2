import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BookOpen, MessageSquare, Image as ImageIcon, FileText, Settings, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ formations: 0, contacts: 0, products: 0 });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Note: We need real auth, but for now we'll simulate a logged-in state
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, contactsRes] = await Promise.all([
        api.get('/stats'),
        api.get('/admin/contacts')
      ]);
      setStats(statsRes);
      setContacts(contactsRes);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'contacts', label: 'Messages & Contacts', icon: MessageSquare },
    { id: 'formations', label: 'Formations', icon: BookOpen },
    { id: 'products', label: 'Produits (BTP)', icon: ImageIcon },
    { id: 'pages', label: 'Pages & Contenu', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">SOGIP - Administration</h2>
            <p className="text-gray-500 mt-2">Connectez-vous pour accéder au tableau de bord</p>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-900">SOGIP Admin</h2>
          <p className="text-xs text-gray-500 mt-1">Gérer votre contenu</p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-blue-700' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {activeTab === 'dashboard' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Messages & Contacts</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.contacts || 0}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-50 text-green-600">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Formations Actives</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.formations || 0}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Produits BTP</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.products || 0}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Contacts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Derniers Messages</h3>
                    <button onClick={() => setActiveTab('contacts')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Voir tout</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {contacts && contacts.length > 0 ? (
                      contacts.slice(0, 5).map((contact: any, i) => (
                        <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                              <p className="text-sm text-gray-500">{contact.email} • {contact.phone}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${contact.status === 'read' ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-700'}`}>
                              {contact.status === 'read' ? 'Lu' : 'Nouveau'}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mt-3">{contact.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        Aucun message pour le moment.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'contacts' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom & Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact: any, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{contact.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${contact.status === 'read' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                            {contact.status === 'read' ? 'Traité' : 'Nouveau'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">Voir</button>
                        </td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          Aucun contact trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === 'formations' || activeTab === 'products' || activeTab === 'pages') && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                  <Settings className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Module en cours de développement</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  La gestion complète des {activeTab} sera disponible dans la prochaine mise à jour du tableau de bord.
                </p>
                <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Créer un nouvel élément (Démo)
                </button>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
